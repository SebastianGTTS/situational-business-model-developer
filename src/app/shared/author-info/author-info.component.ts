import { Component, Input } from '@angular/core';
import { Author } from '../../model/author';

@Component({
  selector: 'app-author-info',
  templateUrl: './author-info.component.html',
  styleUrls: ['./author-info.component.css']
})
export class AuthorInfoComponent {

  @Input() author: Author;

}
