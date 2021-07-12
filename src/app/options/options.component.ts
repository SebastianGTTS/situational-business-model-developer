import { Component } from '@angular/core';
import { PouchdbService } from '../database/pouchdb.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent {

  constructor(
    private pouchdbService: PouchdbService
  ) {
  }

  /**
   * Reset the local database.
   */
  resetDatabase(): void {
    console.log('Delete Database');
    this.pouchdbService.addDefaultData().catch((error) => {
      console.log('ResetDatabase: ' + error);
    });
  }
}
