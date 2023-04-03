import { ArtifactDataReference } from './running-process/artifact-data';
import { Router } from '@angular/router';
import { DatabaseEntry, DbId } from '../database/database-entry';
import { ArtifactVersionId } from './running-process/artifact-version';
import { Type } from '@angular/core';
import { ConfigurationFormComponent } from './module-api/configuration-form-component';
import { UntypedFormGroup } from '@angular/forms';
import { MetaArtifactData } from './method-elements/artifact/artifact';

/**
 * Used to uniquely identify meta artifacts.
 */
export type MetaArtifactType = string;

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
 * Used for utility operations on the meta artifact.
 */
export interface MetaArtifactApi {
  /**
   * Called if the business developer wants to manually create an artifact
   * that has this meta artifact as underlying type.
   *
   * @param router
   * @param reference
   * @param artifactId
   */
  create(router: Router, reference: Reference, artifactId: DbId): void;

  /**
   * Called if the business developer wants to manually edit an artifact
   * that has this meta artifact as underlying type.
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
   * that has this meta artifact as underlying type.
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
   * that have this meta artifact as underlying type.
   * This is used when the artifact is an output artifact and is
   * selected to be saved in the development method (internal: running process).
   *
   * @param model
   */
  getName(model: ArtifactDataReference): Promise<string | undefined>;

  /**
   * Copy an artifact that has this meta artifact as underlying type.
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
   * Get a component to configure meta artifact data. Displayed when selecting
   * this meta artifact for an artifact in the artifact detail page.
   */
  getMetaArtifactDataComponent?(): Type<ConfigurationFormComponent>;

  /**
   * Create the form to be used together with the meta artifact data component.
   *
   * @param metaArtifactData
   */
  createMetaArtifactDataForm?(
    metaArtifactData: MetaArtifactData | undefined
  ): UntypedFormGroup;

  /**
   * Check whether two MetaArtifactData objects are equal.
   * Used to display whether a form has changed or not.
   *
   * @param metaArtifactDataA
   * @param metaArtifactDataB
   */
  equalMetaArtifactData?(
    metaArtifactDataA: MetaArtifactData | undefined,
    metaArtifactDataB: MetaArtifactData | undefined
  ): boolean;

  /**
   * Check whether two MetaArtifactData objects are compatible.
   * Used to check whether a mapping from an input artifact to an output
   * artifact is valid.
   *
   * @param metaArtifactDataA
   * @param metaArtifactDataB
   */
  compatibleMetaArtifactData?(
    metaArtifactDataA: MetaArtifactData | undefined,
    metaArtifactDataB: MetaArtifactData | undefined
  ): boolean;
}

/**
 * Used to save a relation to a specific meta artifact in the database.
 */
export interface MetaArtifactIdentifier extends DatabaseEntry {
  /**
   * The name of the meta artifact.
   */
  name: string;

  /**
   * The type of the meta artifact.
   */
  type: MetaArtifactType;
}

/**
 * Every artifact module needs to provide this class to the MetaArtifactService
 * to register itself.
 */
export interface MetaArtifactDefinition {
  /**
   * The name of the meta artifact
   */
  name: string;

  /**
   * The type of the meta artifact to identify it, e.g., to identify
   * which MetaArtifactApi to use.
   */
  type: MetaArtifactType;

  /**
   * The api for utility operations on the meta artifact, e.g., copy
   * and remove.
   */
  api: MetaArtifactApi;
}
