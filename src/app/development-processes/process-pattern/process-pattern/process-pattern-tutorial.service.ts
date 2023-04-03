import { Inject, Injectable } from '@angular/core';
import {
  TutorialManagerService,
  TutorialStep,
} from '../../../tutorial/tutorial-manager.service';
import { Tutorial } from '../../../tutorial/tutorial-stats.service';
import { InternalRoles } from '../../../role/user.service';
import { DefaultTutorialService } from '../../../tutorial/default-tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SIDENAV_CONTROL, SidenavControl } from '../../../sidenav-control';

@Injectable()
export class ProcessPatternTutorialService extends DefaultTutorialService {
  static readonly tutorialDefinition: Tutorial = {
    id: 'ProcessPatternTutorial',
    role: InternalRoles.DOMAIN_EXPERT,
    name: 'Method Pattern Tutorial',
    steps: 26,
  };

  protected get tutorialId(): string {
    return ProcessPatternTutorialService.tutorialDefinition.id;
  }

  protected readonly tutorialSteps: TutorialStep[] = [
    {
      targetId: 'process-pattern-overview-element-overview',
      title: 'Start Method Pattern Tutorial',
      content: `
        In this tutorial you will learn how to create Method Patterns.
        It assumes that you start it with a newly created pattern.
        Method Patterns are used during the Pattern-based Method Composition
         to define in which order Method Building Blocks should be
        executed.
      `,
      showNext: true,
      showPrevious: false,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'process-pattern-overview-pattern',
      title: 'View Method Pattern',
      content: `
        In this panel, you can see the current Method Pattern. It has only one
        start element. In the upper right corner, the edit button is red, because
        the Method Pattern is not correctly defined and has errors. So let's
        start with adding some more structures to the pattern.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'process-pattern-overview-pattern-edit',
      title: 'Create Pattern',
      content: `
        To go to the edit page of this pattern, you need to click on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'process-pattern-diagram-canvas',
      title: 'Create Pattern II',
      content: `
        Now you are on the edit page of this Method Pattern.
        In this panel, you can see the pattern and edit it.
        Below the panel is a legend which describes the different icons
        used in this panel. At the bottom of the page are different controls.
        Let's start by adding some tasks to the Method Pattern.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['pattern']),
    },
    {
      targetId: 'process-pattern-diagram-canvas',
      title: 'Create Pattern III',
      content: `
        Do this by clicking on the start element, which is the circle in the
        panel. Then select the rectangle which means 'Append Task'. Then a new
        task is created.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['pattern']),
    },
    {
      targetId: 'process-pattern-diagram-canvas',
      title: 'Create Pattern IV',
      content: `
        A task is a placeholder for a Method Building Block. By double-clicking
        on it, you can give it a name. There are also 'Call Activities'. They
        behave like tasks, but also allow a Method Engineer to insert
        other Method Patterns into it instead of only Method Building Blocks.
        You can switch to this type with the wrench icon.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['pattern']),
    },
    {
      targetId: 'process-pattern-diagram-canvas',
      title: 'Create Pattern V',
      content: `
        Now you need to set types onto your newly created task. Do this by
        clicking onto the task and select the gear icon which means 'Manage Types'.
        In the opened box you need to add types to the Method Pattern.
        A detailed description of how Types are applied is on the next page.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['pattern']),
    },
    {
      targetId: 'process-pattern-diagram-canvas',
      title: 'Create Pattern VI',
      content: `
        Types restrict which Method Building Blocks are allowed to be used
        inside a Task. Only Method Building Blocks with the same Type as set
        on the task are allowed to be used inside that task. Additionally,
        it is possible to exclude some types. Inherit types is used to inherit
        the types from the parent element if this Method Pattern is used
        inside another call activity.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['pattern']),
    },
    {
      targetId: 'process-pattern-diagram-canvas',
      title: 'Create Pattern VII',
      content: `
        Now you have created your first task in a Method Pattern. Let's first
        save these changes.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['pattern']),
    },
    {
      targetId: 'process-pattern-diagram-save',
      title: 'Validate Pattern',
      content: `
        To save your changes click on this button. Only if you save your
        changes the Method Pattern is reevaluated and checked whether it is
        correctly defined. This Method Pattern is, if you followed the tutorial,
        still not correctly defined, as you can see in the red error message
        at the top of the page.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['pattern']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'process-pattern-diagram-toggle-linter',
      title: 'Validate Pattern II',
      content: `
        To check what errors are there in the Method Pattern, you need to activate
        the linter. This can be done on this button, so click on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['pattern']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'process-pattern-diagram-canvas',
      title: 'Validate Pattern III',
      content: `
        Another possibility is to use the button in this diagram to activate
        and deactivate the linter. Now you can see that some elements are
        marked with a red cross. This means that they have errors that prevent
        the Method Engineer from using this Method Pattern.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['pattern']),
    },
    {
      targetId: 'process-pattern-diagram-canvas',
      title: 'Validate Pattern IV',
      content: `
        The error messages tell you that an end event is missing in this
        Method Pattern. Normally, Method Patterns are way more complex than
        having only a single task. Often, different control flows are used with
        gateways that allow a Method Pattern to define parallel and exclusive
        flows. For this tutorial, it is enough to just create an end event by clicking
        on the task and selecting the end event. It will connect automatically
        to the task.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['pattern']),
    },
    {
      targetId: 'process-pattern-diagram-save',
      title: 'Validate Pattern V',
      content: `
        Now the linter should not show any more errors. Still, the error message
        on the top of the page is there. Save your changes to reevaluate the
        Method Pattern and the error message will disappear.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['pattern']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'nav-process-pattern-overview',
      title: 'View Method Pattern',
      content: `
        Now that your Method Pattern is correctly defined, let's go back to the
        overview of your Method Pattern.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => {
        await this.navigateToUrl(['pattern']);
        this.openSidenav();
      },
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'process-pattern-overview-types-factors',
      title: 'Update Types and Situational Factors',
      content: `
        Currently, you have a correctly defined Method Pattern, but to make it
        usable for Method Engineers, you need to add Types and optionally
        Situational Factors.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'process-pattern-overview-types-factors-edit',
      title: 'Update Types and Situational Factors II',
      content: `
        To edit the Types and Situational Factors click on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'types',
      title: 'Update Types',
      content: `
        In this panel, you can edit the Types of this Method Pattern. A Method
        Pattern can be used as a starting pattern during the Pattern-based Composition by using the Type
        'initialisation'. To use this Method Pattern in other Patterns, the
        other Pattern must have a Call Activity with a matching Type.
        Let's add a Type to this Method Pattern.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['selection']),
    },
    {
      targetId: 'types-selection-form-add',
      title: 'Update Types II',
      content: `
        Click on this button to add a Type to this Method Pattern.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['selection']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'types-selection-from-method-elements-selection-form',
      title: 'Update Types III',
      content: `
        Now select a List and Type for this Method Building Block. You can
        also add multiple if you want.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['selection']),
    },
    {
      targetId: 'types-selection-form-save',
      title: 'Update Types IV',
      content: `
        If you are finished, click on this button to save your changes.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['selection']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'situational-factors',
      title: 'Update Situational Factors',
      content: `
      The next step is to add Situational Factors. They are used to give the
      Method Engineer guidance on whether the Method Patterns match with the
      context. To add Situational Factors to this Method Pattern, you need
      to click on 'Add Situational Factor'. The only difference to adding
      Types are that Situational Factors also have a value that needs to be
      set.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['selection']),
    },
    {
      targetId: 'nav-process-pattern-overview',
      title: 'View Method Pattern',
      content: `
        Now that you are finished, let's go back to the overview to look at
        your Method Pattern.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => {
        await this.navigateToUrl(['selection']);
        this.openSidenav();
      },
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'process-pattern-overview-element-overview',
      title: 'Create Description',
      content: `
        Now your Method Pattern could be used by Method Engineers. The problem
        is that they do not have a description of your Method Pattern. Currently,
        they can only see the name of the Method Pattern. So let's add a description.
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
        To add a description, click on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'pattern',
      title: 'Create Description III',
      content: `
        On this page, you can edit the name, description, icon, and author of the
        Method Pattern. After you entered the values either click on the update
        button directly below the forms or on the 'Update all' button in the lower
        right corner. It will update all changes. This also finishes the tutorial
        about Method Patterns.
      `,
      showRestart: true,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['general']),
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
}
