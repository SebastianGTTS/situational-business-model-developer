import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessApiService } from '../process-api.service';
import { CanvasResolveService } from '../../canvas-resolve.service';
import { InstanceLoaderService } from '../instance-loader.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RunningArtifact } from '../../../development-process-registry/running-process/running-artifact';
import { ConcreteArtifactService } from '../../../development-process-registry/running-process/concrete-artifact.service';

@Component({
  selector: 'app-view-canvas',
  templateUrl: './view-canvas.component.html',
  styleUrls: ['./view-canvas.component.css'],
  providers: [InstanceLoaderService, ProcessApiService],
})
export class ViewCanvasComponent implements OnInit, OnDestroy {
  artifact: RunningArtifact = null;
  version: number = null;

  private querySubscription: Subscription;

  constructor(
    private canvasResolveService: CanvasResolveService,
    private concreteArtifactService: ConcreteArtifactService,
    private instanceLoaderService: InstanceLoaderService,
    public processApiService: ProcessApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.querySubscription = this.route.queryParamMap.subscribe(
      async (params) => {
        if (params.has('artifactId')) {
          this.artifact = await this.concreteArtifactService.get(
            params.get('artifactId')
          );
          this.version = +params.get('versionId');
        } else {
          this.artifact = null;
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  finish() {
    this.canvasResolveService.resolveEditCanvas(
      this.processApiService.stepInfo,
      this.companyModel._id,
      this.instance.id
    );
  }

  get companyModel() {
    return this.instanceLoaderService.companyModel;
  }

  get instance() {
    return this.instanceLoaderService.instance;
  }

  get queryParams() {
    if (this.artifact != null) {
      return {
        artifactId: this.artifact._id,
      };
    } else {
      return this.processApiService.queryParams;
    }
  }
}
