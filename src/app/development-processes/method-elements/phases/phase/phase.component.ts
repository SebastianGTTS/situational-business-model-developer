import { Component, QueryList, ViewChildren } from '@angular/core';
import { PhaseLoaderService } from '../../../shared/phase-loader.service';
import {
  Phase,
  PhaseInit,
} from '../../../../development-process-registry/phase/phase';
import { PhaseListService } from '../../../../development-process-registry/phase/phase-list.service';
import { PhaseList } from '../../../../development-process-registry/phase/phase-list';
import { Updatable, UPDATABLE } from 'src/app/shared/updatable';
import { IconInit } from 'src/app/model/icon';

@Component({
  selector: 'app-phase',
  templateUrl: './phase.component.html',
  styleUrls: ['./phase.component.css'],
  providers: [PhaseLoaderService],
})
export class PhaseComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private phaseListService: PhaseListService,
    private phaseLoaderService: PhaseLoaderService
  ) {}

  async updateValue(value: PhaseInit): Promise<void> {
    if (this.phaseList != null && this.phase != null) {
      await this.phaseListService.updatePhase(
        this.phaseList._id,
        this.phase.id,
        value
      );
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.phaseList != null && this.phase != null) {
      await this.phaseListService.updateIcon(
        this.phaseList._id,
        this.phase.id,
        icon
      );
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get phaseList(): PhaseList | undefined {
    return this.phaseLoaderService.phaseList;
  }

  get phase(): Phase | undefined {
    return this.phaseLoaderService.phase;
  }
}
