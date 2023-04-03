import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ModuleService } from '../../../development-process-registry/module-api/module.service';
import { HypoMoMapToolApiService } from './hypo-mo-map-tool-api.service';
import { HypoMoMapMetaArtifactService } from '../hypo-mo-map-meta-artifact/hypo-mo-map-meta-artifact.service';
import { Module } from '../../../development-process-registry/module-api/module';
import { Router } from '@angular/router';
import { Reference } from '../../../development-process-registry/meta-artifact-definition';
import { DbId } from '../../../database/database-entry';
import { referenceToApiQueryParams } from '../../../development-process-registry/module-api/api-query-params';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { HypoMoMapTreeService } from '../hypo-mo-map-meta-artifact/hypo-mo-map-tree.service';
import { ModuleMethod } from '../../../development-process-registry/module-api/module-method';
import { InternalRoles } from '../../../role/user.service';

@Injectable({
  providedIn: 'root',
})
export class HypoMoMapToolService {
  constructor(
    private fb: UntypedFormBuilder,
    private moduleService: ModuleService,
    private hypoMoMapToolApiService: HypoMoMapToolApiService,
    private hypoMoMapMetaArtifactService: HypoMoMapMetaArtifactService,
    private hypoMoMapTreeService: HypoMoMapTreeService
  ) {}

  init(): void {
    const module = new Module(
      'HypoMoMap Tools',
      'HypoMoMap Module',
      this.getMethods(),
      this.hypoMoMapToolApiService,
      [
        {
          name: 'Experiments',
          route: ['hypomomaps', 'experiments'],
          roles: [InternalRoles.DOMAIN_EXPERT],
        },
      ]
    );
    this.moduleService.registerModule(module);
    console.log('Registered HypoMoMap Module');
    this.hypoMoMapMetaArtifactService.registerCreateMethod(
      this.createHypoMoMapInstance
    );
    console.log('Registered HypoMoMap Module as create method for HypoMoMaps');
    this.hypoMoMapMetaArtifactService.registerEditMethod(this.editHypoMoMap);
    console.log('Registered HypoMoMap Module as edit method for HypoMoMaps');
    this.hypoMoMapMetaArtifactService.registerViewMethod(this.viewHypoMoMap);
    console.log('Registered HypoMoMap Module as view method for HypoMoMaps');
  }

  private getMethods(): ModuleMethod[] {
    return [
      {
        name: 'createHypoMoMap',
        description: 'Creates an empty HypoMoMap',
        input: [],
        output: [
          this.hypoMoMapMetaArtifactService.hypoMoMapMetaArtifactIdentifier,
        ],
      },
      {
        name: 'addHypotheses',
        description: 'Add hypotheses to a HypoMoMap',
        input: [
          this.hypoMoMapMetaArtifactService.hypoMoMapMetaArtifactIdentifier,
        ],
        output: [
          this.hypoMoMapMetaArtifactService.hypoMoMapMetaArtifactIdentifier,
        ],
      },
      {
        name: 'addExperiments',
        description:
          'Add experiments to a HypoMoMap and create mappings to the hypotheses',
        input: [
          this.hypoMoMapMetaArtifactService.hypoMoMapMetaArtifactIdentifier,
        ],
        output: [
          this.hypoMoMapMetaArtifactService.hypoMoMapMetaArtifactIdentifier,
        ],
      },
      {
        name: 'executeExperiments',
        description: 'Execute experiments of a HypoMoMap',
        input: [
          this.hypoMoMapMetaArtifactService.hypoMoMapMetaArtifactIdentifier,
        ],
        output: [
          this.hypoMoMapMetaArtifactService.hypoMoMapMetaArtifactIdentifier,
        ],
      },
      {
        name: 'editHypoMoMap',
        description: 'Edit a HypoMoMap',
        input: [
          this.hypoMoMapMetaArtifactService.hypoMoMapMetaArtifactIdentifier,
        ],
        output: [
          this.hypoMoMapMetaArtifactService.hypoMoMapMetaArtifactIdentifier,
        ],
      },
      {
        name: 'viewHypoMoMap',
        description: 'View a HypoMoMap',
        input: [
          this.hypoMoMapMetaArtifactService.hypoMoMapMetaArtifactIdentifier,
        ],
        output: [
          this.hypoMoMapMetaArtifactService.hypoMoMapMetaArtifactIdentifier,
        ],
      },
    ];
  }

  async createHypoMoMapInstance(
    router: Router,
    reference: Reference,
    artifactId: DbId
  ): Promise<void> {
    const queryParams = referenceToApiQueryParams(reference);
    await router.navigate(['hypomomaps', 'artifact', artifactId, 'create'], {
      queryParams,
    });
  }

  async viewHypoMoMap(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): Promise<void> {
    const queryParams = referenceToApiQueryParams(reference);
    const hypoMoMapTree = await this.hypoMoMapTreeService.get(model.id);
    await router.navigate(
      [
        'hypomomaps',
        'hypomomaps',
        model.id,
        'version',
        hypoMoMapTree.getLatestHypoMoMap().id,
        'view',
      ],
      {
        queryParams,
      }
    );
  }

  async editHypoMoMap(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): Promise<void> {
    const queryParams = referenceToApiQueryParams(reference);
    const hypoMoMapTree = await this.hypoMoMapTreeService.get(model.id);
    await router.navigate(
      [
        'hypomomaps',
        'hypomomaps',
        model.id,
        'version',
        hypoMoMapTree.getLatestHypoMoMap().id,
        'edit',
      ],
      {
        queryParams,
      }
    );
  }
}
