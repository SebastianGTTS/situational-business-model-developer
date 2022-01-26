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
  MethodElement,
  MethodElementEntry,
} from '../../development-process-registry/method-elements/method-element';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { GroupSelection } from '../../development-process-registry/bm-process/decision';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-method-element-group-info',
  templateUrl: './method-element-group-info.component.html',
  styleUrls: ['./method-element-group-info.component.css'],
})
export class MethodElementGroupInfoComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() methodElementName: string;

  @Input() groups: MultipleSelection<MethodElement>[][];
  @Input() selection: GroupSelection<MethodElement>;

  @Input() methodElements: MethodElementEntry[] = [];

  @Output() submitGroupsForm = new EventEmitter<FormGroup>();

  form: FormGroup = this.fb.group({
    selectedGroup: [null, Validators.required],
    elements: this.fb.array([]),
  });
  changed = false;

  private selectedIndexSubscription: Subscription;
  private changeSubscription: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.selectedIndexSubscription =
      this.selectedGroupControl.valueChanges.subscribe((value) =>
        this.generateControls(value)
      );
    this.changeSubscription = this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => (this.changed = !this.selection.equals(value)))
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groups) {
      this.loadForm();
    } else if (changes.selection) {
      const oldSelection: GroupSelection<MethodElement> =
        changes.selection.previousValue;
      const newSelection: GroupSelection<MethodElement> =
        changes.selection.currentValue;
      if (!newSelection.equals(oldSelection)) {
        this.loadForm();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.selectedIndexSubscription) {
      this.selectedIndexSubscription.unsubscribe();
    }
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm(): void {
    this.submitGroupsForm.emit(this.form);
  }

  private loadForm(): void {
    this.selectedGroupControl.setValue(this.selection.selectedGroup, {
      emitEvent: false,
    });
    this.generateControls(this.selection.selectedGroup);
    if (this.selection.elements) {
      this.elementsFormArray.patchValue(this.selection.elements);
    }
  }

  private generateControls(selectedGroup: number): void {
    if (selectedGroup !== null) {
      const elements = this.groups[selectedGroup].map((element, index) => {
        if (
          element.multiple &&
          this.selection.elements &&
          this.selection.elements[index]
        ) {
          return this.fb.array(
            this.selection.elements[index].map(() =>
              this.fb.control(null, Validators.required)
            )
          );
        }
        return this.fb.array(element.multiple ? [] : [this.fb.control(null)]);
      });
      this.form.setControl('elements', this.fb.array(elements));
    } else {
      this.form.setControl('elements', this.fb.control(null));
    }
  }

  get selectedGroupControl(): FormControl {
    return this.form.get('selectedGroup') as FormControl;
  }

  get selectedGroup(): number {
    return this.selectedGroupControl.value;
  }

  get elementsFormArray(): FormArray {
    return this.form.get('elements') as FormArray;
  }
}
