import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { ArtifactService } from '../../development-process-registry/method-elements/artifact/artifact.service';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { MultipleMappingSelection } from '../../development-process-registry/development-method/multiple-mapping-selection';
import { ArtifactMappingFormService } from '../shared/artifact-mapping-form.service';

@Component({
  selector: 'app-artifacts-selection-form',
  templateUrl: './artifacts-selection-form.component.html',
  styleUrls: ['./artifacts-selection-form.component.css']
})
export class ArtifactsSelectionFormComponent implements OnInit, OnChanges {

  @Input() artifacts: MultipleSelection<Artifact>[][];
  @Input() developmentMethod: DevelopmentMethod = null;

  @Output() submitArtifactsForm = new EventEmitter<FormArray>();

  artifactsForm: FormGroup = this.fb.group({
    allowNone: this.fb.control(false),
    artifacts: this.fb.array([]),
  });

  methodElements: Artifact[] = [];
  listNames: string[] = [];

  private allowNoneSubscription;

  constructor(
    private fb: FormBuilder,
    private artifactMappingFormService: ArtifactMappingFormService,
    private artifactService: ArtifactService,
  ) {
  }

  ngOnInit() {
    this.loadMethodElements();

    this.allowNoneSubscription = this.artifactsForm.get('allowNone').valueChanges.subscribe((value) => {
      if (value) {
        if (this.formArray.controls.length > 0) {
          if ((this.formArray.at(0) as FormArray).controls.length > 0) {
            this.formArray.insert(0, this.fb.array([]));
          }
        }
      } else {
        if (this.formArray.controls.length > 0) {
          if ((this.formArray.at(0) as FormArray).controls.length === 0) {
            this.formArray.removeAt(0);
          }
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.artifacts) {
      this.loadForm(changes.artifacts.currentValue);
    }
  }

  add() {
    this.formArray.push(this.fb.array([]));
  }

  remove(index: number) {
    this.formArray.removeAt(index);
  }

  submitForm() {
    this.submitArtifactsForm.emit(this.artifactsForm.get('artifacts') as FormArray);
  }

  private loadForm(artifacts: MultipleSelection<Artifact>[][]) {
    const formArrays = artifacts.map((group) =>
      this.fb.array(group.map((element) => {
          if (element instanceof MultipleMappingSelection) {
            return this.fb.group({
              list: [element.list, Validators.required],
              element: {value: element.element, disabled: element.multiple},
              multiple: element.multiple,
              multipleElements: {value: element.multipleElements, disabled: element.multiple},
              mapping: this.artifactMappingFormService.createMappingsForm(element.mapping),
            });
          } else {
            return this.fb.group({
              list: [element.list, Validators.required],
              element: {value: element.element, disabled: element.multiple},
              multiple: element.multiple,
              multipleElements: {value: element.multipleElements, disabled: element.multiple},
              mapping: this.fb.array([]),
            });
          }
        }
      )),
    );
    this.artifactsForm.setControl('artifacts', this.fb.array(formArrays));
    if (artifacts.length > 0) {
      this.artifactsForm.get('allowNone').setValue(artifacts[0].length === 0);
    } else {
      this.artifactsForm.get('allowNone').setValue(false);
    }
  }

  private loadMethodElements() {
    this.artifactService.getAll().then((artifacts) => {
      this.methodElements = artifacts.docs;
      this.listNames = [...new Set(this.methodElements.map((element) => element.list))];
    });
  }

  get formArray(): FormArray {
    return this.artifactsForm.get('artifacts') as FormArray;
  }

  createFormGroupFactory = () => this.fb.group({
    list: ['', Validators.required],
    element: null,
    multiple: false,
    multipleElements: false,
    mapping: this.fb.array([]),
  })

}
