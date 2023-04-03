import { Component } from '@angular/core';
import {
  MethodElementInfo,
  MethodElementsInfoService,
} from '../../shared/method-elements-info.service';

@Component({
  selector: 'app-method-elements',
  templateUrl: './method-elements.component.html',
  styleUrls: ['./method-elements.component.css'],
})
export class MethodElementsComponent {
  constructor(private methodElementsInfoService: MethodElementsInfoService) {}

  get methodElementLinks(): MethodElementInfo[] {
    return this.methodElementsInfoService.methodElementInfo;
  }
}
