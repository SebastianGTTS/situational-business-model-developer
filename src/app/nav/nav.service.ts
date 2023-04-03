import { Injectable, OnDestroy } from '@angular/core';
import {
  MenuNavItem,
  NavItem,
} from '../development-process-registry/module-api/nav-item';
import { InternalRoles, UserService } from '../role/user.service';
import { ModuleService } from '../development-process-registry/module-api/module.service';
import {
  ActivatedRouteSnapshot,
  Params,
  ResolveEnd,
  Router,
} from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';

export interface NavDescription {
  menu: MenuNavItem;
  link: string[];
  queryParams?: Params;
  depth: number;
  text?: string;
}

@Injectable()
export class NavService implements OnDestroy {
  private readonly mainMenu: MenuNavItem = {
    name: 'Main Menu',
    submenu: [
      {
        name: 'Startpage',
        route: ['start'],
      },
      {
        name: 'Go to Domain Expert Startpage',
        roles: [undefined],
        click: (): void => void this.switchRole(InternalRoles.DOMAIN_EXPERT),
      },
      {
        name: 'Go to Method Engineer Startpage',
        roles: [undefined],
        click: (): void => void this.switchRole(InternalRoles.METHOD_ENGINEER),
      },
      {
        name: 'Go to Business Developer Startpage',
        roles: [undefined],
        click: (): void =>
          void this.switchRole(InternalRoles.BUSINESS_DEVELOPER),
      },
      {
        name: 'Dashboard',
        route: ['dashboards', 'method-engineer-dashboard'],
        roles: [InternalRoles.METHOD_ENGINEER],
      },
      {
        name: 'Dashboard',
        route: ['dashboards', 'business-developer-dashboard'],
        roles: [InternalRoles.BUSINESS_DEVELOPER],
      },
      {
        name: 'Method Enactment',
        route: ['runningprocess'],
        roles: [InternalRoles.BUSINESS_DEVELOPER],
      },
      {
        name: 'Artifacts',
        route: ['concreteArtifacts'],
        roles: [InternalRoles.BUSINESS_DEVELOPER],
      },
      {
        name: 'Method Composition',
        submenu: [
          {
            name: 'Phase-based',
            route: ['bmprocess', 'phase'],
            roles: [InternalRoles.METHOD_ENGINEER],
          },
          {
            name: 'Pattern-based',
            route: ['bmprocess', 'pattern'],
            roles: [InternalRoles.METHOD_ENGINEER],
          },
        ],
        roles: [InternalRoles.METHOD_ENGINEER],
      },
      {
        name: 'Method Repository',
        submenu: [
          {
            name: 'Dashboard',
            route: ['dashboards', 'method-repository-dashboard'],
            roles: [InternalRoles.DOMAIN_EXPERT],
          },
          {
            name: 'Method Patterns',
            route: ['process'],
            roles: [InternalRoles.DOMAIN_EXPERT],
          },
          {
            name: 'Method Building Blocks',
            route: ['methods'],
            roles: [InternalRoles.DOMAIN_EXPERT],
          },
          {
            name: 'Method Elements',
            route: ['methodElements'],
            roles: [InternalRoles.DOMAIN_EXPERT],
          },
        ],
        roles: [InternalRoles.DOMAIN_EXPERT],
      },
      {
        name: 'Canvas Model Repository',
        submenu: [
          {
            name: 'Dashboard',
            route: ['dashboards', 'model-repository-dashboard'],
            roles: [InternalRoles.DOMAIN_EXPERT],
          },
        ],
        roles: [InternalRoles.DOMAIN_EXPERT],
      },
    ],
  };
  private navMenu!: MenuNavItem;
  private navMenuLink?: string[];
  private navMenuLinkQueryParams?: Params;
  private _depth = 0;
  private _text?: string;

  private readonly navChangedSubject = new ReplaySubject<void>(1);
  readonly navChanged = this.navChangedSubject.asObservable();

  private routerEventSubscription?: Subscription;
  private roleChangeSubscription?: Subscription;

  constructor(
    private moduleService: ModuleService,
    private router: Router,
    private userService: UserService
  ) {
    this.onInit();
  }

  onInit(): void {
    this.merge(this.mainMenu.submenu, this.moduleService.getNavigationItems());
    this.navMenu = this.mainMenu;
    this.routerEventSubscription = this.router.events.subscribe((event) => {
      if (event instanceof ResolveEnd) {
        const navDescription = this.findNavData(event.state.root);
        if (navDescription != null) {
          this.setCustomNav(navDescription);
        } else {
          this.setMainNav();
        }
      }
    });
    this.navChangedSubject.next();
    this.roleChangeSubscription = this.userService.roleChanged.subscribe(() =>
      this.navChangedSubject.next()
    );
  }

  ngOnDestroy(): void {
    this.navChangedSubject.complete();
    this.routerEventSubscription?.unsubscribe();
    this.roleChangeSubscription?.unsubscribe();
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
          if (newItem.roles != null) {
            oldItem.roles?.concat(newItem.roles);
          }
        } else {
          oldNavItems.splice(oldIndex, 1, newItem);
        }
      } else {
        navItemNames.add(newItem.name);
        oldNavItems.push(newItem);
      }
    }
  }

  private setCustomNav(description: NavDescription): void {
    if (
      this.navMenuLink !== description.link ||
      this.navMenuLinkQueryParams !== description.queryParams ||
      this.navMenu !== description.menu ||
      this._depth !== description.depth ||
      this._text !== description.text
    ) {
      this.navMenuLink = description.link;
      this.navMenuLinkQueryParams = description.queryParams;
      this.navMenu = description.menu;
      this._depth = description.depth;
      this._text = description.text;
      this.navChangedSubject.next();
    }
  }

  private setMainNav(): void {
    if (
      this.navMenuLink !== undefined ||
      this.navMenuLinkQueryParams !== undefined ||
      this.navMenu !== this.mainMenu ||
      this._depth !== 0 ||
      this._text !== undefined
    ) {
      this.navMenuLink = undefined;
      this.navMenuLinkQueryParams = undefined;
      this.navMenu = this.mainMenu;
      this._depth = 0;
      this._text = undefined;
      this.navChangedSubject.next();
    }
  }

  private findNavData(
    route: ActivatedRouteSnapshot
  ): NavDescription | undefined {
    for (
      let current: ActivatedRouteSnapshot | null = route;
      current != null;
      current = current.firstChild
    ) {
      if (current.data.nav != null) {
        return current.data.nav;
      }
    }
    return undefined;
  }

  get currentNavMenu(): MenuNavItem {
    return this.navMenu;
  }

  get menuLink(): string[] | undefined {
    return this.navMenuLink;
  }

  get menuLinkQueryParams(): Params | undefined {
    return this.navMenuLinkQueryParams;
  }

  get depth(): number {
    return this._depth;
  }

  get text(): string | undefined {
    return this._text;
  }

  getNumberOfItems(role: InternalRoles): number {
    let numberOfItems = 0;
    const itemStack: NavItem[] = [this.navMenu];
    for (let item = itemStack.pop(); item != null; item = itemStack.pop()) {
      if (item.roles != null && !item.roles.includes(role)) {
        continue;
      }
      numberOfItems += 1;
      if (this.isMenuItem(item)) {
        itemStack.push(...item.submenu);
      }
    }
    return numberOfItems;
  }

  private isMenuItem(navItem: NavItem): navItem is MenuNavItem {
    return 'submenu' in navItem;
  }

  private async switchRole(role: InternalRoles): Promise<void> {
    this.userService.role = this.userService.getRoleById(role);
    await this.router.navigate(['start']);
  }
}
