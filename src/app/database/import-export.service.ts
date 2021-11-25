import { Injectable } from '@angular/core';
import { PouchdbService } from './pouchdb.service';

interface ImportExportContent {
  identifier: string;
  docs: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ImportExportService {
  private static identifier = 'SBMD-v1';

  constructor(private pouchdbService: PouchdbService) {}

  /**
   * Get the blob that represents the database content.
   */
  async exportDatabase(): Promise<Blob> {
    const allDocs = await this.pouchdbService.getAllDocs();
    const exportContent = allDocs as ImportExportContent;
    exportContent.docs.forEach((doc) => delete doc._rev);
    exportContent.identifier = ImportExportService.identifier;
    return new Blob([JSON.stringify(allDocs, null, 2)], {
      type: 'application/json',
    });
  }

  /**
   * Clear the current database and import the file
   *
   * @param file the file to import
   */
  async importDatabase(file: File): Promise<void> {
    console.log('Load file');
    const content = await this.importJson(file);
    console.log('File loaded');
    console.log('Check file');
    const docs = this.convertContentToDocs(content);
    console.log('File check');
    console.log('Delete database');
    await this.pouchdbService.clearDatabase();
    console.log('Database deleted');
    console.log('Import docs');
    await this.pouchdbService.importDocs(docs);
    console.log('Docs imported');
    console.log('Finished');
  }

  /**
   * Check whether the file has the correct content.
   * Throws an error if the file can not be imported.
   *
   * @return the docs to be imported
   */
  private convertContentToDocs(content: unknown): any[] {
    if (
      typeof content === 'object' &&
      'identifier' in content &&
      'docs' in content
    ) {
      const importContent = content as ImportExportContent;
      if (importContent.identifier === ImportExportService.identifier) {
        return importContent.docs;
      }
    }
    throw new Error('Content has not the correct form. Database not deleted.');
  }

  /**
   * Imports JSON from a file.
   *
   * @param file the file to read the JSON from
   */
  private importJson(file: File): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.addEventListener('error', () => {
        reject('Error loading file');
      });
      fileReader.addEventListener(
        'load',
        (event: ProgressEvent<FileReader>) => {
          let json = null;
          try {
            json = JSON.parse(event.target.result as string);
          } catch (error) {
            reject(error);
            return;
          }
          resolve(json);
        }
      );
      fileReader.readAsText(file);
    });
  }
}
