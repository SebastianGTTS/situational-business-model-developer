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

@Injectable()
export class BmPatternProcessTutorialService extends DefaultTutorialService {
  static readonly tutorialDefinition: Tutorial = {
    id: 'BmPatternProcessTutorial',
    role: InternalRoles.METHOD_ENGINEER,
    name: 'Pattern-based Composition Tutorial',
    steps: 19,
  };

  protected get tutorialId(): string {
    return BmPatternProcessTutorialService.tutorialDefinition.id;
  }

  protected readonly tutorialSteps: TutorialStep[] = [
    {
      targetId: 'bm-pattern-process-overview-element-overview',
      title: 'Start Pattern-based Composition Tutorial',
      content: `
        This tutorial will teach you how to compose a pattern-based
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
      targetId: 'bm-pattern-process-overview-context',
      title: 'View Pattern-based Composition',
      content: `
        In the initialization step, you should already have defined your
        context.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'bm-pattern-process-overview-method-overview',
      title: 'Create Pattern-based Development Method',
      content: `
        Thus, we can directly start with creating the Method. Currently, you can
        see that this panel is almost empty. The only object currently in the
        method is the starting point that is shown here in the middle as a
        circle.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'bm-pattern-process-overview-method-overview-edit',
      title: 'Create Pattern-based Development Method II',
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
      targetId: 'bm-process-modeler-canvas',
      title: 'Add Method Pattern',
      content: `
        This panel shows you the method. Below this panel is a legend that
        describes all icons. The method is built up from Method
        Patterns by combining them and inserting them into each other.
        After that, the Method Patterns are filled with Method Building Blocks.
        The tool supports you by showing you only relevant Patterns and
        Building Blocks and sorting them by their suitability.
        Let's start by adding the first Method Pattern.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'bm-process-start-event',
      title: 'Add Method Pattern II',
      content: `
        To do this click on this start event.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
      isPossible: async (): Promise<boolean> => {
        const element = document.getElementById('bm-process-start-event');
        return (
          element == null ||
          (!element.classList.contains('selected') &&
            element.dataset.outgoing === '0')
        );
      },
    },
    {
      targetId: 'bm-process-context-pad-add-method-pattern',
      title: 'Add Method Pattern III',
      content: `
        Now, click on this button to add an initialisation Method Pattern.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
      isPossible: async (start, forward): Promise<boolean> => {
        const element = document.getElementById('bm-process-start-event');
        if (!start && forward) {
          return element != null && element.dataset.outgoing === '0';
        }
        return (
          element != null &&
          element.classList.contains('selected') &&
          element.dataset.outgoing === '0'
        );
      },
    },
    {
      targetId: 'process-pattern-selection-form-select-0',
      title: 'Add Method Pattern IV',
      content: `
        Click this button to select a Method Pattern.
      `,
      showNext: false,
      showPrevious: true,
      modal: true,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
      isPossible: async (): Promise<boolean> => {
        const element = document.getElementById('bm-process-start-event');
        return element == null || element.dataset.outgoing === '0';
      },
    },
    {
      targetId: 'bm-process-modeler-canvas',
      title: 'Add Method Building Blocks',
      content: `
        Now you have added a Method Pattern and you can see it in this panel.
        The red boxes indicate places for Method Building Blocks. If such a
        red box has a plus symbol in it, it is also possible to insert
        Method Patterns into it.
        For now we can keep it simple and just insert Method Building Blocks
        into these boxes. To do this, you need to click on such a box and select
        the option 'Select Method Building Block', which is visualized as a
        database icon. Then, select a Method Building Block.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'bm-process-modeler-canvas',
      title: 'Add Method Building Blocks II',
      content: `
        Now the block's color changed. It should now be green, gray or orange.
        Green means that the Method Building Block is correctly configured.
        If the block is gray, it means that the block needs to be configured.
        To configure or reconfigure a block you can click on the block and
        then in the menu onto 'Edit Method Building Block details', which is
        visualized as a gear icon.
        Orange also means that the Building Block needs to be configured, but
        here a configuration of an execution step is missing. You need to,
        for example, select a composed model for an execution step.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'bm-process-modeler-canvas',
      title: 'Add Method Building Blocks III',
      content: `
        The next step is to fill all empty blocks with Method Building Blocks.
        In the end, there should be no Blocks that are red, gray, or orange. All
        Blocks should be green.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'bm-process-edit-diagram-errors',
      title: 'Validate Method Building Blocks',
      content: `
        This panel shows you errors that lead to an incomplete method that
        a Business Developer can not enact. This is, for example, the case
        if there are empty blocks in the development method or Method Building Blocks that are
        missing configuration.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'bm-process-edit-diagram-warnings',
      title: 'Validate Method Building Blocks II',
      content: `
        This panel shows warnings. Low-value warnings show Method Building
        Blocks and Method Patterns have a Situational Factor that is
        too low in comparison to the required context. Incorrect value warnings
        show Method Building Blocks and Method Patterns that have a situational
        factor that does not fit to the context. Missing Artifacts show Method
        Building Blocks that would miss an Artifact for their input as it is
        not created by Method Building Blocks that are executed before that
        Block. Unreachable shows Method Building Blocks that can not be reached
        in the execution.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['method']),
    },
    {
      targetId: 'nav-pattern-process-overview',
      title: 'View Pattern-based Development Method',
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
      targetId: 'bm-pattern-process-overview-method-overview',
      title: 'Create Description',
      content: `
        Now you can see that the method is shown here in an overview.
        As there are no red edit buttons the method is correctly defined and
        can now be enacted by a Business Developer. Still, there is no description
        and the icon is the default one. Let's change that.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'element-overview-edit-button',
      title: 'Create Description II',
      content: `
        If you click on this button, you can edit the description and icon of
        this method.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'block',
      title: 'Create Description III',
      content: `
        In this panel you can edit the description of the building block,
        below you can edit the icon. Do not forget to click on update, after
        you are finished.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['general']),
    },
    {
      targetId: 'nav-pattern-process-overview',
      title: 'Create Description IV',
      content: `
        Now let's go back to the overview.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => {
        await this.navigateToUrl(['general']);
        this.openSidenav();
      },
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'bm-pattern-process-overview-element-overview',
      title: 'End Pattern-based Composition Tutorial',
      content: `
      Now you can see that the method is shown here in an overview.
      This concludes the tutorial on Pattern-based Method Composition.
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
