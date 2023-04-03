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
import { RunningArtifact } from '../../../development-process-registry/running-process/running-artifact';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { UPDATABLE, Updatable } from '../../../shared/updatable';

@Component({
  selector: 'app-concrete-artifact-form',
  templateUrl: './concrete-artifact-form.component.html',
  styleUrls: ['./concrete-artifact-form.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: ConcreteArtifactFormComponent },
  ],
})
export class ConcreteArtifactFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() artifact!: RunningArtifact;

  @Output() submitArtifactForm = new EventEmitter<
    FormGroup<{
      identifier: FormControl<string>;
      description: FormControl<string>;
    }>
  >();

  artifactForm = this.fb.nonNullable.group({
    identifier: ['', Validators.required],
    description: [''],
  });
  changed = false;

  private changeSubscription?: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.changeSubscription = this.artifactForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed =
              this.artifact.name !== value.identifier ||
              this.artifact.description !== value.description)
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.artifact) {
      const newArtifact = changes.artifact.currentValue;
      const oldArtifact = changes.artifact.previousValue;
      if (!this.equalArtifacts(oldArtifact, newArtifact)) {
        this.loadForm(newArtifact);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm(): void {
    this.submitArtifactForm.emit(this.artifactForm);
  }

  update(): void {
    if (this.changed && this.artifactForm.valid) {
      this.submitForm();
    }
  }

  private loadForm(artifact: RunningArtifact): void {
    if (artifact) {
      this.artifactForm.setValue({
        identifier: artifact.name,
        description: artifact.description,
      });
    } else {
      this.artifactForm.setValue({ identifier: '', description: '' });
    }
  }

  // noinspection JSMethodCanBeStatic
  private equalArtifacts(
    artifactA: RunningArtifact,
    artifactB: RunningArtifact
  ): boolean {
    if (artifactA == null && artifactB == null) {
      return true;
    }
    if (artifactA == null || artifactB == null) {
      return false;
    }
    return (
      artifactA.name === artifactB.name &&
      artifactA.description === artifactB.description
    );
  }
}
