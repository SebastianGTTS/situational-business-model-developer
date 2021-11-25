import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { ConcreteArtifactService } from '../../development-process-registry/running-process/concrete-artifact.service';
import { ElementLoaderService } from '../../database/element-loader.service';

@Injectable()
export class ConcreteArtifactLoaderService extends ElementLoaderService {
  artifact: RunningArtifact = null;

  constructor(
    private concreteArtifactService: ConcreteArtifactService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap) {
    const artifactId = paramMap.get('id');
    this.changesFeed = this.concreteArtifactService
      .getChangesFeed(artifactId)
      .subscribe(() => this.loadArtifact(artifactId));
    void this.loadArtifact(artifactId);
  }

  private async loadArtifact(artifactId: string) {
    this.artifact = await this.concreteArtifactService.get(artifactId);
    this.elementLoaded();
  }
}
