import { Component } from '@angular/core';
import { CarouselImage } from '../carousel/carousel.component';

@Component({
  selector: 'app-method-enactment-explanation',
  templateUrl: './method-enactment-explanation.component.html',
  styleUrls: ['./method-enactment-explanation.component.scss'],
})
export class MethodEnactmentExplanationComponent {
  images: CarouselImage[] = [
    {
      src: 'assets/explanation/create-running-process.png',
      alt: 'Create running method',
      caption: '1. Create a running development method',
    },
    {
      src: 'assets/explanation/method-enactment.png',
      alt: 'Kanban board to manage the enaction',
      caption: '2. Manage the enaction in a kanban board',
    },
    {
      src: 'assets/explanation/development-step.png',
      alt: 'The development step execution page',
      caption: '3. Execute single steps of the development method',
    },
  ];
}
