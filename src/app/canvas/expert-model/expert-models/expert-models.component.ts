import { Component, OnInit } from '@angular/core';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';
import { Router } from '@angular/router';
import { CanvasDefinition } from '../../../canvas-meta-model/canvas-definition';

@Component({
  selector: 'app-expert-models',
  templateUrl: './expert-models.component.html',
  styleUrls: ['./expert-models.component.css']
})
export class ExpertModelsComponent implements OnInit {

  expertModelList: ExpertModel[];

  constructor(
    private expertModelService: ExpertModelService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.loadExpertModelList();
  }

  async addExpertModel(definition: CanvasDefinition, name: string, description: string) {
    await this.expertModelService.createExpertModel({name, description}, definition);
    this.loadExpertModelList();
  }

  viewExpertModel(expertModelId: string): void {
    this.router.navigate(['/expertModels', expertModelId]);
  }

  editExpertModel(expertModelId: string): void {
    this.router.navigate(['/expertModels', expertModelId, 'edit']);
  }

  async deleteExpertModel(featureModelId: string) {
    await this.expertModelService.remove(featureModelId);
    this.loadExpertModelList();
  }

  async loadExpertModelList() {
    const result = await this.expertModelService.getList();
    this.expertModelList = result.docs;
  }

}
