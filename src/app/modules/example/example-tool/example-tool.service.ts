import { Injectable } from '@angular/core';
import { ModuleService } from '../../../development-process-registry/module-api/module.service';
import { Module } from '../../../development-process-registry/module-api/module';
import { ExampleToolApiService } from './example-tool-api.service';
import { FormBuilder } from '@angular/forms';
import { ModuleMethod } from '../../../development-process-registry/module-api/module-method';
import { ExampleArtifactService } from '../example-artifact/example-artifact.service';
import { Router } from '@angular/router';
import { Reference } from '../../../development-process-registry/meta-model-definition';
import { DbId } from '../../../database/database-entry';
import { referenceToApiQueryParams } from '../../../development-process-registry/module-api/api-query-params';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';

@Injectable({
  providedIn: 'root',
})
export class ExampleToolService {
  constructor(
    private exampleArtifactService: ExampleArtifactService,
    private exampleToolApiService: ExampleToolApiService,
    private fb: FormBuilder,
    private moduleService: ModuleService
  ) {}

  init(): void {
    const module = new Module(
      'Example Tools',
      'Example Module',
      this.getMethods(),
      this.exampleToolApiService,
      [
        // for this module we do not have navigation
      ]
    );
    this.moduleService.registerModule(module);
    console.log('Registered Example Tool Module');
    this.exampleArtifactService.registerCreateMethod(this.createExample);
    console.log('Registered Example Tool Module as create method for Examples');
    this.exampleArtifactService.registerEditMethod(this.editExample);
    console.log('Registered Example Tool Module as edit method for Examples');
    this.exampleArtifactService.registerViewMethod(this.viewExample);
    console.log('Registered Example Tool Module as view method for Examples');
  }

  private getMethods(): ModuleMethod[] {
    return [
      {
        name: 'createExample',
        description: 'Creates an example',
        input: [],
        output: [this.exampleArtifactService.exampleArtifactIdentifier],
      },
      {
        name: 'editExample',
        description: 'Edit an example',
        input: [this.exampleArtifactService.exampleArtifactIdentifier],
        output: [this.exampleArtifactService.exampleArtifactIdentifier],
      },
      {
        name: 'viewExample',
        description: 'View an example',
        input: [this.exampleArtifactService.exampleArtifactIdentifier],
        output: [this.exampleArtifactService.exampleArtifactIdentifier],
      },
    ];
  }

  async createExample(
    router: Router,
    reference: Reference,
    artifactId: DbId
  ): Promise<void> {
    const queryParams = referenceToApiQueryParams(reference);
    await router.navigate(['example', 'examples', artifactId, 'create'], {
      queryParams,
    });
  }

  async viewExample(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): Promise<void> {
    const queryParams = referenceToApiQueryParams(reference);
    await router.navigate(['example', 'examples', model.id, 'view'], {
      queryParams,
    });
  }

  async editExample(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): Promise<void> {
    const queryParams = referenceToApiQueryParams(reference);
    await router.navigate(['example', 'examples', model.id, 'edit'], {
      queryParams,
    });
  }
}
