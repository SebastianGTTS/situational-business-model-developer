import { APP_INITIALIZER, NgModule } from '@angular/core';

import { CanvasToolRoutingModule } from './canvas-tool-routing.module';
import { CanvasToolService } from './canvas-tool.service';
import { FeatureModelSubformComponent } from './feature-model/feature-model-subform/feature-model-subform.component';
import { SharedModule } from '../../../shared/shared.module';
import { FeatureModelInstanceSubformComponent } from './instances/feature-model-instance-subform/feature-model-instance-subform.component';
import { MergeIntoTreeComponent } from './merge/merge-into-tree/merge-into-tree.component';
import { MergeModelViewComponent } from './merge/merge-model-view/merge-model-view.component';
import { MergeTreeComponent } from './merge/merge-tree/merge-tree.component';
import { TraceModalComponent } from './merge/trace-modal/trace-modal.component';
import { CrossTreeRelationshipFormComponent } from './relationships/cross-tree-relationship-form/cross-tree-relationship-form.component';
import { CrossTreeRelationshipModalComponent } from './relationships/cross-tree-relationship-modal/cross-tree-relationship-modal.component';
import { DeleteFeatureConfirmComponent } from './feature-model/delete-feature-confirm/delete-feature-confirm.component';
import { FeatureFormComponent } from './feature-model/feature-form/feature-form.component';
import { FeatureModelComponent } from './feature-model/feature-model/feature-model.component';
import { FeatureBuildingBlockComponent } from './feature-model/feature-building-block/feature-building-block.component';
import { ExpertModelComponent } from './expert-model/expert-model/expert-model.component';
import { ExpertModelsComponent } from './expert-model/expert-models/expert-models.component';
import { ModelImportViewComponent } from './feature-model/model-import-view/model-import-view.component';
import { ExpertModelEditComponent } from './expert-model/expert-model-edit/expert-model-edit.component';
import { FeatureModelEditComponent } from './feature-model/feature-model-edit/feature-model-edit.component';
import { FeatureTreeComponent } from './feature-model/feature-tree/feature-tree.component';
import { FeatureModelFormComponent } from './feature-model/feature-model-form/feature-model-form.component';
import { InstanceListComponent } from './instances/instance-list/instance-list.component';
import { InstanceComponent } from './instances/instance/instance.component';
import { PatternComponent } from './instances/pattern/pattern.component';
import { AddDecisionModalComponent } from './instances/add-decision-modal/add-decision-modal.component';
import { CanvasBuildingBlockComponent } from './instances/canvas-building-block/canvas-building-block.component';
import { ExampleComponent } from './instances/example/example.component';
import { CompanyModelEditComponent } from './company-model/company-model-edit/company-model-edit.component';
import { CompanyModelsComponent } from './company-model/company-models/company-models.component';
import { CompanyModelComponent } from './company-model/company-model/company-model.component';
import { CreateCanvasConfigurationComponent } from './api/create-canvas-configuration/create-canvas-configuration.component';
import { CreateCanvasComponent } from './api/create-canvas/create-canvas.component';
import { EditCanvasComponent } from './api/edit-canvas/edit-canvas.component';
import { CanvasDefinitionsComponent } from './canvas-definition/canvas-definitions/canvas-definitions.component';
import { CanvasDefinitionComponent } from './canvas-definition/canvas-definition/canvas-definition.component';
import { CanvasComponent } from './instances/canvas/canvas.component';
import { SelectCanvasDefinitionConfigurationComponent } from './api/select-canvas-definition-configuration/select-canvas-definition-configuration.component';
import { CompanyModelSelectExpertKnowledgeComponent } from './company-model/company-model-select-expert-knowledge/company-model-select-expert-knowledge.component';
import { CompareComponent } from './api/compare/compare.component';
import { InstanceCompareFormComponent } from './instances/instance-compare-form/instance-compare-form.component';
import { CreateCompetitorCanvasComponent } from './api/create-competitor-canvas/create-competitor-canvas.component';
import { EditCompetitorCanvasComponent } from './api/edit-competitor-canvas/edit-competitor-canvas.component';
import { EditCompetitorsComponent } from './api/edit-competitors/edit-competitors.component';
import { RefineCanvasComponent } from './api/refine-canvas/refine-canvas.component';
import { InstanceSelectPatternFormComponent } from './instances/instance-select-pattern-form/instance-select-pattern-form.component';
import { ViewCanvasComponent } from './api/view-canvas/view-canvas.component';
import { EditModelComponent } from './api/edit-model/edit-model.component';
import { CanvasDefinitionRowFormComponent } from './canvas-definition/canvas-definition-row-form/canvas-definition-row-form.component';
import { CanvasDefinitionRelationshipsFormComponent } from './canvas-definition/canvas-definition-relationships-form/canvas-definition-relationships-form.component';
import { CanvasElementsComponent } from './elements/canvas-elements/canvas-elements.component';
import { CanvasDefinitionModelOverviewComponent } from './canvas-definition/canvas-definition-model-overview/canvas-definition-model-overview.component';
import { PatternDescriptionModalComponent } from './instances/pattern-description-modal/pattern-description-modal.component';
import { PatternViewComponent } from './instances/pattern-view/pattern-view.component';
import { PatternHintComponent } from './instances/pattern-hint/pattern-hint.component';
import { CreateCanvasManuallyComponent } from './api/create-canvas-manually/create-canvas-manually.component';
import { ModelAddFormComponent } from './feature-model/model-add-form/model-add-form.component';
import { CanvasDefinitionGeneralComponent } from './canvas-definition/canvas-definition-general/canvas-definition-general.component';
import { CanvasDefinitionModelComponent } from './canvas-definition/canvas-definition-model/canvas-definition-model.component';
import { CanvasDefinitionOverviewComponent } from './canvas-definition/canvas-definition-overview/canvas-definition-overview.component';
import { ExpertModelOverviewComponent } from './expert-model/expert-model-overview/expert-model-overview.component';
import { ExpertModelGeneralComponent } from './expert-model/expert-model-general/expert-model-general.component';
import { ExpertModelInstancesComponent } from './expert-model/expert-model-instances/expert-model-instances.component';
import { InstanceOverviewComponent } from './instances/instance-overview/instance-overview.component';
import { InstanceGeneralComponent } from './instances/instance-general/instance-general.component';
import { ExampleEditComponent } from './instances/example-edit/example-edit.component';
import { PatternEditComponent } from './instances/pattern-edit/pattern-edit.component';
import { CompanyModelOverviewComponent } from './company-model/company-model-overview/company-model-overview.component';
import { CompanyModelGeneralComponent } from './company-model/company-model-general/company-model-general.component';
import { CompanyModelMergeComponent } from './company-model/company-model-merge/company-model-merge.component';
import { CompanyModelMergeEditComponent } from './company-model/company-model-merge-edit/company-model-merge-edit.component';
import { InstanceHintsComponent } from './instances/instance-hints/instance-hints.component';

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (canvasService: CanvasToolService) => (): void =>
        canvasService.init(),
      deps: [CanvasToolService],
      multi: true,
    },
  ],
  imports: [SharedModule, CanvasToolRoutingModule],
  declarations: [
    // api
    CompareComponent,
    CreateCanvasComponent,
    CreateCanvasConfigurationComponent,
    CreateCanvasManuallyComponent,
    CreateCompetitorCanvasComponent,
    EditCanvasComponent,
    EditCompetitorCanvasComponent,
    EditCompetitorsComponent,
    EditModelComponent,
    RefineCanvasComponent,
    SelectCanvasDefinitionConfigurationComponent,
    ViewCanvasComponent,

    // canvas-definition
    CanvasDefinitionComponent,
    CanvasDefinitionGeneralComponent,
    CanvasDefinitionModelComponent,
    CanvasDefinitionModelOverviewComponent,
    CanvasDefinitionOverviewComponent,
    CanvasDefinitionRelationshipsFormComponent,
    CanvasDefinitionRowFormComponent,
    CanvasDefinitionsComponent,

    // company-model
    CompanyModelComponent,
    CompanyModelEditComponent,
    CompanyModelGeneralComponent,
    CompanyModelMergeComponent,
    CompanyModelMergeEditComponent,
    CompanyModelOverviewComponent,
    CompanyModelSelectExpertKnowledgeComponent,
    CompanyModelsComponent,

    // elements
    CanvasElementsComponent,

    // expert-model
    ExpertModelComponent,
    ExpertModelEditComponent,
    ExpertModelGeneralComponent,
    ExpertModelInstancesComponent,
    ExpertModelOverviewComponent,
    ExpertModelsComponent,

    // feature-model
    DeleteFeatureConfirmComponent,
    FeatureBuildingBlockComponent,
    FeatureFormComponent,
    FeatureModelComponent,
    FeatureModelEditComponent,
    FeatureModelFormComponent,
    FeatureModelSubformComponent,
    FeatureTreeComponent,
    ModelAddFormComponent,
    ModelImportViewComponent,

    // instances
    AddDecisionModalComponent,
    CanvasBuildingBlockComponent,
    CanvasComponent,
    ExampleComponent,
    ExampleEditComponent,
    FeatureModelInstanceSubformComponent,
    InstanceCompareFormComponent,
    InstanceComponent,
    InstanceGeneralComponent,
    InstanceHintsComponent,
    InstanceListComponent,
    InstanceOverviewComponent,
    InstanceSelectPatternFormComponent,
    PatternComponent,
    PatternDescriptionModalComponent,
    PatternEditComponent,
    PatternHintComponent,
    PatternViewComponent,

    // merge
    MergeIntoTreeComponent,
    MergeModelViewComponent,
    MergeTreeComponent,
    TraceModalComponent,

    // relationships
    CrossTreeRelationshipFormComponent,
    CrossTreeRelationshipModalComponent,
  ],
})
export class CanvasToolModule {}
