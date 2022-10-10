import { Component, OnDestroy, OnInit } from '@angular/core';
import { InternalRoles, UserService } from '../user.service';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ModuleService } from '../development-process-registry/module-api/module.service';
import {
  MenuNavItem,
  NavItem,
} from '../development-process-registry/module-api/nav-item';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  navItems: NavItem[] = [
    {
      name: 'Method Enactment',
      route: ['runningprocess'],
      roles: [InternalRoles.BUSINESSDEVELOPER],
    },
    {
      name: 'Artifacts',
      route: ['concreteArtifacts'],
      roles: [InternalRoles.BUSINESSDEVELOPER],
    },
    {
      name: 'Method Composition',
      route: ['bmprocess'],
      roles: [InternalRoles.EXPERT],
    },
    {
      name: 'Method Repository',
      submenu: [
        {
          name: 'Method Patterns',
          route: ['process'],
          roles: [InternalRoles.EXPERT],
        },
        {
          name: 'Method Building Blocks',
          route: ['methods'],
          roles: [InternalRoles.EXPERT],
        },
        {
          name: 'Method Elements',
          route: ['methodElements'],
          roles: [InternalRoles.EXPERT],
        },
      ],
      roles: [InternalRoles.EXPERT],
    },
    {
      name: 'Explanation',
      route: ['explanation'],
      roles: [InternalRoles.EXPERT, InternalRoles.BUSINESSDEVELOPER],
    },
  ];
  navExpanded = false;

  roleForm = this.fb.group({
    role: [],
  });

  private roleSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private moduleService: ModuleService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.roleForm.setValue({ role: this.userService.activatedRole });
    this.roleSubscription = this.roleForm
      .get('role')
      ?.valueChanges.subscribe((role) => {
        this.userService.activatedRole = role;
        void this.router.navigate(['/', 'start']);
      });
    this.merge(this.navItems, this.moduleService.getNavigationItems());
  }

  /**
   * Merges the new navigation items into the old navigation items
   *
   * @param oldNavItems
   * @param newNavItems
   * @private
   */
  private merge(oldNavItems: NavItem[], newNavItems: NavItem[]): void {
    const navItemNames: Set<string> = new Set<string>(
      oldNavItems.map((item) => item.name)
    );
    for (const newItem of newNavItems) {
      if (navItemNames.has(newItem.name)) {
        const oldIndex = oldNavItems.findIndex(
          (item) => item.name === newItem.name
        );
        const oldItem = oldNavItems[oldIndex];
        if ('submenu' in newItem && 'submenu' in oldItem) {
          this.merge(oldItem.submenu, newItem.submenu);
          oldItem.roles.concat(newItem.roles);
        } else {
          oldNavItems.splice(oldIndex, 1, newItem);
        }
      } else {
        navItemNames.add(newItem.name);
        oldNavItems.push(newItem);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  get roles(): InternalRoles[] {
    return Object.values(InternalRoles);
  }

  get currentRole(): InternalRoles {
    return this.userService.activatedRole;
  }

  isMenuItem(navItem: NavItem): navItem is MenuNavItem {
    return 'submenu' in navItem;
  }
}
