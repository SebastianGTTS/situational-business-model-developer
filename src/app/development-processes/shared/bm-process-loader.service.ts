import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  BmPatternProcess,
  isBmPatternProcessEntry,
} from '../../development-process-registry/bm-process/bm-pattern-process';
import { ElementLoaderService } from '../../database/element-loader.service';
import {
  BmPhaseProcess,
  isBmPhaseProcessEntry,
} from '../../development-process-registry/bm-process/bm-phase-process';
import { BmProcess } from '../../development-process-registry/bm-process/bm-process';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';

@Injectable()
export class BmProcessLoaderService extends ElementLoaderService {
  bmProcess?: BmProcess;
  bmPatternProcess?: BmPatternProcess;
  bmPhaseProcess?: BmPhaseProcess;

  constructor(
    private bmProcessService: BmProcessService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const bmProcessId = paramMap.get('id');
    if (bmProcessId != null) {
      this.changesFeed = this.bmProcessService
        .getChangesFeed(bmProcessId)
        .subscribe(() => this.loadBmProcess(bmProcessId));
      void this.loadBmProcess(bmProcessId);
    } else {
      this.bmProcess = undefined;
      this.bmPatternProcess = undefined;
      this.bmPhaseProcess = undefined;
    }
  }

  private async loadBmProcess(bmProcessId: string): Promise<void> {
    const bmProcessEntry = await this.bmProcessService.getEntry(bmProcessId);
    if (isBmPhaseProcessEntry(bmProcessEntry)) {
      const bmProcess = new BmPhaseProcess(bmProcessEntry, undefined);
      this.bmProcess = bmProcess;
      this.bmPhaseProcess = bmProcess;
      this.bmPatternProcess = undefined;
    } else if (isBmPatternProcessEntry(bmProcessEntry)) {
      const bmProcess = new BmPatternProcess(bmProcessEntry, undefined);
      this.bmProcess = bmProcess;
      this.bmPhaseProcess = undefined;
      this.bmPatternProcess = bmProcess;
    } else {
      this.bmProcess = new BmProcess(bmProcessEntry, undefined);
      this.bmPhaseProcess = undefined;
      this.bmPatternProcess = undefined;
    }
    this.elementLoaded();
  }
}
