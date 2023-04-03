import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  CanvasDefinition,
  CanvasDefinitionEntry,
} from '../../../canvas-meta-artifact/canvas-definition';
import { CanvasDefinitionService } from '../../../canvas-meta-artifact/canvas-definition.service';
import { EntryType } from '../../../../../database/database-model-part';
import {
  FeatureModel,
  FeatureModelInit,
} from '../../../canvas-meta-artifact/feature-model';
import { ListService } from '../../../../../shared/list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-model-add-form',
  templateUrl: './model-add-form.component.html',
  styleUrls: ['./model-add-form.component.scss'],
})
export class ModelAddFormComponent<
  T extends FeatureModel,
  S extends FeatureModelInit
> implements OnInit
{
  @Input() createFunction!: (
    name: string,
    definition: CanvasDefinition
  ) => S | Promise<S>;
  @Input() elementName!: string;
  @Input() viewLinkFunction?: (item: EntryType<T>) => string[];

  canvasDefinitions: CanvasDefinitionEntry[] = [];

  modelForm = this.fb.nonNullable.group({
    definition: this.fb.control<CanvasDefinitionEntry | null>(
      null,
      Validators.required
    ),
    name: ['', Validators.required],
  });

  constructor(
    private canvasDefinitionService: CanvasDefinitionService,
    private fb: FormBuilder,
    private listService: ListService<T, S>,
    private router: Router
  ) {}

  ngOnInit(): void {
    void this.loadCanvasDefinitions();
  }

  async loadCanvasDefinitions(): Promise<void> {
    this.canvasDefinitions = await this.canvasDefinitionService.getList();
  }

  async addElement(): Promise<void> {
    const addedElement = await this.listService.add(
      await this.createFunction(
        this.modelForm.getRawValue().name,
        new CanvasDefinition(
          this.modelForm.getRawValue().definition ?? undefined,
          undefined
        )
      )
    );
    this.modelForm.reset();
    if (this.viewLinkFunction != null) {
      await this.router.navigate(
        this.viewLinkFunction(addedElement.toDb() as EntryType<T>)
      );
    }
  }

  get definitionControlInvalid(): boolean {
    const definitionControl = this.modelForm.get('definition');
    return (definitionControl?.invalid && definitionControl.touched) ?? false;
  }
}
