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
import { CompanyModelSelectExpertKnowledgeComponent } from './company-model/company-model-select-expert-knowledge/company-model-select-expert-knowledge.component';
import { CompareComponent } from './api/compare/compare.component';
import { CreateCompetitorCanvasComponent } from './api/create-competitor-canvas/create-competitor-canvas.component';
import { EditCompetitorsComponent } from './api/edit-competitors/edit-competitors.component';
import { EditCompetitorCanvasComponent } from './api/edit-competitor-canvas/edit-competitor-canvas.component';
import { RefineCanvasComponent } from './api/refine-canvas/refine-canvas.component';
import { ViewCanvasComponent } from './api/view-canvas/view-canvas.component';
import { EditModelComponent } from './api/edit-model/edit-model.component';
import { AuthGuard } from '../../../database/auth.guard';
import { CanvasElementsComponent } from './elements/canvas-elements/canvas-elements.component';
import { CreateCanvasManuallyComponent } from './api/create-canvas-manually/create-canvas-manually.component';

const routes: Routes = [
  {
    path: 'canvas',
    canActivate: [AuthGuard],
    children: [
      { path: 'definitions', component: CanvasDefinitionsComponent },
      { path: 'definitions/:id', component: CanvasDefinitionComponent },
      { path: 'instance/create', component: CreateCanvasComponent },
      {
        path: 'artifact/:id/create',
        component: CreateCanvasManuallyComponent,
      },
      {
        path: ':companyModelId/instance/:instanceId',
        children: [
          { path: 'edit', component: EditCanvasComponent },
          { path: 'refine', component: RefineCanvasComponent },
          { path: 'view', component: ViewCanvasComponent },
          { path: 'model/edit', component: EditModelComponent },
          {
            path: 'competitors',
            children: [
              { path: '', component: CreateCompetitorCanvasComponent },
              { path: 'edit', component: EditCompetitorsComponent },
              {
                path: ':competitorId/edit',
                component: EditCompetitorCanvasComponent,
              },
            ],
          },
          { path: 'compare', component: CompareComponent },
        ],
      },
    ],
  },
  {
    path: 'companyModels',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: CompanyModelsComponent },
      { path: ':id', component: CompanyModelComponent },
      { path: ':id/edit', component: CompanyModelEditComponent },
      {
        path: ':id/select',
        component: CompanyModelSelectExpertKnowledgeComponent,
      },
    ],
  },
  {
    path: 'expertModels',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ExpertModelsComponent },
      { path: ':id', component: ExpertModelComponent },
      { path: ':id/edit', component: ExpertModelEditComponent },
      { path: ':id/examples/:exampleId', component: ExampleComponent },
      { path: ':id/patterns/:patternId', component: PatternComponent },
    ],
  },
  {
    path: 'merge',
    canActivate: [AuthGuard],
    children: [
      { path: ':companyModelId', component: MergeExpertModelsComponent },
      {
        path: ':companyModelId/:expertModelId',
        component: MergeModelViewComponent,
      },
    ],
  },
  {
    path: 'canvasElements',
    component: CanvasElementsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanvasRoutingModule {}
