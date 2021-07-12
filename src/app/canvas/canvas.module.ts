import { APP_INITIALIZER, NgModule } from '@angular/core';

import { CanvasRoutingModule } from './canvas-routing.module';
import { CanvasService } from './canvas.service';
import { FeatureModelSubformComponent } from './feature-model/feature-model-subform/feature-model-subform.component';
import { SharedModule } from '../shared/shared.module';
import { FeatureModelInstanceSubformComponent } from './instances/feature-model-instance-subform/feature-model-instance-subform.component';
import { MergeExpertModelsComponent } from './merge/merge-expert-models/merge-expert-models.component';
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
import { ModelListComponent } from './feature-model/model-list/model-list.component';
import { ModelImportViewComponent } from './feature-model/model-import-view/model-import-view.component';
import { ExpertModelEditComponent } from './expert-model/expert-model-edit/expert-model-edit.component';
import { FeatureModelEditComponent } from './feature-model/feature-model-edit/feature-model-edit.component';
import { FeatureTreeComponent } from './feature-model/feature-tree/feature-tree.component';
import { FeatureModelFormComponent } from './feature-model/feature-model-form/feature-model-form.component';
import { InstanceListComponent } from './instances/instance-list/instance-list.component';
import { InstanceComponent } from './instances/instance/instance.component';
import { PatternComponent } from './instances/pattern/pattern.component';
import { DeleteDecisionModalComponent } from './instances/delete-decision-modal/delete-decision-modal.component';
import { AddDecisionModalComponent } from './instances/add-decision-modal/add-decision-modal.component';
import { InstanceInfoBoxComponent } from './instances/instance-info-box/instance-info-box.component';
import { InstanceFormComponent } from './instances/instance-form/instance-form.component';
import { CanvasBuildingBlockComponent } from './instances/canvas-building-block/canvas-building-block.component';
import { ExampleComponent } from './instances/example/example.component';
import { ModelInfoBoxComponent } from './feature-model/model-info-box/model-info-box.component';
import { CompanyModelEditComponent } from './company-model/company-model-edit/company-model-edit.component';
import { CompanyModelsComponent } from './company-model/company-models/company-models.component';
import { CompanyModelComponent } from './company-model/company-model/company-model.component';
import { CreateCanvasConfigurationComponent } from './api/create-canvas-configuration/create-canvas-configuration.component';
import { CreateCanvasComponent } from './api/create-canvas/create-canvas.component';
import { EditCanvasComponent } from './api/edit-canvas/edit-canvas.component';
import { CanvasDefinitionsComponent } from './canvas-definition/canvas-definitions/canvas-definitions.component';
import { CanvasDefinitionComponent } from './canvas-definition/canvas-definition/canvas-definition.component';
import { CanvasComponent } from './instances/canvas/canvas.component';
import {
  SelectCanvasDefinitionConfigurationComponent
} from './api/select-canvas-definition-configuration/select-canvas-definition-configuration.component';
import {
  CompanyModelSelectExpertKnowledgeComponent
} from './company-model/company-model-select-expert-knowledge/company-model-select-expert-knowledge.component';
import { CompareComponent } from './api/compare/compare.component';
import { InstanceCompareFormComponent } from './instances/instance-compare-form/instance-compare-form.component';
import { CreateCompetitorCanvasComponent } from './api/create-competitor-canvas/create-competitor-canvas.component';
import { EditCompetitorCanvasComponent } from './api/edit-competitor-canvas/edit-competitor-canvas.component';
import { EditCompetitorsComponent } from './api/edit-competitors/edit-competitors.component';
import { RefineCanvasComponent } from './api/refine-canvas/refine-canvas.component';
import { InstanceSelectPatternFormComponent } from './instances/instance-select-pattern-form/instance-select-pattern-form.component';
import { ViewCanvasComponent } from './api/view-canvas/view-canvas.component';
import { EditModelComponent } from './api/edit-model/edit-model.component';


@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (canvasService: CanvasService) => () => canvasService.init(),
      deps: [CanvasService],
      multi: true
    },
  ],
  imports: [
    SharedModule,
    CanvasRoutingModule,
  ],
  declarations: [
    // api
    CompareComponent,
    CreateCanvasComponent,
    CreateCanvasConfigurationComponent,
    CreateCompetitorCanvasComponent,
    EditCanvasComponent,
    EditCompetitorCanvasComponent,
    EditCompetitorsComponent,
    EditModelComponent,
    RefineCanvasComponent,
    SelectCanvasDefinitionConfigurationComponent,
    ViewCanvasComponent,

    // canvas-definitions
    CanvasDefinitionComponent,
    CanvasDefinitionsComponent,

    // company-model
    CompanyModelComponent,
    CompanyModelEditComponent,
    CompanyModelSelectExpertKnowledgeComponent,
    CompanyModelsComponent,

    // expert-model
    ExpertModelComponent,
    ExpertModelEditComponent,
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
    ModelImportViewComponent,
    ModelInfoBoxComponent,
    ModelListComponent,

    // instances
    AddDecisionModalComponent,
    CanvasComponent,
    CanvasBuildingBlockComponent,
    DeleteDecisionModalComponent,
    ExampleComponent,
    FeatureModelInstanceSubformComponent,
    InstanceComponent,
    InstanceCompareFormComponent,
    InstanceFormComponent,
    InstanceInfoBoxComponent,
    InstanceListComponent,
    PatternComponent,

    // merge
    MergeExpertModelsComponent,
    MergeIntoTreeComponent,
    MergeModelViewComponent,
    MergeTreeComponent,
    TraceModalComponent,

    // relationships
    CrossTreeRelationshipFormComponent,
    CrossTreeRelationshipModalComponent,
    InstanceSelectPatternFormComponent,
  ],
  entryComponents: [
    CreateCanvasConfigurationComponent,
    SelectCanvasDefinitionConfigurationComponent,
  ]
})
export class CanvasModule {
}
