import { Resolve } from '@angular/router';
import { NavDescription } from '../../../nav/nav.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConcreteArtifactNavService implements Resolve<NavDescription> {
  resolve(): NavDescription {
    return {
      menu: {
        name: 'Artifacts',
        submenu: [
          {
            name: 'Edit',
            route: [],
          },
        ],
      },
      link: ['/', 'concreteArtifacts'],
      depth: 1,
    };
  }
}
