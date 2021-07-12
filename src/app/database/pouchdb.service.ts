import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';
import { PouchdbModel } from './pouchdb-model';
import examples from '../../examples';

@Injectable()
export class PouchdbService {

  db: PouchDB.Database<PouchdbModel>;

  // Use "http://localhost:4200/database" for connecting to a CouchDB specified in the proxy.conf.json
  databaseName = 'bmdl-feature-modeler';

  constructor() {
    // Create a PouchDB connection
    PouchDB.plugin(PouchDBFind);
    // Change to this.db = new PouchDB('http://server:port/yourdatabase'); to connect to a couchdb database
    this.db = new PouchDB(this.databaseName);

    // Check database connection
    this.db.info().then((info) => console.log('Database connection: ' + JSON.stringify(info)));
  }

  /**
   * Initialise the database with default data if there is no data
   */
  init(): Promise<void> {
    return this.getDatabaseInfo().then(result => {
      if (result.doc_count === 0) {
        console.log('Init database');
        return this.addDefaultData().catch((error) => {
          console.log('Init (inner): ' + error);
        });
      }
    }, error => {
      console.log('Init: ' + error);
    });
  }

  /**
   * Get info about the database
   */
  getDatabaseInfo() {
    return this.db.info();
  }

  find<T extends PouchdbModel>(type: string, request: PouchDB.Find.FindRequest<T>): Promise<PouchDB.Find.FindResponse<T>> {
    return this.db.find({
      ...request,
      selector: {
        $and: [
          request.selector,
          {type},
        ]
      },
    }) as Promise<PouchDB.Find.FindResponse<T>>;
  }

  get<T extends PouchdbModel>(id: string) {
    return this.db.get<T>(id);
  }

  post<T extends PouchdbModel>(model: T) {
    return this.db.post(model.toPouchDb());
  }

  put<T extends PouchdbModel>(model: T) {
    return this.db.put(model.toPouchDb());
  }

  remove<T extends PouchdbModel>(model: T) {
    return this.db.remove(model);
  }

  /**
   * Add default data to the database.
   */
  addDefaultData() {
    return this.db.destroy().then(() => {
      this.db = new PouchDB(this.databaseName);

      return this.db.bulkDocs(examples as any[]);
    }, error => {
      return error;
    });
  }

}
