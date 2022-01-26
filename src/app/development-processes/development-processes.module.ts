import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BmProcessComponent } from './bm-process/bm-process.component';
import { BmProcessDiagramComponent } from './bm-process-diagram/bm-process-diagram.component';
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

@NgModule({
  declarations: [
    BmProcessComponent,
    BmProcessDiagramComponent,
    BmProcessesComponent,
    DevelopmentMethodComponent,
    DevelopmentMethodsComponent,
    ProcessPatternComponent,
    ProcessPatternDiagramComponent,
    ProcessPatternTypesFormComponent,
    ProcessPatternsComponent,
    ConfirmLeaveModalComponent,
    SituationalFactorsComponent,
    SituationalFactorComponent,
    MethodElementListComponent,
    MethodElementFormComponent,
    ArtifactsComponent,
    ArtifactComponent,
    StakeholdersComponent,
    StakeholderComponent,
    ToolComponent,
    ToolsComponent,
    TypesComponent,
    TypeComponent,
    MethodElementSelectionFormComponent,
    MethodElementsSelectionFormComponent,
    TypesSelectionFormComponent,
    SituationalFactorsSelectionFormComponent,
    SituationalFactorSelectionFormComponent,
    ArtifactsSelectionFormComponent,
    StakeholdersSelectionFormComponent,
    ToolsSelectionFormComponent,
    ExamplesFormComponent,
    MethodInfoComponent,
    MethodElementGroupInfoComponent,
    MethodElementInfoComponent,
    ArtifactsGroupInfoComponent,
    StakeholdersGroupInfoComponent,
    SituationalFactorsOverviewComponent,
    PatternInfoComponent,
    DevelopmentMethodSelectionFormComponent,
    DevelopmentMethodsSelectionFormComponent,
    ProcessPatternSelectionFormComponent,
    ProcessPatternsSelectionFormComponent,
    DevelopmentMethodSummaryComponent,
    ToolsGroupInfoComponent,
    RunningProcessComponent,
    RunningProcessesComponent,
    RunningProcessSelectOutputArtifactsComponent,
    RunningProcessSelectInputArtifactsComponent,
    DevelopmentMethodSelectExecutionStepsComponent,
    DevelopmentMethodSelectExecutionStepComponent,
    DevelopmentMethodArtifactMappingComponent,
    DevelopmentMethodArtifactMappingsComponent,
    RunningProcessMethodComponent,
    ConfigurationFormPlaceholderDirective,
    MethodInfoStepComponent,
    MethodInfoStepsComponent,
    DomainComponent,
    DomainsComponent,
    SituationalFactorFormComponent,
    ArtifactDefinitionFormComponent,
    MethodElementsComponent,
    ConcreteArtifactsComponent,
    ConcreteArtifactComponent,
    RunningProcessArtifactExportFormComponent,
    ConcreteArtifactFormComponent,
    RunningProcessArtifactImportFormComponent,
    RunningProcessArtifactRenameFormComponent,
    MultiplePipe,
    ListPipe,
    RunningProcessSelectOutputArtifactComponent,
    DevelopmentMethodIncompleteModalComponent,
    DevelopmentMethodFormComponent,
    ProcessPatternFormComponent,
  ],
  imports: [DevelopmentProcessesRoutingModule, SharedModule, QuillModule],
})
export class DevelopmentProcessesModule {}
