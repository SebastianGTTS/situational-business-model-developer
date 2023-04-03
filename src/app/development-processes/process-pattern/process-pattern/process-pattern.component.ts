import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcessPatternService } from '../../../development-process-registry/process-pattern/process-pattern.service';
import { ProcessPatternDiagramComponent } from '../process-pattern-diagram/process-pattern-diagram.component';
import { ProcessPatternLoaderService } from '../../shared/process-pattern-loader.service';
import { ProcessPattern } from '../../../development-process-registry/process-pattern/process-pattern';
import { ProcessPatternTutorialService } from './process-pattern-tutorial.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-process-pattern',
  templateUrl: './process-pattern.component.html',
  styleUrls: ['./process-pattern.component.css'],
  providers: [ProcessPatternLoaderService, ProcessPatternTutorialService],
})
export class ProcessPatternComponent implements OnInit {
  correctlyDefined = true;

  @ViewChild(ProcessPatternDiagramComponent)
  diagramComponent!: ProcessPatternDiagramComponent;

  constructor(
    private processPatternLoaderService: ProcessPatternLoaderService,
    private processPatternService: ProcessPatternService,
    private processPatternTutorialService: ProcessPatternTutorialService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    void this.processPatternTutorialService.init(
      this.route.snapshot.queryParamMap.get('created') === 'true',
      this.route.snapshot.queryParamMap.get('tutorial') === 'true'
    );
    this.processPatternLoaderService.loaded.subscribe(async () => {
      if (this.processPattern != null) {
        this.correctlyDefined =
          await this.processPatternService.isCorrectlyDefined(
            this.processPattern
          );
      } else {
        this.correctlyDefined = true;
      }
    });
  }

  get processPattern(): ProcessPattern | undefined {
    return this.processPatternLoaderService.processPattern;
  }
}
