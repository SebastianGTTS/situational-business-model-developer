import { Component, Input } from '@angular/core';
import { Author } from '../../model/author';

@Component({
  selector: 'app-author-overview',
  templateUrl: './author-overview.component.html',
  styleUrls: ['./author-overview.component.css'],
})
export class AuthorOverviewComponent {
  @Input() author!: Author;
  @Input() editLink?: string[];
  @Input() fragment?: string;
}
