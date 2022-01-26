import { Component, OnDestroy, OnInit } from '@angular/core';
import { WhiteboardInstance } from '../../../whiteboard-meta-model/whiteboard-instance';
import { WhiteboardInstanceLoaderService } from '../../shared/whiteboard-instance-loader.service';
import { ProcessApiService } from '../../../development-process-registry/module-api/process-api.service';
import { RunningMethod } from '../../../development-process-registry/running-process/running-method';
import { WhiteboardResolveService } from '../../whiteboard-resolve.service';
import { RunningArtifact } from '../../../development-process-registry/running-process/running-artifact';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConcreteArtifactService } from '../../../development-process-registry/running-process/concrete-artifact.service';
import { RunningProcess } from '../../../development-process-registry/running-process/running-process';

@Component({
  selector: 'app-view-whiteboard-instance',
  templateUrl: './view-whiteboard-instance.component.html',
  styleUrls: ['./view-whiteboard-instance.component.css'],
  providers: [ProcessApiService, WhiteboardInstanceLoaderService],
})
export class ViewWhiteboardInstanceComponent implements OnInit, OnDestroy {
  artifact?: RunningArtifact;
  version?: number;

  private querySubscription?: Subscription;

  constructor(
    private concreteArtifactService: ConcreteArtifactService,
    private processApiService: ProcessApiService,
    private route: ActivatedRoute,
    private whiteboardInstanceLoaderService: WhiteboardInstanceLoaderService,
    private whiteboardResolveService: WhiteboardResolveService
  ) {}

  ngOnInit(): void {
    this.querySubscription = this.route.queryParamMap.subscribe(
      async (params) => {
        if (params.has('artifactId')) {
          this.artifact = await this.concreteArtifactService.get(
            params.get('artifactId')!
          );
          if (params.has('versionId')) {
            this.version = +params.get('versionId')!;
          } else {
            this.version = undefined;
          }
        } else {
          this.artifact = undefined;
          this.version = undefined;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  finish(): void {
    if (this.whiteboardInstance != null) {
      this.whiteboardResolveService.resolve(
        this.processApiService.stepInfo,
        this.whiteboardInstance._id
      );
    }
  }

  get whiteboardInstance(): WhiteboardInstance | undefined {
    return this.whiteboardInstanceLoaderService.whiteboardInstance;
  }

  get runningProcess(): RunningProcess | undefined {
    return this.processApiService.runningProcess;
  }

  get runningMethod(): RunningMethod | undefined {
    return this.processApiService.runningMethod;
  }

  isCorrectStep(): boolean {
    return this.runningMethod != null && this.processApiService.isCorrectStep();
  }

  get queryParams(): { artifactId: string } | undefined {
    if (this.artifact != null) {
      return {
        artifactId: this.artifact._id,
      };
    }
    return undefined;
  }
}
