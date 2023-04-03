import { Params } from '@angular/router';

/**
 * Basic properties for every navigation item
 */
export interface BasicNavItem {
  /**
   * An id for the nav item to reference it in HTML.
   * Must be unique throughout the whole page.
   */
  readonly id?: string;

  /**
   * The display name of the navigation item
   */
  readonly name: string;

  /**
   * The names of the roles for which the navigation item should be displayed.
   */
  readonly roles?: (string | undefined)[];
}

export interface LeafNavItem extends BasicNavItem {
  /**
   * The route where the navigation item should rote to.
   * Should be an absolute path.
   */
  readonly route?: string[];

  /**
   * The query params for the route
   */
  readonly queryParams?: Params;

  /**
   * Called when the nav item is clicked
   */
  readonly click?: () => void;
}

export interface MenuNavItem extends BasicNavItem {
  readonly submenu: NavItem[];
}

export type NavItem = MenuNavItem | LeafNavItem;
