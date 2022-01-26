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
import {
  Stakeholder,
  StakeholderEntry,
} from '../../development-process-registry/method-elements/stakeholder/stakeholder';
import { StakeholderService } from '../../development-process-registry/method-elements/stakeholder/stakeholder.service';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';
import { Subscription } from 'rxjs';
import { equalsListOfLists } from '../../shared/utils';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-stakeholders-selection-form',
  templateUrl: './stakeholders-selection-form.component.html',
  styleUrls: ['./stakeholders-selection-form.component.css'],
})
export class StakeholdersSelectionFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() stakeholders: MultipleSelection<Stakeholder>[][];

  @Output() submitStakeholdersForm = new EventEmitter<FormArray>();

  stakeholdersForm: FormGroup = this.fb.group({
    stakeholders: this.fb.array([]),
  });
  changed = false;

  methodElements: StakeholderEntry[] = [];
  listNames: string[] = [];

  private changeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private stakeholderService: StakeholderService
  ) {}

  ngOnInit(): void {
    void this.loadStakeholders();
    this.changeSubscription = this.stakeholdersForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = !equalsListOfLists(
              this.stakeholders,
              value.stakeholders
            ))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.stakeholders) {
      const oldStakeholderGroups: MultipleSelection<Stakeholder>[][] =
        changes.stakeholders.previousValue;
      const newStakeholderGroups: MultipleSelection<Stakeholder>[][] =
        changes.stakeholders.currentValue;
      if (!equalsListOfLists(oldStakeholderGroups, newStakeholderGroups)) {
        this.loadForm(changes.stakeholders.currentValue);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  add(): void {
    this.formArray.push(this.fb.array([]));
  }

  remove(index: number): void {
    this.formArray.removeAt(index);
  }

  submitForm(): void {
    this.submitStakeholdersForm.emit(
      this.stakeholdersForm.get('stakeholders') as FormArray
    );
  }

  private loadForm(stakeholders: MultipleSelection<Stakeholder>[][]): void {
    const formArrays = stakeholders.map((group) =>
      this.fb.array(
        group.map((element) =>
          this.fb.group({
            list: [element.list, Validators.required],
            element: { value: element.element, disabled: element.multiple },
            multiple: element.multiple,
            multipleElements: {
              value: element.multipleElements,
              disabled: element.multiple,
            },
          })
        )
      )
    );
    this.stakeholdersForm.setControl('stakeholders', this.fb.array(formArrays));
  }

  private async loadStakeholders(): Promise<void> {
    this.methodElements = await this.stakeholderService.getList();
    this.listNames = [
      ...new Set(this.methodElements.map((element) => element.list)),
    ];
  }

  get formArray(): FormArray {
    return this.stakeholdersForm.get('stakeholders') as FormArray;
  }

  createFormGroupFactory = (): FormGroup =>
    this.fb.group({
      list: ['', Validators.required],
      element: null,
      multiple: false,
      multipleElements: false,
    });
}
