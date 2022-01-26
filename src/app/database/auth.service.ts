import { Observable } from 'rxjs';

export abstract class AuthService {
  abstract set redirectTo(redirectTo: string | undefined);

  abstract get username(): string | undefined;

  abstract get group(): string | undefined;

  abstract init(): Observable<void> | Promise<void>;

  abstract login(username: string, password: string): Observable<void>;

  abstract logout(): Observable<void>;

  abstract changePassword(newPassword: string): Observable<void>;

  abstract isLoggedIn(): boolean;
}
