import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { RunningArtifact } from '../../../development-process-registry/running-process/running-artifact';

@Component({
  selector: 'app-running-process-artifact-export-form',
  templateUrl: './running-process-artifact-export-form.component.html',
  styleUrls: ['./running-process-artifact-export-form.component.css'],
})
export class RunningProcessArtifactExportFormComponent implements OnChanges {
  @Input() artifact!: RunningArtifact;

  @Output() submitArtifactExportForm = new EventEmitter<UntypedFormGroup>();

  form?: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.artifact) {
      const newArtifact: RunningArtifact = changes.artifact.currentValue;
      const oldArtifact: RunningArtifact = changes.artifact.previousValue;
      if (
        changes.artifact.firstChange ||
        newArtifact.name !== oldArtifact.name
      ) {
        this.form = this.fb.group({
          identifier: newArtifact.name,
        });
      }
    }
  }

  submitForm(): void {
    this.submitArtifactExportForm.emit(this.form);
  }
}
