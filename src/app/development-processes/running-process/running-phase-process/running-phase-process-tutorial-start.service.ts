import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TutorialStatsService } from '../../../tutorial/tutorial-stats.service';
import { RunningPhaseProcessService } from '../../../development-process-registry/running-process/running-phase-process.service';
import { ElementStartData } from '../../../tutorial/default-tutorial.service';
import PouchDB from 'pouchdb-browser';
import { RunningPhaseProcessTutorialService } from './running-phase-process-tutorial.service';
import { RunningFullProcessTutorialStartService } from '../../shared/running-full-process-tutorial-start.service';
import {
  BmPhaseProcess,
  BmPhaseProcessInit,
  isBmPhaseProcessEntry,
} from '../../../development-process-registry/bm-process/bm-phase-process';
import { BmPhaseProcessService } from '../../../development-process-registry/bm-process/bm-phase-process.service';

@Injectable({
  providedIn: 'root',
})
export class RunningPhaseProcessTutorialStartService extends RunningFullProcessTutorialStartService<
  BmPhaseProcess,
  BmPhaseProcessInit
> {
  constructor(
    private bmPhaseProcessService: BmPhaseProcessService,
    modalService: NgbModal,
    private runningPhaseProcessService: RunningPhaseProcessService,
    router: Router,
    tutorialStatsService: TutorialStatsService
  ) {
    super(bmPhaseProcessService, modalService, router, tutorialStatsService);
  }

  registerTutorial(): void {
    this.tutorialStatsService.registerTutorial(
      RunningPhaseProcessTutorialService.tutorialDefinition,
      this
    );
  }

  async start(startData: ElementStartData | undefined): Promise<boolean> {
    if (startData == null || startData.id == null) {
      return this.createRunningPhaseProcess();
    } else {
      try {
        await this.runningPhaseProcessService.get(startData.id);
      } catch (e) {
        const error = e as PouchDB.Core.Error;
        if (error.status === 404) {
          await this.restartAndDisplayNotFoundError(
            RunningPhaseProcessTutorialService.tutorialDefinition.id
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
        'phase',
      ]);
    }
    return true;
  }

  private async createRunningPhaseProcess(): Promise<boolean> {
    const process = await this.askProcess();
    if (process != null) {
      if (!isBmPhaseProcessEntry(process)) {
        throw new Error('Can only create phase-based processes');
      }
      const bmProcess = new BmPhaseProcess(process, undefined);
      if (!(await this.bmPhaseProcessService.isComplete(bmProcess))) {
        this.showIncompleteProcessError(bmProcess);
        return false;
      }
      const name = await this.askName(
        'Select name for Phase-based Running Method'
      );
      if (name != null && name != '') {
        const runningPhaseProcess = await this.runningPhaseProcessService.add({
          name: name,
          process: bmProcess,
        });
        await this.navigateToTutorial([
          'runningprocess',
          'runningprocessview',
          runningPhaseProcess._id,
          'phase',
        ]);
      }
    }
    return false;
  }
}
