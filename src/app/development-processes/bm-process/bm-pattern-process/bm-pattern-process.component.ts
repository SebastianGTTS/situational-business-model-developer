import { Component, OnInit } from '@angular/core';
import { BmProcessServiceBase } from 'src/app/development-process-registry/bm-process/bm-process.service';
import { BmPatternProcess } from '../../../development-process-registry/bm-process/bm-pattern-process';
import { BmPatternProcessService } from '../../../development-process-registry/bm-process/bm-pattern-process.service';
import { BmProcessLoaderService } from '../../shared/bm-process-loader.service';
import { BmPatternProcessTutorialService } from './bm-pattern-process-tutorial.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bm-pattern-process',
  templateUrl: './bm-pattern-process.component.html',
  styleUrls: ['./bm-pattern-process.component.css'],
  providers: [
    { provide: BmProcessServiceBase, useExisting: BmPatternProcessService },
    BmPatternProcessTutorialService,
  ],
})
export class BmPatternProcessComponent implements OnInit {
  constructor(
    private bmProcessLoaderService: BmProcessLoaderService,
    private bmPatternProcessTutorialService: BmPatternProcessTutorialService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    void this.bmPatternProcessTutorialService.init(
      this.route.snapshot.queryParamMap.get('created') === 'true',
      this.route.snapshot.queryParamMap.get('tutorial') === 'true'
    );
  }

  get bmProcess(): BmPatternProcess | undefined {
    return this.bmProcessLoaderService.bmPatternProcess;
  }
}
