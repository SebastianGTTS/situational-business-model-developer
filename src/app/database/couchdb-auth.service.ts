import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { defer, from, Observable, of, pipe, UnaryFunction } from 'rxjs';
import { catchError, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PouchdbService } from './pouchdb.service';
import { AuthService } from './auth.service';

export enum AuthErrors {
  NOT_AUTHENTICATED = 'You need to be logged in to perform this action',
  NOT_ACTIVATED = 'Your account is not yet activated.',
  NOT_AVAILABLE = 'Database is not available',
  SERVER_MAINTENANCE = 'The database is in maintenance',
}

@Injectable()
export class CouchdbAuthService implements AuthService {
  redirectTo: string | undefined;

  private loggedIn = false;

  private _username?: string = undefined;
  get username(): string | undefined {
    return this._username;
  }

  private _group?: string = undefined;
  get group(): string | undefined {
    return this._group;
  }

  private readonly upUrl = new URL('/database/_up', location.origin).href;
  private readonly url = new URL('/database/_session', location.origin).href;
  private userUrl?: string = undefined;
  private databaseUrl?: string = undefined;

  constructor(
    private http: HttpClient,
    private pouchdbService: PouchdbService,
    private router: Router
  ) {}

  init(): Observable<void> {
    return this.http
      .get(this.url, {
        headers: {
          'X-CouchDB-WWW-Authenticate': 'Cookie',
        },
      })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tap((response: any) =>
          this.initUser(response.userCtx.name, response.userCtx.roles)
        ),
        this.checkAndLogin(),
        catchError(() => of()),
        mapTo(undefined)
      );
  }

  /**
   * Login the user
   *
   * @param username the username
   * @param password the password
   */
  login(username: string, password: string): Observable<void> {
    return this.http
      .post(this.url, {
        username,
        password,
      })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tap((response: any) => this.initUser(response.name, response.roles)),
        this.checkAndLogin(),
        tap(() => this.redirect()),
        mapTo(undefined)
      );
  }

  /**
   * Logout the current user
   */
  logout(): Observable<void> {
    return defer(() => from(this.pouchdbService.closeDb())).pipe(
      tap(() => this.clearUser()),
      switchMap(() =>
        this.http.delete(this.url, {
          headers: {
            'X-CouchDB-WWW-Authenticate': 'Cookie',
          },
        })
      ),
      switchMap(() => from(this.router.navigate(['/', 'login']))),
      mapTo(undefined)
    );
  }

  /**
   * Change the password of the current user
   *
   * @param newPassword the new password of the user
   */
  changePassword(newPassword: string): Observable<void> {
    if (this.userUrl == null) {
      throw new Error(AuthErrors.NOT_AUTHENTICATED);
    }
    const userUrl = this.userUrl;
    return this.http
      .get(userUrl, {
        headers: {
          'X-CouchDB-WWW-Authenticate': 'Cookie',
        },
      })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        switchMap((user: any) => {
          const newUser = {
            _id: user._id,
            _rev: user._rev,
            name: user.name,
            roles: user.roles,
            type: user.type,
            password: newPassword,
          };
          return this.http.put(userUrl, newUser, {
            headers: {
              'X-CouchDB-WWW-Authenticate': 'Cookie',
            },
          });
        }),
        switchMap(async () => {
          this.redirectTo = this.router.url;
          await this.pouchdbService.closeDb();
          this.clearUser();
          return this.router.navigate(['/', 'login'], {
            queryParams: { passwordChanged: true },
          });
        }),
        mapTo(undefined)
      );
  }

  private async redirect(): Promise<void> {
    if (this.redirectTo) {
      await this.router.navigateByUrl(this.redirectTo);
    } else {
      await this.router.navigate(['/']);
    }
  }

  /**
   * Initialize the user after logging in
   *
   * @param username the username of the user
   * @param roles the roles of the user
   */
  private initUser(username: string, roles: string[]): void {
    this._group = this.getGroup(roles);
    this._username = username;
    if (this.group == null) {
      throw new Error(AuthErrors.NOT_ACTIVATED);
    }
    this.userUrl = new URL(
      '/database/_users/org.couchdb.user:' + this.username,
      location.origin
    ).href;
    this.databaseUrl = new URL('/database/' + this.group, location.origin).href;
  }

  /**
   * Checks whether the user is able to log in.
   * Assumes that the group and databaseUrl are set.
   *
   * @return whether the user is able to log in
   */
  private checkAndLogin(): UnaryFunction<
    Observable<unknown>,
    Observable<unknown>
  > {
    return pipe(
      switchMap(() => this.checkServerAvailable()),
      map((available) => {
        if (available) {
          return;
        } else {
          throw new Error(AuthErrors.SERVER_MAINTENANCE);
        }
      }),
      switchMap(() => this.checkDatabaseAvailable()),
      map((available) => {
        if (available) {
          return;
        } else {
          throw new Error(AuthErrors.NOT_AVAILABLE);
        }
      }),
      tap(() => {
        this.pouchdbService.init(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.group!,
          () => this.sessionExpired(),
          () => this.dbError()
        );
        this.loggedIn = true;
      })
    );
  }

  /**
   * Called if the session is expired
   */
  private async sessionExpired(): Promise<void> {
    this.redirectTo = this.router.url;
    await this.pouchdbService.closeDb();
    this.clearUser();
    await this.router.navigate(['/', 'login'], {
      queryParams: {
        expired: true,
      },
    });
  }

  /**
   * Called on critical error in db
   */
  private async dbError(): Promise<void> {
    this.redirectTo = this.router.url;
    await this.pouchdbService.closeDb();
    this.clearUser();
    await this.router.navigate(['/', 'login'], {
      queryParams: {
        dbError: true,
      },
    });
  }

  /**
   * Clear all user related fields
   */
  private clearUser(): void {
    this._group = undefined;
    this._username = undefined;
    this.userUrl = undefined;
    this.databaseUrl = undefined;
    this.loggedIn = false;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Get the group of this user from the roles array
   *
   * @param roles the roles array
   * @return the group the user belongs to
   */
  private getGroup(roles: string[]): string | undefined {
    return roles.find((role) => /^group[0-9]+$/.test(role));
  }

  /**
   * Checks whether the database is available
   *
   * @return whether the database is available
   */
  private checkDatabaseAvailable(): Observable<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.http.head(this.databaseUrl!).pipe(
      mapTo(true),
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.NotFound) {
          return of(false);
        } else {
          throw error;
        }
      })
    );
  }

  /**
   * Checks whether the server is available or in maintenance mode
   *
   * @return whether the server is up
   */
  private checkServerAvailable(): Observable<boolean> {
    return this.http.get(this.upUrl).pipe(
      mapTo(true),
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.NotFound) {
          return of(false);
        } else {
          throw error;
        }
      })
    );
  }

  /**
   * Check whether the user is currently logged in or not
   *
   * @return true if the user is logged in
   */
  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
