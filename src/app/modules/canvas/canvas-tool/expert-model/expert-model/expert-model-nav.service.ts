import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class ExpertModelNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Canvas Building Blocks',
        submenu: [
          {
            name: 'Overview',
            route: ['/', 'expertModels', route.params.id, 'overview'],
          },
          {
            name: 'General',
            route: ['/', 'expertModels', route.params.id, 'general'],
          },
          {
            name: 'Edit Block',
            route: ['/', 'expertModels', route.params.id, 'edit'],
          },
          {
            name: 'Patterns & Examples',
            route: ['/', 'expertModels', route.params.id, 'instances'],
          },
        ],
      },
      link: ['/', 'expertModels'],
      depth: 1,
    };
  }
}
