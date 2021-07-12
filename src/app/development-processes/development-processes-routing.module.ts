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

const routes: Routes = [
  {path: 'bmprocess', component: BmProcessesComponent},
  {path: 'bmprocess/bmprocessview/:id', component: BmProcessComponent, canDeactivate: [DiagramChangeGuard]},
  {path: 'methods', component: DevelopmentMethodsComponent},
  {path: 'methods/methodview/:id', component: DevelopmentMethodComponent},
  {path: 'process', component: ProcessPatternsComponent},
  {path: 'process/processview/:id', component: ProcessPatternComponent, canDeactivate: [DiagramChangeGuard]},
  {path: 'domains', component: DomainsComponent},
  {path: 'domains/detail/:id', component: DomainComponent},
  {path: 'artifacts', component: ArtifactsComponent},
  {path: 'artifacts/detail/:id', component: ArtifactComponent},
  {path: 'situationalFactors', component: SituationalFactorsComponent},
  {path: 'situationalFactors/detail/:id', component: SituationalFactorComponent},
  {path: 'stakeholders', component: StakeholdersComponent},
  {path: 'stakeholders/detail/:id', component: StakeholderComponent},
  {path: 'tools', component: ToolsComponent},
  {path: 'tools/detail/:id', component: ToolComponent},
  {path: 'types', component: TypesComponent},
  {path: 'types/detail/:id', component: TypeComponent},
  {path: 'runningprocess', component: RunningProcessesComponent},
  {path: 'runningprocess/runningprocessview/:id', component: RunningProcessComponent},
  {path: 'runningprocess/runningprocessview/:id/method/:executionId', component: RunningProcessMethodComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevelopmentProcessesRoutingModule {
}
