import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Author } from '../../model/author';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.css'],
})
export class AuthorFormComponent implements OnInit, OnChanges {
  @Input() author: Author = null;

  @Output() submitAuthorForm = new EventEmitter<FormGroup>();

  authorForm: FormGroup = this.fb.group({
    name: '',
    company: '',
    email: ['', Validators.email],
    website: '',
  });
  changed = false;

  private changeSubscription: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.author === null) {
      this.loadForm();
    }
    this.changeSubscription = this.authorForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = this.author != null && !this.author.equals(value))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.author) {
      const oldAuthor: Author = changes.author.previousValue;
      const newAuthor: Author = changes.author.currentValue;
      if (!newAuthor.equals(oldAuthor)) {
        this.loadForm(changes.author.currentValue);
      }
    }
  }

  submitForm() {
    this.submitAuthorForm.emit(this.authorForm);
  }

  private loadForm(author: Author = new Author({})) {
    this.authorForm.patchValue(author);
  }
}
