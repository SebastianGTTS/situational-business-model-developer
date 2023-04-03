import { Component, OnDestroy, OnInit } from '@angular/core';
import { BmPatternProcess } from 'src/app/development-process-registry/bm-process/bm-pattern-process';
import { BmProcessLoaderService } from '../../shared/bm-process-loader.service';
import { Subscription } from 'rxjs';
import { BmPatternProcessService } from '../../../development-process-registry/bm-process/bm-pattern-process.service';

@Component({
  selector: 'app-bm-pattern-process-overview',
  templateUrl: './bm-pattern-process-overview.component.html',
  styleUrls: ['./bm-pattern-process-overview.component.scss'],
})
export class BmPatternProcessOverviewComponent implements OnInit, OnDestroy {
  methodCorrectlyDefined = true;

  private loadedSubscription?: Subscription;

  constructor(
    private bmProcessLoaderService: BmProcessLoaderService,
    private bmPatternProcessService: BmPatternProcessService
  ) {}

  ngOnInit(): void {
    this.loadedSubscription = this.bmProcessLoaderService.loaded.subscribe(
      async () => {
        if (this.bmProcess != null) {
          this.methodCorrectlyDefined =
            await this.bmPatternProcessService.isComplete(this.bmProcess);
        } else {
          this.methodCorrectlyDefined = true;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.loadedSubscription?.unsubscribe();
  }

  get bmProcess(): BmPatternProcess | undefined {
    return this.bmProcessLoaderService.bmPatternProcess;
  }
}
