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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-concrete-artifact-form',
  templateUrl: './concrete-artifact-form.component.html',
  styleUrls: ['./concrete-artifact-form.component.css'],
})
export class ConcreteArtifactFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() artifact: RunningArtifact;

  @Output() submitArtifactForm = new EventEmitter<FormGroup>();

  artifactForm: FormGroup = this.fb.group({
    identifier: ['', Validators.required],
  });
  changed = false;

  private changeSubscription: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.changeSubscription = this.artifactForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = this.artifact.identifier !== value.identifier)
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.artifact) {
      const newArtifact = changes.artifact.currentValue;
      const oldArtifact = changes.artifact.previousValue;
      if (!this.equalArtifacts(oldArtifact, newArtifact)) {
        this.loadForm(newArtifact);
      }
    }
  }

  ngOnDestroy() {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm() {
    this.submitArtifactForm.emit(this.artifactForm);
  }

  private loadForm(artifact: RunningArtifact) {
    if (artifact) {
      this.artifactForm.setValue({ identifier: artifact.identifier });
    } else {
      this.artifactForm.setValue({ identifier: '' });
    }
  }

  private equalArtifacts(
    artifactA: RunningArtifact,
    artifactB: RunningArtifact
  ) {
    if (artifactA == null && artifactB == null) {
      return true;
    }
    if (artifactA == null || artifactB == null) {
      return false;
    }
    return artifactA.identifier === artifactB.identifier;
  }
}
