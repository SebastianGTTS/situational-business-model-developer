import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessPatternLoaderService } from '../../shared/process-pattern-loader.service';
import { ProcessPattern } from '../../../development-process-registry/process-pattern/process-pattern';
import { ProcessPatternDiagramService } from '../../../development-process-registry/process-pattern/process-pattern-diagram.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-process-pattern-overview',
  templateUrl: './process-pattern-overview.component.html',
  styleUrls: ['./process-pattern-overview.component.scss'],
})
export class ProcessPatternOverviewComponent implements OnInit, OnDestroy {
  patternCorrectlyDefined = true;

  private loadedSubscription?: Subscription;

  constructor(
    private processPatternLoaderService: ProcessPatternLoaderService,
    private processPatternDiagramService: ProcessPatternDiagramService
  ) {}

  ngOnInit(): void {
    this.loadedSubscription = this.processPatternLoaderService.loaded.subscribe(
      async () => {
        if (this.processPattern != null) {
          this.patternCorrectlyDefined =
            await this.processPatternDiagramService.isCorrectlyDefined(
              this.processPattern
            );
        } else {
          this.patternCorrectlyDefined = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.loadedSubscription?.unsubscribe();
  }

  get processPattern(): ProcessPattern | undefined {
    return this.processPatternLoaderService.processPattern;
  }
}
