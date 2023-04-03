import { Component } from '@angular/core';
import { Instance } from '../../../canvas-meta-artifact/instance';
import { InstanceLoaderService } from '../../expert-model/instance-loader.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css'],
  providers: [InstanceLoaderService],
})
export class ExampleComponent {
  constructor(private instanceLoaderService: InstanceLoaderService) {}

  get instance(): Instance | undefined {
    return this.instanceLoaderService.instance;
  }
}
