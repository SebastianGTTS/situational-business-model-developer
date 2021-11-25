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

@Component({
  selector: 'app-description-form',
  templateUrl: './description-form.component.html',
  styleUrls: ['./description-form.component.css'],
})
export class DescriptionFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() description: string;

  @Output() submitDescriptionForm = new EventEmitter<FormGroup>();

  descriptionForm: FormGroup = this.fb.group({
    description: this.fb.control(''),
  });
  changed = false;

  private changeSubscription: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.changeSubscription = this.descriptionForm.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => (this.changed = this.description !== value.description))
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.description) {
      this.loadForm(changes.description.currentValue);
    }
  }

  ngOnDestroy() {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm() {
    this.submitDescriptionForm.emit(this.descriptionForm);
  }

  private loadForm(description: string) {
    if (description) {
      this.descriptionForm.setValue({ description });
    } else {
      this.descriptionForm.setValue({ description: '' });
    }
  }
}
