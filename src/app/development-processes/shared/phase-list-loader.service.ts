import { Injectable } from '@angular/core';
import { ElementLoaderService } from '../../database/element-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PhaseList } from '../../development-process-registry/phase/phase-list';
import { PhaseListService } from '../../development-process-registry/phase/phase-list.service';
import { DbId } from '../../database/database-entry';

@Injectable()
export class PhaseListLoaderService extends ElementLoaderService {
  phaseList?: PhaseList;
  private id?: DbId;

  constructor(
    private phaseListService: PhaseListService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected initParams(paramMap: ParamMap): void {
    void this.initChangesFeed();
    void this.loadPhaseList();
  }

  private async initChangesFeed(): Promise<void> {
    this.id = await this.phaseListService.getId();
    this.changesFeed = this.phaseListService
      .getChangesFeed(this.id)
      .subscribe(() => this.loadPhaseList());
  }

  private async loadPhaseList(): Promise<void> {
    this.phaseList = await this.phaseListService.get();
    if (this.phaseList._id !== this.id) {
      await this.initChangesFeed();
    }
    this.elementLoaded();
  }
}
