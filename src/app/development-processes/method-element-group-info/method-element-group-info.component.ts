import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GroupSelection } from '../../development-process-registry/bm-process/decision';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';

@Component({
  selector: 'app-method-element-group-info',
  templateUrl: './method-element-group-info.component.html',
  styleUrls: ['./method-element-group-info.component.css']
})
export class MethodElementGroupInfoComponent implements OnInit, OnChanges, OnDestroy {

  @Input() methodElementName: string;

  @Input() groups: MultipleSelection<MethodElement>[][];
  @Input() selection: GroupSelection<MethodElement>;

  @Input() methodElements: MethodElement[] = [];

  @Output() submitGroupsForm = new EventEmitter<FormGroup>();

  form: FormGroup = this.fb.group({
    selectedGroup: [null, Validators.required],
    elements: this.fb.array([]),
  });

  private selectedIndexSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.selectedIndexSubscription = this.selectedGroupControl.valueChanges.subscribe((value) => this.generateControls(value));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selection || changes.groups) {
      this.loadForm();
    }
  }

  ngOnDestroy() {
    if (this.selectedIndexSubscription) {
      this.selectedIndexSubscription.unsubscribe();
    }
  }

  submitForm() {
    this.submitGroupsForm.emit(this.form);
  }

  private loadForm() {
    this.selectedGroupControl.setValue(this.selection.selectedGroup, {emitEvent: false});
    this.generateControls(this.selection.selectedGroup);
    if (this.selection.elements) {
      this.elementsFormArray.patchValue(this.selection.elements);
    }
  }

  private generateControls(selectedGroup: number) {
    if (selectedGroup !== null) {
      const elements = this.groups[selectedGroup].map((element, index) => {
        if (element.multiple && this.selection.elements && this.selection.elements[index]) {
          return this.fb.array(this.selection.elements[index].map(() => this.fb.control(null, Validators.required)));
        }
        return this.fb.array(element.multiple ? [] : [this.fb.control(null)]);
      });
      this.form.setControl('elements', this.fb.array(elements));
    } else {
      this.form.setControl('elements', this.fb.control(null));
    }
  }

  get selectedGroupControl() {
    return this.form.get('selectedGroup');
  }

  get selectedGroup() {
    return this.selectedGroupControl.value;
  }

  get elementsFormArray() {
    return this.form.get('elements') as FormArray;
  }

}
