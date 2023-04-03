import { Injectable } from '@angular/core';
import { TutorialStatsService } from '../../../tutorial/tutorial-stats.service';
import { ElementStartData } from '../../../tutorial/default-tutorial.service';
import { ProcessPatternService } from '../../../development-process-registry/process-pattern/process-pattern.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ProcessPatternTutorialService } from './process-pattern-tutorial.service';
import { ProcessPatternDiagramService } from '../../../development-process-registry/process-pattern/process-pattern-diagram.service';
import PouchDB from 'pouchdb-browser';
import { DefaultTutorialStartService } from '../../../tutorial/default-tutorial-start.service';

@Injectable({
  providedIn: 'root',
})
export class ProcessPatternTutorialStartService extends DefaultTutorialStartService {
  constructor(
    modalService: NgbModal,
    private processPatternDiagramService: ProcessPatternDiagramService,
    private processPatternService: ProcessPatternService,
    router: Router,
    tutorialStatsService: TutorialStatsService
  ) {
    super(modalService, router, tutorialStatsService);
  }

  registerTutorial(): void {
    this.tutorialStatsService.registerTutorial(
      ProcessPatternTutorialService.tutorialDefinition,
      this
    );
  }

  async start(startData: ElementStartData | undefined): Promise<boolean> {
    if (startData == null || startData.id == null) {
      const name = await this.askName('Select name for Method Pattern');
      if (name != null && name != '') {
        const processPattern = await this.processPatternService.add({
          name: name,
          pattern:
            await this.processPatternDiagramService.getEmptyProcessPatternDiagram(),
        });
        await this.navigateToTutorial([
          'process',
          'processview',
          processPattern._id,
        ]);
      }
    } else {
      try {
        await this.processPatternService.get(startData.id);
      } catch (e) {
        const error = e as PouchDB.Core.Error;
        if (error.status === 404) {
          await this.restartAndDisplayNotFoundError(
            ProcessPatternTutorialService.tutorialDefinition.id
          );
          return false;
        } else {
          throw error;
        }
      }
      await this.navigateToTutorial(['process', 'processview', startData.id]);
    }
    return true;
  }
}
