import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BmProcessesComponent } from './bm-processes/bm-processes.component';
import { BmProcessComponent } from './bm-process/bm-process.component';
import { DevelopmentMethodsComponent } from './development-methods/development-methods.component';
import { DevelopmentMethodComponent } from './development-method/development-method.component';
import { ProcessPatternsComponent } from './process-patterns/process-patterns.component';
import { ProcessPatternComponent } from './process-pattern/process-pattern.component';
import { DiagramChangeGuard } from './shared/diagram-change.guard';
import { SituationalFactorsComponent } from './situational-factors/situational-factors.component';
import { SituationalFactorComponent } from './situational-factor/situational-factor.component';
import { ArtifactsComponent } from './artifacts/artifacts.component';
import { ArtifactComponent } from './artifact/artifact.component';
import { StakeholdersComponent } from './stakeholders/stakeholders.component';
import { StakeholderComponent } from './stakeholder/stakeholder.component';
import { ToolsComponent } from './tools/tools.component';
import { ToolComponent } from './tool/tool.component';
import { TypesComponent } from './types/types.component';
import { TypeComponent } from './type/type.component';
import { RunningProcessesComponent } from './running-processes/running-processes.component';
import { RunningProcessComponent } from './running-process/running-process.component';
import { RunningProcessMethodComponent } from './running-process-method/running-process-method.component';
import { DomainsComponent } from './domains/domains.component';
import { DomainComponent } from './domain/domain.component';
import { AuthGuard } from '../database/auth.guard';
import { MethodElementsComponent } from './method-elements/method-elements.component';
import { ConcreteArtifactsComponent } from './concrete-artifacts/concrete-artifacts.component';
import { ConcreteArtifactComponent } from './concrete-artifact/concrete-artifact.component';
import { RunningProcessContextComponent } from './running-process-context/running-process-context.component';

const routes: Routes = [
  {
    path: 'bmprocess',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: BmProcessesComponent },
      {
        path: 'bmprocessview/:id',
        component: BmProcessComponent,
        canDeactivate: [DiagramChangeGuard],
      },
      {
        path: 'contextchange/:id',
        component: RunningProcessContextComponent,
        canDeactivate: [DiagramChangeGuard],
      },
    ],
  },
  {
    path: 'concreteArtifacts',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ConcreteArtifactsComponent },
      {
        path: 'detail/:id',
        component: ConcreteArtifactComponent,
      },
    ],
  },
  {
    path: 'methods',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DevelopmentMethodsComponent },
      { path: 'methodview/:id', component: DevelopmentMethodComponent },
    ],
  },
  {
    path: 'process',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProcessPatternsComponent },
      {
        path: 'processview/:id',
        component: ProcessPatternComponent,
        canDeactivate: [DiagramChangeGuard],
      },
    ],
  },
  {
    path: 'domains',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DomainsComponent },
      { path: 'detail/:id', component: DomainComponent },
    ],
  },
  {
    path: 'methodElements',
    component: MethodElementsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'artifacts',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ArtifactsComponent },
      { path: 'detail/:id', component: ArtifactComponent },
    ],
  },
  {
    path: 'situationalFactors',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: SituationalFactorsComponent },
      { path: 'detail/:id', component: SituationalFactorComponent },
    ],
  },
  {
    path: 'stakeholders',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: StakeholdersComponent },
      { path: 'detail/:id', component: StakeholderComponent },
    ],
  },
  {
    path: 'tools',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ToolsComponent },
      { path: 'detail/:id', component: ToolComponent },
    ],
  },
  {
    path: 'types',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TypesComponent },
      { path: 'detail/:id', component: TypeComponent },
    ],
  },
  {
    path: 'runningprocess',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RunningProcessesComponent },
      {
        path: 'runningprocessview/:id',
        children: [
          { path: '', component: RunningProcessComponent },
          {
            path: 'method/:executionId',
            component: RunningProcessMethodComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevelopmentProcessesRoutingModule {}
