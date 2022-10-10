import { Component, Input, Optional } from '@angular/core';
import { ProcessApiService } from '../../development-process-registry/module-api/process-api.service';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../development-process-registry/running-process/running-method';
import { ApiQueryParams } from '../../development-process-registry/module-api/api-query-params';
import { ArtifactApiService } from '../../development-process-registry/module-api/artifact-api.service';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';

@Component({
  selector: 'app-api-navigation',
  templateUrl: './api-navigation.component.html',
  styleUrls: ['./api-navigation.component.css'],
})
export class ApiNavigationComponent {
  @Input() apiName?: string;

  constructor(
    private processApiService: ProcessApiService,
    @Optional() private artifactApiService?: ArtifactApiService
  ) {}

  get runningProcess(): RunningProcess | undefined {
    return this.processApiService.runningProcess;
  }

  get runningMethod(): RunningMethod | undefined {
    return this.processApiService.runningMethod;
  }

  get artifact(): RunningArtifact | undefined {
    return this.artifactApiService?.artifact;
  }

  get artifactVersion(): number | undefined {
    if (this.artifactApiService?.version == null) {
      return undefined;
    }
    return this.artifact?.getVersionNumber(this.artifactApiService?.version);
  }

  get queryParams(): ApiQueryParams {
    return this.processApiService.queryParams;
  }

  get artifactQueryParams(): ApiQueryParams | undefined {
    return this.artifactApiService?.queryParams;
  }
}
