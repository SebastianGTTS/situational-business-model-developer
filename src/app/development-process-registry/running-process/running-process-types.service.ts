import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { RunningProcess } from './running-process';
import { ElementService } from '../../database/element.service';
import { DbId } from '../../database/database-entry';
import { Observable } from 'rxjs';
import { EntryType } from '../../database/database-model-part';
import { PouchdbService } from '../../database/pouchdb.service';
import {
  isRunningPatternProcessEntry,
  isRunningPatternProcessInit,
  RunningPatternProcess,
  RunningPatternProcessInit,
} from './running-pattern-process';
import {
  isRunningPhaseProcessEntry,
  isRunningPhaseProcessInit,
  RunningPhaseProcess,
  RunningPhaseProcessInit,
} from './running-phase-process';
import {
  isRunningLightProcessEntry,
  RunningLightProcess,
  RunningLightProcessInit,
} from './running-light-process';
import { RunningPatternProcessService } from './running-pattern-process.service';
import { RunningPhaseProcessService } from './running-phase-process.service';
import { RunningLightProcessService } from './running-light-process.service';

export type RunningProcessTypes =
  | RunningPatternProcess
  | RunningPhaseProcess
  | RunningLightProcess;
export type RunningProcessInitTypes =
  | RunningPatternProcessInit
  | RunningPhaseProcessInit
  | RunningLightProcessInit;

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class RunningProcessTypesService
  implements ElementService<RunningProcessTypes, RunningProcessInitTypes>
{
  constructor(
    protected pouchdbService: PouchdbService,
    private runningLightProcessService: RunningLightProcessService,
    private runningPatternProcessService: RunningPatternProcessService,
    private runningPhaseProcessService: RunningPhaseProcessService
  ) {}

  add(element: RunningProcessInitTypes): Promise<RunningProcessTypes> {
    if (isRunningPatternProcessInit(element)) {
      return this.runningPatternProcessService.add(element);
    } else if (isRunningPhaseProcessInit(element)) {
      return this.runningPhaseProcessService.add(element);
    } else {
      return this.runningLightProcessService.add(element);
    }
  }

  async get(id: DbId): Promise<RunningProcessTypes> {
    const entry = await this.pouchdbService.get<EntryType<RunningProcessTypes>>(
      id
    );
    if (isRunningPatternProcessEntry(entry)) {
      return new RunningPatternProcess(entry, undefined);
    } else if (isRunningPhaseProcessEntry(entry)) {
      return new RunningPhaseProcess(entry, undefined);
    } else if (isRunningLightProcessEntry(entry)) {
      return new RunningLightProcess(entry, undefined);
    } else {
      throw new Error('Unknown running process type');
    }
  }

  async delete(id: DbId): Promise<void> {
    await this.pouchdbService.remove(
      await this.pouchdbService.get<EntryType<RunningProcess>>(id)
    );
  }

  getChangesFeed(id: DbId): Observable<void> {
    return this.pouchdbService.getChangesFeed(id);
  }

  getList(): Promise<EntryType<RunningProcessTypes>[]> {
    return this.pouchdbService.find<EntryType<RunningProcessTypes>>(
      RunningProcess.typeName,
      {
        selector: {
          $not: {
            $or: [{ contextChange: true }, { completed: true }],
          },
        },
      }
    );
  }
}

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class RunningProcessContextTypesService extends RunningProcessTypesService {
  getList(): Promise<EntryType<RunningProcessTypes>[]> {
    return this.pouchdbService.find<EntryType<RunningProcessTypes>>(
      RunningProcess.typeName,
      {
        selector: {
          contextChange: true,
        },
      }
    );
  }
}
