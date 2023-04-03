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
  Type,
  TypeEntry,
} from '../../../development-process-registry/method-elements/type/type';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TypeService } from '../../../development-process-registry/method-elements/type/type.service';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { equalsList } from '../../../shared/utils';
import { Selection } from '../../../development-process-registry/development-method/selection';
import { Updatable, UPDATABLE } from '../../../shared/updatable';

@Component({
  selector: 'app-types-selection-form',
  templateUrl: './types-selection-form.component.html',
  styleUrls: ['./types-selection-form.component.css'],
  providers: [
    {
      provide: UPDATABLE,
      useExisting: TypesSelectionFormComponent,
    },
  ],
})
export class TypesSelectionFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() types!: Selection<Type>[];
  /**
   * Whether the internal types 'initialisation' and 'generic' should be
   * displayed in auto complete.
   */
  @Input() internalTypes = false;

  @Output() submitTypesForm = new EventEmitter<UntypedFormArray>();

  typesForm: UntypedFormGroup = this.fb.group({
    types: this.fb.array([]),
  });
  changed = false;

  methodElements: TypeEntry[] = [];
  listNames: string[] = [];

  private changeSubscription?: Subscription;

  constructor(
    private fb: UntypedFormBuilder,
    private typeService: TypeService
  ) {}

  ngOnInit(): void {
    void this.loadTypes();
    this.changeSubscription = this.typesForm.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => (this.changed = !equalsList(this.types, value.types)))
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.types) {
      const oldTypes: Selection<Type>[] = changes.types.previousValue;
      const newTypes: Selection<Type>[] = changes.types.currentValue;
      if (!equalsList(oldTypes, newTypes)) {
        this.loadForm(changes.types.currentValue);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm(): void {
    this.submitTypesForm.emit(this.typesForm.get('types') as UntypedFormArray);
  }

  update(): void {
    if (this.changed && this.typesForm.valid) {
      this.submitForm();
    }
  }

  private loadForm(types: Selection<Type>[]): void {
    const formGroups = types.map((type) =>
      this.fb.group({
        list: [type.list, Validators.required],
        element: type.element,
      })
    );
    this.typesForm.setControl('types', this.fb.array(formGroups));
  }

  private async loadTypes(): Promise<void> {
    this.methodElements = await this.typeService.getList();
    this.listNames = [
      ...new Set(this.methodElements.map((element) => element.list)),
    ];
    if (this.internalTypes) {
      this.listNames.push('initialisation', 'generic');
    }
  }

  createFormGroupFactory = (): UntypedFormGroup =>
    this.fb.group({
      list: ['', Validators.required],
      element: null,
    });
}
