import { APP_INITIALIZER, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BmProcessComponent } from './bm-process/bm-process/bm-process.component';
import { BmProcessEditDiagramComponent } from './bm-process/bm-process-edit-diagram/bm-process-edit-diagram.component';
import { DevelopmentMethodComponent } from './development-method/development-method/development-method.component';
import { DevelopmentMethodsComponent } from './development-method/development-methods/development-methods.component';
import { DevelopmentProcessesRoutingModule } from './development-processes-routing.module';
import { ProcessPatternComponent } from './process-pattern/process-pattern/process-pattern.component';
import { ProcessPatternDiagramComponent } from './process-pattern/process-pattern-diagram/process-pattern-diagram.component';
import { ProcessPatternTypesFormComponent } from './process-pattern/process-pattern-types-form/process-pattern-types-form.component';
import { ProcessPatternsComponent } from './process-pattern/process-patterns/process-patterns.component';
import { ConfirmLeaveModalComponent } from './confirm-leave-modal/confirm-leave-modal.component';
import { SituationalFactorsComponent } from './method-elements/situational-factors/situational-factors/situational-factors.component';
import { SituationalFactorComponent } from './method-elements/situational-factors/situational-factor/situational-factor.component';
import { MethodElementListComponent } from './method-elements/method-element-list/method-element-list.component';
import { MethodElementFormComponent } from './method-elements/method-element-form/method-element-form.component';
import { ArtifactsComponent } from './method-elements/artifacts/artifacts/artifacts.component';
import { ArtifactComponent } from './method-elements/artifacts/artifact/artifact.component';
import { StakeholdersComponent } from './method-elements/stakeholders/stakeholders/stakeholders.component';
import { StakeholderComponent } from './method-elements/stakeholders/stakeholder/stakeholder.component';
import { ToolComponent } from './method-elements/tools/tool/tool.component';
import { ToolsComponent } from './method-elements/tools/tools/tools.component';
import { TypesComponent } from './method-elements/types/types/types.component';
import { TypeComponent } from './method-elements/types/type/type.component';
import { MethodElementSelectionFormComponent } from './development-method/method-element-selection-form/method-element-selection-form.component';
import { MethodElementsSelectionFormComponent } from './development-method/method-elements-selection-form/method-elements-selection-form.component';
import { TypesSelectionFormComponent } from './development-method/types-selection-form/types-selection-form.component';
import { SituationalFactorsSelectionFormComponent } from './development-method/situational-factors-selection-form/situational-factors-selection-form.component';
import { SituationalFactorSelectionFormComponent } from './development-method/situational-factor-selection-form/situational-factor-selection-form.component';
import { ArtifactsSelectionFormComponent } from './development-method/artifacts-selection-form/artifacts-selection-form.component';
import { StakeholdersSelectionFormComponent } from './development-method/stakeholders-selection-form/stakeholders-selection-form.component';
import { ToolsSelectionFormComponent } from './development-method/tools-selection-form/tools-selection-form.component';
import { ExamplesFormComponent } from './development-method/examples-form/examples-form.component';
import { MethodInfoComponent } from './bm-process/method-info/method-info.component';
import { MethodElementGroupInfoComponent } from './method-elements/method-element-group-info/method-element-group-info.component';
import { MethodElementInfoComponent } from './method-elements/method-element-info/method-element-info.component';
import { ArtifactsGroupInfoComponent } from './method-elements/artifacts/artifacts-group-info/artifacts-group-info.component';
import { StakeholdersGroupInfoComponent } from './method-elements/stakeholders/stakeholders-group-info/stakeholders-group-info.component';
import { SituationalFactorsOverviewComponent } from './method-elements/situational-factors/situational-factors-overview/situational-factors-overview.component';
import { PatternInfoComponent } from './process-pattern/pattern-info/pattern-info.component';
import { DevelopmentMethodSelectionFormComponent } from './development-method/development-method-selection-form/development-method-selection-form.component';
import { DevelopmentMethodsSelectionFormComponent } from './development-method/development-methods-selection-form/development-methods-selection-form.component';
import { ProcessPatternSelectionFormComponent } from './process-pattern/process-pattern-selection-form/process-pattern-selection-form.component';
import { ProcessPatternsSelectionFormComponent } from './process-pattern/process-patterns-selection-form/process-patterns-selection-form.component';
import { DevelopmentMethodSummaryComponent } from './development-method/development-method-summary/development-method-summary.component';
import { ToolsGroupInfoComponent } from './method-elements/tools/tools-group-info/tools-group-info.component';
import { RunningProcessComponent } from './running-process/running-process/running-process.component';
import { RunningProcessesComponent } from './running-process/running-processes/running-processes.component';
import { RunningProcessSelectOutputArtifactsComponent } from './running-process/running-process-select-output-artifacts/running-process-select-output-artifacts.component';
import { RunningProcessSelectInputArtifactsComponent } from './running-process/running-process-select-input-artifacts/running-process-select-input-artifacts.component';
import { DevelopmentMethodSelectExecutionStepsComponent } from './development-method/development-method-select-execution-steps/development-method-select-execution-steps.component';
import { DevelopmentMethodSelectExecutionStepComponent } from './development-method/development-method-select-execution-step/development-method-select-execution-step.component';
import { DevelopmentMethodArtifactMappingComponent } from './development-method/development-method-artifact-mapping/development-method-artifact-mapping.component';
import { DevelopmentMethodArtifactMappingsComponent } from './development-method/development-method-artifact-mappings/development-method-artifact-mappings.component';
import { RunningProcessMethodComponent } from './running-process/running-process-method/running-process-method.component';
import { ConfigurationFormPlaceholderDirective } from './configuration-form-placeholder.directive';
import { MethodInfoStepComponent } from './bm-process/method-info-step/method-info-step.component';
import { MethodInfoStepsComponent } from './bm-process/method-info-steps/method-info-steps.component';
import { DomainComponent } from './method-elements/domains/domain/domain.component';
import { DomainsComponent } from './method-elements/domains/domains/domains.component';
import { SituationalFactorFormComponent } from './method-elements/situational-factors/situational-factor-form/situational-factor-form.component';
import { ArtifactDefinitionFormComponent } from './method-elements/artifacts/artifact-definition-form/artifact-definition-form.component';
import { MethodElementsComponent } from './method-elements/method-elements/method-elements.component';
import { ConcreteArtifactsComponent } from './concrete-artifact/concrete-artifacts/concrete-artifacts.component';
import { ConcreteArtifactComponent } from './concrete-artifact/concrete-artifact/concrete-artifact.component';
import { RunningProcessArtifactExportFormComponent } from './running-process/running-process-artifact-export-form/running-process-artifact-export-form.component';
import { ConcreteArtifactFormComponent } from './concrete-artifact/concrete-artifact-form/concrete-artifact-form.component';
import { RunningProcessArtifactImportFormComponent } from './running-process/running-process-artifact-import-form/running-process-artifact-import-form.component';
import { RunningProcessArtifactRenameFormComponent } from './running-process/running-process-artifact-rename-form/running-process-artifact-rename-form.component';
import { MultiplePipe } from './pipes/multiple.pipe';
import { ListPipe } from './pipes/list.pipe';
import { QuillModule } from 'ngx-quill';
import { RunningProcessSelectOutputArtifactComponent } from './running-process/running-process-select-output-artifact/running-process-select-output-artifact.component';
import { DevelopmentMethodIncompleteModalComponent } from './development-method/development-method-incomplete-modal/development-method-incomplete-modal.component';
import { OptionalPipe } from './pipes/optional.pipe';
import { ArtifactsMappingSelectionFormComponent } from './development-method/artifacts-mapping-selection-form/artifacts-mapping-selection-form.component';
import { GroupsFormComponent } from './development-method/groups-form/groups-form.component';
import { GroupFormComponent } from './development-method/group-form/group-form.component';
import { MethodElementInfoSelectionComponent } from './method-elements/method-element-info-selection/method-element-info-selection.component';
import { RunningProcessesContextListComponent } from './context/running-processes-context-list/running-processes-context-list.component';
import { RunningProcessContextComponent } from './context/running-process-context/running-process-context.component';
import { RunningProcessArtifactsComponent } from './running-process/running-process-artifacts/running-process-artifacts.component';
import { RunningProcessArtifactAddFormComponent } from './running-process/running-process-artifact-add-form/running-process-artifact-add-form.component';
import { ConcreteArtifactShowVersionModalComponent } from './concrete-artifact/concrete-artifact-show-version-modal/concrete-artifact-show-version-modal.component';
import { DevelopmentMethodEmptyExecutionStepComponent } from './development-method/development-method-empty-execution-step/development-method-empty-execution-step.component';
import { ContextEditComponent } from './context/context-edit/context-edit.component';
import { RunningProcessMethodExecutionStepsComponent } from './running-process/running-process-method-execution-steps/running-process-method-execution-steps.component';
import { RunningProcessContextChangeModalComponent } from './context/running-process-context-change-modal/running-process-context-change-modal.component';
import { RunningProcessContextViewComponent } from './context/running-process-context-view/running-process-context-view.component';
import { BmProcessModelerComponent } from './bm-process/bm-process-modeler/bm-process-modeler.component';
import { RunningProcessContextFinishComponent } from './context/running-process-context-finish/running-process-context-finish.component';
import { SituationalFactorsListComponent } from './method-elements/situational-factors/situational-factors-list/situational-factors-list.component';
import { DomainsListComponent } from './method-elements/domains/domains-list/domains-list.component';
import { RunningProcessContextEditSelectDecisionModalComponent } from './context/running-process-context-edit-select-decision-modal/running-process-context-edit-select-decision-modal.component';
import { RunningProcessContextFakeExecuteModalComponent } from './context/running-process-context-fake-execute-modal/running-process-context-fake-execute-modal.component';
import { ProcessPatternIncompleteModalComponent } from './process-pattern/process-pattern-incomplete-modal/process-pattern-incomplete-modal.component';
import { PhaseListComponent } from './method-elements/phases/phase-list/phase-list.component';
import { PhaseComponent } from './method-elements/phases/phase/phase.component';
import { PhaseFormComponent } from './method-elements/phases/phase-form/phase-form.component';
import { PhasesSelectionFormComponent } from './development-method/phases-selection-form/phases-selection-form.component';
import { PhaseSelectionFormComponent } from './development-method/phase-selection-form/phase-selection-form.component';
import { BmProcessInitComponent } from './bm-process/bm-process-init/bm-process-init.component';
import { BmPatternProcessComponent } from './bm-process/bm-pattern-process/bm-pattern-process.component';
import { BmPhaseProcessComponent } from './bm-process/bm-phase-process/bm-phase-process.component';
import { BmPhaseProcessBoardComponent } from './bm-process/bm-phase-process-board/bm-phase-process-board.component';
import { BmPhaseProcessBoardColumnComponent } from './bm-process/bm-phase-process-board-column/bm-phase-process-board-column.component';
import { BmPhaseProcessPhasesComponent } from './bm-process/bm-phase-process-phases/bm-phase-process-phases.component';
import { BmPhaseProcessBoardNumberFormComponent } from './bm-process/bm-phase-process-board-number-form/bm-phase-process-board-number-form.component';
import { PhaseRunningProcessBoardComponent } from './running-process/phase-running-process-board/phase-running-process-board.component';
import { PhaseRunningProcessBoardColumnComponent } from './running-process/phase-running-process-board-column/phase-running-process-board-column.component';
import { BmPhaseProcessEditComponent } from './bm-process/bm-phase-process-edit/bm-phase-process-edit.component';
import { RunningPatternProcessComponent } from './running-process/running-pattern-process/running-pattern-process.component';
import { RunningPhaseProcessComponent } from './running-process/running-phase-process/running-phase-process.component';
import { DevelopmentMethodSummaryModalComponent } from './development-method/development-method-summary-modal/development-method-summary-modal.component';
import { RunningLightProcessComponent } from './running-process/running-light-process/running-light-process.component';
import { RunningProcessBaseComponent } from './running-process/running-process-base/running-process-base.component';
import { RunningPatternProcessContextEditComponent } from './context/running-pattern-process-context-edit/running-pattern-process-context-edit.component';
import { RunningPhaseProcessContextEditComponent } from './context/running-phase-process-context-edit/running-phase-process-context-edit.component';
import { RunningProcessContextEditBaseComponent } from './context/running-process-context-edit-base/running-process-context-edit-base.component';
import { RunningPhaseProcessContextRunComponent } from './context/running-phase-process-context-run/running-phase-process-context-run.component';
import { RunningPatternProcessContextRunComponent } from './context/running-pattern-process-context-run/running-pattern-process-context-run.component';
import { RunningProcessContextRunBaseComponent } from './context/running-process-context-run-base/running-process-context-run-base.component';
import { RunningPhaseProcessContextComponent } from './context/running-phase-process-context/running-phase-process-context.component';
import { RunningPatternProcessContextComponent } from './context/running-pattern-process-context/running-pattern-process-context.component';
import { DevelopmentMethodOverviewComponent } from './development-method/development-method-overview/development-method-overview.component';
import { DevelopmentMethodGeneralComponent } from './development-method/development-method-general/development-method-general.component';
import { DevelopmentMethodExecutionComponent } from './development-method/development-method-execution/development-method-execution.component';
import { DevelopmentMethodSelectionComponent } from './development-method/development-method-selection/development-method-selection.component';
import { DevelopmentMethodOverviewGroupComponent } from './development-method/development-method-overview-group/development-method-overview-group.component';
import { DevelopmentMethodOverviewExecutionStepsComponent } from './development-method/development-method-overview-execution-steps/development-method-overview-execution-steps.component';
import { ProcessPatternOverviewComponent } from './process-pattern/process-pattern-overview/process-pattern-overview.component';
import { ProcessPatternGeneralComponent } from './process-pattern/process-pattern-general/process-pattern-general.component';
import { ProcessPatternSelectionComponent } from './process-pattern/process-pattern-selection/process-pattern-selection.component';
import { ProcessPatternPatternComponent } from './process-pattern/process-pattern-pattern/process-pattern-pattern.component';
import { ProcessPatternOverviewPatternComponent } from './process-pattern/process-pattern-overview-pattern/process-pattern-overview-pattern.component';
import { MethodElementCreateFormComponent } from './method-elements/method-element-create-form/method-element-create-form.component';
import { BmPatternProcessOverviewComponent } from './bm-process/bm-pattern-process-overview/bm-pattern-process-overview.component';
import { BmProcessContextComponent } from './bm-process/bm-process-context/bm-process-context.component';
import { BmProcessGeneralComponent } from './bm-process/bm-process-general/bm-process-general.component';
import { BmPatternProcessMethodComponent } from './bm-process/bm-pattern-process-method/bm-pattern-process-method.component';
import { BmPatternProcessOverviewMethodComponent } from './bm-process/bm-pattern-process-overview-method/bm-pattern-process-overview-method.component';
import { BmPhaseProcessOverviewComponent } from './bm-process/bm-phase-process-overview/bm-phase-process-overview.component';
import { BmPhaseProcessMethodComponent } from './bm-process/bm-phase-process-method/bm-phase-process-method.component';
import { RunningFullProcessContextComponent } from './running-process/running-full-process-context/running-full-process-context.component';
import { RunningProcessGeneralComponent } from './running-process/running-process-general/running-process-general.component';
import { RunningPatternProcessExecutionComponent } from './running-process/running-pattern-process-execution/running-pattern-process-execution.component';
import { RunningProcessArtifactComponent } from './running-process/running-process-artifact/running-process-artifact.component';
import { RunningPatternProcessOverviewComponent } from './running-process/running-pattern-process-overview/running-pattern-process-overview.component';
import { RunningPhaseProcessExecutionComponent } from './running-process/running-phase-process-execution/running-phase-process-execution.component';
import { RunningPhaseProcessOverviewComponent } from './running-process/running-phase-process-overview/running-phase-process-overview.component';
import { RunningLightProcessOverviewComponent } from './running-process/running-light-process-overview/running-light-process-overview.component';
import { RunningLightProcessExecutionComponent } from './running-process/running-light-process-execution/running-light-process-execution.component';
import { RunningLightProcessContextComponent } from './running-process/running-light-process-context/running-light-process-context.component';
import { ContextOverviewComponent } from './context-overview/context-overview.component';
import { RunningProcessOverviewArtifactsComponent } from './running-process/running-process-overview-artifacts/running-process-overview-artifacts.component';
import { PhaseFilterComponent } from './method-elements/phases/phase-filter/phase-filter.component';
import { TypeFilterComponent } from './method-elements/types/type-filter/type-filter.component';
import { DevelopmentProcessesStatsService } from './shared/development-processes-stats.service';
import { BmProcessesSelectionComponent } from './bm-process/bm-processes-selection/bm-processes-selection.component';
import { BmProcessesSelectionModalComponent } from './bm-process/bm-processes-selection-modal/bm-processes-selection-modal.component';
import { BmProcessErrorModalComponent } from './bm-process/bm-process-error-modal/bm-process-error-modal.component';
import { BmPhaseProcessesComponent } from './bm-process/bm-phase-processes/bm-phase-processes.component';
import { BmPatternProcessesComponent } from './bm-process/bm-pattern-processes/bm-pattern-processes.component';
import { RunningPhaseProcessesContextListComponent } from './context/running-phase-processes-context-list/running-phase-processes-context-list.component';
import { RunningPatternProcessesContextListComponent } from './context/running-pattern-processes-context-list/running-pattern-processes-context-list.component';
import { RunningProcessFinishModalComponent } from './running-process/running-process-finish-modal/running-process-finish-modal.component';
import { RunningCompletedProcessesComponent } from './running-process/running-completed-processes/running-completed-processes.component';
import { RunningProcessAskFinishModalComponent } from './running-process/running-process-ask-finish-modal/running-process-ask-finish-modal.component';
import { DevelopmentMethodTutorialStartService } from './development-method/development-method/development-method-tutorial-start.service';
import { ProcessPatternTutorialStartService } from './process-pattern/process-pattern/process-pattern-tutorial-start.service';
import { BmPhaseProcessTutorialStartService } from './bm-process/bm-phase-process/bm-phase-process-tutorial-start.service';
import { BmPatternProcessTutorialStartService } from './bm-process/bm-pattern-process/bm-pattern-process-tutorial-start.service';
import { RunningLightProcessTutorialStartService } from './running-process/running-light-process/running-light-process-tutorial-start.service';
import { RunningPhaseProcessTutorialStartService } from './running-process/running-phase-process/running-phase-process-tutorial-start.service';
import { RunningPatternProcessTutorialStartService } from './running-process/running-pattern-process/running-pattern-process-tutorial-start.service';

