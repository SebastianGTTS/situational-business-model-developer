import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyModelNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Composed Models',
        submenu: [
          {
            name: 'Overview',
            route: ['/', 'companyModels', route.params.id, 'overview'],
          },
          {
            name: 'General',
            route: ['/', 'companyModels', route.params.id, 'general'],
          },
          {
            name: 'Edit Model',
            route: ['/', 'companyModels', route.params.id, 'edit'],
          },
          {
            name: 'Merge',
            route: ['/', 'companyModels', route.params.id, 'merge'],
          },
        ],
      },
      link: ['/', 'companyModels'],
      depth: 1,
    };
  }
}
