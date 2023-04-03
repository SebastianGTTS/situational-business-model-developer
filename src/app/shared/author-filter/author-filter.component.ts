import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FilterService } from '../filter.service';
import { Author, AuthorEntry } from '../../model/author';
import { ListService } from '../list.service';
import { DatabaseModel } from '../../database/database-model';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../database/database-entry';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { getTypeaheadInputPipe } from '../utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-author-filter',
  templateUrl: './author-filter.component.html',
  styleUrls: ['./author-filter.component.scss'],
})
export class AuthorFilterComponent<
  T extends DatabaseRootEntry & { author: AuthorEntry }
> implements OnInit, OnDestroy
{
  private static readonly filterId = 'author';

  @Input() authorNames: string[] = [];

  form = this.fb.nonNullable.group({
    author: [''],
  });
  openAuthorInput = new Subject<string>();

  private formChangeSubscription?: Subscription;
  private listServiceSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService<T>,
    @Optional()
    private listService?: ListService<
      DatabaseModel & { author: Author },
      DatabaseRootInit
    >
  ) {}

  ngOnInit(): void {
    this.formChangeSubscription = this.form.valueChanges.subscribe((value) => {
      if (value.author != null && value.author !== '') {
        const authorName = value.author.toLowerCase();
        this.filterService.addFilterFunction(
          AuthorFilterComponent.filterId,
          (item) =>
            item.author.name?.toLowerCase().includes(authorName) ?? false
        );
      } else {
        this.filterService.removeFilterFunction(AuthorFilterComponent.filterId);
      }
    });
    this.listServiceSubscription = this.listService?.loaded.subscribe(() => {
      const items = this.listService?.elements as T[] | undefined;
      this.authorNames = Array.from(
        new Set(
          (items
            ?.map((item) => item.author?.name)
            .filter((name) => name != null && name !== '') as string[]) ?? []
        )
      );
    });
  }

  ngOnDestroy(): void {
    this.openAuthorInput.complete();
    this.formChangeSubscription?.unsubscribe();
    this.listServiceSubscription?.unsubscribe();
    this.filterService.removeFilterFunction(AuthorFilterComponent.filterId);
  }

  searchAuthors = (input: Observable<string>): Observable<string[]> => {
    return merge(getTypeaheadInputPipe(input), this.openAuthorInput).pipe(
      map((term) =>
        this.authorNames
          .filter((name) => name.toLowerCase().includes(term.toLowerCase()))
          .slice(0, 7)
      )
    );
  };

  get isValid(): boolean {
    return this.form.value.author !== '';
  }
}
