import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class ExperimentDefinitionNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Experiment Definitions',
        submenu: [
          {
            name: 'Overview',
            route: [
              '/',
              'hypomomaps',
              'experiments',
              route.params.id,
              'overview',
            ],
          },
          {
            name: 'General',
            route: [
              '/',
              'hypomomaps',
              'experiments',
              route.params.id,
              'general',
            ],
          },
          {
            name: 'Edit Experiment Tree',
            route: ['/', 'hypomomaps', 'experiments', route.params.id, 'edit'],
          },
        ],
      },
      link: ['/', 'hypomomaps', 'experiments'],
      depth: 1,
    };
  }
}
