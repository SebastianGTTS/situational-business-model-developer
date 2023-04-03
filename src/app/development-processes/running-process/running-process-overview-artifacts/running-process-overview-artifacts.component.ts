import { Component, Input } from '@angular/core';
import { RunningArtifact } from '../../../development-process-registry/running-process/running-artifact';

@Component({
  selector: 'app-running-process-overview-artifacts',
  templateUrl: './running-process-overview-artifacts.component.html',
  styleUrls: ['./running-process-overview-artifacts.component.scss'],
})
export class RunningProcessOverviewArtifactsComponent {
  @Input() artifacts!: RunningArtifact[];
}
