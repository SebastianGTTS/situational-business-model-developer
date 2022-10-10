import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RunningArtifact } from '../running-process/running-artifact';
import { ConcreteArtifactService } from '../running-process/concrete-artifact.service';
import { ApiQueryParams } from './api-query-params';
import {
  ArtifactVersion,
  ArtifactVersionId,
} from '../running-process/artifact-version';

@Injectable()
export class ArtifactApiService implements OnDestroy {
  private readonly _loadedObservable: Observable<void>;
  private readonly _loaded: Subject<void>;
  get loaded(): Observable<void> {
    return this._loadedObservable;
  }

  artifact?: RunningArtifact;
  version?: ArtifactVersion;

  private querySubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private concreteArtifactService: ConcreteArtifactService
  ) {
    this._loaded = new Subject<void>();
    this._loadedObservable = this._loaded.asObservable();
    this.querySubscription = this.route.queryParamMap.subscribe((params) => {
      const artifactId = params.get('artifactId');
      const versionId = params.get('artifactVersionId') ?? undefined;
      if (artifactId != null) {
        void this.loadArtifact(artifactId, versionId);
      } else {
        this.artifact = undefined;
        this.version = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
    this._loaded.complete();
  }

  private async loadArtifact(
    artifactId: string,
    versionId?: ArtifactVersionId
  ): Promise<void> {
    this.artifact = await this.concreteArtifactService.get(artifactId);
    if (versionId != null) {
      this.version = this.artifact.getVersion(versionId);
    } else {
      this.version = undefined;
    }
    this._loaded.next();
  }

  get queryParams(): ApiQueryParams {
    return {
      artifactId: this.artifact?._id,
      artifactVersionId: this.version?.id,
    };
  }
}
