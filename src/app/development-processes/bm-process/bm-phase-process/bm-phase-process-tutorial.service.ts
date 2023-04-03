import { Inject, Injectable } from '@angular/core';
import { Tutorial } from '../../../tutorial/tutorial-stats.service';
import { InternalRoles } from '../../../role/user.service';
import {
  TutorialManagerService,
  TutorialStep,
} from '../../../tutorial/tutorial-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DefaultTutorialService,
  ElementStartData,
} from '../../../tutorial/default-tutorial.service';
import { SIDENAV_CONTROL, SidenavControl } from '../../../sidenav-control';

@Injectable()
export class BmPhaseProcessTutorialService extends DefaultTutorialService {
  static readonly tutorialDefinition: Tutorial = {
    id: 'BmPhaseProcessTutorial',
    role: InternalRoles.METHOD_ENGINEER,
    name: 'Phase-based Composition Tutorial',
    steps: 22,
  };

  protected get tutorialId(): string {
    return BmPhaseProcessTutorialService.tutorialDefinition.id;
  }

  protected readonly tutorialSteps: TutorialStep[] = [
    {
      targetId: 'bm-phase-process-overview-element-overview',
      title: 'Start Phase-based Composition Tutorial',
      content: `
        This tutorial will teach you how to compose a phase-based
        development method. It assumes that you start with an
        empty development method and follow the
        instructions on the initialization page.
      `,
      showNext: true,
      showPrevious: false,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'bm-phase-process-overview-context',
      title: 'View Phase-based Composition',
      content: `
        In the initialization step, you should already have defined your
        context in the form of situational factors and application domains.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'bm-phase-process-overview-method-overview',
      title: 'Create Phase-based Development Method',
      content: `
        Thus, we can directly start with creating the development method. Currently, you can
        see that this panel is empty and has no phases.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'bm-phase-process-overview-method-overview-edit',
      title: 'Create Phase-based Development Method II',
      content: `
        To change this click on this edit button, to edit the method.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'bm-phase-process-edit-edit-phases',
      title: 'Add Phases',
      content: `
        Now, you want to select which phases this Method includes. This is done
        by clicking on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'phase-0',
      title: 'Add Phases II',
      content: `
        Click on this button to select and unselect a phase.
      `,
      showNext: false,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'bm-phase-process-phases-update',
      title: 'Add Phases III',
      content: `
        After you have selected enough phases click on update to save your
        changes. Afterwards close the window.
      `,
      showNext: false,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'bm-phase-process-board-phase-decision-0-add',
      title: 'Add Method Building Blocks',
      content: `
        Click on this button to add a Method Building Block to this phase.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'development-method-selection-form-select-0',
      title: 'Add Method Building Blocks II',
      content: `
        Click this button to select a Method Building Block.
      `,
      showNext: false,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'bm-phase-process-board-column-0-card-0',
      title: 'Add Method Building Blocks III',
      content: `
        Here you can see the added Building Block. If you click on the info
        button you get an overview of the Building Block. The edit button allows
        you to configure the Building Block, and the edit number button allows
        you to edit the execution number in the top right corner of this card.
        The execution number shows you in which order the different Method
        Building Blocks are executed.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'bm-phase-process-board-column-0-card-0-edit',
      title: 'Configure Method Building Blocks',
      content: `
        Now, click on the edit button to configure this Method Building Block.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'bm-phase-process-edit-method-edit-modal-header',
      title: 'Configure Method Building Blocks II',
      content: `
        A new window has opened that is used to configure the Method Building Block that
        you have selected.
      `,
      showNext: true,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'method-info-input-artifacts',
      title: 'Configure Method Building Blocks III',
      content: `
        In this part, the Input Artifacts for the Method Building Block is configured. You need
        to select one of the groups or none if it is available. Sometimes
        you also need to select one or multiple elements in such configuration
        forms.
      `,
      showNext: true,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'method-info-output-artifacts',
      title: 'Configure Method Building Blocks IV',
      content: `
        Here, you can configure the Output Artifacts of this Method Building Block. The configuration
        works exactly like for Input Artifacts.
      `,
      showNext: true,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'method-info-stakeholders',
      title: 'Configure Method Building Blocks V',
      content: `
        Here, involved Stakeholders are configured in this part of the configuration form.
        This choice has no direct effect on the execution but gives some support for the Business Developer
      `,
      showNext: true,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'method-info-tools',
      title: 'Configure Method Building Blocks VI',
      content: `
        Here, you can configure which Tools should be used to execute the
        building block. This has no direct effect on the execution but
        gives the Business Developer an indication of which Tools to use.
      `,
      showNext: true,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'method-info-steps',
      title: 'Configure Method Building Blocks VII',
      content: `
        In this part, the execution steps of this Method Building Block are configured.
        Sometimes this is empty, but sometimes you need to provide some
        configuration for the internal modules that execute this method, for
        example, which composed model should be used.
      `,
      showNext: true,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'bm-phase-process-edit-method-edit-modal-update-all',
      title: 'Configure Method Building Blocks VIII',
      content: `
        If you are finished click on this button to save your changes.
        Then, close the window to continue with the tutorial.
      `,
      showNext: false,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'bm-phase-process-edit-errors',
      title: 'Validate Phase-based Development Method',
      content: `
        This panel shows errors that are critical and result in an incomplete
        Method. It is not possible for a Business Developer to enact an
        incomplete method.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'bm-phase-process-edit-warnings',
      title: 'Validate Phase-based Development Method II',
      content: `
        This panel shows warnings. Low-value warnings show Method Building
        Blocks that have a Situational Factor that is too low in comparison
        to the required context. Incorrect value warnings show Method Building
        Blocks that have a Situational Factor that does not fit the context.
        Missing Artifacts show Method Building Blocks that would miss an Artifact
        for their input as it is not created by Method Building Blocks that
        are executed before that block.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'nav-phase-process-overview',
      title: 'View Phase-based Development Method',
      content: `
        Now the method creation is finished and we can check the method on the
        overview page. To get there click on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => {
        await this.navigateToUrl(['method']);
        this.openSidenav();
      },
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'bm-phase-process-overview-method-overview',
      title: 'End Phase-based Composition Tutorial',
      content: `
        Now you can see that the method is shown here in an overview.
        As there are no red edit buttons the method is correctly defined and
        can now be enacted by a Business Developer. This also concludes
        the tutorial on Phase-based Method Composition.
      `,
      showNext: false,
      showRestart: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
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

  getStartData(): ElementStartData | undefined {
    return {
      id: this.route.snapshot.parent?.paramMap.get('id') ?? undefined,
    };
  }
}
