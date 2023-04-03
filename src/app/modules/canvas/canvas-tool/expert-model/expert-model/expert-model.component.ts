import { Component } from '@angular/core';
import { ExpertModelLoaderService } from '../expert-model-loader.service';
import { ExpertModel } from '../../../canvas-meta-artifact/expert-model';

@Component({
  selector: 'app-expert-model',
  templateUrl: './expert-model.component.html',
  styleUrls: ['./expert-model.component.css'],
  providers: [ExpertModelLoaderService],
})
export class ExpertModelComponent {
  constructor(private expertModelLoaderService: ExpertModelLoaderService) {}

  get expertModel(): ExpertModel | undefined {
    return this.expertModelLoaderService.expertModel;
  }
}
