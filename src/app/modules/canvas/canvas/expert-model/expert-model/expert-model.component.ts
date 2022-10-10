import { Component } from '@angular/core';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';
import { ImportExportService } from '../../feature-model/import-export.service';
import { Instance, InstanceType } from '../../../canvas-meta-model/instance';
import { FormGroup } from '@angular/forms';
import { Domain } from '../../../../../development-process-registry/knowledge/domain';
import { ExpertModelLoaderService } from '../expert-model-loader.service';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';
import { Author } from '../../../../../model/author';

@Component({
  selector: 'app-expert-model',
  templateUrl: './expert-model.component.html',
  styleUrls: ['./expert-model.component.css'],
  providers: [ExpertModelLoaderService],
})
export class ExpertModelComponent {
  constructor(
    private expertModelLoaderService: ExpertModelLoaderService,
    private expertModelService: ExpertModelService,
    private importExportService: ImportExportService
  ) {}

  async exportModel(): Promise<void> {
    if (this.expertModel != null) {
      await this.importExportService.exportExpertModel(this.expertModel._id);
    }
  }

  async update(description: Partial<ExpertModel>): Promise<void> {
    if (this.expertModel != null) {
      await this.expertModelService.update(this.expertModel._id, description);
    }
  }

  async updateDomains(domains: Domain[]): Promise<void> {
    if (this.expertModel != null) {
      await this.expertModelService.updateDomains(
        this.expertModel._id,
        domains
      );
    }
  }

  async updateFeatureModelAuthor(authorInfo: Partial<Author>): Promise<void> {
    if (this.expertModel != null) {
      await this.expertModelService.updateAuthor(
        this.expertModel._id,
        authorInfo
      );
    }
  }

  /**
   * Add a new instance.
   */
  async addInstance(
    instanceForm: FormGroup,
    type = InstanceType.EXAMPLE
  ): Promise<void> {
    if (this.expertModel != null) {
      await this.expertModelService.addInstance(this.expertModel._id, {
        name: instanceForm.value.name,
        type,
      });
    }
  }

  /**
   * Navigate to a single business model.
   *
   * @param instance the pattern instance
   * @return the navigation link
   */
  viewExample = (instance: Instance): string[] => {
    return [
      '/',
      'expertModels',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.expertModel!._id,
      'examples',
      instance.id.toString(),
    ];
  };

  /**
   * Navigate to a component to view the pattern
   *
   * @param instance the pattern instance
   * @return the navigation link
   */
  viewPattern = (instance: Instance): string[] => {
    return [
      '/',
      'expertModels',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.expertModel!._id,
      'patterns',
      instance.id.toString(),
    ];
  };

  /**
   * Delete an instance by id.
   *
   * @param instanceId id of the instance
   */
  async deleteInstance(instanceId: number): Promise<void> {
    if (this.expertModel != null) {
      await this.expertModelService.removeInstance(
        this.expertModel._id,
        instanceId
      );
    }
  }

  getExampleInstances(): Instance[] {
    if (this.expertModel != null) {
      return this.expertModel.instances.filter(
        (instance) => instance.type === InstanceType.EXAMPLE
      );
    } else {
      return [];
    }
  }

  getPatternInstances(): Instance[] {
    if (this.expertModel != null) {
      return this.expertModel.instances.filter(
        (instance) => instance.type === InstanceType.PATTERN
      );
    } else {
      return [];
    }
  }

  getPatternInstanceType(): InstanceType {
    return InstanceType.PATTERN;
  }

  get expertModel(): ExpertModel | undefined {
    return this.expertModelLoaderService.expertModel;
  }
}
