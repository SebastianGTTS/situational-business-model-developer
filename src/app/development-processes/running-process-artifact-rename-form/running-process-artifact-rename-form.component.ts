import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-running-process-artifact-rename-form',
  templateUrl: './running-process-artifact-rename-form.component.html',
  styleUrls: ['./running-process-artifact-rename-form.component.css'],
})
export class RunningProcessArtifactRenameFormComponent implements OnChanges {
  @Input() artifact!: RunningArtifact;

  @Output() submitArtifactExportForm = new EventEmitter<FormGroup>();

  form?: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.artifact) {
      const newArtifact: RunningArtifact = changes.artifact.currentValue;
      const oldArtifact: RunningArtifact = changes.artifact.previousValue;
      if (
        changes.artifact.firstChange ||
        newArtifact.identifier !== oldArtifact.identifier
      ) {
        this.form = this.fb.group({
          identifier: newArtifact.identifier,
        });
      }
    }
  }

  submitForm(): void {
    this.submitArtifactExportForm.emit(this.form);
  }
}
