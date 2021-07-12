import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MergeExpertModelsComponent } from './merge/merge-expert-models/merge-expert-models.component';
import { MergeModelViewComponent } from './merge/merge-model-view/merge-model-view.component';
import { ExpertModelsComponent } from './expert-model/expert-models/expert-models.component';
import { ExpertModelComponent } from './expert-model/expert-model/expert-model.component';
import { ExpertModelEditComponent } from './expert-model/expert-model-edit/expert-model-edit.component';
import { PatternComponent } from './instances/pattern/pattern.component';
import { ExampleComponent } from './instances/example/example.component';
import { CompanyModelEditComponent } from './company-model/company-model-edit/company-model-edit.component';
import { CompanyModelsComponent } from './company-model/company-models/company-models.component';
import { CompanyModelComponent } from './company-model/company-model/company-model.component';
import { CreateCanvasComponent } from './api/create-canvas/create-canvas.component';
import { EditCanvasComponent } from './api/edit-canvas/edit-canvas.component';
import { CanvasDefinitionsComponent } from './canvas-definition/canvas-definitions/canvas-definitions.component';
import { CanvasDefinitionComponent } from './canvas-definition/canvas-definition/canvas-definition.component';
import {
  CompanyModelSelectExpertKnowledgeComponent
} from './company-model/company-model-select-expert-knowledge/company-model-select-expert-knowledge.component';
import { CompareComponent } from './api/compare/compare.component';
import { CreateCompetitorCanvasComponent } from './api/create-competitor-canvas/create-competitor-canvas.component';
import { EditCompetitorsComponent } from './api/edit-competitors/edit-competitors.component';
import { EditCompetitorCanvasComponent } from './api/edit-competitor-canvas/edit-competitor-canvas.component';
import { RefineCanvasComponent } from './api/refine-canvas/refine-canvas.component';
import { ViewCanvasComponent } from './api/view-canvas/view-canvas.component';
import { EditModelComponent } from './api/edit-model/edit-model.component';


const routes: Routes = [
  {path: 'canvas/definitions', component: CanvasDefinitionsComponent},
  {path: 'canvas/definitions/:id', component: CanvasDefinitionComponent},
  {path: 'canvas/instance/create', component: CreateCanvasComponent},
  {path: 'canvas/:companyModelId/instance/:instanceId/edit', component: EditCanvasComponent},
  {path: 'canvas/:companyModelId/instance/:instanceId/refine', component: RefineCanvasComponent},
  {path: 'canvas/:companyModelId/instance/:instanceId/view', component: ViewCanvasComponent},
  {path: 'canvas/:companyModelId/instance/:instanceId/model/edit', component: EditModelComponent},
  {path: 'canvas/:companyModelId/instance/:instanceId/competitors', component: CreateCompetitorCanvasComponent},
  {path: 'canvas/:companyModelId/instance/:instanceId/competitors/edit', component: EditCompetitorsComponent},
  {path: 'canvas/:companyModelId/instance/:instanceId/competitors/:competitorId/edit', component: EditCompetitorCanvasComponent},
  {path: 'canvas/:companyModelId/instance/:instanceId/compare', component: CompareComponent},
  {path: 'companyModels', component: CompanyModelsComponent},
  {path: 'companyModels/:id', component: CompanyModelComponent},
  {path: 'companyModels/:id/edit', component: CompanyModelEditComponent},
  {path: 'companyModels/:id/select', component: CompanyModelSelectExpertKnowledgeComponent},
  {path: 'expertModels', component: ExpertModelsComponent},
  {path: 'expertModels/:id', component: ExpertModelComponent},
  {path: 'expertModels/:id/edit', component: ExpertModelEditComponent},
  {path: 'expertModels/:id/examples/:exampleId', component: ExampleComponent},
  {path: 'expertModels/:id/patterns/:patternId', component: PatternComponent},
  {path: 'merge/:companyModelId', component: MergeExpertModelsComponent},
  {path: 'merge/:companyModelId/:expertModelId', component: MergeModelViewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanvasRoutingModule {
}
