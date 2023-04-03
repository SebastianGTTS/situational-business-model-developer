import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ListService } from '../list.service';
import { DatabaseModel } from '../../database/database-model';
import { DatabaseInit } from '../../database/database-entry';
import { EntryType } from '../../database/database-model-part';
import { Router } from '@angular/router';

@Component({
  selector: 'app-element-name-form',
  templateUrl: './element-name-form.component.html',
  styleUrls: ['./element-name-form.component.css'],
})
export class ElementNameFormComponent<
  T extends DatabaseModel,
  S extends DatabaseInit
> {
  @Input() createFunction!: (name: string) => S | Promise<S>;
  @Input() elementName!: string;
  @Input() viewLinkFunction?: (item: EntryType<T>) => string[];

  nameForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private listService: ListService<T, S>,
    private router: Router
  ) {}

  async addElement(): Promise<void> {
    const addedElement = await this.listService.add(
      await this.createFunction(this.nameForm.getRawValue().name)
    );
    this.nameForm.reset();
    if (this.viewLinkFunction != null) {
      await this.router.navigate(
        this.viewLinkFunction(addedElement.toDb() as EntryType<T>),
        {
          queryParams: {
            created: true,
          },
        }
      );
    }
  }
}
