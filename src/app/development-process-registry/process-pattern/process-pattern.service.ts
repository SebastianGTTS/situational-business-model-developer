import { Injectable } from '@angular/core';
import { ProcessPattern } from './process-pattern';
import { Type } from '../method-elements/type/type';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { DefaultElementService } from '../../database/default-element.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ProcessPatternService extends DefaultElementService<ProcessPattern> {
  protected get typeName(): string {
    return ProcessPattern.typeName;
  }

  /**
   * Get a list of process patterns that have the needed types, but not the forbidden ones.
   *
   * @param needed needed types
   * @param forbidden forbidden types
   */
  async getValidProcessPatterns(
    needed: { list: string; element: { _id: string; name: string } }[],
    forbidden: { list: string; element: { _id: string; name: string } }[]
  ): Promise<ProcessPattern[]> {
    return (
      await this.pouchdbService.find<ProcessPattern>(ProcessPattern.typeName, {
        selector: {},
      })
    ).filter((pattern) => Type.validTypes(pattern.types, needed, forbidden));
  }

  /**
   * Update the process pattern.
   *
   * @param id id of the process pattern
   * @param processPattern the new values of the object (values will be copied)
   */
  async update(id: string, processPattern: Partial<ProcessPattern>) {
    const dbProcessPattern = await this.get(id);
    dbProcessPattern.update(processPattern);
    return this.save(dbProcessPattern);
  }

  /**
   * Get process patterns by their ids
   *
   * @param ids the ids to query
   */
  async getProcessPatterns(ids: string[]): Promise<ProcessPattern[]> {
    return (
      await this.pouchdbService.find<ProcessPattern>(ProcessPattern.typeName, {
        selector: {
          _id: {
            $in: ids,
          },
        },
      })
    ).map((pattern) => new ProcessPattern(pattern));
  }

  protected createElement(element: Partial<ProcessPattern>): ProcessPattern {
    return new ProcessPattern(element);
  }
}
