import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { InternalRoles, UserService } from './user.service';
import { RoleModule } from './role.module';

@Injectable({
  providedIn: RoleModule,
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const roles = this.findRoleData(route);
    if (roles == null || roles.length === 0) {
      return true;
    }
    if (this.userService.role == null) {
      return this.router.createUrlTree(['/', 'role'], {
        queryParams: {
          roles: roles,
          redirect: state.url,
        },
      });
    }
    if (roles.includes(this.userService.role.id)) {
      return true;
    } else {
      return this.router.createUrlTree(['/', 'role'], {
        queryParams: {
          roles: roles,
          redirect: state.url,
        },
      });
    }
  }

  private findRoleData(
    route: ActivatedRouteSnapshot
  ): InternalRoles[] | undefined {
    for (
      let current: ActivatedRouteSnapshot | null = route;
      current != null;
      current = current.firstChild
    ) {
      if (current.data.roles != null) {
        return current.data.roles;
      }
    }
    return undefined;
  }
}
