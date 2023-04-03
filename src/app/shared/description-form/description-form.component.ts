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
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { Updatable, UPDATABLE } from '../updatable';

@Component({
  selector: 'app-description-form',
  templateUrl: './description-form.component.html',
  styleUrls: ['./description-form.component.css'],
  providers: [{ provide: UPDATABLE, useExisting: DescriptionFormComponent }],
})
export class DescriptionFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() description?: string;

  @Output() submitDescriptionForm = new EventEmitter<FormGroup>();

  descriptionForm = this.fb.group({
    description: this.fb.control(''),
  });
  changed = false;

  private changeSubscription?: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.changeSubscription = this.descriptionForm.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => (this.changed = this.description !== value.description))
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.description) {
      this.loadForm(changes.description.currentValue);
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm(): void {
    this.submitDescriptionForm.emit(this.descriptionForm);
  }

  update(): void {
    if (this.changed && this.descriptionForm.valid) {
      this.submitForm();
    }
  }

  private loadForm(description: string): void {
    if (description) {
      this.descriptionForm.setValue({ description });
    } else {
      this.descriptionForm.setValue({ description: '' });
    }
  }
}
