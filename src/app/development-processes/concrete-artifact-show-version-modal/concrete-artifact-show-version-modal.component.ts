import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { ArtifactVersion } from '../../development-process-registry/running-process/artifact-version';
import { ArtifactDataType } from '../../development-process-registry/running-process/artifact-data';

@Component({
  selector: 'app-concrete-artifact-show-version-modal',
  templateUrl: './concrete-artifact-show-version-modal.component.html',
  styleUrls: ['./concrete-artifact-show-version-modal.component.css'],
})
export class ConcreteArtifactShowVersionModalComponent {
  @Input() artifact?: RunningArtifact;
  @Input() version?: ArtifactVersion;

  @Output() dismiss = new EventEmitter<void>();
  @Output() viewArtifactVersion = new EventEmitter<void>();
  @Output() editArtifactVersion = new EventEmitter<void>();

  get versionNumber(): number | undefined {
    if (this.artifact == null || this.version == null) {
      return undefined;
    }
    return this.artifact.getVersionNumber(this.version) + 1;
  }

  get isStringType(): boolean {
    return this.version?.data.type === ArtifactDataType.STRING;
  }

  get isReferenceType(): boolean {
    return this.version?.data.type === ArtifactDataType.REFERENCE;
  }

  get isLatestVersion(): boolean {
    return this.versionNumber === this.artifact?.versions.length;
  }
}
