import { Injectable } from '@angular/core';
import { DefaultTutorialStartService } from '../../../tutorial/default-tutorial-start.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TutorialStatsService } from '../../../tutorial/tutorial-stats.service';
import { BmPatternProcessService } from '../../../development-process-registry/bm-process/bm-pattern-process.service';
import { BmPatternProcessTutorialService } from './bm-pattern-process-tutorial.service';
import { ElementStartData } from '../../../tutorial/default-tutorial.service';
import PouchDB from 'pouchdb-browser';

@Injectable({
  providedIn: 'root',
})
export class BmPatternProcessTutorialStartService extends DefaultTutorialStartService {
  constructor(
    modalService: NgbModal,
    private bmPatternProcessService: BmPatternProcessService,
    router: Router,
    tutorialStatsService: TutorialStatsService
  ) {
    super(modalService, router, tutorialStatsService);
  }

  registerTutorial(): void {
    this.tutorialStatsService.registerTutorial(
      BmPatternProcessTutorialService.tutorialDefinition,
      this
    );
  }

  async start(startData: ElementStartData | undefined): Promise<boolean> {
    if (startData == null || startData.id == null) {
      const name = await this.askName(
        'Select name for Pattern-based Business Model Development Method'
      );
      if (name != null && name != '') {
        const bmPatternProcess = await this.bmPatternProcessService.add(
          await this.bmPatternProcessService.getBmProcessInitialization(name)
        );
        await this.navigateToTutorial([
          'bmprocess',
          'bmprocessview',
          bmPatternProcess._id,
        ]);
      }
    } else {
      try {
        await this.bmPatternProcessService.get(startData.id);
      } catch (e) {
        const error = e as PouchDB.Core.Error;
        if (error.status === 404) {
          await this.restartAndDisplayNotFoundError(
            BmPatternProcessTutorialService.tutorialDefinition.id
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
        'pattern',
      ]);
    }
    return true;
  }
}
