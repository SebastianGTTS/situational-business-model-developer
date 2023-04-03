import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../database/auth.guard';
import { BmPatternProcessMethodComponent } from './bm-process/bm-pattern-process-method/bm-pattern-process-method.component';
import { BmPatternProcessOverviewComponent } from './bm-process/bm-pattern-process-overview/bm-pattern-process-overview.component';
import { BmPatternProcessNavService } from './bm-process/bm-pattern-process/bm-pattern-process-nav.service';
import { BmPatternProcessComponent } from './bm-process/bm-pattern-process/bm-pattern-process.component';
import { BmPhaseProcessMethodComponent } from './bm-process/bm-phase-process-method/bm-phase-process-method.component';
import { BmPhaseProcessOverviewComponent } from './bm-process/bm-phase-process-overview/bm-phase-process-overview.component';
import { BmPhaseProcessNavService } from './bm-process/bm-phase-process/bm-phase-process-nav.service';
import { BmPhaseProcessComponent } from './bm-process/bm-phase-process/bm-phase-process.component';
import { BmProcessContextComponent } from './bm-process/bm-process-context/bm-process-context.component';
import { BmProcessGeneralComponent } from './bm-process/bm-process-general/bm-process-general.component';
import { BmProcessInitNavService } from './bm-process/bm-process-init/bm-process-init-nav.service';
import { BmProcessInitComponent } from './bm-process/bm-process-init/bm-process-init.component';
import { BmProcessComponent } from './bm-process/bm-process/bm-process.component';
import { BmProcessGuard } from './bm-process/bm-process/bm-process.guard';
import { ConcreteArtifactComponent } from './concrete-artifact/concrete-artifact/concrete-artifact.component';
import { ConcreteArtifactsComponent } from './concrete-artifact/concrete-artifacts/concrete-artifacts.component';
import { DevelopmentMethodExecutionComponent } from './development-method/development-method-execution/development-method-execution.component';
import { DevelopmentMethodGeneralComponent } from './development-method/development-method-general/development-method-general.component';
import { DevelopmentMethodOverviewComponent } from './development-method/development-method-overview/development-method-overview.component';
import { DevelopmentMethodSelectionComponent } from './development-method/development-method-selection/development-method-selection.component';
import { DevelopmentMethodNavService } from './development-method/development-method/development-method-nav.service';
import { DevelopmentMethodComponent } from './development-method/development-method/development-method.component';
import { DevelopmentMethodsComponent } from './development-method/development-methods/development-methods.component';
import { DomainNavService } from './method-elements/domains/domain/domain-nav.service';
import { DomainComponent } from './method-elements/domains/domain/domain.component';
import { DomainsComponent } from './method-elements/domains/domains/domains.component';
import { ArtifactNavService } from './method-elements/artifacts/artifact/artifact-nav.service';
import { ArtifactComponent } from './method-elements/artifacts/artifact/artifact.component';
import { ArtifactsComponent } from './method-elements/artifacts/artifacts/artifacts.component';
import { MethodElementsComponent } from './method-elements/method-elements/method-elements.component';
import { PhaseListComponent } from './method-elements/phases/phase-list/phase-list.component';
import { PhaseNavService } from './method-elements/phases/phase/phase-nav.service';
import { PhaseComponent } from './method-elements/phases/phase/phase.component';
import { SituationalFactorNavService } from './method-elements/situational-factors/situational-factor/situational-factor-nav.service';
import { SituationalFactorComponent } from './method-elements/situational-factors/situational-factor/situational-factor.component';
import { SituationalFactorsComponent } from './method-elements/situational-factors/situational-factors/situational-factors.component';
import { StakeholderNavService } from './method-elements/stakeholders/stakeholder/stakeholder-nav.service';
import { StakeholderComponent } from './method-elements/stakeholders/stakeholder/stakeholder.component';
import { StakeholdersComponent } from './method-elements/stakeholders/stakeholders/stakeholders.component';
import { ToolNavService } from './method-elements/tools/tool/tool-nav.service';
import { ToolComponent } from './method-elements/tools/tool/tool.component';
import { ToolsComponent } from './method-elements/tools/tools/tools.component';
import { TypeNavService } from './method-elements/types/type/type-nav.service';
import { TypeComponent } from './method-elements/types/type/type.component';
import { TypesComponent } from './method-elements/types/types/types.component';
import { ProcessPatternGeneralComponent } from './process-pattern/process-pattern-general/process-pattern-general.component';
import { ProcessPatternOverviewComponent } from './process-pattern/process-pattern-overview/process-pattern-overview.component';
import { ProcessPatternPatternComponent } from './process-pattern/process-pattern-pattern/process-pattern-pattern.component';
import { ProcessPatternSelectionComponent } from './process-pattern/process-pattern-selection/process-pattern-selection.component';
import { ProcessPatternNavService } from './process-pattern/process-pattern/process-pattern-nav.service';
import { ProcessPatternComponent } from './process-pattern/process-pattern/process-pattern.component';
import { ProcessPatternsComponent } from './process-pattern/process-patterns/process-patterns.component';
import { RunningProcessContextComponent } from './context/running-process-context/running-process-context.component';
import { RunningProcessMethodComponent } from './running-process/running-process-method/running-process-method.component';
import { RunningProcessComponent } from './running-process/running-process/running-process.component';
import { RunningProcessesComponent } from './running-process/running-processes/running-processes.component';
import { DiagramChangeGuard } from './shared/diagram-change.guard';
import { RunningPatternProcessComponent } from './running-process/running-pattern-process/running-pattern-process.component';
import { RunningPatternProcessNavService } from './running-process/running-pattern-process/running-pattern-process-nav.service';
import { RunningFullProcessContextComponent } from './running-process/running-full-process-context/running-full-process-context.component';
import { RunningProcessGeneralComponent } from './running-process/running-process-general/running-process-general.component';
import { RunningPatternProcessExecutionComponent } from './running-process/running-pattern-process-execution/running-pattern-process-execution.component';
import { RunningProcessArtifactComponent } from './running-process/running-process-artifact/running-process-artifact.component';
import { RunningPatternProcessOverviewComponent } from './running-process/running-pattern-process-overview/running-pattern-process-overview.component';
import { RunningProcessGuard } from './running-process/running-process/running-process.guard';
import { RunningPhaseProcessComponent } from './running-process/running-phase-process/running-phase-process.component';
import { RunningPhaseProcessNavService } from './running-process/running-phase-process/running-phase-process-nav.service';
import { RunningPhaseProcessExecutionComponent } from './running-process/running-phase-process-execution/running-phase-process-execution.component';
import { RunningPhaseProcessOverviewComponent } from './running-process/running-phase-process-overview/running-phase-process-overview.component';
import { RunningLightProcessComponent } from './running-process/running-light-process/running-light-process.component';
import { RunningLightProcessNavService } from './running-process/running-light-process/running-light-process-nav.service';
import { RunningLightProcessOverviewComponent } from './running-process/running-light-process-overview/running-light-process-overview.component';
import { RunningLightProcessExecutionComponent } from './running-process/running-light-process-execution/running-light-process-execution.component';
import { RunningLightProcessContextComponent } from './running-process/running-light-process-context/running-light-process-context.component';
import { RunningProcessMethodNavService } from './running-process/running-process-method/running-process-method-nav.service';
import { ConcreteArtifactNavService } from './concrete-artifact/concrete-artifact/concrete-artifact-nav.service';
import { RoleGuard } from '../role/role.guard';
import { InternalRoles } from '../role/user.service';
import { BmPhaseProcessesComponent } from './bm-process/bm-phase-processes/bm-phase-processes.component';
import { BmPatternProcessesComponent } from './bm-process/bm-pattern-processes/bm-pattern-processes.component';

