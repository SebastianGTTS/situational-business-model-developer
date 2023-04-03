import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EntryType } from '../../../database/database-model-part';
import { FormBuilder, Validators } from '@angular/forms';
import { ListService } from '../../../shared/list.service';
import { Router } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { getTypeaheadInputPipe } from '../../../shared/utils';
import { map } from 'rxjs/operators';
import {
  MethodElement,
  MethodElementInit,
} from '../../../development-process-registry/method-elements/method-element';
import { MethodElementService } from '../../../development-process-registry/method-elements/method-element.service';

@Component({
  selector: 'app-method-element-create-form',
  templateUrl: './method-element-create-form.component.html',
  styleUrls: ['./method-element-create-form.component.scss'],
})
export class MethodElementCreateFormComponent<
  T extends MethodElement,
  S extends MethodElementInit
> implements OnInit, OnDestroy
{
  @Input() createFunction!: (name: string, list: string) => S | Promise<S>;
  @Input() elementName!: string;
  @Input() viewLinkFunction?: (item: EntryType<T>) => string[];

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    list: ['', Validators.required],
  });

  listNames: string[] = [];
  openListInput = new Subject<string>();

  constructor(
    private methodElementService: MethodElementService<T, S>,
    private fb: FormBuilder,
    private listService: ListService<T, S>,
    private router: Router
  ) {}

  ngOnInit(): void {
    void this.loadListNames();
  }

  ngOnDestroy(): void {
    this.openListInput.complete();
  }

  private async loadListNames(): Promise<void> {
    this.listNames = await this.methodElementService.getListNames();
  }

  async addElement(): Promise<void> {
    const addedElement = await this.listService.add(
      await this.createFunction(
        this.form.getRawValue().name,
        this.form.getRawValue().list
      )
    );
    this.form.reset();
    if (this.viewLinkFunction != null) {
      await this.router.navigate(
        this.viewLinkFunction(addedElement.toDb() as EntryType<T>)
      );
    }
  }

  searchLists = (input: Observable<string>): Observable<string[]> => {
    return merge(getTypeaheadInputPipe(input), this.openListInput).pipe(
      map((term) =>
        this.listNames
          .filter((listItem) =>
            listItem.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 10)
      )
    );
  };
}
