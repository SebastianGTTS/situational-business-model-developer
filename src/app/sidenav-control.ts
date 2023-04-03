import { InjectionToken } from '@angular/core';

export const SIDENAV_CONTROL = new InjectionToken<SidenavControl>(
  'Sidenav Control'
);

export interface SidenavControl {
  toggleSidenav(): void;

  isSidenavShown(): boolean;
}
