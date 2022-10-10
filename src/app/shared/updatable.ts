import { InjectionToken } from '@angular/core';

export interface Updatable {
  update(): void;
}

/**
 * All updatable components should provide this token, so they can be queried by ViewChildren
 */
export const UPDATABLE = new InjectionToken<Updatable>(
  'Token for updatable components'
);
