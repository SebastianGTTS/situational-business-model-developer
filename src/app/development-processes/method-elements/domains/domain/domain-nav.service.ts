import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from 'src/app/nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class DomainNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Domains',
        submenu: [
          {
            name: 'Edit',
            route: ['/', 'domains', 'detail', route.params.id],
          },
        ],
      },
      link: ['/', 'domains'],
      depth: 1,
    };
  }
}
