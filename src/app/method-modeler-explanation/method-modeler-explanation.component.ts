import { Component, ViewChild } from '@angular/core';
import {
  NgbCarousel,
  NgbPagination,
  NgbSlideEvent,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-method-modeler-explanation',
  templateUrl: './method-modeler-explanation.component.html',
  styleUrls: ['./method-modeler-explanation.component.css'],
})
export class MethodModelerExplanationComponent {
  @ViewChild(NgbCarousel) carousel!: NgbCarousel;
  @ViewChild(NgbPagination) pagination!: NgbPagination;

  updateCarousel(tab: number): void {
    this.carousel.select(String(tab));
  }

  updatePagination(slideEvent: NgbSlideEvent): void {
    this.pagination.selectPage(Number(slideEvent.current));
  }
}
