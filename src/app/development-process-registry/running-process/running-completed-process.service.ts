import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { ElementService } from '../../database/element.service';
import {
  RunningProcessInitTypes,
  RunningProcessTypes,
} from './running-process-types.service';
import { EntryType } from '../../database/database-model-part';
import { RunningProcess } from './running-process';
import { PouchdbService } from '../../database/pouchdb.service';
import { DbId } from '../../database/database-entry';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class RunningCompletedProcessService
  implements ElementService<RunningProcessTypes, RunningProcessInitTypes>
{
  constructor(private pouchdbService: PouchdbService) {}

  get(): Promise<RunningProcessTypes> {
    throw new Error('Not implemented');
  }

  add(): Promise<RunningProcessTypes> {
    throw new Error('Not implemented');
  }

  getChangesFeed(): Observable<void> {
    throw new Error('Not implemented');
  }

  async delete(id: DbId): Promise<void> {
    await this.pouchdbService.remove(
      await this.pouchdbService.get<EntryType<RunningProcess>>(id)
    );
  }

  getList(): Promise<EntryType<RunningProcessTypes>[]> {
    return this.pouchdbService.find<EntryType<RunningProcessTypes>>(
      RunningProcess.typeName,
      {
        selector: {
          completed: true,
        },
      }
    );
  }
}
