import { Component } from '@angular/core';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';
import { ExpertModelLoaderService } from '../expert-model-loader.service';

@Component({
  selector: 'app-expert-model-edit',
  templateUrl: './expert-model-edit.component.html',
  styleUrls: ['./expert-model-edit.component.css'],
  providers: [ExpertModelLoaderService],
})
export class ExpertModelEditComponent {
  constructor(
    private expertModelLoaderService: ExpertModelLoaderService,
    private expertModelService: ExpertModelService
  ) {}

  async updateExpertModel() {
    await this.expertModelService.save(this.expertModel);
  }

  get expertModel() {
    return this.expertModelLoaderService.expertModel;
  }
}
