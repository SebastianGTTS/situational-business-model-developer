import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyModelSelectExpertKnowledgeNavService
  implements Resolve<NavDescription>
{
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    if (route.queryParamMap.has('bmProcessId')) {
      return {
        menu: {
          name: 'Method',
          submenu: [
            {
              name: 'Merge',
              route: [],
              queryParams: {
                bmProcessId: route.queryParams.bmProcessId,
              },
            },
          ],
        },
        link: [
          '/',
          'bmprocess',
          'bmprocessview',
          route.queryParams.bmProcessId,
          'phase',
          'method',
        ],
        depth: 2,
      };
    } else if (route.queryParamMap.has('runningProcessId')) {
      return {
        menu: {
          name: 'Running Method',
          submenu: [
            {
              name: 'Merge',
              route: [],
              queryParams: {
                runningProcessId: route.queryParams.runningProcessId,
              },
            },
          ],
        },
        link: [
          '/',
          'runningprocess',
          'runningprocessview',
          route.queryParams.runningProcessId,
          'light',
          'execution',
        ],
        depth: 2,
      };
    }
    return {
      menu: {
        name: 'Composed Models',
        submenu: [
          {
            name: 'Merge',
            route: [],
          },
        ],
      },
      link: ['/', 'companyModels'],
      depth: 2,
    };
  }
}
