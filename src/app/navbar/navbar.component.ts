import { Component, OnDestroy, OnInit } from '@angular/core';
import { InternalRoles, UserService } from '../user.service';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

class NavItem {
  name: string;
  route?: string[];
  roles: string[];
}

class RootNavItem extends NavItem {
  submenu?: RootNavItem[];
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  navItems: RootNavItem[] = [
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
      name: 'Model Composition',
      route: ['companyModels'],
      roles: [InternalRoles.EXPERT],
    },
    {
      name: 'Canvas Model Repository',
      submenu: [
        {
          name: 'Canvas Building Blocks',
          route: ['expertModels'],
          roles: [InternalRoles.EXPERT],
        },
        {
          name: 'Canvas Models',
          route: ['canvas', 'definitions'],
          roles: [InternalRoles.EXPERT],
        },
        {
          name: 'Canvas Elements',
          route: ['canvasElements'],
          roles: [InternalRoles.EXPERT],
        },
      ],
      roles: [InternalRoles.EXPERT],
    },
    {
      name: 'Templates',
      route: ['whiteboard', 'templates'],
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

  private roleSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.roleForm.setValue({ role: this.userService.activatedRole });
    this.roleSubscription = this.roleForm
      .get('role')
      .valueChanges.subscribe((role) => {
        this.userService.activatedRole = role;
        void this.router.navigate(['/', 'start']);
      });
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
}
