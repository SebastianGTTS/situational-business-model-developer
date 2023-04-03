import { Inject, Injectable } from '@angular/core';
import { DefaultTutorialService } from '../../../tutorial/default-tutorial.service';
import { Tutorial } from '../../../tutorial/tutorial-stats.service';
import { InternalRoles } from '../../../role/user.service';
import {
  TutorialManagerService,
  TutorialStep,
} from '../../../tutorial/tutorial-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RunningProcessMethod, State } from './running-process-method';
import { SIDENAV_CONTROL, SidenavControl } from '../../../sidenav-control';

@Injectable()
export class RunningProcessMethodTutorialService extends DefaultTutorialService {
  static readonly tutorialDefinition: Tutorial = {
    id: 'RunningProcessMethodTutorial',
    role: InternalRoles.BUSINESS_DEVELOPER,
    name: 'Development Step Tutorial',
    steps: 10,
  };

  protected get tutorialId(): string {
    return RunningProcessMethodTutorialService.tutorialDefinition.id;
  }

  protected readonly tutorialSteps: TutorialStep[] = [
    {
      targetId: 'running-process-method-steps',
      title: 'Enact Development Step Tutorial',
      content: `
        This tutorial will teach you how to enact a single development
        step. Here, in this overview you can see at which stage you are.
        There are the stages 'Select input artifacts',
        'Execute Development Step', and 'Create/Merge output artifacts'.
        Sometimes the phase 'Execute Development Step' is missing if there
        are no concrete execution steps prescribed by the development step.
      `,
      showNext: true,
      showPrevious: false,
      modal: false,
    },
    {
      targetId: 'running-process-method-input-mapping',
      title: 'Enact Development Step Tutorial',
      content: `
        Here in this panel, you need to select the input artifacts for this
        development step or none if this step does not have input artifacts.
        If you do not have the possibility to select an input artifact even
        if the method has input artifacts,
        you do not have created them in a previous step. Then, you need to go back
        to the running method and create that artifact first through another
        method or manually.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      isPossible: async (): Promise<boolean> => this.isInSelectInputArtifacts(),
    },
    {
      targetId: 'running-process-select-input-artifacts-confirm-no-input',
      title: 'Enact Development Step Tutorial',
      content: `
        You do not have any input artifacts, just confirm.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      isPossible: async (): Promise<boolean> => this.hasNoInputArtifacts(),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'running-process-select-input-artifacts-confirm-input',
      title: 'Enact Development Step Tutorial',
      content: `
        After you have selected the input artifacts, confirm your choices.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      isPossible: async (): Promise<boolean> => this.hasInputArtifacts(),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'running-process-method-steps',
      title: 'Enact Development Step Tutorial',
      content: `
        Now you should be at the next step.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
    },
    {
      targetId: 'running-process-method-development-step-overview',
      title: 'Enact Development Step Tutorial',
      content: `
        Here, you can see an overview of the development step.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      isPossible: async (): Promise<boolean> => this.isInExecutionOrOutput(),
    },
    {
      targetId: 'running-process-method-execution-steps',
      title: 'Enact Development Step Tutorial',
      content: `
        This panel shows you the different execution steps of this development
        step.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      isPossible: async (): Promise<boolean> => this.isInExecution(),
    },
    {
      targetId: 'running-process-method-execution-steps-execute-next-step',
      title: 'Enact Development Step Tutorial',
      content: `
        Click on this button to execute the next development step.
        After you are back on this page, click on the button in the lower
        left corner to resume the tutorial.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      isPossible: async (): Promise<boolean> => this.hasStepsLeft(),
    },
    {
      targetId: 'running-process-method-output-mapping',
      title: 'Enact Development Step Tutorial',
      content: `
        Now you can configure the output artifacts in this panel if the
        development step has output artifacts.
        For any artifact you can select whether to merge it into an already
        existing artifact and create a new version, or create a completely new
        artifact. Sometimes it is also possible to set the artifact to optional
        and not creating it. To save your changes click on update.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      isPossible: async (): Promise<boolean> => this.isInExecutionOrOutput(),
    },
    {
      targetId: 'running-process-method-steps',
      title: 'Enact Development Step Tutorial',
      content: `
        This is the end of the tutorial how to enact development steps.
        To finish this development step click on finish at the bottom of the
        page.
      `,
      showNext: false,
      showRestart: true,
      showPrevious: true,
      modal: false,
    },
  ];

  private runningProcessMethod?: RunningProcessMethod;

  constructor(
    route: ActivatedRoute,
    router: Router,
    @Inject(SIDENAV_CONTROL) sidenavControl: SidenavControl,
    tutorialManagerService: TutorialManagerService
  ) {
    super(route, router, sidenavControl, tutorialManagerService);
  }

  private async isInSelectInputArtifacts(): Promise<boolean> {
    return this.runningProcessMethod?.getState() === State.INPUT_SELECTION;
  }

  private async hasNoInputArtifacts(): Promise<boolean> {
    return (
      (await this.isInSelectInputArtifacts()) &&
      !((await this.runningProcessMethod?.hasInputArtifacts()) ?? false)
    );
  }

  private async hasInputArtifacts(): Promise<boolean> {
    return (
      (await this.isInSelectInputArtifacts()) &&
      ((await this.runningProcessMethod?.hasInputArtifacts()) ?? false)
    );
  }

  private async isInExecution(): Promise<boolean> {
    return this.runningProcessMethod?.getState() === State.EXECUTION;
  }

  private async hasStepsLeft(): Promise<boolean> {
    return (
      (await this.isInExecution()) &&
      (this.runningProcessMethod?.hasStepsLeft() ?? false)
    );
  }

  private async isInExecutionOrOutput(): Promise<boolean> {
    return (this.runningProcessMethod?.getState() ?? 0) >= State.EXECUTION;
  }

  async init(
    created: boolean,
    startTutorial: boolean,
    runningProcessMethod?: RunningProcessMethod
  ): Promise<void> {
    this.runningProcessMethod = runningProcessMethod;
    return super.init(created, startTutorial);
  }
}
