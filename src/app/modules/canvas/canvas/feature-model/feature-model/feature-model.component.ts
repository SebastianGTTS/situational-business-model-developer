import { Component, Input } from '@angular/core';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';
import { Feature } from '../../../canvas-meta-model/feature';

@Component({
  selector: 'app-feature-model',
  templateUrl: './feature-model.component.html',
  styleUrls: ['./feature-model.component.css'],
})
export class FeatureModelComponent {
  @Input() featureModel?: FeatureModel;

  asList(features: { [id: string]: Feature }): Feature[] {
    return Object.values(features);
  }
}
