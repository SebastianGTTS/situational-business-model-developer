import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder) {}

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
      const base64Image = await this.loadImage(this.file);
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

  private async loadImage(file: File): Promise<string> {
    return new Promise((resolve: (value: string) => void, reject) => {
      if (!file.type.startsWith('image/')) {
        reject('File must be an image');
      }
      const fileReader = new FileReader();
      fileReader.addEventListener('error', () => {
        reject('Error loading file');
      });
      fileReader.addEventListener(
        'load',
        (event: ProgressEvent<FileReader>) => {
          try {
            const imageBase64 = event.target?.result as string;
            resolve(imageBase64);
          } catch (error) {
            reject(error);
            return;
          }
        }
      );
      fileReader.readAsDataURL(file);
    });
  }
}
