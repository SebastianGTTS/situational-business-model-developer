import { Component } from '@angular/core';
import { ExpertModel } from '../../../canvas-meta-artifact/expert-model';
import { ExpertModelLoaderService } from '../expert-model-loader.service';
import { ImportExportService } from '../../feature-model/import-export.service';

@Component({
  selector: 'app-expert-model-overview',
  templateUrl: './expert-model-overview.component.html',
  styleUrls: ['./expert-model-overview.component.scss'],
})
export class ExpertModelOverviewComponent {
  constructor(
    private expertModelLoaderService: ExpertModelLoaderService,
    private importExportService: ImportExportService
  ) {}

  async exportModel(): Promise<void> {
    if (this.expertModel != null) {
      await this.importExportService.exportExpertModel(this.expertModel._id);
    }
  }

  get expertModel(): ExpertModel | undefined {
    return this.expertModelLoaderService.expertModel;
  }
}
