import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';

@Component({
  selector: 'app-method-element-list',
  templateUrl: './method-element-list.component.html',
  styleUrls: ['./method-element-list.component.css'],
})
export class MethodElementListComponent<T extends MethodElement> {
  @Input() listTitle: string;
  @Input() elementLists: { listName: string; elements: T[] }[] = null;
  @Input() getRouterLink: (element: T) => string[] = (element) => [
    'detail',
    element._id,
  ];
  @Output() deleteElement = new EventEmitter<T>();
}
