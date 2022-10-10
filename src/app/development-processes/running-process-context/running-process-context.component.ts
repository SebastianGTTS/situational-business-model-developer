import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RunningProcessLoaderService } from '../shared/running-process-loader.service';
import { ContextChangeRunningProcess } from '../../development-process-registry/running-process/running-process';
import {
  ContextChangeErrors,
  RunningProcessContextService,
} from '../../development-process-registry/running-process/running-process-context.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DiagramComponentInterface } from '../shared/diagram-component-interface';
import { RunningProcessContextEditComponent } from '../running-process-context-edit/running-process-context-edit.component';
import {
  NgbModal,
  NgbModalRef,
  NgbNav,
  NgbNavChangeEvent,
} from '@ng-bootstrap/ng-bootstrap';
import { RunningProcessContextViewComponent } from '../running-process-context-view/running-process-context-view.component';
import { Updatable } from '../../shared/updatable';
import { ConfirmLeaveModalComponent } from '../confirm-leave-modal/confirm-leave-modal.component';
import { Subscription } from 'rxjs';

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
  @ViewChild(RunningProcessContextViewComponent)
  runningProcessContextViewComponent?: Updatable;
  @ViewChild(RunningProcessContextEditComponent)
  runningProcessContextEditComponent?: RunningProcessContextEditComponent;

  private modalReference?: NgbModalRef;

  private firstLoad?: Subscription;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private runningProcessContextService: RunningProcessContextService,
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  ngOnInit(): void {
    this.firstLoad = this.runningProcessLoaderService.loaded.subscribe(() =>
      this.afterLoad()
    );
  }

  ngOnDestroy(): void {
    if (this.runningProcess != null) {
      void this.runningProcessContextService.updateStep(
        this.runningProcess._id,
        this.stepNav.activeId
      );
    }
  }

  nextStep(): void {
    const currentId = this.stepNav.activeId;
    switch (currentId) {
      case 'stepView':
        this.runningProcessContextViewComponent?.update();
        this.stepNav.select('stepEdit');
        break;
      case 'stepEdit':
        this.runningProcessContextEditComponent?.update();
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
    if (this.runningProcess != null) {
      try {
        await this.runningProcessContextService.finishContextChange(
          this.runningProcess._id
        );
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
  }

  goToEdit(): void {
    this.stepNav.select('stepEdit');
    window.scroll({
      top: 0,
      left: 0,
    });
  }

  get runningProcess(): ContextChangeRunningProcess | undefined {
    return this.runningProcessLoaderService.runningProcess as
      | ContextChangeRunningProcess
      | undefined;
  }

  async diagramChanged(): Promise<boolean> {
    if (this.runningProcessContextEditComponent == null) {
      return false;
    }
    return this.runningProcessContextEditComponent.diagramChanged();
  }

  async saveDiagram(): Promise<void> {
    return this.runningProcessContextEditComponent?.saveDiagram();
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
