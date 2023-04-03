import { Component, Input, ViewChild } from '@angular/core';
import {
  NgbCarousel,
  NgbPagination,
  NgbSlideEvent,
} from '@ng-bootstrap/ng-bootstrap';

export interface CarouselImage {
  src: string;
  alt: string;
  caption: string;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
  @Input() images!: CarouselImage[];

  private nextTab?: string;
  private isAnimating = false;

  @ViewChild(NgbCarousel) carousel!: NgbCarousel;
  @ViewChild(NgbPagination) pagination!: NgbPagination;

  startSliding(): void {
    this.isAnimating = true;
  }

  endSliding(slideEvent: NgbSlideEvent): void {
    if (this.nextTab != null && this.nextTab !== this.carousel.activeId) {
      this.carousel.select(this.nextTab);
      this.nextTab = undefined;
    } else {
      const pageNumber = Number(slideEvent.current);
      if (pageNumber !== this.pagination.page) {
        this.pagination.selectPage(pageNumber);
      }
      this.nextTab = undefined;
      this.isAnimating = false;
    }
  }

  updateCarousel(tab: number): void {
    const tabName = String(tab);
    if (this.isAnimating) {
      this.nextTab = tabName;
    } else if (tabName !== this.carousel.activeId) {
      this.nextTab = undefined;
      this.isAnimating = true;
      this.carousel.select(tabName);
    }
  }
}
