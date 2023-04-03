import { Component } from '@angular/core';
import { CarouselImage } from '../carousel/carousel.component';

@Component({
  selector: 'app-method-composition-explanation',
  templateUrl: './method-composition-explanation.component.html',
  styleUrls: ['./method-composition-explanation.component.scss'],
})
export class MethodCompositionExplanationComponent {
  images: CarouselImage[] = [
    {
      src: 'assets/explanation/method-composition-pattern.png',
      alt: 'Pattern-based Method Composition Overview Page',
      caption:
        'A. Pattern-based Method Composition for composing a development method',
    },
    {
      src: 'assets/explanation/method-composition-phase.png',
      alt: 'Phase-based Method Composition Overview Page',
      caption:
        'B. Phase-based Method Composition for composing a development method',
    },
  ];
}
