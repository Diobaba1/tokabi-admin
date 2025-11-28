// src/types/index.ts
export type {
  LoginRequest,
  RegisterRequest,
  UserResponse,
  TokenResponse,
  LoginResponse,
  ChangePasswordRequest,
  AuthError,
} from './auth.types';



// Stub for TokenPrice
export interface TokenPrice {
  symbol: string;
  price: number;
  change_24h?: number;
}

