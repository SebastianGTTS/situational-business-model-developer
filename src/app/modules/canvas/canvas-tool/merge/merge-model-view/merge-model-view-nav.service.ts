import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class MergeModelViewNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    if (route.queryParamMap.has('bmProcessId')) {
      return {
        menu: {
          name: 'Composed Model',
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
        link: ['/', 'companyModels', route.params.companyModelId, 'select'],
        queryParams: {
          bmProcessId: route.queryParams.bmProcessId,
        },
        depth: 3,
      };
    } else if (route.queryParamMap.has('runningProcessId')) {
      return {
        menu: {
          name: 'Composed Model',
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
        link: ['/', 'companyModels', route.params.companyModelId, 'select'],
        queryParams: {
          runningProcessId: route.queryParams.runningProcessId,
        },
        depth: 3,
      };
    }
    return {
      menu: {
        name: 'Composed Model',
        submenu: [
          {
            name: 'Merge',
            route: [],
          },
        ],
      },
      link: ['/', 'companyModels', route.params.companyModelId, 'merge'],
      depth: 2,
    };
  }
}
