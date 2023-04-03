import { Injectable } from '@angular/core';
import { DefaultTutorialStartService } from '../../tutorial/default-tutorial-start.service';
import { BmProcessesSelectionModalComponent } from '../bm-process/bm-processes-selection-modal/bm-processes-selection-modal.component';
import { firstValueFrom } from 'rxjs';
import {
  BmProcess,
  BmProcessEntry,
  BmProcessInit,
} from '../../development-process-registry/bm-process/bm-process';
import { BmProcessErrorModalComponent } from '../bm-process/bm-process-error-modal/bm-process-error-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TutorialStatsService } from '../../tutorial/tutorial-stats.service';
import { BmProcessServiceBase } from '../../development-process-registry/bm-process/bm-process.service';

@Injectable()
export abstract class RunningFullProcessTutorialStartService<
  T extends BmProcess,
  S extends BmProcessInit
> extends DefaultTutorialStartService {
  protected constructor(
    private bmProcessService: BmProcessServiceBase<T, S>,
    modalService: NgbModal,
    router: Router,
    tutorialStatsService: TutorialStatsService
  ) {
    super(modalService, router, tutorialStatsService);
  }

  protected async askProcess(): Promise<BmProcessEntry | undefined> {
    const processes = await this.bmProcessService.getList();
    const modal = this.modalService.open(BmProcessesSelectionModalComponent, {
      size: 'lg',
    });
    const modalComponent =
      modal.componentInstance as BmProcessesSelectionModalComponent;
    modalComponent.title =
      'Select Business Model Development Method to execute';
    modalComponent.bmProcesses = processes;
    try {
      return await firstValueFrom(modal.closed);
    } catch (e) {
      return undefined;
    }
  }

  protected showIncompleteProcessError(bmProcess: BmProcess): void {
    const errorModal = this.modalService.open(BmProcessErrorModalComponent, {
      size: 'lg',
    });
    (errorModal.componentInstance as BmProcessErrorModalComponent).bmProcess =
      bmProcess;
  }
}
