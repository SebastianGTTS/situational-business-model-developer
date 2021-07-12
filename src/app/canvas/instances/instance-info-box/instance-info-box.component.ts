import { Component, Input } from '@angular/core';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';
import { Instance } from '../../../canvas-meta-model/instance';

@Component({
  selector: 'app-instance-info-box',
  templateUrl: './instance-info-box.component.html',
  styleUrls: ['./instance-info-box.component.css']
})
export class InstanceInfoBoxComponent {

  @Input() featureModel: FeatureModel;
  @Input() instance: Instance;

}
