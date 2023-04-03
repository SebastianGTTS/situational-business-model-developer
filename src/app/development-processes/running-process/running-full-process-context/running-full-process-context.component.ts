import { Component } from '@angular/core';
import {
  RunningFullProcess,
  RunningFullProcessInit,
} from '../../../development-process-registry/running-process/running-full-process';
import { RunningFullProcessServiceBase } from '../../../development-process-registry/running-process/running-full-process.service';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import { RunningProcessContextChangeModalComponent } from '../../context/running-process-context-change-modal/running-process-context-change-modal.component';
import { RunningProcessContextChangeModal } from '../../context/running-process-context-change-modal/running-process-context-change-modal';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import { Selection } from '../../../development-process-registry/development-method/selection';
import { SituationalFactor } from '../../../development-process-registry/method-elements/situational-factor/situational-factor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-running-full-process-context',
  templateUrl: './running-full-process-context.component.html',
  styleUrls: ['./running-full-process-context.component.scss'],
})
export class RunningFullProcessContextComponent<
  T extends RunningFullProcess,
  S extends RunningFullProcessInit
> {
  private modalReference?: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private runningFullProcessService: RunningFullProcessServiceBase<T, S>,
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  async openRequestContextChangeModal(): Promise<void> {
    if (this.runningProcess != null) {
      const modalReference = this.modalService.open(
        RunningProcessContextChangeModalComponent,
        {
          size: 'lg',
        }
      );
      this.modalReference = modalReference;
      const modal: RunningProcessContextChangeModal =
        modalReference.componentInstance;
      modal.domains = this.runningProcess.domains;
      modal.situationalFactors = this.runningProcess.situationalFactors;
      modal.requestContextChange.subscribe((request) => {
        void this.requestContextChange(
          request.comment,
          request.domains,
          request.situationalFactors
        );
        modalReference.close();
      });
    }
  }

  /**
   * Requests a context change from the method engineer
   *
   * @param comment
   * @param domains
   * @param situationalFactors
   */
  async requestContextChange(
    comment: string,
    domains: Domain[],
    situationalFactors: Selection<SituationalFactor>[]
  ): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningFullProcessService.setContextChange(
        this.runningProcess._id,
        comment,
        domains,
        situationalFactors
      );
      await this.router.navigate(['/', 'runningprocess']);
    }
  }

  get runningProcess(): RunningFullProcess | undefined {
    return this.runningProcessLoaderService.runningFullProcess;
  }
}
