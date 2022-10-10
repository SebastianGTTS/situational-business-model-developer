import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { PouchdbService } from '../../database/pouchdb.service';
import { Observable } from 'rxjs';
import {
  RunningArtifact,
  RunningArtifactEntry,
  RunningArtifactInit,
} from './running-artifact';
import { ArtifactDataType } from './artifact-data';
import { ArtifactVersion, ArtifactVersionId } from './artifact-version';
import { ArtifactDataService } from './artifact-data.service';
import { ElementService } from '../../database/element.service';
import { DatabaseRevision, DbId } from '../../database/database-entry';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ConcreteArtifactService
  implements ElementService<RunningArtifact, RunningArtifactInit>
{
  constructor(
    private artifactDataService: ArtifactDataService,
    private pouchdbService: PouchdbService
  ) {}

  async add(artifact: RunningArtifactInit): Promise<RunningArtifact> {
    const add = new RunningArtifact(undefined, artifact);
    await this.pouchdbService.post(add);
    return add;
  }

  /**
   * View an internal artifact
   *
   * @param id
   * @param versionId
   */
  async view(id: DbId, versionId: ArtifactVersionId): Promise<void> {
    const artifact = await this.get(id);
    const version = artifact.getVersion(versionId);
    if (version == null) {
      throw new Error('Artifact does not contain a version with the versionId');
    }
    this.artifactDataService.edit(version.data, {
      referenceType: 'Artifact',
      artifactId: artifact._id,
      versionId: version.id,
    });
  }

  /**
   * Edit an internal artifact
   *
   * @param id
   */
  async edit(id: DbId): Promise<void> {
    const artifact = await this.get(id);
    const latestVersion = artifact.getLatestVersion();
    if (latestVersion == null) {
      throw new Error('Artifact without versions');
    }
    let editVersion: ArtifactVersion;
    if (latestVersion.editing) {
      editVersion = latestVersion;
    } else {
      artifact.addVersion({
        createdBy: 'added',
        data: await this.artifactDataService.copy(latestVersion.data),
        editing: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      editVersion = artifact.getLatestVersion()!;
      await this.save(artifact);
    }
    this.artifactDataService.edit(editVersion.data, {
      referenceType: 'Artifact',
      artifactId: artifact._id,
      versionId: editVersion.id,
    });
  }

  /**
   * Update the artifact identifier
   *
   * @param id the id of the artifact
   * @param identifier the identifier of the artifact
   */
  async updateIdentifier(id: DbId, identifier: string): Promise<void> {
    const artifact = await this.get(id);
    artifact.identifier = identifier;
    await this.save(artifact);
  }

  /**
   * Exports an artifact from a running process.
   * Copies it sets the identifier and sets created by to the import name.
   *
   * @param identifier the identifier
   * @param artifact the artifact to export
   * @param importName the import name for other processes
   */
  async export(
    identifier: string,
    artifact: RunningArtifact,
    importName: string
  ): Promise<RunningArtifact> {
    artifact = await this.copy(artifact);
    artifact.identifier = identifier;
    artifact.versions.forEach((version) => {
      version.createdBy = 'imported';
      version.executedBy = undefined;
      if (version.importName == null) {
        version.importName = importName;
      }
    });
    await this.add(artifact);
    return artifact;
  }

  async getList(): Promise<RunningArtifactEntry[]> {
    return this.pouchdbService.find<RunningArtifactEntry>(
      RunningArtifact.typeName,
      {
        selector: {},
      }
    );
  }

  async get(id: string): Promise<RunningArtifact & DatabaseRevision> {
    return new RunningArtifact(
      await this.pouchdbService.get<RunningArtifactEntry>(id),
      undefined
    ) as RunningArtifact & DatabaseRevision;
  }

  /**
   * Get the changes of a domain
   *
   * @param id the id of the domain
   * @return the changes feed
   */
  getChangesFeed(id: string): Observable<void> {
    return this.pouchdbService.getChangesFeed(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.get(id);
    for (const version of result.versions) {
      if (version.data.type === ArtifactDataType.REFERENCE) {
        await this.artifactDataService.remove(version.data);
      }
    }
    await this.pouchdbService.remove(result);
  }

  async save(runningArtifact: RunningArtifact): Promise<void> {
    await this.pouchdbService.put(runningArtifact);
  }

  /**
   * Makes a deep copy of the running artifact by also copying the objects
   * behind references.
   *
   * @param runningArtifact the artifact to copy
   * @return the copy
   */
  async copy(runningArtifact: RunningArtifact): Promise<RunningArtifact> {
    const artifact = new RunningArtifact(undefined, runningArtifact);
    artifact.resetDatabaseState();
    artifact.versions = await Promise.all(
      artifact.versions.map(async (version) => {
        if (version.data.type === ArtifactDataType.REFERENCE) {
          return new ArtifactVersion(undefined, {
            ...version,
            data: await this.artifactDataService.copy(version.data),
          });
        }
        return version;
      })
    );
    return artifact;
  }
}
