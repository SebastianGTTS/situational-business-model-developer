import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';
import { CanvasDefinition } from '../../../canvas-meta-model/canvas-definition';
import { CanvasDefinitionService } from '../../../canvas-meta-model/canvas-definition.service';
import { ListService } from '../../../shared/list.service';
import { ModelList } from './model-list';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css'],
})
export class ModelListComponent implements OnInit, ModelList {
  @Input() modelListTitle: string;
  @Input() modelFormTitle: string;

  @Output() viewModel = new EventEmitter<string>();
  @Output() editModel = new EventEmitter<string>();
  @Output() deleteModel = new EventEmitter<string>();
  @Output() addModel = new EventEmitter<{
    definition: CanvasDefinition;
    name: string;
    description: string;
  }>();

  canvasDefinitions: CanvasDefinition[] = [];

  modelForm = this.fb.group({
    definition: [null, Validators.required],
    name: ['', Validators.required],
    description: [],
  });

  constructor(
    private canvasDefinitionService: CanvasDefinitionService,
    private fb: FormBuilder,
    private listService: ListService<FeatureModel>
  ) {}

  ngOnInit() {
    void this.loadCanvasDefinitions();
  }

  resetAddForm() {
    this.modelForm.reset();
  }

  addModelForwardEmitter() {
    this.addModel.emit({
      definition: new CanvasDefinition(this.modelForm.value.definition),
      name: this.modelForm.value.name,
      description: this.modelForm.value.description,
    });
  }

  async loadCanvasDefinitions(): Promise<void> {
    this.canvasDefinitions = await this.canvasDefinitionService.getList();
  }

  get definitionControl() {
    return this.modelForm.get('definition');
  }

  get modelList(): FeatureModel[] {
    return this.listService.elements;
  }

  get noResults(): boolean {
    return this.listService.noResults;
  }

  get loading(): boolean {
    return this.listService.loading;
  }

  get reloading(): boolean {
    return this.listService.reloading;
  }
}
