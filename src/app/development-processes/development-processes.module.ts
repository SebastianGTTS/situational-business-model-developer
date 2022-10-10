import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BmProcessComponent } from './bm-process/bm-process.component';
import { BmProcessEditDiagramComponent } from './bm-process-edit-diagram/bm-process-edit-diagram.component';
import { BmProcessesComponent } from './bm-processes/bm-processes.component';
import { DevelopmentMethodComponent } from './development-method/development-method.component';
import { DevelopmentMethodsComponent } from './development-methods/development-methods.component';
import { DevelopmentProcessesRoutingModule } from './development-processes-routing.module';
import { ProcessPatternComponent } from './process-pattern/process-pattern.component';
import { ProcessPatternDiagramComponent } from './process-pattern-diagram/process-pattern-diagram.component';
import { ProcessPatternTypesFormComponent } from './process-pattern-types-form/process-pattern-types-form.component';
import { ProcessPatternsComponent } from './process-patterns/process-patterns.component';
import { ConfirmLeaveModalComponent } from './confirm-leave-modal/confirm-leave-modal.component';
import { SituationalFactorsComponent } from './situational-factors/situational-factors.component';
import { SituationalFactorComponent } from './situational-factor/situational-factor.component';
import { MethodElementListComponent } from './method-element-list/method-element-list.component';
import { MethodElementFormComponent } from './method-element-form/method-element-form.component';
import { ArtifactsComponent } from './artifacts/artifacts.component';
import { ArtifactComponent } from './artifact/artifact.component';
import { StakeholdersComponent } from './stakeholders/stakeholders.component';
import { StakeholderComponent } from './stakeholder/stakeholder.component';
import { ToolComponent } from './tool/tool.component';
import { ToolsComponent } from './tools/tools.component';
import { TypesComponent } from './types/types.component';
import { TypeComponent } from './type/type.component';
import { MethodElementSelectionFormComponent } from './method-element-selection-form/method-element-selection-form.component';
import { MethodElementsSelectionFormComponent } from './method-elements-selection-form/method-elements-selection-form.component';
import { TypesSelectionFormComponent } from './types-selection-form/types-selection-form.component';
import { SituationalFactorsSelectionFormComponent } from './situational-factors-selection-form/situational-factors-selection-form.component';
import { SituationalFactorSelectionFormComponent } from './situational-factor-selection-form/situational-factor-selection-form.component';
import { ArtifactsSelectionFormComponent } from './artifacts-selection-form/artifacts-selection-form.component';
import { StakeholdersSelectionFormComponent } from './stakeholders-selection-form/stakeholders-selection-form.component';
import { ToolsSelectionFormComponent } from './tools-selection-form/tools-selection-form.component';
import { ExamplesFormComponent } from './examples-form/examples-form.component';
import { MethodInfoComponent } from './method-info/method-info.component';
import { MethodElementGroupInfoComponent } from './method-element-group-info/method-element-group-info.component';
import { MethodElementInfoComponent } from './method-element-info/method-element-info.component';
import { ArtifactsGroupInfoComponent } from './artifacts-group-info/artifacts-group-info.component';
import { StakeholdersGroupInfoComponent } from './stakeholders-group-info/stakeholders-group-info.component';
import { SituationalFactorsOverviewComponent } from './situational-factors-overview/situational-factors-overview.component';
import { PatternInfoComponent } from './pattern-info/pattern-info.component';
import { DevelopmentMethodSelectionFormComponent } from './development-method-selection-form/development-method-selection-form.component';
import { DevelopmentMethodsSelectionFormComponent } from './development-methods-selection-form/development-methods-selection-form.component';
import { ProcessPatternSelectionFormComponent } from './process-pattern-selection-form/process-pattern-selection-form.component';
import { ProcessPatternsSelectionFormComponent } from './process-patterns-selection-form/process-patterns-selection-form.component';
import { DevelopmentMethodSummaryComponent } from './development-method-summary/development-method-summary.component';
import { ToolsGroupInfoComponent } from './tools-group-info/tools-group-info.component';
import { RunningProcessComponent } from './running-process/running-process.component';
import { RunningProcessesComponent } from './running-processes/running-processes.component';
import { RunningProcessSelectOutputArtifactsComponent } from './running-process-select-output-artifacts/running-process-select-output-artifacts.component';
import { RunningProcessSelectInputArtifactsComponent } from './running-process-select-input-artifacts/running-process-select-input-artifacts.component';
import { DevelopmentMethodSelectExecutionStepsComponent } from './development-method-select-execution-steps/development-method-select-execution-steps.component';
import { DevelopmentMethodSelectExecutionStepComponent } from './development-method-select-execution-step/development-method-select-execution-step.component';
import { DevelopmentMethodArtifactMappingComponent } from './development-method-artifact-mapping/development-method-artifact-mapping.component';
import { DevelopmentMethodArtifactMappingsComponent } from './development-method-artifact-mappings/development-method-artifact-mappings.component';
import { RunningProcessMethodComponent } from './running-process-method/running-process-method.component';
import { ConfigurationFormPlaceholderDirective } from './configuration-form-placeholder.directive';
import { MethodInfoStepComponent } from './method-info-step/method-info-step.component';
import { MethodInfoStepsComponent } from './method-info-steps/method-info-steps.component';
import { DomainComponent } from './domain/domain.component';
import { DomainsComponent } from './domains/domains.component';
import { SituationalFactorFormComponent } from './situational-factor-form/situational-factor-form.component';
import { ArtifactDefinitionFormComponent } from './artifact-definition-form/artifact-definition-form.component';
import { MethodElementsComponent } from './method-elements/method-elements.component';
import { ConcreteArtifactsComponent } from './concrete-artifacts/concrete-artifacts.component';
import { ConcreteArtifactComponent } from './concrete-artifact/concrete-artifact.component';
import { RunningProcessArtifactExportFormComponent } from './running-process-artifact-export-form/running-process-artifact-export-form.component';
import { ConcreteArtifactFormComponent } from './concrete-artifact-form/concrete-artifact-form.component';
import { RunningProcessArtifactImportFormComponent } from './running-process-artifact-import-form/running-process-artifact-import-form.component';
import { RunningProcessArtifactRenameFormComponent } from './running-process-artifact-rename-form/running-process-artifact-rename-form.component';
import { MultiplePipe } from './pipes/multiple.pipe';
import { ListPipe } from './pipes/list.pipe';
import { QuillModule } from 'ngx-quill';
import { RunningProcessSelectOutputArtifactComponent } from './running-process-select-output-artifact/running-process-select-output-artifact.component';
import { DevelopmentMethodIncompleteModalComponent } from './development-method-incomplete-modal/development-method-incomplete-modal.component';
import { DevelopmentMethodFormComponent } from './development-method-form/development-method-form.component';
import { ProcessPatternFormComponent } from './process-pattern-form/process-pattern-form.component';
import { OptionalPipe } from './pipes/optional.pipe';
import { ArtifactsMappingSelectionFormComponent } from './artifacts-mapping-selection-form/artifacts-mapping-selection-form.component';
import { GroupsFormComponent } from './groups-form/groups-form.component';
import { GroupFormComponent } from './group-form/group-form.component';
import { MethodElementInfoSelectionComponent } from './method-element-info-selection/method-element-info-selection.component';
import { RunningProcessesContextListComponent } from './running-processes-context-list/running-processes-context-list.component';
import { RunningProcessContextComponent } from './running-process-context/running-process-context.component';
import { RunningProcessContextRunComponent } from './running-process-context-run/running-process-context-run.component';
import { RunningProcessContextEditComponent } from './running-process-context-edit/running-process-context-edit.component';
import { RunningProcessArtifactsComponent } from './running-process-artifacts/running-process-artifacts.component';
import { RunningProcessArtifactAddFormComponent } from './running-process-artifact-add-form/running-process-artifact-add-form.component';
import { ConcreteArtifactShowVersionModalComponent } from './concrete-artifact-show-version-modal/concrete-artifact-show-version-modal.component';
import { DevelopmentMethodEmptyExecutionStepComponent } from './development-method-empty-execution-step/development-method-empty-execution-step.component';
import { ContextEditComponent } from './context-edit/context-edit.component';
import { SearchFilterTypeComponent } from './search-filter-type/search-filter-type.component';
import { RunningProcessMethodExecutionStepsComponent } from './running-process-method-execution-steps/running-process-method-execution-steps.component';
import { RunningProcessContextChangeModalComponent } from './running-process-context-change-modal/running-process-context-change-modal.component';
import { RunningProcessContextViewComponent } from './running-process-context-view/running-process-context-view.component';
import { BmProcessModelerComponent } from './bm-process-modeler/bm-process-modeler.component';
import { RunningProcessContextFinishComponent } from './running-process-context-finish/running-process-context-finish.component';
import { SituationalFactorsListComponent } from './situational-factors-list/situational-factors-list.component';
import { DomainsListComponent } from './domains-list/domains-list.component';
import { RunningProcessContextEditSelectDecisionModalComponent } from './running-process-context-edit-select-decision-modal/running-process-context-edit-select-decision-modal.component';
import { RunningProcessContextFakeExecuteModalComponent } from './running-process-context-fake-execute-modal/running-process-context-fake-execute-modal.component';
import { ProcessPatternIncompleteModalComponent } from './process-pattern-incomplete-modal/process-pattern-incomplete-modal.component';

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
    BmProcessesComponent,
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
    DevelopmentMethodFormComponent,
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
    ProcessPatternFormComponent,
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
    RunningProcessContextEditComponent,
    RunningProcessContextEditSelectDecisionModalComponent,
    RunningProcessContextFakeExecuteModalComponent,
    RunningProcessContextFinishComponent,
    RunningProcessContextRunComponent,
    RunningProcessContextViewComponent,
    RunningProcessMethodComponent,
    RunningProcessMethodExecutionStepsComponent,
    RunningProcessSelectInputArtifactsComponent,
    RunningProcessSelectOutputArtifactComponent,
    RunningProcessSelectOutputArtifactsComponent,
    RunningProcessesComponent,
    RunningProcessesContextListComponent,
    SearchFilterTypeComponent,
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
  ],
  imports: [DevelopmentProcessesRoutingModule, SharedModule, QuillModule],
})
export class DevelopmentProcessesModule {}
