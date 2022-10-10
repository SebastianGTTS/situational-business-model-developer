import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { PouchdbService } from './pouchdb.service';
import { environment } from '../../environments/environment';

@Injectable()
export class LocalAuthService implements AuthService {
  constructor(private pouchdbService: PouchdbService) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set redirectTo(redirectTo: string) {}

  get username(): undefined {
    return undefined;
  }

  get group(): undefined {
    return undefined;
  }

  async init(): Promise<void> {
    this.pouchdbService.init('bmdlFeatureModeler');
    const info = await this.pouchdbService.getDatabaseInfo();
    if (info.doc_count === 0 && environment.exampleData) {
      console.log('No docs detected. Adding default data.');
      await this.pouchdbService.addDefaultData();
    }
  }

  isLoggedIn(): boolean {
    return true;
  }

  login(): Observable<void> {
    return of();
  }

  logout(): Observable<void> {
    return of();
  }

  changePassword(): Observable<void> {
    throw new Error('Not implemented');
  }
}
