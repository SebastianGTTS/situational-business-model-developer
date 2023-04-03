import { Inject, Injectable } from '@angular/core';
import {
  DefaultTutorialService,
  ElementStartData,
} from '../../../tutorial/default-tutorial.service';
import { Tutorial } from '../../../tutorial/tutorial-stats.service';
import { InternalRoles } from '../../../role/user.service';
import {
  TutorialManagerService,
  TutorialStep,
} from '../../../tutorial/tutorial-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SIDENAV_CONTROL, SidenavControl } from '../../../sidenav-control';

interface RunningPhaseProcessTutorialStep extends TutorialStep {
  onFinishedMethod?: () => void;
}

@Injectable()
export class RunningPhaseProcessTutorialService extends DefaultTutorialService {
  static readonly tutorialDefinition: Tutorial = {
    id: 'RunningPhaseProcessTutorial',
    role: InternalRoles.BUSINESS_DEVELOPER,
    name: 'Phase-based Running Method Tutorial',
    steps: 15,
  };

  protected get tutorialId(): string {
    return RunningPhaseProcessTutorialService.tutorialDefinition.id;
  }

  protected readonly tutorialSteps: RunningPhaseProcessTutorialStep[] = [
    {
      targetId: 'running-phase-process-overview-element-overview',
      title: 'Start Phase-based Running Develop Method Tutorial',
      content: `
        This is the tutorial for the enaction of phase-based development methods.
        Phase-based Development Methods have an order of phases in which
        development steps are executed.
      `,
      showNext: true,
      showPrevious: false,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'context-overview',
      title: 'View Context',
      content: `
        In this panel, you can see the context that the Method Engineer has defined
        for this development method.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'running-phase-process-overview-execution-overview-edit',
      title: 'Execute Development Method',
      content: `
      As the context is already defined, you can directly start with the
      execution of development steps. To start click on this button to
      get to the execution page.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'running-phase-process-execution-phases',
      title: 'Execute Development Method II',
      content: `
        In this panel, you can see the overview of the process that defines in
        which order development steps should be executed. The columns represent
        different phases and structure the development steps. The number in the
        top right corner of a development step shows the order in which
        development steps are executed. You do not need to worry about these
        details as the tool selects the next step for you automatically.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'running-process-base-kanban-board',
      title: 'Phase-based Running Method Tutorial',
      content: `
        This is the main overview of the method execution. As you can see it
        is visualized as a kanban board. It shows steps in To Do that need to
        be executed later. It shows steps in Doing if they are currently
        executed, and steps in Done are finished. The add button in the
        To Do column allows you to add development steps manually, but let's stick
        to the predefined method for now.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'kanban-board-todo-0',
      title: 'Execute Development Method III',
      content: `
        This card represents the first development step. The buttons allow you
        to visualize the step in the process above, to get an overview of the step,
        and to start the step.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'kanban-board-todo-0-start',
      title: 'Execute Development Steps',
      content: `
        Let's start this development step by clicking on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'kanban-board-doing-0-view-execution',
      title: 'Execute Development Steps II',
      content: `
        Now let's go to the detail page of this development step by clicking
        on this button. There another tutorial will take over.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onFinishedMethod: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'kanban-board-done-0',
      title: 'View Executed Development Method',
      content: `
        Here, you can see the executed method. You can still view the comments
        and created artifacts.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'running-process-base-finish-method',
      title: 'Finish Executed Development Method',
      content: `
        With a click on the button in this panel you can finish methods. You will
        also, be asked about finishing a method if you are done with the predefined
        process.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'nav-running-phase-process-artifacts',
      title: 'View Created Artifacts',
      content: `
      Let's check out the created artifacts by clicking on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => {
        await this.navigateToUrl(['execution']);
        this.openSidenav();
      },
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'running-process-artifacts-artifacts',
      title: 'View Created Artifacts II',
      content: `
      In this panel you can see the created artifacts. Here, you can
      add, edit, import, and export artifacts.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['artifacts']),
    },
    {
      targetId: 'nav-running-phase-process-context',
      title: 'Change Context',
      content: `
        Now, let's go to the context overview by clicking on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => {
        await this.navigateToUrl(['artifacts']);
        this.openSidenav();
      },
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'running-full-process-context-context',
      title: 'Change Context II',
      content: `
        In this panel, you can see an overview of the current context as it has
        been defined by the Method Engineer. If the context changes, you can
        request a context change from the Method Engineer by clicking on the
        button in the upper right corner of this panel. Then, you can comment
        on why a context change is necessary and how the context change should look
        like. After submitting the form, the Method Engineer can see the method
        in the method overview and edit it, so that the new context is
        represented.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['context']),
    },
    {
      targetId: 'running-full-process-context-context',
      title: 'End Phase-based Running Development Method Tutorial',
      content: `
        This also concludes the tutorial on how to enact phase-based development methods.
      `,
      showNext: false,
      showRestart: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['context']),
    },
  ];

  constructor(
    route: ActivatedRoute,
    router: Router,
    @Inject(SIDENAV_CONTROL) sidenavControl: SidenavControl,
    tutorialManagerService: TutorialManagerService
  ) {
    super(route, router, sidenavControl, tutorialManagerService);
  }

  async init(
    created: boolean,
    startTutorial: boolean,
    finishedMethod = false
  ): Promise<void> {
    await super.init(created, startTutorial);
    if (finishedMethod) {
      const step = this.tutorialManagerService.getTutorialStep() as
        | RunningPhaseProcessTutorialStep
        | undefined;
      step?.onFinishedMethod?.();
    }
  }

  getStartData(): ElementStartData | undefined {
    return {
      id: this.route.snapshot.parent?.paramMap.get('id') ?? undefined,
    };
  }
}
