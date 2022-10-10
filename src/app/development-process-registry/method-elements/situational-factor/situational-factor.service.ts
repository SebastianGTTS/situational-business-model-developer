import { Injectable } from '@angular/core';
import {
  SituationalFactorDefinition,
  SituationalFactorDefinitionInit,
} from './situational-factor-definition';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';
import { MethodElementService } from '../method-element.service';
import {
  SituationalFactor,
  SituationalFactorEntry,
} from './situational-factor';

interface SortableList {
  _id: string;
  situationalFactors: { list: string; element?: SituationalFactorEntry }[];
}

export interface SituationalFactorsMatchResult {
  missing: SituationalFactor[];
  low: SituationalFactor[];
  incorrect: SituationalFactor[];
}

type FactorMap = { [listName: string]: { [factorName: string]: string } };

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class SituationalFactorService extends MethodElementService<
  SituationalFactorDefinition,
  SituationalFactorDefinitionInit
> {
  protected readonly typeName = SituationalFactorDefinition.typeName;

  protected readonly elementConstructor = SituationalFactorDefinition;

  /**
   * Sort a list by the distance of the situational factors of each
   * item in the list to the provided situational factors
   *
   * @param situationalFactors
   * @param list
   */
  sortByDistance<T extends SortableList[]>(
    situationalFactors: SituationalFactor[],
    list: T
  ): T {
    const distanceMap: { [id: string]: number } = {};
    list.forEach((listItem) => {
      const factorsProvidedByListItem = listItem.situationalFactors.map(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (factor) => factor.element!
      );
      distanceMap[listItem._id] = this.distance(
        situationalFactors,
        factorsProvidedByListItem
      );
    });
    return list.sort(
      (methodA, methodB) => distanceMap[methodA._id] - distanceMap[methodB._id]
    );
  }

  /**
   * Calculate the distance between the base situational factors and the provided ones
   *
   * @param base
   * @param provided
   */
  distance(
    base: SituationalFactor[],
    provided: (SituationalFactor | SituationalFactorEntry)[]
  ): number {
    const factorMap = this.createMap(provided);
    const { missing, incorrect, low } = this.checkMatch(base, factorMap);
    let distance = incorrect.length;
    low.forEach((factor) => {
      const internalDistance =
        factor.factor.values.indexOf(factor.value) -
        factor.factor.values.indexOf(
          factorMap[factor.factor.list][factor.factor.name]
        );
      distance += internalDistance / factor.factor.values.length;
    });
    const correct =
      base.length - missing.length - incorrect.length - low.length;
    return distance - correct;
  }

  checkMatch(
    base: SituationalFactor[],
    provided: FactorMap
  ): SituationalFactorsMatchResult {
    const result: SituationalFactorsMatchResult = {
      missing: [],
      low: [],
      incorrect: [],
    };
    base.forEach((factor) => {
      if (factor == null) {
        return;
      }
      if (
        factor.factor.list in provided &&
        factor.factor.name in provided[factor.factor.list]
      ) {
        const value = provided[factor.factor.list][factor.factor.name];
        if (factor.value !== value) {
          if (factor.factor.ordered) {
            if (
              factor.factor.values.indexOf(factor.value) >
              factor.factor.values.indexOf(value)
            ) {
              result.low.push(factor);
            }
          } else {
            result.incorrect.push(factor);
          }
        }
      } else {
        result.missing.push(factor);
      }
    });
    return result;
  }

  createMap(
    situationalFactors: (SituationalFactor | SituationalFactorEntry)[]
  ): FactorMap {
    const map: FactorMap = {};
    situationalFactors.forEach((factor) => {
      if (!(factor.factor.list in map)) {
        map[factor.factor.list] = {};
      }
      map[factor.factor.list][factor.factor.name] = factor.value;
    });
    return map;
  }
}
