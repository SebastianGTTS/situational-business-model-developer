import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  MenuNavItem,
  NavItem,
} from '../../development-process-registry/module-api/nav-item';
import { InternalRoles, UserService } from '../../role/user.service';
import {
  animate,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-side-list',
  templateUrl: './nav-side-list.component.html',
  styleUrls: ['./nav-side-list.component.css'],
  animations: [
    trigger('chevron', [
      state('open', style({ transform: 'rotate(90deg)' })),
      state('closed', style({ transform: 'rotate(0)' })),
      transition('open <=> closed', [animate('0.1s')]),
    ]),
    trigger('submenu', [
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0 })),
        query('ul', [animate('0.1s ease-in', style({ height: 0 }))]),
      ]),
      transition(':enter', [
        style({ opacity: 0 }),
        query('ul', [style({ height: 0 }), animate('0.1s ease-out')]),
        animate('0.2s ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class NavSideListComponent implements OnChanges {
  @Input() expandAll!: boolean;
  @Input() navItems!: NavItem[];
  @Input() depth = 0;

  openState: boolean[] = [];

  constructor(private router: Router, private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.navItems || changes.expandAll) {
      this.openState = this.navItems.map(() => this.expandAll);
      if (!this.expandAll) {
        this.handleOpenStates();
      }
    }
  }

  private handleOpenStates(): void {
    navItemLoop: for (const [index, item] of this.navItems.entries()) {
      if (this.isMenuItem(item)) {
        for (const subitem of item.submenu) {
          if (
            !this.isMenuItem(subitem) &&
            subitem.route != null &&
            this.router.isActive(this.router.createUrlTree(subitem.route), {
              paths: 'exact',
              queryParams: 'ignored',
              fragment: 'ignored',
              matrixParams: 'ignored',
            })
          ) {
            this.openState[index] = true;
            continue navItemLoop;
          }
        }
      }
    }
  }

  get currentRole(): InternalRoles | undefined {
    return this.userService.activatedRole;
  }

  toggleSubmenu(index: number): void {
    this.openState[index] = !this.openState[index];
  }

  isMenuItem(navItem: NavItem): navItem is MenuNavItem {
    return 'submenu' in navItem;
  }
}
