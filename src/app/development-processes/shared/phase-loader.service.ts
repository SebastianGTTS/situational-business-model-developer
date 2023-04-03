import { Injectable } from '@angular/core';
import { PhaseListLoaderService } from './phase-list-loader.service';
import { Phase } from '../../development-process-registry/phase/phase';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PhaseListService } from '../../development-process-registry/phase/phase-list.service';

@Injectable()
export class PhaseLoaderService extends PhaseListLoaderService {
  phase?: Phase;
  private phaseId?: string;

  constructor(phaseListService: PhaseListService, route: ActivatedRoute) {
    super(phaseListService, route);
    this.loaded.subscribe(() => this.loadPhase());
  }

  protected initParams(paramMap: ParamMap): void {
    super.initParams(paramMap);
    this.phaseId = paramMap.get('id') ?? undefined;
  }

  private loadPhase(): void {
    this.phase = this.phaseList?.getPhase(this.phaseId);
  }
}
