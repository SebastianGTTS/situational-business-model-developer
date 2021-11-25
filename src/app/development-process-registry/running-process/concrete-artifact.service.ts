import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { PouchdbService } from '../../database/pouchdb.service';
import { Observable } from 'rxjs';
import { RunningArtifact } from './running-artifact';
import { ArtifactDataType } from './artifact-data';
import { ArtifactVersion } from './artifact-version';
import { ArtifactDataService } from './artifact-data.service';
import { ElementService } from '../../database/element.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ConcreteArtifactService
  implements ElementService<RunningArtifact>
{
  constructor(
    private artifactDataService: ArtifactDataService,
    private pouchdbService: PouchdbService
  ) {}

  async add(artifact: Partial<RunningArtifact>): Promise<void> {
    await this.pouchdbService.post(new RunningArtifact(artifact));
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
      if (version.importName == null) {
        version.importName = importName;
      }
    });
    await this.add(artifact);
    return artifact;
  }

  async getList(): Promise<RunningArtifact[]> {
    return this.pouchdbService.find<RunningArtifact>(RunningArtifact.typeName, {
      selector: {},
    });
  }

  async get(id: string): Promise<RunningArtifact> {
    return new RunningArtifact(
      await this.pouchdbService.get<RunningArtifact>(id)
    );
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

  async update(
    id: string,
    runningArtifact: Partial<RunningArtifact>
  ): Promise<void> {
    const artifact = await this.get(id);
    artifact.update(runningArtifact);
    await this.save(artifact);
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
    const artifact = new RunningArtifact({
      ...runningArtifact.toDb(),
    });
    artifact.resetDatabaseState();
    artifact.versions = await Promise.all(
      artifact.versions.map(async (version) => {
        if (version.data.type === ArtifactDataType.REFERENCE) {
          return new ArtifactVersion({
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
