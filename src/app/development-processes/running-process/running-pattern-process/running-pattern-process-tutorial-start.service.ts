import { Injectable } from '@angular/core';
import { RunningFullProcessTutorialStartService } from '../../shared/running-full-process-tutorial-start.service';
import {
  BmPatternProcess,
  BmPatternProcessInit,
  isBmPatternProcessEntry,
} from '../../../development-process-registry/bm-process/bm-pattern-process';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TutorialStatsService } from '../../../tutorial/tutorial-stats.service';
import { BmPatternProcessService } from '../../../development-process-registry/bm-process/bm-pattern-process.service';
import { RunningPatternProcessService } from '../../../development-process-registry/running-process/running-pattern-process.service';
import { RunningPatternProcessTutorialService } from './running-pattern-process-tutorial.service';
import { ElementStartData } from '../../../tutorial/default-tutorial.service';
import PouchDB from 'pouchdb-browser';

@Injectable({
  providedIn: 'root',
})
export class RunningPatternProcessTutorialStartService extends RunningFullProcessTutorialStartService<
  BmPatternProcess,
  BmPatternProcessInit
> {
  constructor(
    private bmPatternProcessService: BmPatternProcessService,
    modalService: NgbModal,
    private runningPatternProcessService: RunningPatternProcessService,
    router: Router,
    tutorialStatsService: TutorialStatsService
  ) {
    super(bmPatternProcessService, modalService, router, tutorialStatsService);
  }

  registerTutorial(): void {
    this.tutorialStatsService.registerTutorial(
      RunningPatternProcessTutorialService.tutorialDefinition,
      this
    );
  }

  async start(startData: ElementStartData | undefined): Promise<boolean> {
    if (startData == null || startData.id == null) {
      return this.createRunningPatternProcess();
    } else {
      try {
        await this.runningPatternProcessService.get(startData.id);
      } catch (e) {
        const error = e as PouchDB.Core.Error;
        if (error.status === 404) {
          await this.restartAndDisplayNotFoundError(
            RunningPatternProcessTutorialService.tutorialDefinition.id
          );
          return false;
        } else {
          throw error;
        }
      }
      await this.navigateToTutorial([
        'runningprocess',
        'runningprocessview',
        startData.id,
        'pattern',
      ]);
    }
    return true;
  }

  private async createRunningPatternProcess(): Promise<boolean> {
    const process = await this.askProcess();
    if (process != null) {
      if (!isBmPatternProcessEntry(process)) {
        throw new Error('Can only create pattern-based processes');
      }
      const bmProcess = new BmPatternProcess(process, undefined);
      if (!(await this.bmPatternProcessService.isComplete(bmProcess))) {
        this.showIncompleteProcessError(bmProcess);
        return false;
      }
      const name = await this.askName(
        'Select name for Pattern-based Running Method'
      );
      if (name != null && name != '') {
        const runningPatternProcess =
          await this.runningPatternProcessService.add({
            name: name,
            process: bmProcess,
          });
        await this.navigateToTutorial([
          'runningprocess',
          'runningprocessview',
          runningPatternProcess._id,
          'pattern',
        ]);
      }
    }
    return false;
  }
}
