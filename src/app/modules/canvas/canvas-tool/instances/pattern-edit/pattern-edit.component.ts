import { Component } from '@angular/core';
import { InstanceLoaderService } from '../../expert-model/instance-loader.service';
import { Instance } from '../../../canvas-meta-artifact/instance';
import { ExpertModel } from '../../../canvas-meta-artifact/expert-model';
import { FeatureInit } from '../../../canvas-meta-artifact/feature';
import { ExpertModelService } from '../../../canvas-meta-artifact/expert-model.service';

@Component({
  selector: 'app-pattern-edit',
  templateUrl: './pattern-edit.component.html',
  styleUrls: ['./pattern-edit.component.scss'],
})
export class PatternEditComponent {
  constructor(
    private expertModelService: ExpertModelService,
    private instanceLoaderService: InstanceLoaderService
  ) {}

  async addDecision(featureId: string): Promise<void> {
    if (this.expertModel != null && this.instance != null) {
      await this.expertModelService.addDecisionToInstance(
        this.expertModel._id,
        this.instance.id,
        featureId
      );
    }
  }

  async addFeature(parentId: string, featureInit: FeatureInit): Promise<void> {
    if (this.expertModel != null && this.instance != null) {
      await this.expertModelService.addFeatureToInstance(
        this.expertModel._id,
        this.instance.id,
        parentId,
        featureInit
      );
    }
  }

  async removeDecision(featureId: string): Promise<void> {
    if (this.expertModel != null && this.instance != null) {
      await this.expertModelService.removeDecisionFromInstance(
        this.expertModel._id,
        this.instance.id,
        featureId
      );
    }
  }

  get instance(): Instance | undefined {
    return this.instanceLoaderService.instance;
  }

  get expertModel(): ExpertModel | undefined {
    return this.instanceLoaderService.expertModel;
  }
}
