import { Component, OnDestroy, OnInit } from '@angular/core';
import { InternalRoles, UserService } from '../user.service';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

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
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  navItems: RootNavItem[] = [
    {name: 'Running Methods', route: ['runningprocess'], roles: [InternalRoles.BUSINESSDEVELOPER]},
    {
      name: 'Method Modeler', submenu: [
        {name: 'Methods', route: ['bmprocess'], roles: [InternalRoles.EXPERT]},
        {name: 'Patterns', route: ['process'], roles: [InternalRoles.EXPERT]},
        {name: 'Building Blocks', route: ['methods'], roles: [InternalRoles.EXPERT]},
      ], roles: [InternalRoles.EXPERT],
    },
    {
      name: 'Method Elements', submenu: [
        {name: 'Artifacts', route: ['artifacts'], roles: [InternalRoles.EXPERT]},
        {name: 'Situational Factors', route: ['situationalFactors'], roles: [InternalRoles.EXPERT]},
        {name: 'Stakeholders', route: ['stakeholders'], roles: [InternalRoles.EXPERT]},
        {name: 'Tools', route: ['tools'], roles: [InternalRoles.EXPERT]},
        {name: 'Types', route: ['types'], roles: [InternalRoles.EXPERT]},
      ], roles: [InternalRoles.EXPERT],
    },
    {name: 'Domains', route: ['domains'], roles: [InternalRoles.EXPERT]},
    {
      name: 'Canvas', submenu: [
        {name: 'Expert Models', route: ['expertModels'], roles: [InternalRoles.EXPERT]},
        {name: 'Company Models', route: ['companyModels'], roles: [InternalRoles.EXPERT]},
        {name: 'Canvas Definitions', route: ['canvas', 'definitions'], roles: [InternalRoles.EXPERT]},
      ], roles: [InternalRoles.EXPERT],
    },
    {name: 'Explanation', route: ['explanation'], roles: [InternalRoles.EXPERT, InternalRoles.BUSINESSDEVELOPER]},
    {name: 'Options', route: ['options'], roles: [InternalRoles.EXPERT, InternalRoles.BUSINESSDEVELOPER]},
  ];
  navExpanded = false;

  roleForm = this.fb.group({
    role: [],
  });

  private roleSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.roleForm.setValue({role: this.userService.activatedRole});
    this.roleSubscription = this.roleForm.get('role').valueChanges.subscribe((role) => this.userService.activatedRole = role);
  }

  ngOnDestroy() {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  get roles() {
    return Object.values(InternalRoles);
  }

  get currentRole() {
    return this.userService.activatedRole;
  }

}
