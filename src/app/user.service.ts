import { Injectable } from '@angular/core';

export enum InternalRoles {
  EXPERT = 'Method Engineer', BUSINESSDEVELOPER = 'Business Developer',
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  activatedRole: InternalRoles = InternalRoles.BUSINESSDEVELOPER;

}
