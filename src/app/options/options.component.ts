import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../database/auth.service';
import { environment } from '../../environments/environment';
import { PouchdbService } from '../database/pouchdb.service';
import { saveAs } from 'file-saver';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ImportExportService } from '../database/import-export.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent {
  passwordChangeError = false;
  passwordChangeForbidden = false;

  readonly verifyString = 'resetDB';
  file?: File;
  form = this.fb.group({
    file: [null, Validators.required],
    verify: [
      '',
      [
        Validators.required,
        (control: AbstractControl): ValidationErrors | null => {
          return control.value !== this.verifyString
            ? { notVerified: true }
            : null;
        },
      ],
    ],
  });
  importError?: string;

  @ViewChild('importModal', { static: true }) importModal: unknown;
  private modalReference?: NgbModalRef;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private importExportService: ImportExportService,
    private modalService: NgbModal,
    private pouchdbService: PouchdbService
  ) {}

  changePassword(newPassword: string): void {
    this.passwordChangeError = false;
    this.passwordChangeForbidden = false;
    this.authService.changePassword(newPassword).subscribe(
      () => console.log('Password changed.'),
      (error) => {
        console.error(error);
        console.log('Password NOT changed.');
        if (error.status === 403) {
          this.passwordChangeForbidden = true;
        } else {
          this.passwordChangeError = true;
        }
      }
    );
  }

  openImportDatabase(): void {
    this.modalReference = this.modalService.open(this.importModal, {
      size: 'lg',
    });
  }

  fileChange(event: Event): void {
    this.importError = null;
    const fileInput = event.target as HTMLInputElement;
    this.file = fileInput.files[0];
  }

  async submitForm(): Promise<void> {
    try {
      await this.importExportService.importDatabase(this.file);
    } catch (error) {
      if (typeof error === 'string') {
        this.importError = error;
      } else if (error instanceof Error) {
        this.importError = error.message;
      } else {
        this.importError =
          "Unknown Error. See browser's console for more info.";
      }
      throw error;
    }
    this.modalReference!.close();
  }

  async exportDatabase(): Promise<void> {
    saveAs(await this.importExportService.exportDatabase(), 'db.json');
  }

  get username(): string | undefined {
    return this.authService.username;
  }

  isLocalDatabase(): boolean {
    return environment.localDatabase === true;
  }

  /**
   * Reset the local database.
   */
  async resetDatabase(): Promise<void> {
    console.log('Delete Database');
    await this.pouchdbService.clearDatabase();
    console.log('Add default data');
    await this.pouchdbService.addDefaultData();
  }

  get verifyControl(): AbstractControl {
    return this.form.get('verify');
  }
}
