import { Component } from '@angular/core';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';
import { ImportExportService } from '../../feature-model/import-export.service';
import { Instance, InstanceType } from '../../../canvas-meta-model/instance';
import { FormGroup } from '@angular/forms';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import { ExpertModelLoaderService } from '../expert-model-loader.service';

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

  async exportModel() {
    await this.importExportService.exportExpertModel(this.expertModel._id);
  }

  async update(description: any) {
    await this.expertModelService.update(this.expertModel._id, description);
  }

  async updateDomains(domains: Domain[]) {
    await this.expertModelService.updateDomains(this.expertModel._id, domains);
  }

  async updateFeatureModelAuthor(authorInfo: any) {
    await this.expertModelService.updateAuthor(
      this.expertModel._id,
      authorInfo
    );
  }

  /**
   * Add a new instance.
   */
  async addInstance(instanceForm: FormGroup, type = InstanceType.EXAMPLE) {
    await this.expertModelService.addInstance(this.expertModel._id, {
      name: instanceForm.value.name,
      type,
    });
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
      this.expertModel._id,
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
      this.expertModel._id,
      'patterns',
      instance.id.toString(),
    ];
  };

  /**
   * Delete an instance by id.
   *
   * @param instanceId id of the instance
   */
  async deleteInstance(instanceId: number) {
    await this.expertModelService.removeInstance(
      this.expertModel._id,
      instanceId
    );
  }

  getExampleInstances(): Instance[] {
    return this.expertModel.instances.filter(
      (instance) => instance.type === InstanceType.EXAMPLE
    );
  }

  getPatternInstances(): Instance[] {
    return this.expertModel.instances.filter(
      (instance) => instance.type === InstanceType.PATTERN
    );
  }

  getPatternInstanceType() {
    return InstanceType.PATTERN;
  }

  get expertModel() {
    return this.expertModelLoaderService.expertModel;
  }
}
