import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RunningArtifact } from '../../../development-process-registry/running-process/running-artifact';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-running-process-artifact-rename-form',
  templateUrl: './running-process-artifact-rename-form.component.html',
  styleUrls: ['./running-process-artifact-rename-form.component.css'],
})
export class RunningProcessArtifactRenameFormComponent implements OnChanges {
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
