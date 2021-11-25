import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-wrapper',
  templateUrl: './list-wrapper.component.html',
  styleUrls: ['./list-wrapper.component.css'],
})
export class ListWrapperComponent {
  @Input() listTitle: string;
  @Input() loading: boolean = false;
  @Input() reloading: boolean = false;
  @Input() noResults: boolean = false;
}
