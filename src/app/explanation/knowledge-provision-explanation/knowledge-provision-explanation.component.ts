import { Component } from '@angular/core';
import { CarouselImage } from '../carousel/carousel.component';

@Component({
  selector: 'app-knowledge-provision-explanation',
  templateUrl: './knowledge-provision-explanation.component.html',
  styleUrls: ['./knowledge-provision-explanation.component.scss'],
})
export class KnowledgeProvisionExplanationComponent {
  images: CarouselImage[] = [
    {
      src: 'assets/explanation/situational-factor.png',
      alt: 'Situational factor page',
      caption:
        '1. Create Method Elements (i.e., a situational factor) as atomic parts',
    },
    {
      src: 'assets/explanation/building-block.png',
      alt: 'Method Building Block page',
      caption: '2. Create Method Building Blocks out of elements',
    },
    {
      src: 'assets/explanation/pattern.png',
      alt: 'Method Pattern page',
      caption: '3. Create Method Patterns to arrange building blocks',
    },
  ];
}
