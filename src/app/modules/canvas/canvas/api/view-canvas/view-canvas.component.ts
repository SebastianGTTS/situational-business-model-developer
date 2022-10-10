import { Component } from '@angular/core';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { CanvasResolveService } from '../../canvas-resolve.service';
import { InstanceLoaderService } from '../instance-loader.service';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { Instance } from '../../../canvas-meta-model/instance';
import { StepInfo } from '../../../../../development-process-registry/module-api/step-info';
import { ArtifactApiService } from '../../../../../development-process-registry/module-api/artifact-api.service';

@Component({
  selector: 'app-view-canvas',
  templateUrl: './view-canvas.component.html',
  styleUrls: ['./view-canvas.component.css'],
  providers: [ArtifactApiService, InstanceLoaderService, ProcessApiService],
})
export class ViewCanvasComponent {
  constructor(
    private canvasResolveService: CanvasResolveService,
    private instanceLoaderService: InstanceLoaderService,
    private processApiService: ProcessApiService
  ) {}

  finish(): void {
    if (
      this.companyModel != null &&
      this.instance != null &&
      this.processApiService.stepInfo != null
    ) {
      this.canvasResolveService.resolveEditCanvas(
        this.processApiService.stepInfo,
        this.companyModel._id,
        this.instance.id
      );
    }
  }

  get companyModel(): CompanyModel | undefined {
    return this.instanceLoaderService.companyModel;
  }

  get instance(): Instance | undefined {
    return this.instanceLoaderService.instance;
  }

  get stepInfo(): StepInfo | undefined {
    return this.processApiService.stepInfo;
  }
}
