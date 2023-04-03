import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageLoaderService } from '../../../../shared/image-loader.service';

@Component({
  selector: 'app-image-selector-modal',
  templateUrl: './image-selector-modal.component.html',
  styleUrls: ['./image-selector-modal.component.css'],
})
export class ImageSelectorModalComponent {
  file?: File;
  form = this.fb.group({
    file: [null, Validators.required],
  });
  imageLoadingError?: string;

  constructor(
    private activeModal: NgbActiveModal,
    private fb: UntypedFormBuilder,
    private imageLoaderService: ImageLoaderService
  ) {}

  fileChange(event: Event): void {
    this.imageLoadingError = undefined;
    const fileInput = event.target as HTMLInputElement;
    this.file = fileInput.files?.[0];
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  async select(): Promise<void> {
    if (this.file == null) {
      return;
    }
    try {
      const base64Image = await this.imageLoaderService.loadImage(this.file);
      this.activeModal.close(base64Image);
    } catch (error) {
      if (typeof error === 'string') {
        this.imageLoadingError = error;
      } else if (error instanceof Error) {
        this.imageLoadingError = error.message;
      } else {
        this.imageLoadingError =
          "Unknown Error. See browser's console for more info.";
      }
      throw error;
    }
  }
}
