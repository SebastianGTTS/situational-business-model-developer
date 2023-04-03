import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TutorialManagerService,
  TutorialStep,
} from '../../../tutorial/tutorial-manager.service';
import { Tutorial } from '../../../tutorial/tutorial-stats.service';
import { InternalRoles } from '../../../role/user.service';
import { DefaultTutorialService } from '../../../tutorial/default-tutorial.service';
import { SIDENAV_CONTROL, SidenavControl } from '../../../sidenav-control';

@Injectable()
export class DevelopmentMethodTutorialService extends DefaultTutorialService {
  static readonly tutorialDefinition: Tutorial = {
    id: 'DevelopmentMethodTutorial',
    role: InternalRoles.DOMAIN_EXPERT,
    name: 'Method Building Block Tutorial',
    steps: 55,
  };

  protected get tutorialId(): string {
    return DevelopmentMethodTutorialService.tutorialDefinition.id;
  }

  protected readonly tutorialSteps: TutorialStep[] = [
    {
      targetId: 'development-method-overview-element-overview',
      title: 'Start Method Building Block Tutorial',
      content: `
      In this tutorial, you will learn how to create Method Building Blocks.
      Those building blocks correspond to single development steps with the development method.
      The tutorial starts with a newly created building block.
      `,
      showNext: true,
      showPrevious: false,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'development-method-overview-element-overview',
      title: 'View Method Building Block',
      content: `
      This is the main overview of a Method Building Block, where you can see the name, icon, and description of a Method Building Block.
      Let's start by adding a fitting description.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'element-overview-edit-button',
      title: 'Create Description',
      content: `
      For that,  you need to click on this edit button to get to the general edit page.

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
      title: 'Create Description II',
      content: `
        Write a fitting description for the Method Building Block.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['general']),
    },
    {
      targetId: 'element-form-update-button',
      title: 'Create Description III',
      content: `
        Click on the update button to update the description.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['general']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'icon',
      title: 'Update Icon',
      content: `
        Next, you can update the icon of the Method Building Block.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['general']),
    },
    {
      targetId: 'development-method-general-update-all',
      title: 'Update Method Building Block',
      content: `
        You can also push this update button to update all information of the page.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['general']),
    },
    {
      targetId: 'nav-development-method-overview',
      title: 'Update Method Building Block II',
      content: `
        Let's go back to the overview page by clicking here.
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
      targetId: 'development-method-overview-selection',
      title: 'Update Types and Phases',
      content: `
      Here you can see the types, phases, and situational factors of this Method Building Block.
      They support the selection of Method Building Blocks during the Phased-based and Pattern-based Composition.
      Let's add some types and phases to make your selectable during the Method Composition.

      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'development-method-overview-selection-edit-button',
      title: 'Update Types and Phases II',
      content: `
        Click on this button to edit them.
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
        Here, you can select types that are used to match Method Building
        Blocks into Method Patterns for pattern-based composition. Hit the
        add button to add a new type. If you are finished click on the update
        button to save your changes.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['selection']),
    },
    {
      targetId: 'phases',
      title: 'Update Phases',
      content: `
        Next, you can select phases that are used to match Method Building
        Blocks and phases during the Phase-based Composition. Hit the
        add button to add a new phase. If you are finished click on the update
        button to save your changes.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['selection']),
    },
    {
      targetId: 'situational-factors',
      title: 'Update Situational Factors',
      content: `
        Last, you can select situational factors that are supporting the finding of the perfect Method
        Building Blocks for a given context. Hit the add button to add a new situational factor. In
        comparison to types and phases, situational factors additionally need
        a value. If you are finished click on the update button to save your
        changes.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['selection']),
    },
    {
      targetId: 'nav-development-method-overview',
      title: 'Update Execution',
      content: `
        Let's go back now to the overview page to configure the execution.
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
      targetId: 'development-method-overview-artifacts',
      title: 'Update Artifacts',
      content: `
        A Method Building Block takes Input Artifacts and transforms them into
        Output Artifacts.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'development-method-overview-input-artifacts-edit',
      title: 'Update Input Artifact',
      content: `
        Let's start by defining the Input Artifacts.
        Click on this edit button to get to the edit page.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'input-artifacts',
      title: 'Update Input Artifact II',
      content: `
        Here, you can define the Input Artifacts of the Method Building Block.
        A Method Engineer can later fine-tune which artifacts a Business
        Developer needs to provide.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'input-artifacts-add-or-group',
      title: 'Update Input Artifact III',
      content: `
        Let's start by adding the first group of artifacts by clicking on this
        button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'checkboxAllowNoneArtifact-1',
      title: 'Update Input Artifact IV',
      content: `
        First of all, you can see that this new option appears. This option
        is used to indicate whether a Method Engineer can select that no
        artifacts need to be provided.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'input-artifacts-or-group-0',
      title: 'Update Input Artifact V',
      content: `
        This new panel represents an OR-Group that consists of at least one
        Artifact. If 'Allow None' is not set the Method Engineer needs to
        select one of these groups to specify which artifacts need to be
        provided by the Business Developer. You can also
        set one of the OR-Groups as default with the button at the top right
        of the group. Through this, the Method Engineer does not need to select
        one manually.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'input-artifacts-0-add',
      title: 'Update Input Artifact VI',
      content: `
        Let's add now one artifact. Do this by clicking on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'listInput-input-artifacts-0-0',
      title: 'Update Input Artifact VII',
      content: `
        Now you need to specify which artifact needs to be provided for the
        Building Block. You can select a List, which groups different Artifacts,
        e.g., all Product Artifacts, or a concrete Artifact, which is done
        with the input on the right side. For the tutorial,
        let's add the Artifact 'Business Model Canvas', which belongs to the
        list 'Structured Information'. To do this start to type
        'Structured Information' into this
        input field and select 'Structured Information' from the dropdown.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'multiple-check-input-artifacts-0-0-label',
      title: 'Update Input Artifact VIII',
      content: `
        This button indicates whether a Method Engineer can select multiple
        Artifacts of the specified list that the Business Developer needs to
        select. This is not necessary for now, as we want the Building Block
        to require only one Business Model Canvas.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'elementInput-input-artifacts-0-0',
      title: 'Update Input Artifact IX',
      content: `
        Now you can specify the concrete Artifact. In this case is should be
        'Business Model Canvas'. Thus start to type 'Business Model Canvas' and
        select it in the dropdown menu. Instead of first providing a list, it
        is also possible to directly select the artifact in this input form.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'optional-check-input-artifacts-0-0-label',
      title: 'Update Input Artifact X',
      content: `
        This button indicates whether the artifact is optional and is not
        necessarily provided by the Business Developer. As we want to use this
        artifact in the upcoming process leave this button unset.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'input-artifacts-0-add-mapping',
      title: 'Update Input Artifact XI',
      content: `
        You can see that this button appeared. It is used to specify the flow
        of artifacts in this Method Building Block, e.g., that this Artifact
        should flow to a specific Execution Step. We will cover that later.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'input-artifacts-update',
      title: 'Update Input Artifact XII',
      content: `
        Now click on this update button to save your changes.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'output-artifacts',
      title: 'Update Output Artifact ',
      content: `
        Now we want to edit the Output artifacts. This is done in this panel.
        Please add a 'Business Model Canvas' as an output artifact. It works
        exactly like you learned in the previous steps.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'output-artifacts-update',
      title: 'Update Output Artifact II',
      content: `
        Now click on this update button to save your changes.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'nav-development-method-overview',
      title: 'View Artifacts',
      content: `
        Let's go back to the overview to see the changes.
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
      targetId: 'development-method-overview-artifacts',
      title: 'View Artifacts',
      content: `
        Now you can see the OR-Groups that you created for the input and
        output artifacts.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'development-method-overview-tools',
      title: 'Update Tools',
      content: `
        You also need to define which tools a Business Developer should use to
        process the input artifacts and create the output artifacts.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'development-method-overview-tools-edit',
      title: 'Update Tools II',
      content: `
        To do this you need to click on this button to edit the tools.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'tools',
      title: 'Update Tools III',
      content: `
        In this panel, you can specify the Tools that the Business Developer
        should use. In this Method Building Block the Business Developer should use
        the internal 'Canvas Module' from the list 'Canvas Tools' to edit the
        Business Model Canvas. Please add that tool now to the list. It works
        exactly like adding input and output artifacts.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'tools-update',
      title: 'Update Tools IV',
      content: `
        Click on this update button to save your changes.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'execution-steps',
      title: 'Update Execution Steps',
      content: `
      Now let's head directly to the execution steps.
      Execution steps define a chain of development steps of corresponding modules that should be processed.
      Here you can define which steps of the Canvas Module should be executed.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'development-method-select-execution-steps-add-execution-step',
      title: 'Update Execution Steps II',
      content: `
        Click on this button to add a new execution step.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'development-method-select-execution-steps-step-0',
      title: 'Update Execution Steps III',
      content: `
        This is the execution step. In the upper right, you can select whether
        this step has actual logic and is a development step of an existing module or is just a
        textual step with no logic. Leave it as a 'Method' Step for now. Select
        'Canvas Module' as the Module and 'editCanvas' as the development step.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'development-method-select-execution-steps-update',
      title: 'Update Execution Steps IV',
      content: `
        After you added the Method click on update to save your changes.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'execution-steps',
      title: 'Update Execution Steps V',
      content: `
      You can see that there are no inputs for this method. This is what was
      meant by the flow of artifacts previously. You need to define
      how artifacts flow through your Building Block. Then, the method
      definition is finished. Let's start by adding a mapping to an output
      artifact so that the result of this method goes to an output artifact.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'development-method-select-execution-step-0-add-mapping',
      title: 'Update Execution Steps VI',
      content: `
        To do this click on this button to add a new mapping.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId:
        'development-method-select-execution-step-0-mapping-0-step-output',
      title: 'Update Execution Steps VII',
      content: `
        Now you need to select whether the artifact should flow to another step
        or an output artifact. Select 'Output' to let it flow to an output
        artifact.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'development-method-select-execution-step-0-mapping-0-output',
      title: 'Update Execution Steps VIII',
      content: `
        In this part, you need to select to which OR-Group the artifact should
        go to. As this Building Block has only one OR-Group, select the OR-Group
        '#1'.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'development-method-select-execution-step-0-mapping-0-artifact',
      title: 'Update Execution Steps IX',
      content: `
        Here, you need to select the artifact of the OR-Group. Select the one
        that is shown in the dropdown, as you only have one artifact in your
        OR-Group.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'development-method-select-execution-steps-update',
      title: 'Update Execution Steps X',
      content: `
        After you added the Mapping click on update to save your changes.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'nav-development-method-overview',
      title: 'Update Execution Steps XI',
      content: `
        Let's go back to the overview to see the changes.
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
      targetId: 'development-method-overview-execution-steps',
      title: 'Update Execution Steps XII',
      content: `
        You can see now the added execution step. Additionally, you can see that
        the edit button is red. This means that there is an error with the
        execution steps. As you know, we still have not specified a single input
        artifact for that execution step.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
    },
    {
      targetId: 'development-method-overview-input-artifacts-edit',
      title: 'Update Execution Steps XIII',
      content: `
        To do this, we need to specify a mapping on an input artifact. So let's
        edit the input artifacts by clicking on this button.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['overview']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'input-artifacts-0-add-mapping',
      title: 'Update Execution Steps XIV',
      content: `
        Click on this button to add a mapping for this input artifact.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'input-artifacts-0-mapping-0-step-output',
      title: 'Update Execution Steps XV',
      content: `
        This time you need to select 'Step' to specify that this artifact should
        go to an Execution Step.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'input-artifacts-0-mapping-0-step',
      title: 'Update Execution Steps XVI',
      content: `
        As a Step select the only Step that is available.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'input-artifacts-0-mapping-0-artifact',
      title: 'Update Execution Steps XVII',
      content: `
        As an Artifact select the only Artifact that is available.
      `,
      showNext: true,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
    },
    {
      targetId: 'input-artifacts-update',
      title: 'Update Execution Steps XVIII',
      content: `
        Now click on update to save your changes.
      `,
      showNext: false,
      showPrevious: true,
      modal: false,
      enterAction: async (): Promise<void> => this.navigateToUrl(['execution']),
      onClickAction: async (): Promise<void> =>
        this.tutorialManagerService.nextStep(),
    },
    {
      targetId: 'nav-development-method-overview',
      title: 'Update Execution Steps XIX',
      content: `
        Let's go back to the overview.
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
      targetId: 'development-method-overview-element-overview',
      title: 'End Method Building Block Tutorial',
      content: `
        Now, the Method Building Block should be correctly defined. This is indicated by no red
        edit buttons and the green message at the top of the page.
        You can additionally also specify involved Stakeholders or add links to explanations
        for this Method Building Block.
        Now, you know how to create Method Building Blocks.
         You can either restart the tutorial or close it.
      `,
      showNext: false,
      showPrevious: true,
      showRestart: true,
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
}
