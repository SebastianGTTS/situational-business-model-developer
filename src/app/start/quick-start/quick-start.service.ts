import { Injectable } from '@angular/core';
import { InternalRoles, UserService } from '../../role/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ElementNameModalComponent } from '../../shared/element-name-modal/element-name-modal.component';
import { Router } from '@angular/router';
import { BmPatternProcessService } from '../../development-process-registry/bm-process/bm-pattern-process.service';
import { BmPhaseProcessService } from '../../development-process-registry/bm-process/bm-phase-process.service';
import { BmProcessesSelectionModalComponent } from '../../development-processes/bm-process/bm-processes-selection-modal/bm-processes-selection-modal.component';
import { RunningProcessTypesService } from '../../development-process-registry/running-process/running-process-types.service';
import {
  BmPatternProcess,
  isBmPatternProcessEntry,
} from '../../development-process-registry/bm-process/bm-pattern-process';
import {
  BmPhaseProcess,
  isBmPhaseProcessEntry,
} from '../../development-process-registry/bm-process/bm-phase-process';
import { BmProcessErrorModalComponent } from '../../development-processes/bm-process/bm-process-error-modal/bm-process-error-modal.component';

export interface TreeItem {
  readonly text: string;
  readonly children: readonly TreeItem[];
  readonly steps?: readonly string[];
  readonly action?: () => Promise<void>;
}

@Injectable()
export class QuickStartService {
  private readonly tree: TreeItem = {
    text: 'I want to',
    children: [
      {
        text: 'supply my knowledge to the knowledge repository, and',
        children: [
          {
            text: 'want to supply knowledge about business model development methods',
            children: [],
            steps: [
              'Switch to Domain Expert',
              'Go to method repository dashboard',
            ],
            action: async (): Promise<void> =>
              this.goToMethodRepositoryDashboard(),
          },
          {
            text: 'want to supply knowledge about business models',
            children: [],
            steps: [
              'Switch to Domain Expert',
              'Go to canvas model repository dashboard',
            ],
            action: async (): Promise<void> =>
              this.goToModelRepositoryDashboard(),
          },
        ],
      },
      {
        text: 'create a new business model development method, and',
        children: [
          {
            text: 'want maximum flexibility with a complex pattern-based method',
            children: [],
            steps: ['Switch to Method Engineer', 'Create pattern-based method'],
            action: async (): Promise<void> => this.createPatternBasedMethod(),
          },
          {
            text: 'want more guidance with a simple phase-based method',
            children: [],
            steps: ['Switch to Method Engineer', 'Create phase-based method'],
            action: async (): Promise<void> => this.createPhaseBasedMethod(),
          },
        ],
      },
      {
        text: 'develop a new business model, and',
        children: [
          {
            text: 'I want to use an existing business model development method to execute',
            children: [],
            steps: ['Switch to Business Developer', 'Select Method to execute'],
            action: async (): Promise<void> => this.selectMethodToExecute(),
          },
          {
            text: 'I do not have a business model development method to execute, and',
            children: [
              {
                text: 'I want to systematic compose a development method in advance, and',
                children: [
                  {
                    text: 'I want to create a development method by myself, and',
                    children: [
                      {
                        text: 'want maximum flexibility with a complex pattern-based method',
                        children: [],
                        steps: [
                          'Switch to Method Engineer',
                          'Create pattern-based method',
                        ],
                        action: async (): Promise<void> =>
                          this.createPatternBasedMethod(),
                      },
                      {
                        text: 'want more guidance with a simple phase-based method',
                        children: [],
                        steps: [
                          'Switch to Method Engineer',
                          'Create phase-based method',
                        ],
                        action: async (): Promise<void> =>
                          this.createPhaseBasedMethod(),
                      },
                    ],
                  },
                ],
              },
              {
                text: 'I want to flexible execute development steps',
                children: [],
                steps: [
                  'Switch to Business Developer',
                  'Create lightweight Business Model Development Method',
                ],
                action: async (): Promise<void> =>
                  this.createLightweightRunningProcess(),
              },
            ],
          },
        ],
      },
    ],
  };

  private items: TreeItem[] = [this.tree];
  private _text = this.tree.text;

  constructor(
    private bmPatternProcessService: BmPatternProcessService,
    private bmPhaseProcessService: BmPhaseProcessService,
    private modalService: NgbModal,
    private router: Router,
    private runningProcessTypesService: RunningProcessTypesService,
    private userService: UserService
  ) {}

  reset(): void {
    this.items = [this.tree];
    this._text = this.tree.text;
  }

  next(index: number): void {
    const next = this.currentTreeItem.children[index];
    if (next == null) {
      throw new Error('invalid index');
    }
    this.items.push(next);
    this.updateText();
  }

  back(): void {
    if (this.items.length <= 1) {
      throw new Error('Can not go further back');
    }
    this.items.pop();
    this.updateText();
  }

  get depth(): number {
    return this.items.length;
  }

