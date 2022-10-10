import { Component, Input } from '@angular/core';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';

@Component({
  selector: 'app-model-info-box',
  templateUrl: './model-info-box.component.html',
  styleUrls: ['./model-info-box.component.css'],
})
export class ModelInfoBoxComponent {
  @Input() featureModel!: FeatureModel;
}
