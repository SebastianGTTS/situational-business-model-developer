import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stakeholder } from '../../development-process-registry/method-elements/stakeholder/stakeholder';
import { StakeholderService } from '../../development-process-registry/method-elements/stakeholder/stakeholder.service';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';

@Component({
  selector: 'app-stakeholders-selection-form',
  templateUrl: './stakeholders-selection-form.component.html',
  styleUrls: ['./stakeholders-selection-form.component.css']
})
export class StakeholdersSelectionFormComponent implements OnInit, OnChanges {

  @Input() stakeholders: MultipleSelection<Stakeholder>[][];

  @Output() submitStakeholdersForm = new EventEmitter<FormArray>();

  stakeholdersForm: FormGroup = this.fb.group({
    stakeholders: this.fb.array([]),
  });

  methodElements: Stakeholder[] = [];
  listNames: string[] = [];

  constructor(
    private fb: FormBuilder,
    private stakeholderService: StakeholderService,
  ) {
  }

  ngOnInit() {
    this.loadStakeholders();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.stakeholders) {
      this.loadForm(changes.stakeholders.currentValue);
    }
  }

  add() {
    this.formArray.push(this.fb.array([]));
  }

  remove(index: number) {
    this.formArray.removeAt(index);
  }

  submitForm() {
    this.submitStakeholdersForm.emit(this.stakeholdersForm.get('stakeholders') as FormArray);
  }

  private loadForm(stakeholders: MultipleSelection<Stakeholder>[][]) {
    const formArrays = stakeholders.map((group) =>
      this.fb.array(group.map((element) =>
        this.fb.group({
          list: [element.list, Validators.required],
          element: {value: element.element, disabled: element.multiple},
          multiple: element.multiple,
          multipleElements: {value: element.multipleElements, disabled: element.multiple},
        })
      )),
    );
    this.stakeholdersForm.setControl('stakeholders', this.fb.array(formArrays));
  }

  private loadStakeholders() {
    this.stakeholderService.getAll().then((stakeholders) => {
      this.methodElements = stakeholders.docs;
      this.listNames = [...new Set(this.methodElements.map((element) => element.list))];
    });
  }

  get formArray(): FormArray {
    return this.stakeholdersForm.get('stakeholders') as FormArray;
  }

  createFormGroupFactory = () => this.fb.group({
    list: ['', Validators.required],
    element: null,
    multiple: false,
    multipleElements: false,
  })

}
