import { UserRole } from '../constants/status.constants';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}