const routes: Routes = [
  {
    path: 'bmprocess',
    data: {
      roles: [InternalRoles.METHOD_ENGINEER],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: 'phase', component: BmPhaseProcessesComponent },
      { path: 'pattern', component: BmPatternProcessesComponent },
      {
        path: 'bmprocessview/:id',
        component: BmProcessComponent,
        canActivateChild: [BmProcessGuard],
        children: [
          {
            path: '',
            redirectTo: 'init',
            pathMatch: 'full',
          },
          {
            path: 'init',
            component: BmProcessInitComponent,
            resolve: {
              nav: BmProcessInitNavService,
            },
          },
          {
            path: 'phase',
            component: BmPhaseProcessComponent,
            resolve: {
              nav: BmPhaseProcessNavService,
            },
            children: [
              {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full',
              },
              {
                path: 'overview',
                component: BmPhaseProcessOverviewComponent,
              },
              {
                path: 'general',
                component: BmProcessGeneralComponent,
              },
              {
                path: 'method',
                component: BmPhaseProcessMethodComponent,
              },
              {
                path: 'context',
                component: BmProcessContextComponent,
              },
            ],
          },
          {
            path: 'pattern',
            component: BmPatternProcessComponent,
            resolve: {
              nav: BmPatternProcessNavService,
            },
            children: [
              {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full',
              },
              {
                path: 'overview',
                component: BmPatternProcessOverviewComponent,
              },
              {
                path: 'general',
                component: BmProcessGeneralComponent,
              },
              {
                path: 'method',
                component: BmPatternProcessMethodComponent,
                canDeactivate: [DiagramChangeGuard],
              },
              {
                path: 'context',
                component: BmProcessContextComponent,
              },
            ],
          },
        ],
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
    data: {
      roles: [InternalRoles.BUSINESS_DEVELOPER],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: ConcreteArtifactsComponent },
      {
        path: 'detail/:id',
        resolve: {
          nav: ConcreteArtifactNavService,
        },
        component: ConcreteArtifactComponent,
      },
    ],
  },
  {
    path: 'methods',
    data: {
      roles: [InternalRoles.DOMAIN_EXPERT],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: DevelopmentMethodsComponent },
      {
        path: 'methodview/:id',
        component: DevelopmentMethodComponent,
        resolve: {
          nav: DevelopmentMethodNavService,
        },
        children: [
          {
            path: '',
            redirectTo: 'overview',
            pathMatch: 'full',
          },
          {
            path: 'overview',
            component: DevelopmentMethodOverviewComponent,
          },
          {
            path: 'general',
            component: DevelopmentMethodGeneralComponent,
          },
          {
            path: 'selection',
            component: DevelopmentMethodSelectionComponent,
          },
          {
            path: 'execution',
            component: DevelopmentMethodExecutionComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'process',
    data: {
      roles: [InternalRoles.DOMAIN_EXPERT],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: ProcessPatternsComponent },
      {
        path: 'processview/:id',
        component: ProcessPatternComponent,
        resolve: {
          nav: ProcessPatternNavService,
        },
        children: [
          {
            path: '',
            redirectTo: 'overview',
            pathMatch: 'full',
          },
          {
            path: 'overview',
            component: ProcessPatternOverviewComponent,
          },
          {
            path: 'general',
            component: ProcessPatternGeneralComponent,
          },
          {
            path: 'selection',
            component: ProcessPatternSelectionComponent,
          },
          {
            path: 'pattern',
            component: ProcessPatternPatternComponent,
            canDeactivate: [DiagramChangeGuard],
          },
        ],
      },
    ],
  },
  {
    path: 'domains',
    data: {
      roles: [InternalRoles.DOMAIN_EXPERT],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: DomainsComponent },
      {
        path: 'detail/:id',
        component: DomainComponent,
        resolve: {
          nav: DomainNavService,
        },
      },
    ],
  },
  {
    path: 'methodElements',
    component: MethodElementsComponent,
    data: {
      roles: [InternalRoles.DOMAIN_EXPERT],
    },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'artifacts',
    data: {
      roles: [InternalRoles.DOMAIN_EXPERT],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: ArtifactsComponent },
      {
        path: 'detail/:id',
        component: ArtifactComponent,
        resolve: {
          nav: ArtifactNavService,
        },
      },
    ],
  },
  {
    path: 'situationalFactors',
    data: {
      roles: [InternalRoles.DOMAIN_EXPERT],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: SituationalFactorsComponent },
      {
        path: 'detail/:id',
        component: SituationalFactorComponent,
        resolve: {
          nav: SituationalFactorNavService,
        },
      },
    ],
  },
  {
    path: 'stakeholders',
    data: {
      roles: [InternalRoles.DOMAIN_EXPERT],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: StakeholdersComponent },
      {
        path: 'detail/:id',
        component: StakeholderComponent,
        resolve: {
          nav: StakeholderNavService,
        },
      },
    ],
  },
  {
    path: 'tools',
    data: {
      roles: [InternalRoles.DOMAIN_EXPERT],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: ToolsComponent },
      {
        path: 'detail/:id',
        component: ToolComponent,
        resolve: {
          nav: ToolNavService,
        },
      },
    ],
  },
  {
    path: 'types',
    data: {
      roles: [InternalRoles.DOMAIN_EXPERT],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: TypesComponent },
      {
        path: 'detail/:id',
        component: TypeComponent,
        resolve: {
          nav: TypeNavService,
        },
      },
    ],
  },
  {
    path: 'phase-list',
    data: {
      roles: [InternalRoles.DOMAIN_EXPERT],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: PhaseListComponent },
      {
        path: ':id',
        component: PhaseComponent,
        resolve: {
          nav: PhaseNavService,
        },
      },
    ],
  },
  {
    path: 'runningprocess',
    data: {
      roles: [InternalRoles.BUSINESS_DEVELOPER],
    },
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: RunningProcessesComponent },
      {
        path: 'runningprocessview/:id',
        children: [
          {
            path: '',
            component: RunningProcessComponent,
            canActivateChild: [RunningProcessGuard],
            children: [
              {
                path: '',
                redirectTo: 'pattern',
                pathMatch: 'full',
              },
              {
                path: 'light',
                component: RunningLightProcessComponent,
                resolve: {
                  nav: RunningLightProcessNavService,
                },
                children: [
                  {
                    path: '',
                    redirectTo: 'overview',
                    pathMatch: 'full',
                  },
                  {
                    path: 'overview',
                    component: RunningLightProcessOverviewComponent,
                  },
                  {
                    path: 'general',
                    component: RunningProcessGeneralComponent,
                  },
                  {
                    path: 'execution',
                    component: RunningLightProcessExecutionComponent,
                  },
                  {
                    path: 'artifacts',
                    component: RunningProcessArtifactComponent,
                  },
                  {
                    path: 'context',
                    component: RunningLightProcessContextComponent,
                  },
                ],
              },
              {
                path: 'phase',
                component: RunningPhaseProcessComponent,
                resolve: {
                  nav: RunningPhaseProcessNavService,
                },
                children: [
                  {
                    path: '',
                    redirectTo: 'overview',
                    pathMatch: 'full',
                  },
                  {
                    path: 'overview',
                    component: RunningPhaseProcessOverviewComponent,
                  },
                  {
                    path: 'general',
                    component: RunningProcessGeneralComponent,
                  },
                  {
                    path: 'execution',
                    component: RunningPhaseProcessExecutionComponent,
                  },
                  {
                    path: 'artifacts',
                    component: RunningProcessArtifactComponent,
                  },
                  {
                    path: 'context',
                    component: RunningFullProcessContextComponent,
                  },
                ],
              },
              {
                path: 'pattern',
                component: RunningPatternProcessComponent,
                resolve: {
                  nav: RunningPatternProcessNavService,
                },
                children: [
                  {
                    path: '',
                    redirectTo: 'overview',
                    pathMatch: 'full',
                  },
                  {
                    path: 'overview',
                    component: RunningPatternProcessOverviewComponent,
                  },
                  {
                    path: 'general',
                    component: RunningProcessGeneralComponent,
                  },
                  {
                    path: 'execution',
                    component: RunningPatternProcessExecutionComponent,
                  },
                  {
                    path: 'artifacts',
                    component: RunningProcessArtifactComponent,
                  },
                  {
                    path: 'context',
                    component: RunningFullProcessContextComponent,
                  },
                ],
              },
            ],
          },
          {
            path: 'method/:executionId',
            component: RunningProcessMethodComponent,
            resolve: {
              nav: RunningProcessMethodNavService,
            },
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
