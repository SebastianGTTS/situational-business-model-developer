import { Component, ViewChild } from '@angular/core';
import { NgbCarousel, NgbPagination, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-enaction-explanation',
  templateUrl: './enaction-explanation.component.html',
  styleUrls: ['./enaction-explanation.component.css']
})
export class EnactionExplanationComponent {

  @ViewChild(NgbCarousel, {static: false}) carousel: NgbCarousel;
  @ViewChild(NgbPagination, {static: false}) pagination: NgbPagination;

  updateCarousel(tab: number) {
    this.carousel.select(String(tab));
  }

  updatePagination(slideEvent: NgbSlideEvent) {
    this.pagination.selectPage(Number(slideEvent.current));
  }

}
