import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Author } from '../../model/author';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { Updatable, UPDATABLE } from '../updatable';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.css'],
  providers: [
    {
      provide: UPDATABLE,
      useExisting: AuthorFormComponent,
    },
  ],
})
export class AuthorFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() author?: Author;

  @Output() submitAuthorForm = new EventEmitter<FormGroup>();

  authorForm = this.fb.group({
    name: '',
    company: '',
    email: ['', Validators.email],
    website: '',
  });
  changed = false;

  private changeSubscription?: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.author == null) {
      this.loadForm();
    }
    this.changeSubscription = this.authorForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed =
              this.author != null &&
              !this.author.equals({
                name: value.name ?? undefined,
                company: value.company ?? undefined,
                email: value.email ?? undefined,
                website: value.website ?? undefined,
              }))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.author) {
      const oldAuthor: Author = changes.author.previousValue;
      const newAuthor: Author = changes.author.currentValue;
      if (!newAuthor.equals(oldAuthor)) {
        this.loadForm(changes.author.currentValue);
      }
    }
  }

  ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
  }

  submitForm(): void {
    this.submitAuthorForm.emit(this.authorForm);
  }

  update(): void {
    if (this.changed && this.authorForm.valid) {
      this.submitForm();
    }
  }

  private loadForm(author: Author = new Author(undefined, {})): void {
    this.authorForm.patchValue(author);
  }
}
