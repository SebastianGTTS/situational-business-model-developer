import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Author } from '../../model/author';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.css']
})
export class AuthorFormComponent implements OnInit, OnChanges {

  @Input() author: Author = null;

  @Output() submitAuthorForm = new EventEmitter<FormGroup>();

  authorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    if (this.author === null) {
      this.loadForm();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.author) {
      this.loadForm(changes.author.currentValue);
    }
  }

  submitForm() {
    this.submitAuthorForm.emit(this.authorForm);
  }

  private loadForm(author: Author = new Author({})) {
    this.authorForm = this.fb.group({
      name: author.name,
      company: author.company,
      email: [author.email, Validators.email],
      website: author.website
    });
  }

}
