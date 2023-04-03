import { Component, OnInit } from '@angular/core';
import { BmProcessServiceBase } from 'src/app/development-process-registry/bm-process/bm-process.service';
import { BmPhaseProcess } from '../../../development-process-registry/bm-process/bm-phase-process';
import { BmPhaseProcessService } from '../../../development-process-registry/bm-process/bm-phase-process.service';
import { BmProcessLoaderService } from '../../shared/bm-process-loader.service';
import { BmPhaseProcessTutorialService } from './bm-phase-process-tutorial.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bm-phase-process',
  templateUrl: './bm-phase-process.component.html',
  styleUrls: ['./bm-phase-process.component.css'],
  providers: [
    { provide: BmProcessServiceBase, useExisting: BmPhaseProcessService },
    BmPhaseProcessTutorialService,
  ],
})
export class BmPhaseProcessComponent implements OnInit {
  constructor(
    private bmProcessLoaderService: BmProcessLoaderService,
    private bmPhaseProcessTutorialService: BmPhaseProcessTutorialService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    void this.bmPhaseProcessTutorialService.init(
      this.route.snapshot.queryParamMap.get('created') === 'true',
      this.route.snapshot.queryParamMap.get('tutorial') === 'true'
    );
  }

  get bmProcess(): BmPhaseProcess | undefined {
    return this.bmProcessLoaderService.bmPhaseProcess;
  }
}
