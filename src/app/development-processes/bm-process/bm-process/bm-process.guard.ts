import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  UrlTree,
} from '@angular/router';
import { isBmPatternProcessEntry } from 'src/app/development-process-registry/bm-process/bm-pattern-process';
import { isBmPhaseProcessEntry } from 'src/app/development-process-registry/bm-process/bm-phase-process';
import { BmProcessService } from 'src/app/development-process-registry/bm-process/bm-process.service';
import { BmPatternProcessComponent } from '../bm-pattern-process/bm-pattern-process.component';
import { BmPhaseProcessComponent } from '../bm-phase-process/bm-phase-process.component';
import { BmProcessInitComponent } from '../bm-process-init/bm-process-init.component';

@Injectable({
  providedIn: 'root',
})
export class BmProcessGuard implements CanActivateChild {
  constructor(
    private bmProcessService: BmProcessService,
    private router: Router
  ) {}

  async canActivateChild(
    childRoute: ActivatedRouteSnapshot
  ): Promise<boolean | UrlTree> {
    const id = childRoute.parent?.params.id;
    if (id == null) {
      return true;
    }
    const bmProcessEntry = await this.bmProcessService.getEntry(id);
    if (bmProcessEntry.initial) {
      if (childRoute.component !== BmProcessInitComponent) {
        return this.router.createUrlTree([
          '/',
          'bmprocess',
          'bmprocessview',
          id,
          'init',
        ]);
      }
    } else if (isBmPhaseProcessEntry(bmProcessEntry)) {
      if (childRoute.component !== BmPhaseProcessComponent) {
        return this.router.createUrlTree([
          '/',
          'bmprocess',
          'bmprocessview',
          id,
          'phase',
          childRoute.firstChild?.url[0].path ?? 'overview',
        ]);
      }
    } else if (isBmPatternProcessEntry(bmProcessEntry)) {
      if (childRoute.component !== BmPatternProcessComponent) {
        return this.router.createUrlTree([
          '/',
          'bmprocess',
          'bmprocessview',
          id,
          'pattern',
          childRoute.firstChild?.url[0].path ?? 'overview',
        ]);
      }
    }
    return true;
  }
}
