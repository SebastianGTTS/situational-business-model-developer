import { Injectable } from '@angular/core';
import {
  ExperimentDefinition,
  ExperimentDefinitionEntry,
  ExperimentDefinitionInit,
} from './experiment-definition';
import { Experiment, ExperimentInit } from './experiment';
import { Author } from '../../../model/author';
import { DefaultElementService } from '../../../database/default-element.service';
import { HypoMoMapMetaArtifactModule } from './hypo-mo-map-meta-artifact.module';
import { IconInit } from '../../../model/icon';

@Injectable({
  providedIn: HypoMoMapMetaArtifactModule,
})
export class ExperimentRepoService extends DefaultElementService<
  ExperimentDefinition,
  ExperimentDefinitionInit
> {
  protected readonly typeName = ExperimentDefinition.typeName;

  protected readonly elementConstructor = ExperimentDefinition;

  /**
   * Get an initialization for a new experiment definition.
   *
   * @param name name of the experiment
   */
  getExperimentDefinitionInit(name: string): ExperimentDefinitionInit {
    return {
      author: {},
      experiment: {
        id: 'root',
        name: name,
      },
    };
  }

  /**
   * Get the list of the experiment definitions.
   *
   * @param ignored list of ids that should be ignored
   */
  async getExperimentsList(
    ignored: string[] = []
  ): Promise<ExperimentDefinitionEntry[]> {
    return this.pouchdbService.find<ExperimentDefinitionEntry>(
      ExperimentDefinition.typeName,
      {
        selector: {
          $not: {
            _id: { $in: ignored },
          },
        },
      }
    );
  }

  /**
   * Update the author of an experiment definition.
   *
   * @param id the id of the experiment definition
   * @param author the new values of the author (values will be copied to the current object)
   */
  async updateExperimentDefinitionAuthor(
    id: string,
    author: Partial<Author>
  ): Promise<void> {
    try {
      const experimentDefinition = await this.getWrite(id);
      experimentDefinition.updateAuthor(author);
      await this.save(experimentDefinition);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Add experiment to an experiment definition
   *
   * @param id the id of the experiment definition
   * @param experiment the experiment to add (values will be copied to new object)
   * @param parentId the id of the parent experiment
   */
  async addExperiment(
    id: string,
    experiment: ExperimentInit,
    parentId: string
  ): Promise<void> {
    try {
      const experimentDefinition = await this.getWrite(id);
      experimentDefinition.addExperiment(experiment, parentId);
      await this.save(experimentDefinition);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update an experiment of an experiment definition
   *
   * @param id the id of the experiment definition
   * @param experimentId the id of the experiment
   * @param parentExperimentId the experiment id of the parent experiment
   * @param experiment the new values of the experiment (values will be copied to the current object)
   */
  async updateExperiment(
    id: string,
    experimentId: string,
    parentExperimentId: string | undefined,
    experiment: Partial<Experiment>
  ): Promise<void> {
    try {
      const experimentDefinition = await this.getWrite(id);
      experimentDefinition.updateExperiment(
        experimentId,
        parentExperimentId,
        experiment
      );
      await this.save(experimentDefinition);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update the icon of a development method
   *
   * @param id
   * @param experimentId
   * @param icon
   */
  async updateExperimentIcon(
    id: string,
    experimentId: string,
    icon: IconInit
  ): Promise<void> {
    try {
      const experimentDefinition = await this.getWrite(id);
      experimentDefinition.updateIcon(experimentId, icon);
      await this.save(experimentDefinition);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Remove an experiment from an experiment definition
   *
   * @param id the id of the experiment definition
   * @param experimentId the id of the experiment to remove
   */
  async removeExperiment(id: string, experimentId: string): Promise<void> {
    try {
      const experimentDefinition = await this.getWrite(id);
      experimentDefinition.removeExperiment(experimentId);
      await this.save(experimentDefinition);
    } finally {
      this.freeWrite(id);
    }
  }
}
