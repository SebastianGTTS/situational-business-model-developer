import { Component, ViewChild } from '@angular/core';
import {
  NgbCarousel,
  NgbPagination,
  NgbSlideEvent,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-feature-modeler-explanation',
  templateUrl: './feature-modeler-explanation.component.html',
  styleUrls: ['./feature-modeler-explanation.component.css'],
})
export class FeatureModelerExplanationComponent {
  @ViewChild(NgbCarousel) carousel!: NgbCarousel;
  @ViewChild(NgbPagination) pagination!: NgbPagination;

  updateCarousel(tab: number): void {
    this.carousel.select(String(tab));
  }

  updatePagination(slideEvent: NgbSlideEvent): void {
    this.pagination.selectPage(Number(slideEvent.current));
  }
}
