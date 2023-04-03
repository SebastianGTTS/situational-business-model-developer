import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class ArtifactNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Artifacts',
        submenu: [
          {
            name: 'Edit',
            route: ['/', 'artifacts', 'detail', route.params.id],
          },
        ],
      },
      link: ['/', 'artifacts'],
      depth: 1,
    };
  }
}