@NgModule({
  declarations: [
    ArtifactComponent,
    ArtifactDefinitionFormComponent,
    ArtifactsComponent,
    ArtifactsGroupInfoComponent,
    ArtifactsMappingSelectionFormComponent,
    ArtifactsSelectionFormComponent,
    BmProcessComponent,
    BmProcessEditDiagramComponent,
    BmProcessModelerComponent,
    ConcreteArtifactComponent,
    ConcreteArtifactFormComponent,
    ConcreteArtifactShowVersionModalComponent,
    ConcreteArtifactsComponent,
    ConfigurationFormPlaceholderDirective,
    ConfirmLeaveModalComponent,
    ContextEditComponent,
    DevelopmentMethodArtifactMappingComponent,
    DevelopmentMethodArtifactMappingsComponent,
    DevelopmentMethodComponent,
    DevelopmentMethodEmptyExecutionStepComponent,
    DevelopmentMethodIncompleteModalComponent,
    DevelopmentMethodSelectExecutionStepComponent,
    DevelopmentMethodSelectExecutionStepsComponent,
    DevelopmentMethodSelectionFormComponent,
    DevelopmentMethodSummaryComponent,
    DevelopmentMethodsComponent,
    DevelopmentMethodsSelectionFormComponent,
    DomainComponent,
    DomainsComponent,
    DomainsListComponent,
    ExamplesFormComponent,
    GroupFormComponent,
    GroupsFormComponent,
    ListPipe,
    MethodElementFormComponent,
    MethodElementGroupInfoComponent,
    MethodElementInfoComponent,
    MethodElementInfoSelectionComponent,
    MethodElementListComponent,
    MethodElementSelectionFormComponent,
    MethodElementsComponent,
    MethodElementsSelectionFormComponent,
    MethodInfoComponent,
    MethodInfoStepComponent,
    MethodInfoStepsComponent,
    MultiplePipe,
    OptionalPipe,
    PatternInfoComponent,
    ProcessPatternComponent,
    ProcessPatternDiagramComponent,
    ProcessPatternSelectionFormComponent,
    ProcessPatternTypesFormComponent,
    ProcessPatternsComponent,
    ProcessPatternsSelectionFormComponent,
    RunningProcessArtifactAddFormComponent,
    RunningProcessArtifactExportFormComponent,
    RunningProcessArtifactImportFormComponent,
    RunningProcessArtifactRenameFormComponent,
    RunningProcessArtifactsComponent,
    RunningProcessComponent,
    RunningProcessContextChangeModalComponent,
    RunningProcessContextComponent,
    RunningProcessContextEditSelectDecisionModalComponent,
    RunningProcessContextFakeExecuteModalComponent,
    RunningProcessContextFinishComponent,
    RunningProcessContextViewComponent,
    RunningProcessMethodComponent,
    RunningProcessMethodExecutionStepsComponent,
    RunningProcessSelectInputArtifactsComponent,
    RunningProcessSelectOutputArtifactComponent,
    RunningProcessSelectOutputArtifactsComponent,
    RunningProcessesComponent,
    RunningProcessesContextListComponent,
    SituationalFactorComponent,
    SituationalFactorFormComponent,
    SituationalFactorSelectionFormComponent,
    SituationalFactorsComponent,
    SituationalFactorsListComponent,
    SituationalFactorsOverviewComponent,
    SituationalFactorsSelectionFormComponent,
    StakeholderComponent,
    StakeholdersComponent,
    StakeholdersGroupInfoComponent,
    StakeholdersSelectionFormComponent,
    ToolComponent,
    ToolsComponent,
    ToolsGroupInfoComponent,
    ToolsSelectionFormComponent,
    TypeComponent,
    TypesComponent,
    TypesSelectionFormComponent,
    ProcessPatternIncompleteModalComponent,
    PhaseListComponent,
    PhaseComponent,
    PhaseFormComponent,
    PhasesSelectionFormComponent,
    PhaseSelectionFormComponent,
    BmProcessInitComponent,
    BmPatternProcessComponent,
    BmPhaseProcessComponent,
    BmPhaseProcessBoardComponent,
    BmPhaseProcessBoardColumnComponent,
    BmPhaseProcessPhasesComponent,
    BmPhaseProcessBoardNumberFormComponent,
    PhaseRunningProcessBoardComponent,
    PhaseRunningProcessBoardColumnComponent,
    BmPhaseProcessEditComponent,
    RunningPatternProcessComponent,
    RunningPhaseProcessComponent,
    DevelopmentMethodSummaryModalComponent,
    RunningLightProcessComponent,
    RunningProcessBaseComponent,
    RunningPatternProcessContextEditComponent,
    RunningPhaseProcessContextEditComponent,
    RunningProcessContextEditBaseComponent,
    RunningPhaseProcessContextRunComponent,
    RunningPatternProcessContextRunComponent,
    RunningProcessContextRunBaseComponent,
    RunningPhaseProcessContextComponent,
    RunningPatternProcessContextComponent,
    DevelopmentMethodOverviewComponent,
    DevelopmentMethodGeneralComponent,
    DevelopmentMethodExecutionComponent,
    DevelopmentMethodSelectionComponent,
    DevelopmentMethodOverviewGroupComponent,
    DevelopmentMethodOverviewExecutionStepsComponent,
    ProcessPatternOverviewComponent,
    ProcessPatternGeneralComponent,
    ProcessPatternSelectionComponent,
    ProcessPatternPatternComponent,
    ProcessPatternOverviewPatternComponent,
    MethodElementCreateFormComponent,
    BmPatternProcessOverviewComponent,
    BmProcessContextComponent,
    BmProcessGeneralComponent,
    BmPatternProcessMethodComponent,
    BmPatternProcessOverviewMethodComponent,
    BmPhaseProcessOverviewComponent,
    BmPhaseProcessMethodComponent,
    RunningFullProcessContextComponent,
    RunningProcessGeneralComponent,
    RunningPatternProcessExecutionComponent,
    RunningProcessArtifactComponent,
    RunningPatternProcessOverviewComponent,
    RunningPhaseProcessExecutionComponent,
    RunningPhaseProcessOverviewComponent,
    RunningLightProcessOverviewComponent,
    RunningLightProcessExecutionComponent,
    RunningLightProcessContextComponent,
    ContextOverviewComponent,
    RunningProcessOverviewArtifactsComponent,
    PhaseFilterComponent,
    TypeFilterComponent,
    BmProcessesSelectionComponent,
    BmProcessesSelectionModalComponent,
    BmProcessErrorModalComponent,
    BmPhaseProcessesComponent,
    BmPatternProcessesComponent,
    RunningPhaseProcessesContextListComponent,
    RunningPatternProcessesContextListComponent,
    RunningProcessFinishModalComponent,
    RunningCompletedProcessesComponent,
    RunningProcessAskFinishModalComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory:
        (developmentProcessesStatsService: DevelopmentProcessesStatsService) =>
        (): void =>
          developmentProcessesStatsService.init(),
      deps: [DevelopmentProcessesStatsService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (
          developmentMethodTutorialStartService: DevelopmentMethodTutorialStartService
        ) =>
        (): void =>
          developmentMethodTutorialStartService.registerTutorial(),
      deps: [DevelopmentMethodTutorialStartService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (
          processPatternTutorialStartService: ProcessPatternTutorialStartService
        ) =>
        (): void =>
          processPatternTutorialStartService.registerTutorial(),
      deps: [ProcessPatternTutorialStartService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (
          bmPhaseProcessTutorialStartService: BmPhaseProcessTutorialStartService
        ) =>
        (): void =>
          bmPhaseProcessTutorialStartService.registerTutorial(),
      deps: [BmPhaseProcessTutorialStartService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (
          bmPatternProcessTutorialStartService: BmPatternProcessTutorialStartService
        ) =>
        (): void =>
          bmPatternProcessTutorialStartService.registerTutorial(),
      deps: [BmPatternProcessTutorialStartService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (
          runningLightProcessTutorialStartService: RunningLightProcessTutorialStartService
        ) =>
        (): void =>
          runningLightProcessTutorialStartService.registerTutorial(),
      deps: [RunningLightProcessTutorialStartService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (
          runningPhaseProcessTutorialStartService: RunningPhaseProcessTutorialStartService
        ) =>
        (): void =>
          runningPhaseProcessTutorialStartService.registerTutorial(),
      deps: [RunningPhaseProcessTutorialStartService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (
          runningPatternProcessTutorialStartService: RunningPatternProcessTutorialStartService
        ) =>
        (): void =>
          runningPatternProcessTutorialStartService.registerTutorial(),
      deps: [RunningPatternProcessTutorialStartService],
      multi: true,
    },
  ],
  imports: [DevelopmentProcessesRoutingModule, SharedModule, QuillModule],
})
export class DevelopmentProcessesModule {}
