import { Component } from '@angular/core';
import { IconEntry, IconTypes } from '../../../../../model/icon';

interface CanvasElementLink {
  name: string;
  description?: string;
  icon?: IconEntry;
  route: string[];
}

@Component({
  selector: 'app-canvas-elements',
  templateUrl: './canvas-elements.component.html',
  styleUrls: ['./canvas-elements.component.css'],
})
export class CanvasElementsComponent {
  canvasElements: CanvasElementLink[] = [
    {
      name: 'Domains',
      description: 'Domains can be applied to Canvas Building Blocks',
      icon: {
        type: IconTypes.PREDEFINED,
        icon: 'bi-box2',
        color: 'dark',
      },
      route: ['/', 'domains'],
    },
  ];
}
