import { Injectable } from '@angular/core';
import { DefaultTutorialStartService } from '../../../tutorial/default-tutorial-start.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TutorialStatsService } from '../../../tutorial/tutorial-stats.service';
import { RunningLightProcessService } from '../../../development-process-registry/running-process/running-light-process.service';
import { RunningLightProcessTutorialService } from './running-light-process-tutorial.service';
import { ElementStartData } from '../../../tutorial/default-tutorial.service';
import PouchDB from 'pouchdb-browser';

@Injectable({
  providedIn: 'root',
})
export class RunningLightProcessTutorialStartService extends DefaultTutorialStartService {
  constructor(
    modalService: NgbModal,
    private runningLightProcessService: RunningLightProcessService,
    router: Router,
    tutorialStatsService: TutorialStatsService
  ) {
    super(modalService, router, tutorialStatsService);
  }

  registerTutorial(): void {
    this.tutorialStatsService.registerTutorial(
      RunningLightProcessTutorialService.tutorialDefinition,
      this
    );
  }

  async start(startData: ElementStartData | undefined): Promise<boolean> {
    if (startData == null || startData.id == null) {
      const name = await this.askName('Select name for Light Running Method');
      if (name != null && name != '') {
        const bmPhaseProcess = await this.runningLightProcessService.add({
          name: name,
        });
        await this.navigateToTutorial([
          'runningprocess',
          'runningprocessview',
          bmPhaseProcess._id,
          'light',
        ]);
      }
    } else {
      try {
        await this.runningLightProcessService.get(startData.id);
      } catch (e) {
        const error = e as PouchDB.Core.Error;
        if (error.status === 404) {
          await this.restartAndDisplayNotFoundError(
            RunningLightProcessTutorialService.tutorialDefinition.id
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
        'light',
      ]);
    }
    return true;
  }
}
