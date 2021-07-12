import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';

@Component({
  selector: 'app-method-element-list',
  templateUrl: './method-element-list.component.html',
  styleUrls: ['./method-element-list.component.css']
})
export class MethodElementListComponent {

  @Input() elementLists: { listName: string, elements: MethodElement[] }[] = null;

  @Output() deleteElement = new EventEmitter<MethodElement>();

  @Input() getRouterLink: (element: MethodElement) => string[] = (element) => ['detail', element._id];

}
