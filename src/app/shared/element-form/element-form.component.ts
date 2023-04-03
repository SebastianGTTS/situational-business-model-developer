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
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { Updatable, UPDATABLE } from '../updatable';

interface Element {
  name: string;
  description: string;
}

@Component({
  selector: 'app-element-form',
  templateUrl: './element-form.component.html',
  styleUrls: ['./element-form.component.scss'],
  providers: [{ provide: UPDATABLE, useExisting: ElementFormComponent }],
})
export class ElementFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() disabled = false;
  @Input() element!: Element;

  @Output() submitElementForm = new EventEmitter<
    FormGroup<{ name: FormControl<string>; description: FormControl<string> }>
  >();

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
  });
  changed = false;

  private changeSubscription?: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.changeSubscription = this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed =
              value.name !== this.element.name ||
              value.description !== this.element.description)
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.element) {
      const oldElement: Element = changes.element.previousValue;
      const newElement: Element = changes.element.currentValue;
      if (
        changes.element.firstChange ||
        oldElement.name !== newElement.name ||
        oldElement.description !== newElement.description
      ) {
        this.updateForm(newElement);
      }
    }
    if (changes.disabled) {
      if (this.disabled) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }

  ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
  }

  submitForm(): void {
    this.submitElementForm.emit(this.form);
  }

  update(): void {
    if (this.changed && this.form.valid) {
      this.submitForm();
    }
  }

  private updateForm(element: Element): void {
    this.form.setValue({
      name: element.name,
      description: element.description,
    });
  }
}
