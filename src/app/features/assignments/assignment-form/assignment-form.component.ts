import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { formatApiDate, parseApiDate } from '../../../shared/utils/date-format.util';
import { ExternalResource } from '../../../core/models/external-resource.model';
import { Initiative } from '../../../core/models/initiative.model';
import { Provider } from '../../../core/models/provider.model';
import { User } from '../../../core/models/user.model';
import { forkJoin, of } from 'rxjs';
import { AssignmentService } from '../../../core/services/assignment.service';
import { AuthService } from '../../../core/services/auth.service';
import { ExchangeRateService } from '../../../core/services/exchange-rate.service';
import { ExternalResourceService } from '../../../core/services/external-resource.service';
import { InitiativeService } from '../../../core/services/initiative.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProviderService } from '../../../core/services/provider.service';
import { UserService } from '../../../core/services/user.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Assignment, AssignmentInitiativeRequest, CreateAssignmentRequest } from '../../../core/models/assignment.model';
import {
  dateRangeValidator,
  exchangeRateRequiredWhenPen,
} from '../../../shared/utils/form-validators.util';
import { convertToUsd } from '../../../shared/utils/money-format.util';
import { UsdCurrencyPipe } from '../../../shared/pipes/usd-currency.pipe';

@Component({
  selector: 'app-assignment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    UsdCurrencyPipe,
  ],
  templateUrl: './assignment-form.component.html',
  styleUrl: './assignment-form.component.scss',
})
export class AssignmentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly assignmentService = inject(AssignmentService);
  private readonly resourceService = inject(ExternalResourceService);
  private readonly providerService = inject(ProviderService);
  private readonly initiativeService = inject(InitiativeService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly notification = inject(NotificationService);

  isEdit = false;
  assignmentId = '';
  loading = false;
  pageLoading = true;

  resources: ExternalResource[] = [];
  providers: Provider[] = [];
  initiatives: Initiative[] = [];
  managers: User[] = [];
  analysts: User[] = [];
  isAdmin = this.authService.hasRole('ADMIN');
  showManagerField = true;
  showAnalystField = false;

  form = this.fb.nonNullable.group(
    {
      resource_id: ['', Validators.required],
      provider_id: ['', Validators.required],
      main_initiative_id: ['', Validators.required],
      manager_id: ['', Validators.required],
      analyst_responsible_id: [''],
      start_date: [null as Date | null, Validators.required],
      end_date: [null as Date | null, Validators.required],
      duration_months: [1, [Validators.required, Validators.min(1)]],
      monthly_cost: [0, [Validators.required, Validators.min(0)]],
      currency: ['USD' as 'USD' | 'PEN', Validators.required],
      exchange_rate: [null as number | null],
      comments: [''],
      initiatives: this.fb.array([]),
    },
    {
      validators: [
        dateRangeValidator('start_date', 'end_date'),
        exchangeRateRequiredWhenPen('currency', 'exchange_rate'),
      ],
    }
  );

  get initiativesArray(): FormArray {
    return this.form.get('initiatives') as FormArray;
  }

  ngOnInit(): void {
    this.exchangeRateService.loadUsdPenRate();
    this.form.controls.currency.valueChanges.subscribe((currency) => {
      if (currency === 'PEN') {
        this.applyCurrentExchangeRate();
      }
    });

    this.assignmentId = this.route.snapshot.paramMap.get('id') ?? '';
    this.isEdit = !!this.assignmentId && this.route.snapshot.url.some((s) => s.path === 'edit');

    forkJoin({
      resources: this.resourceService.getExternalResources({ page_size: 100 }),
      providers: this.providerService.getProviders({ page_size: 100 }),
      initiatives: this.initiativeService.getInitiatives({ page_size: 100 }),
      managers: this.userService.getManagersForSelect(),
      analysts: this.userService.getAnalystsForSelect(),
      assignment: this.isEdit
        ? this.assignmentService.getAssignment(this.assignmentId)
        : of(null),
    }).subscribe({
      next: ({ resources, providers, initiatives, managers, analysts, assignment }) => {
        this.resources = resources.data.items;
        this.providers = providers.data.items;
        this.initiatives = initiatives.data.items;
        this.managers = managers;
        this.analysts = analysts;
        this.showManagerField = this.isAdmin || managers.length > 1;
        this.showAnalystField = analysts.length > 0;

        if (this.isEdit) {
          if (!assignment?.data) {
            this.notification.error('No se pudo cargar la asignación');
            this.router.navigate(['/assignments']);
            this.pageLoading = false;
            return;
          }
          this.populateForm(assignment.data);
        } else if (managers.length === 1) {
          this.form.patchValue({ manager_id: managers[0].id });
        }

        this.pageLoading = false;
      },
      error: () => {
        if (this.isEdit) {
          this.notification.error('No se pudo cargar la asignación');
          this.router.navigate(['/assignments']);
        }
        this.pageLoading = false;
      },
    });
  }

  get monthlyCostUsd(): number | null {
    const value = this.form.getRawValue();
    return convertToUsd(value.monthly_cost, value.currency, value.exchange_rate);
  }

  private applyCurrentExchangeRate(): void {
    const currentRate = this.form.controls.exchange_rate.value;
    if (currentRate && currentRate > 0) {
      return;
    }

    const cachedRate = this.exchangeRateService.getRateValue();
    if (cachedRate) {
      this.form.patchValue({ exchange_rate: cachedRate });
      return;
    }

    this.exchangeRateService.getUsdPenRate().subscribe((response) => {
      if (!response.success) {
        return;
      }
      const rate = this.exchangeRateService.getRateValue();
      if (rate && !this.form.controls.exchange_rate.value) {
        this.form.patchValue({ exchange_rate: rate });
      }
    });
  }

  private populateForm(assignment: Assignment): void {
    const resourceId =
      assignment.resource_id ??
      this.resources.find((resource) => resource.consultant_name === assignment.consultant_name)?.id ??
      '';
    const providerId =
      assignment.provider_id ??
      this.providers.find((provider) => provider.name === assignment.provider_name)?.id ??
      '';
    const mainInitiativeId =
      assignment.main_initiative_id ??
      this.initiatives.find((initiative) => initiative.name === assignment.main_initiative_name)?.id ??
      '';
    const managerId =
      assignment.manager_id ??
      this.managers.find((manager) => manager.full_name === assignment.manager_name)?.id ??
      '';
    const analystId =
      assignment.analyst_responsible_id ??
      this.analysts.find((analyst) => analyst.full_name === assignment.analyst_responsible_name)?.id ??
      '';

    this.form.patchValue({
      resource_id: resourceId,
      provider_id: providerId,
      main_initiative_id: mainInitiativeId,
      manager_id: managerId,
      analyst_responsible_id: analystId,
      start_date: parseApiDate(assignment.start_date),
      end_date: parseApiDate(assignment.end_date),
      duration_months: assignment.duration_months,
      monthly_cost: assignment.monthly_cost,
      currency: assignment.currency,
      exchange_rate: assignment.exchange_rate ?? null,
      comments: assignment.comments ?? '',
    });

    this.initiativesArray.clear();
    for (const initiative of assignment.initiatives ?? []) {
      this.initiativesArray.push(
        this.fb.nonNullable.group({
          initiative_id: [initiative.initiative_id, Validators.required],
          allocation_percentage: [
            initiative.allocation_percentage,
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
          is_primary: [initiative.is_primary],
          is_funding_source: [initiative.is_funding_source],
        })
      );
    }
  }

  addInitiativeRow(): void {
    this.initiativesArray.push(
      this.fb.nonNullable.group({
        initiative_id: ['', Validators.required],
        allocation_percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
        is_primary: [false],
        is_funding_source: [false],
      })
    );
  }

  removeInitiativeRow(index: number): void {
    this.initiativesArray.removeAt(index);
  }

  validateInitiatives(): string | null {
    const items = this.initiativesArray.getRawValue();
    if (items.length === 0) {
      return null;
    }
    const total = items.reduce((sum, i) => sum + (i.allocation_percentage || 0), 0);
    if (total > 100) {
      return 'La suma de porcentajes no puede superar 100%.';
    }
    const primaryCount = items.filter((i) => i.is_primary).length;
    if (primaryCount > 1) {
      return 'Solo puede haber una iniciativa principal.';
    }
    const fundingCount = items.filter((i) => i.is_funding_source).length;
    if (fundingCount > 1) {
      return 'Solo puede haber una fuente de fondeo.';
    }
    return null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const initiativeError = this.validateInitiatives();
    if (initiativeError) {
      this.notification.error(initiativeError);
      return;
    }

    this.loading = true;
    const value = this.form.getRawValue();
    const payload: CreateAssignmentRequest = {
      resource_id: value.resource_id,
      provider_id: value.provider_id,
      main_initiative_id: value.main_initiative_id,
      manager_id: value.manager_id,
      analyst_responsible_id: value.analyst_responsible_id || null,
      start_date: formatApiDate(value.start_date!),
      end_date: formatApiDate(value.end_date!),
      duration_months: value.duration_months,
      monthly_cost: value.monthly_cost,
      currency: value.currency,
      exchange_rate: value.currency === 'PEN' ? value.exchange_rate : null,
      comments: value.comments || null,
      initiatives: value.initiatives as AssignmentInitiativeRequest[],
    };

    const request$ = this.isEdit
      ? this.assignmentService.updateAssignment(this.assignmentId, payload)
      : this.assignmentService.createAssignment(payload);

    request$.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Asignación actualizada' : 'Asignación creada');
        this.router.navigate(['/assignments']);
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/assignments']);
  }
}
