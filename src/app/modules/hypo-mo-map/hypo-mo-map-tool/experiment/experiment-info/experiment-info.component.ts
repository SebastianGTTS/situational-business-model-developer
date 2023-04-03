import { Component, Input } from '@angular/core';
import { ExperimentUsed } from '../../../hypo-mo-map-meta-artifact/experiment-used';

@Component({
  selector: 'app-experiment-info',
  templateUrl: './experiment-info.component.html',
  styleUrls: ['./experiment-info.component.css'],
})
export class ExperimentInfoComponent {
  @Input() experiment!: ExperimentUsed;
  @Input() showDescription = true;
  @Input() metric?: string = undefined;
}
