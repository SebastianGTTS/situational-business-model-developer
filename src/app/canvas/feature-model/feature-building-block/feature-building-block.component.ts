import { Component, Input } from '@angular/core';
import { Feature } from '../../../canvas-meta-model/feature';

@Component({
  selector: 'app-feature-building-block',
  templateUrl: './feature-building-block.component.html',
  styleUrls: ['./feature-building-block.component.css']
})
/**
 * Internal class to display single features of the feature canvas.
 *
 * @author: Sebastian Gottschalk
 */
export class FeatureBuildingBlockComponent {
  @Input() buildingBlockName: string;
  @Input() features: Feature[];
}
