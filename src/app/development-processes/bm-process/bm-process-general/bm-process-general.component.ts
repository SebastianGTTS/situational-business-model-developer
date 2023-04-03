import { Component, QueryList, ViewChildren } from '@angular/core';
import {
  BmProcess,
  BmProcessInit,
} from 'src/app/development-process-registry/bm-process/bm-process';
import { BmProcessServiceBase } from 'src/app/development-process-registry/bm-process/bm-process.service';
import { IconInit } from 'src/app/model/icon';
import { UPDATABLE, Updatable } from 'src/app/shared/updatable';
import { BmProcessLoaderService } from '../../shared/bm-process-loader.service';

@Component({
  selector: 'app-bm-process-general',
  templateUrl: './bm-process-general.component.html',
  styleUrls: ['./bm-process-general.component.scss'],
  providers: [{ provide: UPDATABLE, useExisting: BmProcessGeneralComponent }],
})
export class BmProcessGeneralComponent<
  T extends BmProcess,
  S extends BmProcessInit
> implements Updatable
{
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private bmProcessLoaderService: BmProcessLoaderService,
    private bmProcessService: BmProcessServiceBase<T, S>
  ) {}

  async updateInfo(name: string, description: string): Promise<void> {
    if (this.bmProcess != null) {
      await this.bmProcessService.updateInfo(
        this.bmProcess._id,
        name,
        description
      );
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.bmProcess != null) {
      await this.bmProcessService.updateIcon(this.bmProcess._id, icon);
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
