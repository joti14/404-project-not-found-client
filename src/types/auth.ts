/** Shapes mirror the Django serializers (snake_case kept intentionally). */

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}
