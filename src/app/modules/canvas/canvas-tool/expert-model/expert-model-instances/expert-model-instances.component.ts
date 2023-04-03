import { Component } from '@angular/core';
import { ExpertModelLoaderService } from '../expert-model-loader.service';
import { ExpertModel } from '../../../canvas-meta-artifact/expert-model';
import { FormControl, FormGroup } from '@angular/forms';
import { Instance, InstanceType } from '../../../canvas-meta-artifact/instance';
import { ExpertModelService } from '../../../canvas-meta-artifact/expert-model.service';

@Component({
  selector: 'app-expert-model-instances',
  templateUrl: './expert-model-instances.component.html',
  styleUrls: ['./expert-model-instances.component.scss'],
})
export class ExpertModelInstancesComponent {
  constructor(
    private expertModelLoaderService: ExpertModelLoaderService,
    private expertModelService: ExpertModelService
  ) {}

  /**
   * Add a new instance.
   */
  async addInstance(
    instanceForm: FormGroup<{ name: FormControl<string> }>,
    type: InstanceType
  ): Promise<void> {
    if (this.expertModel != null) {
      await this.expertModelService.addInstance(this.expertModel._id, {
        name: instanceForm.getRawValue().name,
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

  get instanceTypes(): typeof InstanceType {
    return InstanceType;
  }

  get expertModel(): ExpertModel | undefined {
    return this.expertModelLoaderService.expertModel;
  }
}
