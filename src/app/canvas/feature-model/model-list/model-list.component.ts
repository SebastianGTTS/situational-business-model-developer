import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';
import { CanvasDefinition } from '../../../canvas-meta-model/canvas-definition';
import { CanvasDefinitionService } from '../../../canvas-meta-model/canvas-definition.service';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit {

  @Input() modelListTitle: string;
  @Input() modelList: FeatureModel[];
  @Input() modelFormTitle: string;

  @Output() viewModel = new EventEmitter<string>();
  @Output() editModel = new EventEmitter<string>();
  @Output() deleteModel = new EventEmitter<string>();
  @Output() addModel = new EventEmitter<{ definition: CanvasDefinition, name: string, description: string }>();

  canvasDefinitions: CanvasDefinition[] = [];

  modelForm = this.fb.group({definition: [null, Validators.required], name: ['', Validators.required], description: []});

  constructor(
    private canvasDefinitionService: CanvasDefinitionService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.loadCanvasDefinitions().then();
  }

  addModelForwardEmitter() {
    this.addModel.emit({
      definition: new CanvasDefinition(this.modelForm.value.definition),
      name: this.modelForm.value.name,
      description: this.modelForm.value.description
    });
  }

  async loadCanvasDefinitions() {
    this.canvasDefinitions = (await this.canvasDefinitionService.getList()).docs;
  }

  get definitionControl() {
    return this.modelForm.get('definition');
  }

}
