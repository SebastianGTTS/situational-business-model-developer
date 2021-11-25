import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { ArtifactService } from '../../development-process-registry/method-elements/artifact/artifact.service';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { MultipleMappingSelection } from '../../development-process-registry/development-method/multiple-mapping-selection';
import { ArtifactMappingFormService } from '../shared/artifact-mapping-form.service';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { equalsListOfLists } from '../../shared/utils';

@Component({
  selector: 'app-artifacts-selection-form',
  templateUrl: './artifacts-selection-form.component.html',
  styleUrls: ['./artifacts-selection-form.component.css'],
})
export class ArtifactsSelectionFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() artifacts: MultipleSelection<Artifact>[][];
  @Input() developmentMethod: DevelopmentMethod = null;

  @Output() submitArtifactsForm = new EventEmitter<FormArray>();

  artifactsForm: FormGroup = this.fb.group({
    allowNone: this.fb.control(false),
    artifacts: this.fb.array([]),
  });
  changed = false;

  methodElements: Artifact[] = [];
  listNames: string[] = [];

  private allowNoneSubscription: Subscription;
  private changeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private artifactMappingFormService: ArtifactMappingFormService,
    private artifactService: ArtifactService
  ) {}

  ngOnInit() {
    void this.loadMethodElements();

    this.allowNoneSubscription = this.artifactsForm
      .get('allowNone')
      .valueChanges.subscribe((value) => {
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
    this.changeSubscription = this.artifactsForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = !equalsListOfLists(this.artifacts, value.artifacts))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.artifacts) {
      const oldArtifactGroups: MultipleSelection<Artifact>[][] =
        changes.artifacts.previousValue;
      const newArtifactGroups: MultipleSelection<Artifact>[][] =
        changes.artifacts.currentValue;
      if (!equalsListOfLists(oldArtifactGroups, newArtifactGroups)) {
        this.loadForm(newArtifactGroups);
      }
    }
  }

  ngOnDestroy() {
    if (this.allowNoneSubscription) {
      this.allowNoneSubscription.unsubscribe();
    }
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  add() {
    this.formArray.push(this.fb.array([]));
  }

  remove(index: number) {
    this.formArray.removeAt(index);
  }

  submitForm() {
    this.submitArtifactsForm.emit(
      this.artifactsForm.get('artifacts') as FormArray
    );
  }

  private loadForm(artifacts: MultipleSelection<Artifact>[][]) {
    const formArrays = artifacts.map((group) =>
      this.fb.array(
        group.map((element) => {
          if (element instanceof MultipleMappingSelection) {
            return this.fb.group({
              list: [element.list, Validators.required],
              element: { value: element.element, disabled: element.multiple },
              multiple: element.multiple,
              multipleElements: {
                value: element.multipleElements,
                disabled: element.multiple,
              },
              mapping: this.artifactMappingFormService.createMappingsForm(
                element.mapping
              ),
            });
          } else {
            return this.fb.group({
              list: [element.list, Validators.required],
              element: { value: element.element, disabled: element.multiple },
              multiple: element.multiple,
              multipleElements: {
                value: element.multipleElements,
                disabled: element.multiple,
              },
              mapping: this.fb.array([]),
            });
          }
        })
      )
    );
    this.artifactsForm.setControl('artifacts', this.fb.array(formArrays));
    if (artifacts.length > 0) {
      this.artifactsForm.get('allowNone').setValue(artifacts[0].length === 0);
    } else {
      this.artifactsForm.get('allowNone').setValue(false);
    }
  }

  private async loadMethodElements(): Promise<void> {
    this.methodElements = await this.artifactService.getList();
    this.listNames = [
      ...new Set(this.methodElements.map((element) => element.list)),
    ];
  }

  get formArray(): FormArray {
    return this.artifactsForm.get('artifacts') as FormArray;
  }

  createFormGroupFactory = () =>
    this.fb.group({
      list: ['', Validators.required],
      element: null,
      multiple: false,
      multipleElements: false,
      mapping: this.fb.array([]),
    });
}
