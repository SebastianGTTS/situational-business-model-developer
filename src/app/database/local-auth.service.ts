import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { PouchdbService } from './pouchdb.service';
import { environment } from '../../environments/environment';

@Injectable()
export class LocalAuthService implements AuthService {
  constructor(private pouchdbService: PouchdbService) {}

  set redirectTo(redirectTo: string) {}

  get username() {
    return null;
  }

  get group() {
    return null;
  }

  async init(): Promise<any> {
    this.pouchdbService.init('bmdlFeatureModeler', null, null);
    const info = await this.pouchdbService.getDatabaseInfo();
    if (info.doc_count === 0 && environment.exampleData) {
      console.log('No docs detected. Adding default data.');
      await this.pouchdbService.addDefaultData();
    }
    return null;
  }

  isLoggedIn(): boolean {
    return true;
  }

  login(username: string, password: string): Observable<any> {
    return of();
  }

  logout(): Observable<any> {
    return of();
  }

  changePassword(newPassword: string): Observable<any> {
    throw new Error('Not implemented');
  }
}
