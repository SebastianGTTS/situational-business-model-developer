import { Injectable, NgZone, OnDestroy } from '@angular/core';
import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';
import { DatabaseModel } from './database-model';
import examples from '../../examples';
import { from, Observable, Subject } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  DatabaseRevision,
  DatabaseRootEntry,
  DbId,
  DbType,
} from './database-entry';
import FindResponse = PouchDB.Find.FindResponse;

export enum DatabaseErrors {
  INVALID_NAME = 'Name of database may only contain characters or numbers.',
  MISSING_NAME = 'Database name is missing.',
}

interface CouchDBFindResponse {
  docs: unknown[];
  bookmark?: string;
}

// noinspection JSVoidFunctionReturnValueUsed
@Injectable()
export class PouchdbService implements OnDestroy {
  private db?: PouchDB.Database<DatabaseRootEntry>;
  private expired?: () => Promise<void>;
  private error?: () => Promise<void>;

  private readonly dbChange: Subject<boolean> = new Subject<boolean>();
  readonly dbChangeObserver: Observable<boolean> = this.dbChange.asObservable();

  private readonly dbDataReset: Subject<boolean> = new Subject<boolean>();
  readonly dbDataResetObserver: Observable<boolean> =
    this.dbDataReset.asObservable();

  constructor(private zone: NgZone) {
    PouchDB.plugin(PouchDBFind);
  }

  ngOnDestroy(): void {
    this.dbChange.complete();
    this.dbDataReset.complete();
  }

  init(
    name: string,
    expired?: () => Promise<void>,
    error?: () => Promise<void>
  ): void {
    if (this.db) {
      void this.db.close();
    }
    this.db = this.getDatabase(name);
    this.expired = expired;
    this.error = error;
    this.dbChange.next(true);
  }

  /**
   * Close the connection to the current database
   */
  async closeDb(): Promise<void> {
    await this.getDb().close();
    this.db = undefined;
    this.expired = undefined;
    this.error = undefined;
    this.dbChange.next(false);
  }

