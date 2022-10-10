import { Injectable } from '@angular/core';
import {
  ProcessPattern,
  ProcessPatternEntry,
  ProcessPatternInit,
} from './process-pattern';
import { Type } from '../method-elements/type/type';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { DefaultElementService } from '../../database/default-element.service';
import { PouchdbService } from '../../database/pouchdb.service';
import { SituationalFactorService } from '../method-elements/situational-factor/situational-factor.service';
import { SituationalFactor } from '../method-elements/situational-factor/situational-factor';
import { ProcessPatternDiagramService } from './process-pattern-diagram.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ProcessPatternService extends DefaultElementService<
  ProcessPattern,
  ProcessPatternInit
> {
  protected readonly typeName = ProcessPattern.typeName;

  protected readonly elementConstructor = ProcessPattern;

  constructor(
    pouchdbService: PouchdbService,
    private processPatternDiagramService: ProcessPatternDiagramService,
    private situationalFactorService: SituationalFactorService
  ) {
    super(pouchdbService);
  }

  /**
   * Get a list of process patterns that have the needed types, but not the forbidden ones.
   *
   * @param needed needed types
   * @param forbidden forbidden types
   */
  async getValidProcessPatterns(
    needed: { list: string; element?: { _id: string; name: string } }[],
    forbidden: { list: string; element?: { _id: string; name: string } }[]
  ): Promise<ProcessPatternEntry[]> {
    return (
      await this.pouchdbService.find<ProcessPatternEntry>(
        ProcessPattern.typeName,
        {
          selector: {},
        }
      )
    ).filter((pattern) => Type.validTypes(pattern.types, needed, forbidden));
  }

  /**
   * Get a list of process patterns that have the needed types, but not the forbidden ones.
   * Additionally, sorted by the distance to the situational factors.
   *
   * @param needed needed types
   * @param forbidden forbidden types
   * @param situationalFactors
   */
  async getSortedValidProcessPatterns(
    needed: { list: string; element?: { _id: string; name: string } }[],
    forbidden: { list: string; element?: { _id: string; name: string } }[],
    situationalFactors: SituationalFactor[]
  ): Promise<ProcessPatternEntry[]> {
    const list = await this.getValidProcessPatterns(needed, forbidden);
    return this.situationalFactorService.sortByDistance(
      situationalFactors,
      list
    );
  }

  /**
   * Update the process pattern.
   *
   * @param id id of the process pattern
   * @param processPattern the new values of the object (values will be copied)
   */
  async update(
    id: string,
    processPattern: Partial<ProcessPattern>
  ): Promise<void> {
    const dbProcessPattern = await this.get(id);
    dbProcessPattern.update(processPattern);
    await this.save(dbProcessPattern);
  }

  /**
   * Get process patterns by their ids
   *
   * @param ids the ids to query
   */
  async getProcessPatterns(ids: string[]): Promise<ProcessPattern[]> {
    return (
      await this.pouchdbService.find<ProcessPatternEntry>(
        ProcessPattern.typeName,
        {
          selector: {
            _id: {
              $in: ids,
            },
          },
        }
      )
    ).map((pattern) => new ProcessPattern(pattern, undefined));
  }

  /**
   * Checks whether the process pattern is correctly defined
   *
   * @param processPattern the process pattern to check
   * @return true if the process pattern is correctly defined and can
   * be used in processes
   */
  async isCorrectlyDefined(processPattern: ProcessPattern): Promise<boolean> {
    return this.processPatternDiagramService.isCorrectlyDefined(processPattern);
  }
}
