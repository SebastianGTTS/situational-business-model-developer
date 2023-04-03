import { Component } from '@angular/core';
import { Instance } from '../../../canvas-meta-artifact/instance';
import { InstanceLoaderService } from '../../expert-model/instance-loader.service';

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.css'],
  providers: [InstanceLoaderService],
})
export class PatternComponent {
  constructor(private instanceLoaderService: InstanceLoaderService) {}

  get instance(): Instance | undefined {
    return this.instanceLoaderService.instance;
  }
}
