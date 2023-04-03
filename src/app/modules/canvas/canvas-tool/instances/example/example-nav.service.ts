import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class ExampleNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Canvas Building Block',
        submenu: [
          {
            name: 'Overview',
            route: [
              '/',
              'expertModels',
              route.params.id,
              'examples',
              route.params.instanceId,
              'overview',
            ],
          },
          {
            name: 'General',
            route: [
              '/',
              'expertModels',
              route.params.id,
              'examples',
              route.params.instanceId,
              'general',
            ],
          },
          {
            name: 'Edit Example',
            route: [
              '/',
              'expertModels',
              route.params.id,
              'examples',
              route.params.instanceId,
              'edit',
            ],
          },
        ],
      },
      link: ['/', 'expertModels', route.params.id, 'instances'],
      depth: 2,
    };
  }
}