  get currentTreeItem(): TreeItem {
    return this.items[this.items.length - 1];
  }

  get text(): string {
    return this._text;
  }

  private updateText(): void {
    let text = '';
    for (const item of this.items) {
      text += ' ' + item.text;
    }
    this._text = text;
  }

  private async goToMethodRepositoryDashboard(): Promise<void> {
    this.userService.role = this.userService.getRoleById(
      InternalRoles.DOMAIN_EXPERT
    );
    await this.router.navigate(['dashboards', 'method-repository-dashboard']);
  }

  private async goToModelRepositoryDashboard(): Promise<void> {
    this.userService.role = this.userService.getRoleById(
      InternalRoles.DOMAIN_EXPERT
    );
    await this.router.navigate(['dashboards', 'model-repository-dashboard']);
  }

  private async createPatternBasedMethod(): Promise<void> {
    const modal = this.modalService.open(ElementNameModalComponent, {
      size: 'lg',
    });
    const modalComponent = modal.componentInstance as ElementNameModalComponent;
    modalComponent.title = 'Select name for pattern-based Method';
    modal.closed.subscribe(async (name) => {
      if (name != null && name != '') {
        this.userService.role = this.userService.getRoleById(
          InternalRoles.METHOD_ENGINEER
        );
        const bmProcess = await this.bmPatternProcessService.add(
          await this.bmPatternProcessService.getBmProcessInitialization(name)
        );
        await this.router.navigate([
          'bmprocess',
          'bmprocessview',
          bmProcess._id,
        ]);
      }
    });
  }

  private async createPhaseBasedMethod(): Promise<void> {
    const modal = this.modalService.open(ElementNameModalComponent, {
      size: 'lg',
    });
    const modalComponent = modal.componentInstance as ElementNameModalComponent;
    modalComponent.title = 'Select name for phase-based Method';
    modal.closed.subscribe(async (name) => {
      if (name != null && name != '') {
        this.userService.role = this.userService.getRoleById(
          InternalRoles.METHOD_ENGINEER
        );
        const bmProcess = await this.bmPhaseProcessService.add({
          name: name,
        });
        await this.router.navigate([
          'bmprocess',
          'bmprocessview',
          bmProcess._id,
        ]);
      }
    });
  }

  private async createLightweightRunningProcess(): Promise<void> {
    const modal = this.modalService.open(ElementNameModalComponent, {
      size: 'lg',
    });
    const modalComponent = modal.componentInstance as ElementNameModalComponent;
    modalComponent.title = 'Select name for Running Method';
    modal.closed.subscribe(async (name) => {
      if (name != null && name != '') {
        this.userService.role = this.userService.getRoleById(
          InternalRoles.BUSINESS_DEVELOPER
        );
        const runningLightProcess = await this.runningProcessTypesService.add({
          name: name,
        });
        await this.router.navigate([
          'runningprocess',
          'runningprocessview',
          runningLightProcess._id,
        ]);
      }
    });
  }

  private async selectMethodToExecute(): Promise<void> {
    const methodModal = this.modalService.open(
      BmProcessesSelectionModalComponent,
      {
        size: 'lg',
      }
    );
    const methodModalComponent =
      methodModal.componentInstance as BmProcessesSelectionModalComponent;
    methodModalComponent.title =
      'Select Business Model Development Method to execute';
    methodModal.closed.subscribe(async (method) => {
      if (method == null) {
        return;
      }
      let process: BmPatternProcess | BmPhaseProcess;
      let complete: boolean;
      if (isBmPatternProcessEntry(method)) {
        process = new BmPatternProcess(method, undefined);
        complete = await this.bmPatternProcessService.isComplete(process);
      } else if (isBmPhaseProcessEntry(method)) {
        process = new BmPhaseProcess(method, undefined);
        complete = await this.bmPhaseProcessService.isComplete(process);
      } else {
        throw new Error(
          'Can only instantiate running processes with pattern or phase based processes'
        );
      }
      if (!complete) {
        const errorModal = this.modalService.open(
          BmProcessErrorModalComponent,
          {
            size: 'lg',
          }
        );
        (
          errorModal.componentInstance as BmProcessErrorModalComponent
        ).bmProcess = process;
        return;
      }
      const nameModal = this.modalService.open(ElementNameModalComponent, {
        size: 'lg',
      });
      const nameModalComponent =
        nameModal.componentInstance as ElementNameModalComponent;
      nameModalComponent.title = 'Select name for Running Method';
      nameModal.closed.subscribe(async (name) => {
        if (name != null && name != '') {
          this.userService.role = this.userService.getRoleById(
            InternalRoles.BUSINESS_DEVELOPER
          );
          const runningLightProcess = await this.runningProcessTypesService.add(
            {
              name: name,
              process: process,
            }
          );
          await this.router.navigate([
            'runningprocess',
            'runningprocessview',
            runningLightProcess._id,
          ]);
        }
      });
    });
  }
}
