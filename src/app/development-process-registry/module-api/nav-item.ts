/**
 * Basic properties for every navigation item
 */
export interface BasicNavItem {
  /**
   * The display name of the navigation item
   */
  readonly name: string;

  /**
   * The names of the roles for which the navigation item should be displayed.
   */
  readonly roles: string[];
}

export interface LeafNavItem extends BasicNavItem {
  /**
   * The route where the navigation item should rote to.
   * Should be an absolute path.
   */
  readonly route: string[];
}

export interface MenuNavItem extends BasicNavItem {
  readonly submenu: LeafNavItem[];
}

export type NavItem = MenuNavItem | LeafNavItem;
