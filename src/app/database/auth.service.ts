import { Observable } from 'rxjs';

export abstract class AuthService {
  abstract set redirectTo(redirectTo: string);

  abstract get username(): string | undefined;

  abstract get group(): string | undefined;

  abstract init(): Observable<any> | Promise<any>;

  abstract login(username: string, password: string): Observable<any>;

  abstract logout(): Observable<any>;

  abstract changePassword(newPassword: string): Observable<any>;

  abstract isLoggedIn(): boolean;
}
