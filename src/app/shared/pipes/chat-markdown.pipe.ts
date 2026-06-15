import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderChatMarkdown } from '../utils/chat-markdown.util';

@Pipe({
  name: 'chatMarkdown',
  standalone: true,
})
export class ChatMarkdownPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    const html = renderChatMarkdown(value ?? '');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
