import { Component, OnDestroy, OnInit } from '@angular/core';
import { BmPhaseProcess } from 'src/app/development-process-registry/bm-process/bm-phase-process';
import { BmProcessLoaderService } from '../../shared/bm-process-loader.service';
import { Subscription } from 'rxjs';
import { BmPhaseProcessService } from '../../../development-process-registry/bm-process/bm-phase-process.service';

@Component({
  selector: 'app-bm-phase-process-overview',
  templateUrl: './bm-phase-process-overview.component.html',
  styleUrls: ['./bm-phase-process-overview.component.scss'],
})
export class BmPhaseProcessOverviewComponent implements OnInit, OnDestroy {
  methodCorrectlyDefined = true;

  private loadedSubscription?: Subscription;

  constructor(
    private bmProcessLoaderService: BmProcessLoaderService,
    private bmPhaseProcessService: BmPhaseProcessService
  ) {}

  ngOnInit(): void {
    this.loadedSubscription = this.bmProcessLoaderService.loaded.subscribe(
      async () => {
        if (this.bmProcess != null) {
          this.methodCorrectlyDefined =
            await this.bmPhaseProcessService.isComplete(this.bmProcess);
        } else {
          this.methodCorrectlyDefined = true;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.loadedSubscription?.unsubscribe();
  }

  get bmProcess(): BmPhaseProcess | undefined {
    return this.bmProcessLoaderService.bmPhaseProcess;
  }
}
