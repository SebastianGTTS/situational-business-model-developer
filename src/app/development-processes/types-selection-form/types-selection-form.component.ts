import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Type } from '../../development-process-registry/method-elements/type/type';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeService } from '../../development-process-registry/method-elements/type/type.service';

@Component({
  selector: 'app-types-selection-form',
  templateUrl: './types-selection-form.component.html',
  styleUrls: ['./types-selection-form.component.css']
})
export class TypesSelectionFormComponent implements OnInit, OnChanges {

  @Input() types: { list: string, element: Type }[];

  @Output() submitTypesForm = new EventEmitter<FormArray>();

  typesForm: FormGroup = this.fb.group({
    types: this.fb.array([]),
  });

  methodElements: Type[] = [];
  listNames: string[] = [];

  constructor(
    private fb: FormBuilder,
    private typeService: TypeService,
  ) {
  }

  ngOnInit() {
    this.loadTypes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.types) {
      this.loadForm(changes.types.currentValue);
    }
  }

  submitForm() {
    this.submitTypesForm.emit(this.typesForm.get('types') as FormArray);
  }

  private loadForm(types: { list: string, element: Type }[]) {
    const formGroups = types.map((type) => this.fb.group({
      list: [type.list, Validators.required],
      element: type.element,
    }));
    this.typesForm.setControl('types', this.fb.array(formGroups));
  }

  private loadTypes() {
    this.typeService.getAll().then((types) => {
      this.methodElements = types.docs;
      this.listNames = [...new Set(this.methodElements.map((element) => element.list))];
    });
  }

  createFormGroupFactory = () => this.fb.group({
    list: ['', Validators.required],
    element: null,
  })

}
