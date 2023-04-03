import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Ajv from 'ajv';
import { ImportExportService } from '../import-export.service';

@Component({
  selector: 'app-model-import-view',
  templateUrl: './model-import-view.component.html',
  styleUrls: ['./model-import-view.component.css'],
})
export class ModelImportViewComponent {
  @Input() elementName!: string;

  @Output() imported = new EventEmitter<void>();

  file?: Blob;
  form = this.fb.group({ file: null });
  importError?: string;

  constructor(
    private fb: FormBuilder,
    private importExportService: ImportExportService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fileChange(event: any): void {
    this.importError = undefined;
    this.file = event.target.files[0];
  }

  async submitForm(): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.importExportService.importExpertModel(this.file!);
      this.form.reset();
      this.file = undefined;
      this.imported.emit();
    } catch (e) {
      console.log(e);
      if (typeof e === 'string') {
        this.importError = e;
      } else if (e instanceof Error) {
        this.importError = e.message;
      } else if (Array.isArray(e)) {
        const ajvError = e as Ajv.ErrorObject[];
        this.importError = ajvError[0].message;
      } else {
        this.importError =
          "Unknown Error. See browser's console for more info.";
      }
    }
  }
}
