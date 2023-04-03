import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-wrapper',
  templateUrl: './list-wrapper.component.html',
  styleUrls: ['./list-wrapper.component.css'],
})
export class ListWrapperComponent {
  @Input() listTitle!: string;
  @Input() loading = false;
  @Input() reloading = false;
  @Input() noResults = false;
}
