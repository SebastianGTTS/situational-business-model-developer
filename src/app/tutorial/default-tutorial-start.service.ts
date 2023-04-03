import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import {
  TutorialStartService,
  TutorialStatsService,
} from './tutorial-stats.service';
import { ElementNameModalComponent } from '../shared/element-name-modal/element-name-modal.component';
import { firstValueFrom } from 'rxjs';
import { TutorialNotFoundModalComponent } from './tutorial-not-found-modal/tutorial-not-found-modal.component';
import { DatabaseEntry } from '../database/database-entry';

@Injectable()
export abstract class DefaultTutorialStartService
  implements TutorialStartService
{
  protected constructor(
    protected modalService: NgbModal,
    protected router: Router,
    protected tutorialStatsService: TutorialStatsService
  ) {}

  abstract start(startData: DatabaseEntry | undefined): Promise<boolean>;

  protected async askName(title: string): Promise<string | undefined> {
    const modal = this.modalService.open(ElementNameModalComponent, {
      size: 'lg',
    });
    const modalComponent = modal.componentInstance as ElementNameModalComponent;
    modalComponent.title = title;
    try {
      return await firstValueFrom(modal.closed);
    } catch (e) {
      return undefined;
    }
  }

  protected async restartAndDisplayNotFoundError(
    tutorialId: string
  ): Promise<void> {
    await this.tutorialStatsService.updateTutorialStep(
      tutorialId,
      0,
      undefined
    );
    this.modalService.open(TutorialNotFoundModalComponent, {
      size: 'lg',
    });
  }

  protected async navigateToTutorial(commands: string[]): Promise<void> {
    await this.router.navigate(commands, {
      queryParams: { tutorial: true },
    });
  }
}
