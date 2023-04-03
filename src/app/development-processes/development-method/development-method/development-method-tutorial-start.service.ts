import { Injectable } from '@angular/core';
import { TutorialStatsService } from '../../../tutorial/tutorial-stats.service';
import { DevelopmentMethodTutorialService } from './development-method-tutorial.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DevelopmentMethodService } from '../../../development-process-registry/development-method/development-method.service';
import { Router } from '@angular/router';
import { ElementStartData } from '../../../tutorial/default-tutorial.service';
import { DefaultTutorialStartService } from '../../../tutorial/default-tutorial-start.service';
import PouchDB from 'pouchdb-browser';

@Injectable({
  providedIn: 'root',
})
export class DevelopmentMethodTutorialStartService extends DefaultTutorialStartService {
  constructor(
    private developmentMethodService: DevelopmentMethodService,
    modalService: NgbModal,
    router: Router,
    tutorialStatsService: TutorialStatsService
  ) {
    super(modalService, router, tutorialStatsService);
  }

  registerTutorial(): void {
    this.tutorialStatsService.registerTutorial(
      DevelopmentMethodTutorialService.tutorialDefinition,
      this
    );
  }

  async start(startData: ElementStartData | undefined): Promise<boolean> {
    if (startData == null || startData.id == null) {
      const name = await this.askName('Select name for Method Building Block');
      if (name != null && name != '') {
        const developmentMethod = await this.developmentMethodService.add({
          name: name,
          author: {},
        });
        await this.navigateToTutorial([
          'methods',
          'methodview',
          developmentMethod._id,
        ]);
      }
    } else {
      try {
        await this.developmentMethodService.get(startData.id);
      } catch (e) {
        const error = e as PouchDB.Core.Error;
        if (error.status === 404) {
          await this.restartAndDisplayNotFoundError(
            DevelopmentMethodTutorialService.tutorialDefinition.id
          );
          return false;
        } else {
          throw error;
        }
      }
      await this.navigateToTutorial(['methods', 'methodview', startData.id]);
    }
    return true;
  }
}
