import { Inject, Injectable } from '@angular/core';
import { Tutorial } from '../../../tutorial/tutorial-stats.service';
import {
  TutorialManagerService,
  TutorialStep,
} from '../../../tutorial/tutorial-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DefaultTutorialService,
  ElementStartData,
} from '../../../tutorial/default-tutorial.service';
import { InternalRoles } from '../../../role/user.service';
import { SIDENAV_CONTROL, SidenavControl } from '../../../sidenav-control';
import { RunningLightProcess } from '../../../development-process-registry/running-process/running-light-process';

interface RunningLightProcessTutorialStep extends TutorialStep {
  onFinishedMethod?: () => void;
}

@Injectable()
export class RunningLightProcessTutorialService extends DefaultTutorialService {
  static readonly tutorialDefinition: Tutorial = {
    id: 'RunningLightProcessTutorial',
    role: InternalRoles.BUSINESS_DEVELOPER,
    name: 'Light Running Method Tutorial',
    steps: 30,
  };

  protected get tutorialId(): string {
    return RunningLightProcessTutorialService.tutorialDefinition.id;
  }

  protected readonly tutorialSteps: RunningLightProcessTutorialStep[] = [
    {
      targetId: 'running-light-process-overview-element-overview',
      title: 'Start Ad-hoc Running Development Method Tutorial',
      content: `
        This is the tutorial for the enaction of lightweight Business Development Methods.
        Lightweight Business Development Methods do not have a process in which order
        Development Steps are executed. It is up to the Business Developer to select
        which Development Steps are executed when.
      `,
      showNext: true,
      showPrevious: false,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'context-overview-edit',
      title: 'Add Context',
      content: `
        Let's start by adding a context to this method. The context later helps you to select
        fitting Development Steps. To edit the context, click on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'context-edit',
      title: 'Add Context II',
      content: `
        The context is split up into two parts: the Domain and the Situational Factors.
        The Domain is used to select fitting model knowledge for your business development method.
        The Situational Factors are used to select fitting development steps for your method.
        Let's start by selecting fitting Domains.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['context']),
    },
    {
      targetId: 'domains-selection-form-add',
      title: 'Add Domain',
      content: `
        To add a new Domain click on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['context']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'domainSelection0',
      title: 'Add Domain II',
      content: `
        Click into this input field to get a short preview of some Domains.
        Type in a Domain name to search for specific Domains. To select a Domain,
        you need to click on its name.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['context']),
    },
    {
      targetId: 'domains-selection-form-update',
      title: 'Add Domain III',
      content: `
        After you have selected a Domain, click on this button to update the
        Domain selection.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['context']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'situational-factors-add',
      title: 'Add Situational Factors',
      content: `
        Now you need to specify the Situational Factors.
        To add a Situational Factors click on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['context']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'situational-factor-list-input-0',
      title: 'Add Situational Factors II',
      content: `
        First, you need to specify to which list the factor belongs that you
        want to add. Click into this input field and start typing to search
        for lists. Afterward, click on the list name in the dropdown.
        Alternatively, you can specify the factor directly in the next step
        and the list will be selected automatically.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['context']),
    },
    {
      targetId: 'situational-factor-element-input-0',
      title: 'Add Situational Factors III',
      content: `
        In this input field you need to specify the actual Situational Factors.
        As in the previous step, you can start typing to search for a factor.
        In this input field it is important to click onto the factor in the
        dropdown.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['context']),
    },
    {
      targetId: 'situational-factor-factor-value-0',
      title: 'Add Situational Factors IV',
      content: `
        Now you are able to select a value for this Situational Factors. Select
        one of the values in the dropdown menu.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['context']),
    },
    {
      targetId: 'situational-factors-selection-form-update',
      title: 'Add Situational Factors V',
      content: `
        Click on update to save your changes.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['context']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'nav-running-light-process-overview',
      title: 'View Ad-hoc Running Development Method',
      content: `
        Now you can go back to the overview by clicking on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => {
        await this.navigateToUrl(['context']);
        this.openSidenav();
      },
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'running-light-process-overview-execution-overview-edit',
      title: 'Execute Ad-hoc Running Development Method',
      content: `
        You can start now with the execution of development steps. To start
        click on this button to get to the execution page.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'running-process-base-kanban-board',
      title: 'Execute Ad-hoc Running Development Method II',
      content: `
        This is the main overview of the method execution. As you can see it
        is visualized as a kanban board. It shows steps in To Do that need to
        be executed later. It shows steps in Doing if they are currently
        executed, and steps in Done are finished.
        Let's add a development step.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'kanban-board-add',
      title: 'Add Development Step',
      content: `
        To add a development step, you need to click on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'development-method-selection-form-select-0',
      title: 'Add Development Step II',
      content: `
        Now you need to select a Method Building Block as a development step by clicking on this select button.
      `,
      showNext: false,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'method-configuration-modal-header',
      title: 'Add Development Step III',
      content: `
        A new windows has opened that is used to configure the Method Building Block that
        you have selected.
      `,
      showNext: true,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'method-info-input-artifacts',
      title: 'Add Development Step IV',
      content: `
        In this part, the input for the Method Building Block is configured. You need
        to select one of the groups or none if it is available. Sometimes
        you also need to select one or multiple elements in such configuration
        forms.
      `,
      showNext: true,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'method-info-output-artifacts',
      title: 'Add Development Step V',
      content: `
        Here, you can configure the output of this Method Building Block. The configuration
        works exactly like input artifacts.
      `,
      showNext: true,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'method-info-stakeholders',
      title: 'Add Development Step VI',
      content: `
        Stakeholders are configured in this part of the configuration form.
      `,
      showNext: true,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'method-info-tools',
      title: 'Add Development Step VII',
      content: `
        Here, you can configure which tools should be used to execute the
        Method Building Block. This has no direct effect on the execution but
        gives the Business Developer an indication which tools to use.
      `,
      showNext: true,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'method-info-steps',
      title: 'Add Development Step VIII',
      content: `
        In this part, the execution steps of this Method Building Block are configured.
        Sometimes this is empty, but sometimes you need to provide some
        configuration for the internal modules that execute this method, for
        example, which composed model should be used.
      `,
      showNext: true,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'method-configuration-modal-finish',
      title: 'Add Development Step IX',
      content: `
        After you are finished click on this button to save your changes and
        close the modal. The Method Building Block configuration form should not show
        any indications, like red exclamation marks, that it is incorrectly defined.
      `,
      showNext: false,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'kanban-board-todo-0-start',
      title: 'Execute Development Step',
      content: `
        Now its time to start the execution. Click on this button to start the
        development step. If you have configured it correctly,
        the development step should move to do. Otherwise, an error message
        will be shown and you need to fix the configuration.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
      isPossible: async (start, forward): Promise<boolean> => {
        if (!start && forward) {
          return true;
        }
        return (
          this.runningProcess == null ||
          this.runningProcess.todoMethods.length > 0
        );
      },
    },
    {
      targetId: 'kanban-board-doing-0-view-execution',
      title: 'Execute Development Step II',
      content: `
        Let's go into the detail view of this development step by clicking on
        this button. There another tutorial will show you how to execute a
        development step. After you are back this tutorial will take over again.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onFinishedMethod: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
      isPossible: async (start, forward): Promise<boolean> => {
        if (!start && forward) {
          return true;
        }
        return (
          this.runningProcess == null ||
          this.runningProcess.runningMethods.length > 0
        );
      },
    },
    {
      targetId: 'kanban-board-done-0',
      title: 'View Executed Development',
      content: `
        Here, you can see the executed method. You can still view the comments
        and created artifacts.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      isPossible: async (start, forward): Promise<boolean> => {
        if (!start && forward) {
          return true;
        }
        return (
          this.runningProcess == null ||
          this.runningProcess.executedMethods.length > 0
        );
      },
    },
    {
      targetId: 'nav-running-light-process-artifacts',
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
        In this panel, you can see the created artifacts. Here, you can
        add, edit, import, and export artifacts.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['artifacts']),
    },
    {
      targetId: 'nav-running-light-process-execution',
      title: 'View Created Artifacts III',
      content: `
        Let's go back to the execution page of this running method.
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
      targetId: 'running-process-base-finish-method',
      title: 'End Ad-hoc Running Development Method Tutorial',
      content: `
        If you are done with the whole business model development, you can
        end the execution through this panel. This also concludes the
        tutorial on ad-hoc running methods. You have learned how to choose
        and enact development steps and how to check out the created artifacts.
      `,
      showNext: false,
      showRestart: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
  ];

  private runningProcess?: RunningLightProcess;

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
        | RunningLightProcessTutorialStep
        | undefined;
      step?.onFinishedMethod?.();
    }
  }

  setRunningProcess(runningProcess: RunningLightProcess | undefined): void {
    this.runningProcess = runningProcess;
  }

  getStartData(): ElementStartData | undefined {
    return {
      id: this.route.snapshot.parent?.paramMap.get('id') ?? undefined,
    };
  }
}
