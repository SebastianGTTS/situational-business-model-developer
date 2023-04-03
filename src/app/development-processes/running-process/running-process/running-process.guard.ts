import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  UrlTree,
} from '@angular/router';
import { RunningProcessService } from '../../../development-process-registry/running-process/running-process.service';
import { isRunningPhaseProcessEntry } from '../../../development-process-registry/running-process/running-phase-process';
import { RunningPhaseProcessComponent } from '../running-phase-process/running-phase-process.component';
import { isRunningPatternProcessEntry } from '../../../development-process-registry/running-process/running-pattern-process';
import { isRunningLightProcessEntry } from '../../../development-process-registry/running-process/running-light-process';
import { RunningPatternProcessComponent } from '../running-pattern-process/running-pattern-process.component';
import { RunningLightProcessComponent } from '../running-light-process/running-light-process.component';
import { isRunningFullProcessEntry } from '../../../development-process-registry/running-process/running-full-process';

@Injectable({
  providedIn: 'root',
})
export class RunningProcessGuard implements CanActivateChild {
  constructor(
    private runningProcessService: RunningProcessService,
    private router: Router
  ) {}

  async canActivateChild(
    childRoute: ActivatedRouteSnapshot
  ): Promise<boolean | UrlTree> {
    const id = childRoute.parent?.params.id;
    if (id == null) {
      return true;
    }
    const runningProcessEntry = await this.runningProcessService.getEntry(id);
    if (
      isRunningFullProcessEntry(runningProcessEntry) &&
      runningProcessEntry.contextChange
    ) {
      return this.router.createUrlTree(['/', 'bmprocess', 'contextchange', id]);
    } else {
      if (isRunningPhaseProcessEntry(runningProcessEntry)) {
        if (childRoute.component !== RunningPhaseProcessComponent) {
          return this.router.createUrlTree(
            [
              '/',
              'runningprocess',
              'runningprocessview',
              id,
              'phase',
              childRoute.firstChild?.url[0].path ?? '',
            ],
            {
              queryParams: childRoute.queryParams,
            }
          );
        }
      } else if (isRunningPatternProcessEntry(runningProcessEntry)) {
        if (childRoute.component !== RunningPatternProcessComponent) {
          return this.router.createUrlTree(
            [
              '/',
              'runningprocess',
              'runningprocessview',
              id,
              'pattern',
              childRoute.firstChild?.url[0].path ?? '',
            ],
            {
              queryParams: childRoute.queryParams,
            }
          );
        }
      } else if (isRunningLightProcessEntry(runningProcessEntry)) {
        if (childRoute.component !== RunningLightProcessComponent) {
          return this.router.createUrlTree(
            [
              '/',
              'runningprocess',
              'runningprocessview',
              id,
              'light',
              childRoute.firstChild?.url[0].path ?? '',
            ],
            {
              queryParams: childRoute.queryParams,
            }
          );
        }
      } else {
        return false;
      }
    }
    return true;
  }
}
