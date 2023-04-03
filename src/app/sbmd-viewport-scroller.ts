import { ViewportScroller } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SbmdViewportScroller extends ViewportScroller {
  private element?: HTMLDivElement;

  private offset: () => [number, number] = () => [0, 0];

  getScrollPosition(): [number, number] {
    if (this.element != null) {
      return [this.element.scrollLeft, this.element.scrollTop];
    } else {
      return [0, 0];
    }
  }

  scrollToAnchor(anchor: string): void {
    void this.scrollToAnchorPromise(anchor);
  }

  // TODO: add better work around
  private async scrollToAnchorPromise(anchor: string): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    const anchorObject = document.getElementById(anchor);
    anchorObject?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  scrollToPosition(position: [number, number]): void {
    this.element?.scrollTo(position[0], position[1]);
  }

  setHistoryScrollRestoration(): void {
    // do nothing
  }

  setOffset(offset: [number, number] | (() => [number, number])): void {
    if (Array.isArray(offset)) {
      this.offset = (): [number, number] => offset;
    } else {
      this.offset = offset;
    }
  }

  setElement(element: HTMLDivElement): void {
    this.element = element;
  }
}
