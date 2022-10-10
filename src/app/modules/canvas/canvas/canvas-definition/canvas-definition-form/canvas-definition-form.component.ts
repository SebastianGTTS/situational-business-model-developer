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
import { CanvasDefinition } from '../../../canvas-meta-model/canvas-definition';

@Component({
  selector: 'app-canvas-definition-form',
  templateUrl: './canvas-definition-form.component.html',
  styleUrls: ['./canvas-definition-form.component.css'],
})
export class CanvasDefinitionFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() canvasDefinition!: CanvasDefinition;

  @Output() submitForm = new EventEmitter<FormGroup>();

  form: FormGroup = this.fb.group({
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
            (this.changed = !this.equalCanvasDefinitions(
              this.canvasDefinition,
              value
            ))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.canvasDefinition) {
      const newCanvasDefinition = changes.canvasDefinition.currentValue;
      const oldCanvasDefinition = changes.canvasDefinition.previousValue;
      if (
        !this.equalCanvasDefinitions(oldCanvasDefinition, newCanvasDefinition)
      ) {
        this.loadForm(newCanvasDefinition);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  emitSubmitForm(): void {
    this.submitForm.emit(this.form);
  }

  private loadForm(canvasDefinition: CanvasDefinition): void {
    if (canvasDefinition != null) {
      this.form.patchValue({
        name: canvasDefinition.name,
        description: canvasDefinition.description,
      });
    } else {
      this.form.patchValue({ name: '', description: '' });
    }
  }

  // noinspection JSMethodCanBeStatic
  private equalCanvasDefinitions(
    canvasDefinitionA: CanvasDefinition,
    canvasDefinitionB: CanvasDefinition
  ): boolean {
    if (canvasDefinitionA == null && canvasDefinitionB == null) {
      return true;
    }
    if (canvasDefinitionA == null || canvasDefinitionB == null) {
      return false;
    }
    return (
      canvasDefinitionA.name === canvasDefinitionB.name &&
      canvasDefinitionA.description === canvasDefinitionB.description
    );
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }
}
