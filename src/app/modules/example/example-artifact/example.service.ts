import { Injectable } from '@angular/core';
import { DefaultElementService } from '../../../database/default-element.service';
import { Example, ExampleInit } from './example';
import { DbId } from '../../../database/database-entry';

@Injectable()
export class ExampleService extends DefaultElementService<
  Example,
  ExampleInit
> {
  protected readonly typeName = Example.typeName;

  protected readonly elementConstructor = Example;

  /**
   * Update an example with a new name and description
   *
   * @param id
   * @param name
   * @param description
   */
  async update(id: DbId, name: string, description: string): Promise<void> {
    const example = await this.get(id);
    example.name = name;
    example.description = description;
    await this.save(example);
  }
}
