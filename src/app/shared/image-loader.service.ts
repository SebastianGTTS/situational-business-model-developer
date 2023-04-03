import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageLoaderService {
  /**
   * Load a base64 image from a file
   *
   * @param file
   */
  async loadImage(file: File | undefined): Promise<string> {
    return new Promise((resolve: (value: string) => void, reject) => {
      if (file == null) {
        reject('No file provided');
        return;
      }
      if (!file.type.startsWith('image/')) {
        reject('File must be an image');
        return;
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
