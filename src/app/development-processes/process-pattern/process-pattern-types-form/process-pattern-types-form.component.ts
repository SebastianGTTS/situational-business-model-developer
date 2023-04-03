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
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TypeEntry } from '../../../development-process-registry/method-elements/type/type';
import { TypeService } from '../../../development-process-registry/method-elements/type/type.service';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { equalsListGeneric } from '../../../shared/utils';

interface StoredType {
  _id: string;
  name: string;
}

interface StoredTypeConfig {
  list: string;
  element?: StoredType;
}

interface TypesConfiguration {
  inherit: boolean;
  neededType: StoredTypeConfig[];
  forbiddenType: StoredTypeConfig[];
}

type TypeFormGroup = FormGroup<{
  list: FormControl<string>;
  element: FormControl<StoredType | null>;
}>;
type TypesFormArray = FormArray<TypeFormGroup>;
type TypesFormGroup = FormGroup<{
  inherit: FormControl<boolean>;
  neededType: TypesFormArray;
  forbiddenType: TypesFormArray;
}>;
type TypeFormValue = Partial<{
  list: string;
  element: StoredType | null;
}>;
type TypesFormValue = Partial<{
  inherit: boolean;
  neededType: TypeFormValue[];
  forbiddenType: TypeFormValue[];
}>;

@Component({
  selector: 'app-process-pattern-types-form',
  templateUrl: './process-pattern-types-form.component.html',
  styleUrls: ['./process-pattern-types-form.component.css'],
})
export class ProcessPatternTypesFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() types!: TypesConfiguration;

  @Output() submitTypesForm = new EventEmitter<FormGroup>();

  typesForm: TypesFormGroup = this.fb.nonNullable.group({
    inherit: this.fb.nonNullable.control(false, Validators.required),
    neededType: this.fb.array<TypeFormGroup>([]),
    forbiddenType: this.fb.array<TypeFormGroup>([]),
  });
  changed = false;

  methodElements?: TypeEntry[];
  listNames?: string[];

  private changeSubscription?: Subscription;

  constructor(private fb: FormBuilder, private typeService: TypeService) {}

  ngOnInit(): void {
    void this.loadTypes();
    this.changeSubscription = this.typesForm.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => (this.changed = !this.equals(this.types, value)))
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.types) {
      const oldTypes: TypesConfiguration = changes.types.previousValue;
      const newTypes: TypesConfiguration = changes.types.currentValue;
      if (!this.equals(oldTypes, newTypes)) {
        this.loadForm(changes.types.currentValue);
      }
    }
  }

  ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
  }

  submitForm(): void {
    this.submitTypesForm.emit(this.typesForm);
  }

  private loadForm(types: TypesConfiguration): void {
    const mapTypeToFormGroup = (type: StoredTypeConfig): UntypedFormGroup =>
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

  private equals(
    typesA: TypesConfiguration | undefined,
    typesB: TypesConfiguration | Partial<TypesFormValue> | undefined
  ): boolean {
    if (typesA == null && typesB == null) {
      return true;
    }
    if (typesA == null || typesB == null) {
      return false;
    }
    if (typesA.inherit || typesB.inherit) {
      return typesA.inherit === typesB.inherit;
    }
    const compareTypes = (
      a: StoredTypeConfig,
      b: StoredTypeConfig | TypeFormValue
    ): boolean => {
      if (a.list !== b.list) {
        return false;
      }
      if (a.element == null && b.element == null) {
        return true;
      }
      if (a.element == null || b.element == null) {
        return false;
      }
      return a.element._id === b.element._id;
    };
    return (
      equalsListGeneric(typesA.neededType, typesB.neededType, (a, b) =>
        compareTypes(a, b)
      ) &&
      equalsListGeneric(typesA.forbiddenType, typesB.forbiddenType, (a, b) =>
        compareTypes(a, b)
      )
    );
  }

  createFormGroupFactory = (): UntypedFormGroup =>
    this.fb.group({
      list: ['', Validators.required],
      element: null,
    });
}
