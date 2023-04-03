import { Component } from '@angular/core';
import { InstanceLoaderService } from '../../expert-model/instance-loader.service';
import { Instance, InstanceType } from '../../../canvas-meta-artifact/instance';
import { ExpertModel } from '../../../canvas-meta-artifact/expert-model';
import { ExpertModelService } from '../../../canvas-meta-artifact/expert-model.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instance-overview',
  templateUrl: './instance-overview.component.html',
  styleUrls: ['./instance-overview.component.scss'],
})
export class InstanceOverviewComponent {
  constructor(
    private expertModelService: ExpertModelService,
    private instanceLoaderService: InstanceLoaderService,
    private router: Router
  ) {}

  /**
   * Create adaptation of the instance.
   */
  async createAdaptation(): Promise<void> {
    if (this.expertModel != null && this.instance != null) {
      const instance = await this.expertModelService.createAdaptation(
        this.expertModel._id,
        this.instance.id
      );
      if (this.instance.type === InstanceType.EXAMPLE) {
        await this.router.navigate([
          'expertModels',
          this.expertModel._id,
          'examples',
          instance.id,
        ]);
      } else {
        await this.router.navigate([
          'expertModels',
          this.expertModel._id,
          'patterns',
          instance.id,
        ]);
      }
    }
  }

  get instance(): Instance | undefined {
    return this.instanceLoaderService.instance;
  }

  get expertModel(): ExpertModel | undefined {
    return this.instanceLoaderService.expertModel;
  }

  get instanceTypeName(): string | undefined {
    if (this.instance != null) {
      switch (this.instance.type) {
        case InstanceType.EXAMPLE:
          return 'Example';
        case InstanceType.PATTERN:
          return 'Pattern';
      }
    }
    return undefined;
  }
}
