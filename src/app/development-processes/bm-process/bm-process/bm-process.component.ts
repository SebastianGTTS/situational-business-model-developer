import { Component, OnInit } from '@angular/core';
import { BmProcess } from '../../../development-process-registry/bm-process/bm-process';
import { BmProcessLoaderService } from '../../shared/bm-process-loader.service';

@Component({
  selector: 'app-bm-process',
  templateUrl: './bm-process.component.html',
  styleUrls: ['./bm-process.component.css'],
  providers: [BmProcessLoaderService],
})
export class BmProcessComponent implements OnInit {
  private previousInitial?: boolean;

  constructor(private bmProcessLoaderService: BmProcessLoaderService) {}

  ngOnInit(): void {
    this.bmProcessLoaderService.loaded.subscribe(() => {
      if (
        this.previousInitial != null &&
        this.previousInitial &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        !this.bmProcess!.initial
      ) {
        document.body.scrollIntoView({ behavior: 'smooth' });
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.previousInitial = this.bmProcess!.initial;
    });
  }

  get bmProcess(): BmProcess | undefined {
    return this.bmProcessLoaderService.bmProcess;
  }
}
