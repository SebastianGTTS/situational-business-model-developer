import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from 'src/app/nav/nav.service';
import { BmProcessService } from '../../../development-process-registry/bm-process/bm-process.service';
import { isBmPhaseProcessEntry } from '../../../development-process-registry/bm-process/bm-phase-process';

@Injectable({
  providedIn: 'root',
})
export class BmProcessInitNavService implements Resolve<NavDescription> {
  constructor(private bmProcessService: BmProcessService) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<NavDescription> {
    const bmProcessEntry = await this.bmProcessService.getEntry(
      route.parent?.params.id
    );
    let isPhase = false;
    if (isBmPhaseProcessEntry(bmProcessEntry)) {
      isPhase = true;
    }
    return {
      menu: {
        name: 'Methods',
        submenu: [
          {
            name: 'Init',
            route: [
              '/',
              'bmprocess',
              'bmprocessview',
              route.parent?.params.id,
              'init',
            ],
          },
        ],
      },
      link: ['/', 'bmprocess', isPhase ? 'phase' : 'pattern'],
      depth: 1,
    };
  }
}
