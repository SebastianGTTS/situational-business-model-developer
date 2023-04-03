import { Component, ViewChildren, QueryList } from '@angular/core';
import {
  BmProcess,
  BmProcessInit,
} from '../../../development-process-registry/bm-process/bm-process';
import { BmProcessServiceBase } from '../../../development-process-registry/bm-process/bm-process.service';
import { SelectionInit } from '../../../development-process-registry/development-method/selection';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import { SituationalFactorInit } from '../../../development-process-registry/method-elements/situational-factor/situational-factor';
import { UPDATABLE, Updatable } from '../../../shared/updatable';
import { BmProcessLoaderService } from '../../shared/bm-process-loader.service';
import { BmProcessGeneralComponent } from '../bm-process-general/bm-process-general.component';

@Component({
  selector: 'app-bm-process-context',
  templateUrl: './bm-process-context.component.html',
  styleUrls: ['./bm-process-context.component.scss'],
  providers: [{ provide: UPDATABLE, useExisting: BmProcessGeneralComponent }],
})
export class BmProcessContextComponent<
  T extends BmProcess,
  S extends BmProcessInit
> implements Updatable
{
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private bmProcessLoaderService: BmProcessLoaderService,
    private bmProcessService: BmProcessServiceBase<T, S>
  ) {}

  async updateDomains(domains: Domain[]): Promise<void> {
    if (this.bmProcess != null) {
      await this.bmProcessService.updateDomains(this.bmProcess._id, domains);
    }
  }

  async updateSituationalFactors(
    situationalFactors: SelectionInit<SituationalFactorInit>[]
  ): Promise<void> {
    if (this.bmProcess != null) {
      await this.bmProcessService.updateSituationalFactors(
        this.bmProcess._id,
        situationalFactors
      );
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get bmProcess(): BmProcess | undefined {
    return this.bmProcessLoaderService.bmProcess;
  }
}
