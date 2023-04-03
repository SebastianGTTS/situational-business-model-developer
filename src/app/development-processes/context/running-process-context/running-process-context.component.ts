import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import { ContextChangeErrors } from '../../../development-process-registry/running-process/running-process-context.service';
import { Router } from '@angular/router';
import { UntypedFormBuilder } from '@angular/forms';
import { DiagramComponentInterface } from '../../shared/diagram-component-interface';
import {
  NgbModal,
  NgbModalRef,
  NgbNav,
  NgbNavChangeEvent,
} from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveModalComponent } from '../../confirm-leave-modal/confirm-leave-modal.component';
import { Subscription } from 'rxjs';
import { ContextChangeRunningProcess } from '../../../development-process-registry/running-process/running-full-process';
import { RunningPatternProcess } from '../../../development-process-registry/running-process/running-pattern-process';
import { RunningPhaseProcess } from '../../../development-process-registry/running-process/running-phase-process';
import { RunningPhaseProcessContextService } from '../../../development-process-registry/running-process/running-phase-process-context.service';
import { RunningPatternProcessContextService } from '../../../development-process-registry/running-process/running-pattern-process-context.service';
import { RunningPatternProcessContextComponent } from '../running-pattern-process-context/running-pattern-process-context.component';
import { RunningPhaseProcessContextComponent } from '../running-phase-process-context/running-phase-process-context.component';

export enum Steps {
  VIEW = 'stepView',
  EDIT = 'stepEdit',
  RUN = 'stepRun',
  FINISH = 'stepFinish',
}

@Component({
  selector: 'app-running-process-context',
  templateUrl: './running-process-context.component.html',
  styleUrls: ['./running-process-context.component.css'],
  providers: [RunningProcessLoaderService],
})
export class RunningProcessContextComponent
  implements DiagramComponentInterface, OnInit, OnDestroy
{
  @ViewChild('errorProcessModal', { static: true })
  errorProcessModal: unknown;
  @ViewChild('nav') stepNav!: NgbNav;
  @ViewChild(RunningPatternProcessContextComponent)
  runningPatternProcessContextComponent?: RunningPatternProcessContextComponent;
  @ViewChild(RunningPhaseProcessContextComponent)
  runningPhaseProcessContextComponent?: RunningPhaseProcessContextComponent;

  private modalReference?: NgbModalRef;

  private firstLoad?: Subscription;

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private runningPatternProcessContextService: RunningPatternProcessContextService,
    private runningPhaseProcessContextService: RunningPhaseProcessContextService,
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  ngOnInit(): void {
    this.firstLoad = this.runningProcessLoaderService.loaded.subscribe(() =>
      this.afterLoad()
    );
  }

  ngOnDestroy(): void {
    if (this.runningPatternProcess != null) {
      void this.runningPatternProcessContextService.updateStep(
        this.runningPatternProcess._id,
        this.stepNav.activeId
      );
    } else if (this.runningPhaseProcess != null) {
      void this.runningPhaseProcessContextService.updateStep(
        this.runningPhaseProcess._id,
        this.stepNav.activeId
      );
    }
  }

  nextStep(): void {
    void this.runningPatternProcessContextComponent?.update();
    this.runningPhaseProcessContextComponent?.update();
    const currentId = this.stepNav.activeId;
    switch (currentId) {
      case 'stepView':
        this.stepNav.select('stepEdit');
        break;
      case 'stepEdit':
        this.stepNav.select('stepRun');
        break;
      case 'stepRun':
        this.stepNav.select('stepFinish');
        break;
    }
    window.scroll({
      top: 0,
      left: 0,
    });
  }

  async navChange(navChangeEvent: NgbNavChangeEvent): Promise<void> {
    navChangeEvent.preventDefault();
    if (await this.diagramChanged()) {
      const modal = this.modalService.open(ConfirmLeaveModalComponent, {
        size: 'lg',
      });
      try {
        const result: boolean = await modal.result;
        if (result) {
          await this.saveDiagram();
        }
      } catch {
        return;
      }
    }
    this.stepNav.select(navChangeEvent.nextId);
  }

  async finishContextChange(): Promise<void> {
    try {
      if (this.runningPatternProcess != null) {
        await this.runningPatternProcessContextService.finishContextChange(
          this.runningPatternProcess._id
        );
      } else if (this.runningPhaseProcess != null) {
        await this.runningPhaseProcessContextService.finishContextChange(
          this.runningPhaseProcess._id
        );
      }
      await this.router.navigate(['/', 'bmprocess']);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === ContextChangeErrors.PROCESS_INCOMPLETE
      ) {
        this.modalReference = this.modalService.open(this.errorProcessModal, {
          size: 'lg',
        });
      } else {
        throw error;
      }
    }
  }

  goToEdit(): void {
    this.stepNav.select('stepEdit');
    window.scroll({
      top: 0,
      left: 0,
    });
  }

  get runningProcess(): ContextChangeRunningProcess | undefined {
    return this.runningProcessLoaderService.runningFullProcess as
      | ContextChangeRunningProcess
      | undefined;
  }

  get runningPatternProcess():
    | (RunningPatternProcess & ContextChangeRunningProcess)
    | undefined {
    return this.runningProcessLoaderService.runningPatternProcess as
      | (RunningPatternProcess & ContextChangeRunningProcess)
      | undefined;
  }

  get runningPhaseProcess():
    | (RunningPhaseProcess & ContextChangeRunningProcess)
    | undefined {
    return this.runningProcessLoaderService.runningPhaseProcess as
      | (RunningPhaseProcess & ContextChangeRunningProcess)
      | undefined;
  }

  async diagramChanged(): Promise<boolean> {
    return (
      this.runningPatternProcessContextComponent?.diagramChanged() ?? false
    );
  }

  async saveDiagram(): Promise<void> {
    await this.runningPatternProcessContextComponent?.saveDiagram();
  }

  private afterLoad(): void {
    if (
      this.runningProcess != null &&
      this.runningProcess.contextChangeInfo.step != null
    ) {
      this.stepNav.select(this.runningProcess.contextChangeInfo.step);
    }
    this.firstLoad?.unsubscribe();
  }
}
