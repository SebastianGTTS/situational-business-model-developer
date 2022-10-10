import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Type,
  TypeEntry,
} from '../../development-process-registry/method-elements/type/type';
import { TypeService } from '../../development-process-registry/method-elements/type/type.service';

@Component({
  selector: 'app-process-pattern-types-form',
  templateUrl: './process-pattern-types-form.component.html',
  styleUrls: ['./process-pattern-types-form.component.css'],
})
export class ProcessPatternTypesFormComponent implements OnInit, OnChanges {
  @Input() types!: {
    inherit: boolean;
    neededType: { list: string; element: Type }[];
    forbiddenType: { list: string; element: Type }[];
  };

  @Output() submitTypesForm = new EventEmitter<FormGroup>();

  typesForm: FormGroup = this.fb.group({
    inherit: this.fb.control(false, Validators.required),
    neededType: this.fb.array([]),
    forbiddenType: this.fb.array([]),
  });

  methodElements?: TypeEntry[];
  listNames?: string[];

  constructor(private fb: FormBuilder, private typeService: TypeService) {}

  ngOnInit(): void {
    void this.loadTypes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.types) {
      this.loadForm(changes.types.currentValue);
    }
  }

  submitForm(): void {
    this.submitTypesForm.emit(this.typesForm);
  }

  private loadForm(types: {
    inherit: boolean;
    neededType: { list: string; element: Type }[];
    forbiddenType: { list: string; element: Type }[];
  }): void {
    const mapTypeToFormGroup = (type: {
      list: string;
      element: Type;
    }): FormGroup =>
      this.fb.group({
        list: [type.list, Validators.required],
        element: type.element,
      });
    const neededTypesFormGroups = types.neededType.map(mapTypeToFormGroup);
    const forbiddenTypesFormGroups =
      types.forbiddenType.map(mapTypeToFormGroup);

    if (types.inherit) {
      this.typesForm.get('inherit')?.setValue(types.inherit);
    }
    this.typesForm.setControl(
      'neededType',
      this.fb.array(neededTypesFormGroups)
    );
    this.typesForm.setControl(
      'forbiddenType',
      this.fb.array(forbiddenTypesFormGroups)
    );
  }

  private async loadTypes(): Promise<void> {
    this.methodElements = await this.typeService.getList();
    this.listNames = [
      ...new Set(this.methodElements.map((element) => element.list)),
    ];
  }

  createFormGroupFactory = (): FormGroup =>
    this.fb.group({
      list: ['', Validators.required],
      element: null,
    });
}