  /**
   * Get the database to connect to
   *
   * @param name the name of the database
   */
  private getDatabase(name: string): PouchDB.Database<DatabaseRootEntry> {
    if (name == null) {
      throw new Error(DatabaseErrors.MISSING_NAME);
    }
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      throw new Error(DatabaseErrors.INVALID_NAME);
    }
    if (environment.localDatabase) {
      return new PouchDB<DatabaseRootEntry>(name);
    } else {
      const options: PouchDB.Configuration.DatabaseConfiguration = {
        fetch: (fetchUrl, fetchOptions) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (fetchOptions!.headers as Headers).set(
            'X-CouchDB-WWW-Authenticate',
            'Cookie'
          );
          return PouchDB.fetch(fetchUrl, fetchOptions);
        },
        skip_setup: true,
      };
      const url = new URL('/database/' + name, location.origin).href;
      return new PouchDB<DatabaseRootEntry>(url, options);
    }
  }

  /**
   * Get info about the database
   */
  getDatabaseInfo(): Promise<PouchDB.Core.DatabaseInfo> {
    return this.getDb()
      .info()
      .catch((error) => this.handleError(error));
  }

  async find<T extends DatabaseRootEntry>(
    type: DbType,
    request: PouchDB.Find.FindRequest<T>
  ): Promise<T[]> {
    try {
      let result: PouchDB.Find.FindResponse<T>;
      if (Object.keys(request.selector).length > 0) {
        result = (await this._find({
          ...request,
          selector: {
            $and: [request.selector, { type }],
          },
        })) as PouchDB.Find.FindResponse<T>;
      } else {
        result = (await this._find({
          ...request,
          selector: {
            type,
          },
        })) as PouchDB.Find.FindResponse<T>;
      }
      return result.docs;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async get<T extends DatabaseRootEntry>(
    id: DbId
  ): Promise<T & DatabaseRevision> {
    try {
      return await this.getDb().get<T>(id);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post(model: DatabaseModel): Promise<void> {
    try {
      await this.getDb().post(model.toDb());
    } catch (error) {
      await this.handleError(error);
    }
  }

  async put<T extends DatabaseModel>(model: T): Promise<void> {
    try {
      await this.getDb().put(model.toDb());
    } catch (error) {
      await this.handleError(error);
    }
  }

  async remove(model: DatabaseRevision): Promise<void> {
    try {
      await this.getDb().remove(model);
    } catch (error) {
      await this.handleError(error);
    }
  }

  /**
   * Get all changes of a specific model
   *
   * @param id the id of the model
   * @return the changes feed, needs to be canceled to stop receiving changes
   */
  getChangesFeed(id: DbId): Observable<void> {
    const subject = new Subject<void>();
    const changes = this.getDb()
      .changes({
        since: 'now',
        live: true,
        doc_ids: [id],
      })
      .on('change', () => this.zone.run(() => subject.next()))
      .on('error', (error) => this.zone.run(() => subject.error(error)));
    return subject.pipe(
      catchError((error) => from(this.handleError(error))),
      finalize(() => changes.cancel())
    );
  }

  /**
   * Called on error
   */
  private async handleError(error: unknown): Promise<never> {
    const pouchDbError = error as PouchDB.Core.Error;
    if (
      pouchDbError.status === 401 &&
      pouchDbError.error === 'unauthorized' &&
      this.expired != null
    ) {
      await this.expired();
    }
    if (
      pouchDbError.status === 500 &&
      pouchDbError.error === 'internal_server_error' &&
      this.error != null
    ) {
      await this.error();
    }
    throw error;
  }

  /**
   * Add default data to the database.
   */
  async addDefaultData(): Promise<void> {
    try {
      await this.getDb().bulkDocs(examples as DatabaseRootEntry[]);
    } catch (error) {
      return this.handleError(error);
    }
    this.dbDataReset.next(false);
  }

  /**
   * Clear all documents from the database
   */
  async clearDatabase(): Promise<void> {
    this.dbDataReset.next(true);
    try {
      const allDocs = await this.getDb().allDocs();
      const toBeDeleted = allDocs.rows.map((row) => {
        return {
          _id: row.id,
          _rev: row.value.rev,
          _deleted: true,
        };
      });
      await this.getDb().bulkDocs(
        toBeDeleted as unknown[] as DatabaseRootEntry[]
      );
    } catch (error) {
      await this.handleError(error);
    }
  }

  /**
   * Export the complete database
   */
  async getAllDocs(): Promise<PouchDB.Find.FindResponse<DatabaseRootEntry>> {
    const docCount = (await this.getDatabaseInfo()).doc_count;
    const allDocs = await this._find({ selector: {} });
    if (docCount !== allDocs.docs.length) {
      throw new Error('Doc count does not match export size');
    }
    return allDocs as PouchDB.Find.FindResponse<DatabaseRootEntry>;
  }

  async importDocs(docs: DatabaseRootEntry[]): Promise<void> {
    try {
      await this.getDb().bulkDocs(docs);
    } catch (error) {
      await this.handleError(error);
    }
    this.dbDataReset.next(false);
  }

  private async _find<T extends DatabaseRootEntry>(
    request: PouchDB.Find.FindRequest<T>
  ): Promise<PouchDB.Find.FindResponse<T>> {
    const response = await this.getDb().find(request);
    if ('bookmark' in response) {
      const couchDbResponse = response as CouchDBFindResponse;
      let docCount = couchDbResponse.docs.length;
      while (docCount > 0 && couchDbResponse.bookmark != null) {
        const nextPage = await this.getDb().find({
          ...request,
          bookmark: couchDbResponse.bookmark,
        } as never);
        docCount = nextPage.docs.length;
        couchDbResponse.docs = couchDbResponse.docs.concat(nextPage.docs);
        if ('bookmark' in response) {
          const couchDbNextPage = nextPage as CouchDBFindResponse;
          couchDbResponse.bookmark = couchDbNextPage.bookmark;
        } else {
          couchDbResponse.bookmark = undefined;
        }
      }
    }
    return response as FindResponse<T>;
  }

  /**
   * Get the database, but check whether it is available.
   */
  private getDb(): PouchDB.Database<DatabaseRootEntry> {
    if (this.db == null) {
      throw new Error('Database is not initialized');
    }
    return this.db;
  }
}
