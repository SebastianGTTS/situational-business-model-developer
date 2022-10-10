import { Injectable } from '@angular/core';
import { MetaModelService } from '../../../development-process-registry/meta-model.service';
import {
  MetaModelApi,
  MetaModelDefinition,
} from '../../../development-process-registry/meta-model-definition';
import { SimulationArtifactArtifactApiService } from './simulation-artifact-artifact-api.service';

@Injectable()
export class SimulationArtifactArtifactService {
  constructor(
    private simulationArtifactArtifactApiService: SimulationArtifactArtifactApiService,
    private metaModelService: MetaModelService
  ) {}

  init(): void {
    const definition: MetaModelDefinition = {
      name: '<ADD NAME HERE>', // TODO add meta model name
      type: '<ADD TYPE NAME>', // TODO add type name
      api: this.simulationArtifactArtifactApiService,
    };
    this.metaModelService.registerMetaModel(definition);
    console.log('Registered ' + definition.name + ' Meta Model');
  }

  registerCreateMethod(create: MetaModelApi['create']): void {
    this.simulationArtifactArtifactApiService.createMethod = create;
  }

  registerEditMethod(edit: MetaModelApi['edit']): void {
    this.simulationArtifactArtifactApiService.editMethod = edit;
  }

  registerViewMethod(view: MetaModelApi['view']): void {
    this.simulationArtifactArtifactApiService.viewMethod = view;
  }
}
