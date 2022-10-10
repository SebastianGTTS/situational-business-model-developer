import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { ConcreteArtifactService } from '../../development-process-registry/running-process/concrete-artifact.service';
import { ElementLoaderService } from '../../database/element-loader.service';

@Injectable()
export class ConcreteArtifactLoaderService extends ElementLoaderService {
  artifact?: RunningArtifact;

  constructor(
    private concreteArtifactService: ConcreteArtifactService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const artifactId = paramMap.get('id');
    if (artifactId != null) {
      this.changesFeed = this.concreteArtifactService
        .getChangesFeed(artifactId)
        .subscribe(() => this.loadArtifact(artifactId));
      void this.loadArtifact(artifactId);
    } else {
      this.artifact = undefined;
    }
  }

  private async loadArtifact(artifactId: string): Promise<void> {
    this.artifact = await this.concreteArtifactService.get(artifactId);
    this.elementLoaded();
  }
}
