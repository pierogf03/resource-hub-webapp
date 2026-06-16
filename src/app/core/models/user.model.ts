import { UserRole } from '../constants/status.constants';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}

export interface CreateUserRequest {
  full_name: string;
  email: string;
  password: string;
  role: string;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  full_name?: string;
  email?: string;
  password?: string;
  role?: string;
  is_active?: boolean;
}
