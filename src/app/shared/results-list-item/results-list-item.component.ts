import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-results-list-item',
  templateUrl: './results-list-item.component.html',
  styleUrls: ['./results-list-item.component.css'],
})
export class ResultsListItemComponent {
  @Input() viewLink: string[];
  @Output() delete = new EventEmitter();
}
