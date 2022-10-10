import { ArtifactDataReference } from './running-process/artifact-data';
import { Router } from '@angular/router';
import { DatabaseEntry, DbId } from '../database/database-entry';
import { ArtifactVersionId } from './running-process/artifact-version';
import { Type } from '@angular/core';
import { ConfigurationFormComponent } from './module-api/configuration-form-component';
import { FormGroup } from '@angular/forms';
import { MetaModelData } from './method-elements/artifact/artifact';

/**
 * Used to uniquely identify meta models.
 */
export type MetaModelType = string;

/**
 * A reference used to identify from where the business developer called
 * the action.
 */
export type Reference = ProcessReference | MethodReference | ArtifactReference;

/**
 * Used if the action is called from the execution page
 * of a business model development method (internal: running process).
 */
export interface ProcessReference {
  referenceType: 'Process';
  runningProcessId: string;
  artifactVersionId?: ArtifactVersionId;
}

/**
 * Used if the action is called from the execution page
 * of a development step (internal: development method).
 */
export interface MethodReference {
  referenceType: 'Method';
  runningProcessId: string;
  executionId: string;
}

/**
 * Used if the action is called from an exported artifact page.
 */
export interface ArtifactReference {
  referenceType: 'Artifact';
  artifactId: string;
  versionId: ArtifactVersionId;
}

/**
 * Used for utility operations on the metamodel/artifact.
 */
export interface MetaModelApi {
  /**
   * Called if the business developer wants to manually create an artifact
   * that has this metamodel as underlying type.
   *
   * @param router
   * @param reference
   * @param artifactId
   */
  create(router: Router, reference: Reference, artifactId: DbId): void;

  /**
   * Called if the business developer wants to manually edit an artifact
   * that has this metamodel as underlying type.
   *
   * @param model
   * @param router
   * @param reference
   */
  edit(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): void;

  /**
   * Called if the business developer wants to view an artifact
   * that has this metamodel as underlying type.
   *
   * @param model
   * @param router
   * @param reference
   */
  view(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): void;

  /**
   * Used to get the default name for artifacts
   * that have this metamodel as underlying type.
   * This is used when the artifact is an output artifact and is
   * selected to be saved in the development method (internal: running process).
   *
   * @param model
   */
  getName(model: ArtifactDataReference): Promise<string | undefined>;

  /**
   * Copy an artifact that has this metamodel as underlying type.
   * This is used for versioning of artifacts. For each step the artifact
   * is first copied and then edited to preserve traceability.
   *
   * It is up to the module developer to correctly copy the artifact.
   *
   * @param model
   */
  copy(model: ArtifactDataReference): Promise<ArtifactDataReference>;

  /**
   * Used to delete unused artifact references. This is used after a
   * development step/business building block in a
   * business development method is finished.
   * (internal: development method in a running process)
   *
   * It is up to the module developer to correctly remove the artifact.
   *
   * @param model
   */
  remove(model: ArtifactDataReference): Promise<void>;

  /**
   * Get a component to configure metamodel data. Displayed when selecting
   * this metamodel for an artifact in the artifact detail page.
   */
  getMetaModelDataComponent?(): Type<ConfigurationFormComponent>;

  /**
   * Create the form to be used together with the metamodel data component.
   *
   * @param metaModelData
   */
  createMetaModelDataForm?(metaModelData: MetaModelData | undefined): FormGroup;

  /**
   * Check whether two MetaModelData objects are equal.
   * Used to display whether a form has changed or not.
   *
   * @param metaModelDataA
   * @param metaModelDataB
   */
  equalMetaModelData?(
    metaModelDataA: MetaModelData | undefined,
    metaModelDataB: MetaModelData | undefined
  ): boolean;

  /**
   * Check whether two MetaModelData objects are compatible.
   * Used to check whether a mapping from an input artifact to an output
   * artifact is valid.
   *
   * @param metaModelDataA
   * @param metaModelDataB
   */
  compatibleMetaModelData?(
    metaModelDataA: MetaModelData | undefined,
    metaModelDataB: MetaModelData | undefined
  ): boolean;
}

/**
 * Used to save a relation to a specific meta model in the database.
 */
export interface MetaModelIdentifier extends DatabaseEntry {
  /**
   * The name of the meta model.
   */
  name: string;

  /**
   * The type of the meta model.
   */
  type: MetaModelType;
}

/**
 * Every artifact module needs to provide this class to the MetaModelService
 * to register itself.
 */
export interface MetaModelDefinition {
  /**
   * The name of the metamodel
   */
  name: string;

  /**
   * The type of the metamodel to identify it, e.g., to identify
   * which MetaModelApi to use.
   */
  type: MetaModelType;

  /**
   * The api for utility operations on the metamodel/artifact, e.g., copy
   * and remove.
   */
  api: MetaModelApi;
}
