import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { TutorialStatsService } from './tutorial-stats.service';
import { DatabaseEntry } from '../database/database-entry';

export enum TutorialErrors {
  NO_TUTORIAL = 'No tutorial provided',
  FIRST_STEP = 'Already at first step',
  LAST_STEP = 'Already at last step',
  NOT_STARTED = 'Tutorial is not started yet',
  ALREADY_STARTED = 'Tutorial is already started',
}

export interface StartDataProvider {
  getStartData(step: number): DatabaseEntry | undefined;
}

export interface TutorialStep {
  targetId: string;
  title: string;
  content: string;
  showNext: boolean;
  showPrevious: boolean;
  showRestart?: boolean;
  modal: boolean;
  enterAction?: () => Promise<void>;
  finalAction?: () => Promise<void>;
  exitAction?: () => Promise<void>;
  isPossible?: (start: boolean, forward: boolean) => Promise<boolean>;
  onClickAction?: () => Promise<void>;
}

@Injectable()
export class TutorialManagerService {
  private currentStep = 0;
  private tutorialId?: string;
  private startDataProvider?: StartDataProvider;
  private _tutorialSteps?: TutorialStep[];
  private _tutorialStep?: TutorialStep;

  private readonly tutorialStepChange = new ReplaySubject<
    TutorialStep | undefined
  >(1);
  readonly tutorialStepChangeObserver = this.tutorialStepChange.asObservable();

  constructor(private tutorialStatsService: TutorialStatsService) {}

  setTutorial(
    tutorialId: string | undefined,
    startDataProvider: StartDataProvider | undefined,
    tutorialSteps: TutorialStep[] | undefined
  ): void {
    if (this.tutorialStep != null) {
      this.tutorialStep = undefined;
    }
    this.tutorialId = tutorialId;
    this.startDataProvider = startDataProvider;
    this.currentStep = this.tutorialStatsService.getTutorialStep(tutorialId);
    this._tutorialSteps = tutorialSteps;
    if (
      this._tutorialSteps != null &&
      (this.currentStep >= this._tutorialSteps.length || this.currentStep < 0)
    ) {
      this.currentStep = 0;
    }
  }

  private set tutorialStep(tutorialStep: TutorialStep | undefined) {
    this._tutorialStep = tutorialStep;
    this.tutorialStepChange.next(tutorialStep);
  }

  private get tutorialStep(): TutorialStep | undefined {
    return this._tutorialStep;
  }

  async startTutorial(): Promise<void> {
    if (this._tutorialSteps == null) {
      throw new Error(TutorialErrors.NO_TUTORIAL);
    }
    await this.tutorialStep?.finalAction?.();
    this.currentStep = 0;
    const nextStep = this._tutorialSteps[0];
    await nextStep.enterAction?.();
    this.tutorialStep = nextStep;
  }

  async resumeTutorial(): Promise<void> {
    if (this._tutorialSteps == null) {
      throw new Error(TutorialErrors.NO_TUTORIAL);
    }
    if (this.tutorialStep != null) {
      throw new Error(TutorialErrors.ALREADY_STARTED);
    }
    await this.selectStep(true, false);
  }

  async stopTutorial(): Promise<void> {
    await this.tutorialStep?.finalAction?.();
    this.tutorialStep = undefined;
  }

  async nextStep(): Promise<void> {
    if (this._tutorialSteps == null) {
      throw new Error(TutorialErrors.NO_TUTORIAL);
    }
    if (this.tutorialStep == null) {
      throw new Error(TutorialErrors.NOT_STARTED);
    }
    await this.selectStep(true);
  }

  async previousStep(): Promise<void> {
    if (this._tutorialSteps == null) {
      throw new Error(TutorialErrors.NO_TUTORIAL);
    }
    if (this.tutorialStep == null) {
      throw new Error(TutorialErrors.NOT_STARTED);
    }
    await this.selectStep(false);
  }

  private async updateTutorialStep(): Promise<void> {
    await this.tutorialStatsService.updateTutorialStep(
      this.tutorialId,
      this.currentStep,
      this.startDataProvider?.getStartData(this.currentStep)
    );
  }

  /**
   * Assumes that current step is at the correct position of the previous step.
   * This method will check whether the step is possible and if not go on
   * until it finds a fitting step.
   *
   * @param forward whether to go into forward direction
   * @param initial whether to initially go into direction
   */
  private async selectStep(forward: boolean, initial = true): Promise<void> {
    if (this._tutorialSteps == null) {
      throw new Error(TutorialErrors.NO_TUTORIAL);
    }
    const direction = forward ? 1 : -1;
    const previousStep = this.tutorialStep;
    let currentStep = this.currentStep + (initial ? direction : 0);
    let step = this._tutorialSteps[currentStep];
    while (
      step != null &&
      step.isPossible != null &&
      !(await step.isPossible(!initial, forward))
    ) {
      currentStep += direction;
      step = this._tutorialSteps[currentStep];
    }
    if (!initial || (previousStep != null && !previousStep.modal && !forward)) {
      /*
       * Tutorial is resumed or stared, there cannot be an open modal, so
       * go back in the steps to have a working step that guides the user to open
       * the modal
       *
       * Other case is that the user clicks on back, then a modal will not be reopened
       */
      while (
        step != null &&
        ((step.isPossible != null &&
          !(await step.isPossible(!initial, forward))) ||
          step.modal)
      ) {
        currentStep -= 1;
        step = this._tutorialSteps[currentStep];
      }
    }
    if (step == null) {
      if (currentStep >= this._tutorialSteps.length) {
        throw new Error(TutorialErrors.LAST_STEP);
      } else {
        throw new Error(TutorialErrors.FIRST_STEP);
      }
    }
    if (this.tutorialStep != null) {
      await this.tutorialStep.finalAction?.();
      if (forward) {
        await this.tutorialStep.exitAction?.();
      }
    }
    this.currentStep = currentStep;
    await step.enterAction?.();
    this.tutorialStep = step;
    if (initial) {
      await this.updateTutorialStep();
    }
  }

  hasTutorial(): boolean {
    return this._tutorialSteps != null;
  }

  isRunning(): boolean {
    return this.tutorialStep != null;
  }

  isFirstStep(): boolean {
    return this.currentStep === 0;
  }

  getTutorialStep(): TutorialStep | undefined {
    return this._tutorialStep;
  }
}
