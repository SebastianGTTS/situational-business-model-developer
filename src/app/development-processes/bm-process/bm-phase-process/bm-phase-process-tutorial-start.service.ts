import { Injectable } from '@angular/core';
import { DefaultTutorialStartService } from '../../../tutorial/default-tutorial-start.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TutorialStatsService } from '../../../tutorial/tutorial-stats.service';
import { BmPhaseProcessService } from '../../../development-process-registry/bm-process/bm-phase-process.service';
import { BmPhaseProcessTutorialService } from './bm-phase-process-tutorial.service';
import { ElementStartData } from '../../../tutorial/default-tutorial.service';
import PouchDB from 'pouchdb-browser';

@Injectable({
  providedIn: 'root',
})
export class BmPhaseProcessTutorialStartService extends DefaultTutorialStartService {
  constructor(
    modalService: NgbModal,
    private bmPhaseProcessService: BmPhaseProcessService,
    router: Router,
    tutorialStatsService: TutorialStatsService
  ) {
    super(modalService, router, tutorialStatsService);
  }

  registerTutorial(): void {
    this.tutorialStatsService.registerTutorial(
      BmPhaseProcessTutorialService.tutorialDefinition,
      this
    );
  }

  async start(startData: ElementStartData | undefined): Promise<boolean> {
    if (startData == null || startData.id == null) {
      const name = await this.askName(
        'Select name for Phase-based Business Model Development Method'
      );
      if (name != null && name != '') {
        const bmPhaseProcess = await this.bmPhaseProcessService.add({
          name: name,
        });
        await this.navigateToTutorial([
          'bmprocess',
          'bmprocessview',
          bmPhaseProcess._id,
        ]);
      }
    } else {
      try {
        await this.bmPhaseProcessService.get(startData.id);
      } catch (e) {
        const error = e as PouchDB.Core.Error;
        if (error.status === 404) {
          await this.restartAndDisplayNotFoundError(
            BmPhaseProcessTutorialService.tutorialDefinition.id
          );
          return false;
        } else {
          throw error;
        }
      }
      await this.navigateToTutorial([
        'bmprocess',
        'bmprocessview',
        startData.id,
        'phase',
      ]);
    }
    return true;
  }
}
