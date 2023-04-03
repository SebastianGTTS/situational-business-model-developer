import { Component, OnDestroy, OnInit } from '@angular/core';
import { InternalRoles, Role, UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-role-switch',
  templateUrl: './role-switch.component.html',
  styleUrls: ['./role-switch.component.scss'],
})
export class RoleSwitchComponent implements OnInit, OnDestroy {
  private querySubscription?: Subscription;

  nextRoles: Role[] = [];
  redirectUrl?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.querySubscription = this.route.queryParamMap.subscribe((params) => {
      if (params.has('roles')) {
        const roles: InternalRoles[] = params.getAll(
          'roles'
        ) as InternalRoles[];
        this.nextRoles = roles
          .map((role) => this.userService.getRoleById(role))
          .filter((role) => role != null) as Role[];
      }
      if (params.has('redirect')) {
        this.redirectUrl = params.get('redirect') ?? undefined;
      }
    });
  }

  ngOnDestroy(): void {
    this.querySubscription?.unsubscribe();
  }

  async redirect(): Promise<void> {
    if (this.redirectUrl != null) {
      await this.router.navigateByUrl(this.redirectUrl);
    } else {
      await this.router.navigate(['/', 'start']);
    }
  }

  get currentRole(): Role | undefined {
    return this.userService.role;
  }

  get nextRole(): Role | undefined {
    if (this.nextRoles.length === 0) {
      return undefined;
    }
    return this.nextRoles[0];
  }
}
