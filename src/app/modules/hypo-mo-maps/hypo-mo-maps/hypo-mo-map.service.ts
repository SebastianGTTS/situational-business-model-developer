import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModuleService } from '../../../development-process-registry/module-api/module.service';
import { HypoMoMapApiService } from './hypo-mo-map-api.service';
import { HypoMoMapMetaModelService } from '../hypo-mo-map-meta-model/hypo-mo-map-meta-model.service';
import { Module } from '../../../development-process-registry/module-api/module';
import { Router } from '@angular/router';
import { Reference } from '../../../development-process-registry/meta-model-definition';
import { DbId } from '../../../database/database-entry';
import { referenceToApiQueryParams } from '../../../development-process-registry/module-api/api-query-params';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { HypoMoMapTreeService } from '../hypo-mo-map-meta-model/hypo-mo-map-tree.service';
import { ModuleMethod } from '../../../development-process-registry/module-api/module-method';
import { InternalRoles } from '../../../user.service';

@Injectable({
  providedIn: 'root',
})
export class HypoMoMapService {
  constructor(
    private fb: FormBuilder,
    private moduleService: ModuleService,
    private hypoMoMapApiService: HypoMoMapApiService,
    private hypoMoMapMetaModelService: HypoMoMapMetaModelService,
    private hypoMoMapTreeService: HypoMoMapTreeService
  ) {}

  init(): void {
    const module = new Module(
      'HypoMoMap Tools',
      'HypoMoMap Module',
      this.getMethods(),
      this.hypoMoMapApiService,
      [
        {
          name: 'Experiments',
          route: ['hypomomaps', 'experiments'],
          roles: [InternalRoles.EXPERT],
        },
      ]
    );
    this.moduleService.registerModule(module);
    console.log('Registered HypoMoMap Module');
    this.hypoMoMapMetaModelService.registerCreateMethod(
      this.createHypoMoMapInstance
    );
    console.log('Registered HypoMoMap Module as create method for HypoMoMaps');
    this.hypoMoMapMetaModelService.registerEditMethod(this.editHypoMoMap);
    console.log('Registered HypoMoMap Module as edit method for HypoMoMaps');
    this.hypoMoMapMetaModelService.registerViewMethod(this.viewHypoMoMap);
    console.log('Registered HypoMoMap Module as view method for HypoMoMaps');
  }

  private getMethods(): ModuleMethod[] {
    return [
      {
        name: 'createHypoMoMap',
        description: 'Creates an empty HypoMoMap',
        input: [],
        output: [this.hypoMoMapMetaModelService.hypoMoMapMetaModelIdentifier],
      },
      {
        name: 'addHypotheses',
        description: 'Add hypotheses to a HypoMoMap',
        input: [this.hypoMoMapMetaModelService.hypoMoMapMetaModelIdentifier],
        output: [this.hypoMoMapMetaModelService.hypoMoMapMetaModelIdentifier],
      },
      {
        name: 'addExperiments',
        description:
          'Add experiments to a HypoMoMap and create mappings to the hypotheses',
        input: [this.hypoMoMapMetaModelService.hypoMoMapMetaModelIdentifier],
        output: [this.hypoMoMapMetaModelService.hypoMoMapMetaModelIdentifier],
      },
      {
        name: 'executeExperiments',
        description: 'Execute experiments of a HypoMoMap',
        input: [this.hypoMoMapMetaModelService.hypoMoMapMetaModelIdentifier],
        output: [this.hypoMoMapMetaModelService.hypoMoMapMetaModelIdentifier],
      },
      {
        name: 'editHypoMoMap',
        description: 'Edit a HypoMoMap',
        input: [this.hypoMoMapMetaModelService.hypoMoMapMetaModelIdentifier],
        output: [this.hypoMoMapMetaModelService.hypoMoMapMetaModelIdentifier],
      },
      {
        name: 'viewHypoMoMap',
        description: 'View a HypoMoMap',
        input: [this.hypoMoMapMetaModelService.hypoMoMapMetaModelIdentifier],
        output: [this.hypoMoMapMetaModelService.hypoMoMapMetaModelIdentifier],
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
