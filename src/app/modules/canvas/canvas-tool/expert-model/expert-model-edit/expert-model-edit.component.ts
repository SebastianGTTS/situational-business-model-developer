import { Component } from '@angular/core';
import { ExpertModelService } from '../../../canvas-meta-artifact/expert-model.service';
import { ExpertModelLoaderService } from '../expert-model-loader.service';
import { ExpertModel } from '../../../canvas-meta-artifact/expert-model';

@Component({
  selector: 'app-expert-model-edit',
  templateUrl: './expert-model-edit.component.html',
  styleUrls: ['./expert-model-edit.component.css'],
})
export class ExpertModelEditComponent {
  constructor(
    private expertModelLoaderService: ExpertModelLoaderService,
    private expertModelService: ExpertModelService
  ) {}

  async updateExpertModel(): Promise<void> {
    if (this.expertModel != null) {
      await this.expertModelService.save(this.expertModel);
    }
  }

  get expertModel(): ExpertModel | undefined {
    return this.expertModelLoaderService.expertModel;
  }
}
