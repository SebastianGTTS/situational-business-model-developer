import { Injectable, OnDestroy } from '@angular/core';
import { Icon } from '../model/icon';
import { RoleModule } from './role.module';
import { ReplaySubject } from 'rxjs';

export interface Role {
  readonly id: InternalRoles;
  readonly name: string;
  readonly description: string;
  readonly icon: Icon;
}

export enum InternalRoles {
  DOMAIN_EXPERT = 'domain-expert',
  METHOD_ENGINEER = 'method-engineer',
  BUSINESS_DEVELOPER = 'business-developer',
}

@Injectable({
  providedIn: RoleModule,
})
export class UserService implements OnDestroy {
  private readonly roleChangedSubject = new ReplaySubject<void>(1);
  readonly roleChanged = this.roleChangedSubject.asObservable();

  readonly roles: Role[] = [
    {
      id: InternalRoles.DOMAIN_EXPERT,
      name: 'Domain Expert',
      description:
        'The domain expert defines abstract knowledge for the method repository and the canvas model repository.',
      icon: new Icon(undefined, {
        icon: 'bi-database',
      }),
    },
    {
      id: InternalRoles.METHOD_ENGINEER,
      name: 'Method Engineer',
      description:
        'The method engineer composes development methods out of the repositories that is executed by the business developer.',
      icon: new Icon(undefined, {
        icon: 'bi-diagram-3',
      }),
    },
    {
      id: InternalRoles.BUSINESS_DEVELOPER,
      name: 'Business Developer',
      description:
        'The business developer creates a business models by enacting a development method or selecting own developsment steps.',
      icon: new Icon(undefined, {
        icon: 'bi-columns',
      }),
    },
  ];

  private _role?: Role;

  ngOnDestroy(): void {
    this.roleChangedSubject.complete();
  }

  set role(role: Role | undefined) {
    this._role = role;
    this.roleChangedSubject.next();
  }

  get role(): Role | undefined {
    return this._role;
  }

  getRoleById(id: InternalRoles | undefined): Role | undefined {
    return this.roles.find((role) => role.id === id);
  }

  get activatedRole(): InternalRoles | undefined {
    return this._role?.id;
  }
}
