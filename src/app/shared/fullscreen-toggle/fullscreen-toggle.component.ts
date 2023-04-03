import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-fullscreen-toggle',
  templateUrl: './fullscreen-toggle.component.html',
  styleUrls: ['./fullscreen-toggle.component.css'],
})
export class FullscreenToggleComponent {
  @Input() fullscreenElement?: HTMLElement;

  /**
   * This method is also needed for change detection. Do not remove.
   */
  @HostListener('window:fullscreenchange')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private fullscreenchange(): void {}

  async openFullscreen(): Promise<void> {
    await this.fullscreenElement?.requestFullscreen();
  }

  async closeFullscreen(): Promise<void> {
    await document.exitFullscreen();
  }

  get isFullscreenPossible(): boolean {
    return document.fullscreenEnabled;
  }

  get isInFullscreenMode(): boolean {
    return document.fullscreenElement != null;
  }
}
