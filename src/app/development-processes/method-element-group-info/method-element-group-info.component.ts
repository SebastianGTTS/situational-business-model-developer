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
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { GroupDecision } from '../../development-process-registry/bm-process/group-decision';
import { GroupDecisionFormService } from '../shared/group-decision-form.service';
import { UPDATABLE, Updatable } from '../../shared/updatable';

@Component({
  selector: 'app-method-element-group-info',
  templateUrl: './method-element-group-info.component.html',
  styleUrls: ['./method-element-group-info.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: MethodElementGroupInfoComponent },
  ],
})
export class MethodElementGroupInfoComponent<T extends MethodElement>
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() methodElementName!: string;

  @Input() groupDecision!: GroupDecision<T>;

  @Input() methodElements: MethodElementEntry[] = [];

  @Output() submitGroupsForm = new EventEmitter<GroupDecision<T>>();

  changed = false;

  private changeSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private groupDecisionFormService: GroupDecisionFormService<T>
  ) {}

  ngOnInit(): void {
    this.changeSubscription = this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => {
          if (this.form.valid) {
            this.changed = !this.groupDecision.equals(
              this.groupDecisionFormService.getGroupDecision(value)
            );
          } else {
            this.changed = true;
          }
        })
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupDecision) {
      const oldDecision: GroupDecision<T> = changes.groupDecision.previousValue;
      const newDecision: GroupDecision<T> = changes.groupDecision.currentValue;
      if (!newDecision.equals(oldDecision)) {
        this.groupDecisionFormService.loadForm(newDecision);
      } else {
        this.groupDecisionFormService.updateGroups(newDecision.groups);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm(): void {
    this.submitGroupsForm.emit(
      this.groupDecisionFormService.getGroupDecision(
        this.groupDecisionFormService.form.value
      )
    );
  }

  update(): void {
    if (this.changed && this.form.valid) {
      this.submitForm();
    }
  }

  get selectedGroup(): number {
    return this.groupDecisionFormService.groupIndexControl.value;
  }

  get form(): FormGroup {
    return this.groupDecisionFormService.form;
  }
}
