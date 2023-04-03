import { Component, QueryList, ViewChildren } from '@angular/core';
import { ProcessPatternLoaderService } from '../../shared/process-pattern-loader.service';
import { ProcessPattern } from '../../../development-process-registry/process-pattern/process-pattern';
import { ProcessPatternService } from '../../../development-process-registry/process-pattern/process-pattern.service';
import { IconInit } from '../../../model/icon';
import { UPDATABLE, Updatable } from '../../../shared/updatable';

@Component({
  selector: 'app-process-pattern-general',
  templateUrl: './process-pattern-general.component.html',
  styleUrls: ['./process-pattern-general.component.scss'],
  providers: [
    { provide: UPDATABLE, useExisting: ProcessPatternGeneralComponent },
  ],
})
export class ProcessPatternGeneralComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private processPatternLoaderService: ProcessPatternLoaderService,
    private processPatternService: ProcessPatternService
  ) {}

  async updateProcessPatternValue(
    value: Partial<ProcessPattern>
  ): Promise<void> {
    if (this.processPattern != null) {
      await this.processPatternService.update(this.processPattern._id, value);
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.processPattern != null) {
      await this.processPatternService.updateIcon(
        this.processPattern._id,
        icon
      );
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get processPattern(): ProcessPattern | undefined {
    return this.processPatternLoaderService.processPattern;
  }
}
