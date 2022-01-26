import { Injectable } from '@angular/core';
import { FeatureModel } from './feature-model';
import { Feature, FeatureType, SubfeatureConnectionsType } from './feature';
import { Instance, InstanceType } from './instance';
import { ConformanceReport, PatternHint } from './conformance-report';

@Injectable({
  providedIn: 'root',
})
export class CanvasModelConsistencyService {
  /**
   * Called to check whether a feature model is consistent. Raises an error if not.
   *
   * @param featureModel the feature model to check
   */
  checkFormalConsistency(featureModel: FeatureModel): void {
    // has a definition
    if (!featureModel.definition) {
      throw new Error('Missing definition');
    }

    // has the root canvas blocks of the definition
    const blocks = featureModel.definition.rootFeatures.map(
      (feature) => feature.id
    );
    if (!blocks.every((id) => id in featureModel.features)) {
      throw new Error('Missing canvas blocks');
    }

    // has unique feature ids and only references valid features in relationships
    const featureIds = new Set<string>();
    featureModel.iterateFeatures((feature: Feature) => {
      if (featureIds.has(feature.id)) {
        throw new Error('Feature id ' + feature.id + ' is not unique');
      } else {
        featureIds.add(feature.id);
      }
      return false;
    });
    featureModel.iterateFeatures((feature: Feature) => {
      if (
        !feature.relationships
          .getAllReferencedFeatureIds()
          .every((id) => featureIds.has(id))
      ) {
        throw new Error(
          'Relationships of feature ' +
            feature.id +
            ' reference a non existing feature id'
        );
      }
      if (
        feature.relationships
          .getRelationshipTypes()
          .some(
            (type) => !featureModel.definition.relationshipTypes.includes(type)
          )
      ) {
        throw new Error(
          'Feature ' +
            feature.id +
            ' has a relationship types that does not exist in the definition'
        );
      }
      return false;
    });

    // instances use at least the nine root canvas blocks
    if (
      !featureModel.instances.every((instance) =>
        blocks.every((id) => instance.usedFeatures.includes(id))
      )
    ) {
      throw new Error('Instance does not reference all root canvas blocks');
    }

    // instances only reference valid features
    if (
      !featureModel.instances.every((instance) =>
        instance.usedFeatures.every((id) => featureIds.has(id))
      )
    ) {
      throw new Error('Instance references non existing feature id');
    }
  }

  /**
   * Check whether an instantiation is possible or not possible
   *
   * @param featureModel the feature model to check
   */
  instanceIsPossible(featureModel: FeatureModel): {
    problems: string[];
    problemFeatureIds: string[];
    possibleInstance: Instance;
  } {
    const featureMap = featureModel.getFeatureMap();
    const testInstance = new Instance(undefined, {
      name: 'Possible Instance',
      type: InstanceType.EXAMPLE,
    });
    testInstance.usedFeatures = [];

    const instances = this.addFeaturesToPossibleInstances(
      [testInstance],
      Object.values(featureModel.features),
      featureMap
    );

    const results = instances.map((instance) => {
      return {
        ...this.checkPossibleInstanceErrors(featureModel, instance),
        possibleInstance: instance,
      };
    });

    const result = results.find((res) => res.problems.length === 0);

    if (result) {
      return result;
    } else {
      const min = Math.min(...results.map((res) => res.problems.length));
      return results.find((res) => res.problems.length === min);
    }
  }

  /**
   * Add a feature to a possible instance and add all features that are required after this feature is added
   * (required, parent, mandatory, subfeatures)
   *
   * @param instance the possible instance
   * @param feature the feature to add
   * @param featureMap the feature map of the feature model
   */
  private addFeatureToPossibleInstance(
    instance: Instance,
    feature: Feature,
    featureMap: { [id: string]: Feature }
  ): Instance[] {
    instance.addFeature(feature.id);

    let instances = [instance];

    // Add parent of feature
    if (feature.parent !== null) {
      instances = this.addFeatureToPossibleInstances(
        instances,
        feature.parent,
        featureMap
      );
    }

    // Add all required features
    instances = this.addFeaturesToPossibleInstances(
      instances,
      feature.relationships
        .getRelationships('required')
        .map((id) => featureMap[id]),
      featureMap
    );

    // Check for new mandatory features
    instances = this.addFeaturesToPossibleInstances(
      instances,
      Object.values(feature.subfeatures).filter(
        (subfeature) => subfeature.type === FeatureType.MANDATORY
      ),
      featureMap
    );

    // Check OR and XOR
    if (
      feature.subfeatureConnections === SubfeatureConnectionsType.XOR ||
      feature.subfeatureConnections === SubfeatureConnectionsType.OR
    ) {
      const newInstances = [
        ...instances.filter(
          (inst) =>
            Object.keys(feature.subfeatures).filter((id) =>
              inst.usedFeatures.includes(id)
            ).length > 0
        ),
      ];
      instances
        .filter(
          (inst) =>
            Object.keys(feature.subfeatures).filter((id) =>
              inst.usedFeatures.includes(id)
            ).length === 0
        )
        .forEach((inst) => {
          if (Object.keys(feature.subfeatures).length === 0) {
            newInstances.push(inst);
          } else {
            Object.values(feature.subfeatures).forEach((subfeature) => {
              const tmpInstance = new Instance(undefined, inst);
              tmpInstance.usedFeatures = [...tmpInstance.usedFeatures];
              newInstances.push(
                ...this.addFeatureToPossibleInstance(
                  tmpInstance,
                  subfeature,
                  featureMap
                )
              );
            });
          }
        });
      instances = newInstances;
    }

    return instances;
  }

  /**
   * Add a feature to possible instances. Return the resulting possible instances.
   *
   * @param instances the possible instances
   * @param feature the feature to add
   * @param featureMap the feature map of the feature model
   */
  private addFeatureToPossibleInstances(
    instances: Instance[],
    feature: Feature,
    featureMap: { [id: string]: Feature }
  ): Instance[] {
    const newInstances = [];
    instances.forEach((instance) => {
      instance.usedFeatures.includes(feature.id)
        ? newInstances.push(instance)
        : newInstances.push(
            ...this.addFeatureToPossibleInstance(instance, feature, featureMap)
          );
    });
    return newInstances;
  }

  /**
   * Add features to possible instances. Return the resulting possible instances.
   *
   * @param instances the possible instances
   * @param features the features to add
   * @param featureMap the feature map of the feature model
   */
  private addFeaturesToPossibleInstances(
    instances: Instance[],
    features: Feature[],
    featureMap: { [id: string]: Feature }
  ): Instance[] {
    features.forEach(
      (feature) =>
        (instances = this.addFeatureToPossibleInstances(
          instances,
          feature,
          featureMap
        ))
    );
    return instances;
  }

  /**
   * Checks for problems with an instance that is valid except for XOR and excludes fields
   *
   * @param featureModel the feature model
   * @param instance the instance to check
   */
  private checkPossibleInstanceErrors(
    featureModel: FeatureModel,
    instance: Instance
  ): { problems: string[]; problemFeatureIds: string[] } {
    const featureMap = featureModel.getFeatureMap();
    const problems: string[] = [];
    const problemFeatureIds: Set<string> = new Set<string>();

    featureModel.iterateFeatures(
      (feature) => {
        // Check for XOR problem
        if (
          feature.subfeatureConnections === SubfeatureConnectionsType.XOR &&
          Object.keys(feature.subfeatures).filter((id) =>
            instance.usedFeatures.includes(id)
          ).length !== 1
        ) {
          problems.push(
            feature.name + ' is XOR, but can not have exactly one subfeature'
          );
          problemFeatureIds.add(feature.id);
        }

        // Check for OR problem
        if (
          feature.subfeatureConnections === SubfeatureConnectionsType.OR &&
          Object.keys(feature.subfeatures).filter((id) =>
            instance.usedFeatures.includes(id)
          ).length === 0
        ) {
          problems.push(
            feature.name + ' is OR, but can not have at least one subfeature'
          );
          problemFeatureIds.add(feature.id);
        }

        // Check excludes problem
        feature.relationships
          .getRelationships('excludes')
          .filter((id) => instance.usedFeatures.includes(id))
          .forEach((id) => {
            const excludedFeature = featureMap[id];
            problems.push(
              feature.name +
                ' excludes the feature ' +
                excludedFeature.name +
                ', but both features have to be included'
            );
            problemFeatureIds.add(feature.id);
          });
        return false;
      },
      (feature) => instance.usedFeatures.includes(feature.id)
    );
    return {
      problems,
      problemFeatureIds: Array.from(problemFeatureIds),
    };
  }

  /**
   * Check that hurts and supports do not exclude each other.
   *
   * @param featureModel the feature model to check
   * @return problems and problem feature ids of the features that have an incorrect relationship
   */
  checkHurtsSupports(featureModel: FeatureModel): {
    problems: string[];
    problemFeatureIds: string[];
  } {
    const featureMap = featureModel.getFeatureMap();
    const problems: string[] = [];
    const problemFeatureIds: Set<string> = new Set<string>();

    featureModel.iterateFeatures((feature) => {
      const features = feature.relationships
        .getRelationships('supports')
        .map((id) => featureMap[id])
        .filter((relatedFeature) =>
          relatedFeature.relationships
            .getRelationships('hurts')
            .includes(feature.id)
        );
      features.forEach((relatedFeature) => {
        problems.push(
          'Feature ' +
            feature.name +
            ' supports ' +
            relatedFeature.name +
            ', but ' +
            relatedFeature.name +
            ' hurts ' +
            feature.name +
            '.'
        );
        problemFeatureIds.add(relatedFeature.id);
      });
      if (features.length > 0) {
        problemFeatureIds.add(feature.id);
      }
      return false;
    });

    return {
      problems,
      problemFeatureIds: Array.from(problemFeatureIds),
    };
  }

  /**
   * Checks the conformance of an instance of a feature model
   *
   * @param featureModel the feature model
   * @param instanceId the id of the instance
   * @param patterns the patterns
   * @return featureIds that have problems and errors as messages
   */
  checkConformanceOfInstance(
    featureModel: FeatureModel,
    instanceId: number,
    patterns: Instance[]
  ): ConformanceReport {
    const instance = featureModel.instances.find((i) => i.id === instanceId);

    return new ConformanceReport({
      ...this.getConformanceMessages(featureModel, instance),
      ...this.getHints(featureModel, instance),
      ...this.getPatternHints(featureModel, instance, patterns),
    });
  }

  /**
   * Get errors, warnings and strengths for the instance
   *
   * @param featureModel the feature model
   * @param instance the instance
   */
  private getConformanceMessages(
    featureModel: FeatureModel,
    instance: Instance
  ): {
    errorFeatureIds: string[];
    errors: string[];
    warningFeatureIds: string[];
    warnings: string[];
    strengthFeatureIds: string[];
    strengths: string[];
  } {
    const errorFeatureIds = new Set<string>();
    const warningFeatureIds = new Set<string>();
    const strengthFeatureIds = new Set<string>();
    const errors: string[] = [];
    const warnings: string[] = [];
    const strengths: string[] = [];

    const filter = (feature: Feature): boolean =>
      instance.usedFeatures.includes(feature.id) ||
      feature.type === FeatureType.MANDATORY;
    const checkFeature = (feature: Feature): boolean => {
      const selected = instance.usedFeatures.includes(feature.id);
      const selectedSubfeaturesLength = Object.keys(feature.subfeatures).filter(
        (id: string) => instance.usedFeatures.includes(id)
      ).length;

      if (feature.type === FeatureType.MANDATORY && !selected) {
        errorFeatureIds.add(feature.id);
        errors.push(feature.name + ' is mandatory');
      }

      switch (feature.subfeatureConnections) {
        case SubfeatureConnectionsType.OR:
          if (selectedSubfeaturesLength === 0) {
            errorFeatureIds.add(feature.id);
            errors.push(feature.name + ' needs at least one subfeature');
          }
          break;
        case SubfeatureConnectionsType.XOR:
          if (selectedSubfeaturesLength !== 1) {
            errorFeatureIds.add(feature.id);
            errors.push(feature.name + ' needs exactly one subfeature');
          }
          break;
      }

      const missingRequiredFeatures = feature.relationships
        .getRelationships('requires')
        .filter((id: string) => !instance.usedFeatures.includes(id));
      if (missingRequiredFeatures.length > 0) {
        errorFeatureIds.add(feature.id);
        missingRequiredFeatures.forEach((id: string) =>
          errors.push(
            feature.name +
              ' requires the feature ' +
              featureModel.getFeature(id).name
          )
        );
      }

      const disallowedFeatures = feature.relationships
        .getRelationships('excludes')
        .filter((id: string) => instance.usedFeatures.includes(id));
      if (disallowedFeatures.length > 0) {
        errorFeatureIds.add(feature.id);
        disallowedFeatures.forEach((id: string) =>
          errors.push(
            feature.name +
              ' excludes the feature ' +
              featureModel.getFeature(id).name
          )
        );
      }

      const supportedFeatures = feature.relationships
        .getRelationships('supports')
        .filter((id: string) => instance.usedFeatures.includes(id));
      if (supportedFeatures.length > 0) {
        strengthFeatureIds.add(feature.id);
        supportedFeatures.forEach((id: string) =>
          strengths.push(
            feature.name +
              ' supports the feature ' +
              featureModel.getFeature(id).name
          )
        );
      }

      const hurtedFeatures = feature.relationships
        .getRelationships('hurts')
        .filter((id: string) => instance.usedFeatures.includes(id));
      if (hurtedFeatures.length > 0) {
        warningFeatureIds.add(feature.id);
        hurtedFeatures.forEach((id: string) =>
          warnings.push(
            feature.name +
              ' hurts the feature ' +
              featureModel.getFeature(id).name
          )
        );
      }

      return false;
    };
    featureModel.iterateFeatures(checkFeature, filter);

    return {
      errorFeatureIds: Array.from(errorFeatureIds),
      errors,
      warningFeatureIds: Array.from(warningFeatureIds),
      warnings,
      strengthFeatureIds: Array.from(strengthFeatureIds),
      strengths,
    };
  }

  /**
   * Gets hints for the instance
   *
   * @param featureModel the feature model
   * @param instance the instance
   */
  private getHints(
    featureModel: FeatureModel,
    instance: Instance
  ): { hintFeatureIds: string[]; hints: string[] } {
    const hintFeatureIds = new Set<string>();
    const hints: string[] = [];

    const checkHint = (feature: Feature): boolean => {
      if (
        !instance.usedFeatures.includes(feature.id) &&
        this.isFeatureEasyAddable(featureModel, instance, feature)
      ) {
        feature.relationships.getRelationships('supports').forEach((id) => {
          if (instance.usedFeatures.includes(id)) {
            hints.push(
              'Including ' +
                feature.name +
                ' would support ' +
                featureModel.getFeature(id).name
            );
            hintFeatureIds.add(feature.id);
            for (let f = feature.parent; f !== null; f = f.parent) {
              if (instance.usedFeatures.includes(f.id)) {
                break;
              }
              hintFeatureIds.add(f.id);
            }
          }
        });
      }

      return false;
    };
    featureModel.iterateFeatures(checkHint);

    return {
      hintFeatureIds: Array.from(hintFeatureIds),
      hints,
    };
  }

  /**
   * Get all pattern hints for the instance
   *
   * @param featureModel the feature model
   * @param instance the instance
   * @param patterns the patterns in the format of this feature model
   */
  getPatternHints(
    featureModel: FeatureModel,
    instance: Instance,
    patterns: Instance[]
  ): {
    patternHintFeatureIds: string[];
    patternHints: PatternHint[];
    usedPatterns: Instance[];
  } {
    const patternHintFeatureIds = new Set<string>();
    const patternHints: PatternHint[] = [];
    const usedPatterns: Instance[] = [];

    patterns.forEach((pattern) => {
      let leafFeatures = 0;
      let usedLeafFeatures = 0;
      featureModel.iterateFeatures(
        (feature) => {
          if (feature.parent === null) {
            // do not count main features
            return false;
          }
          if (
            Object.keys(feature.subfeatures).every(
              (id) => !pattern.usedFeatures.includes(id)
            )
          ) {
            leafFeatures += 1;
            if (instance.usedFeatures.includes(feature.id)) {
              usedLeafFeatures += 1;
            }
          }
          return false;
        },
        (feature) => pattern.usedFeatures.includes(feature.id)
      );
      if (usedLeafFeatures / leafFeatures >= 0.5) {
        let hasMissingFeatures = false;
        let isPossible = true;
        const hint: PatternHint = {
          pattern: pattern,
          missingFeatures: [],
        };
        const features = new Set<Feature>();
        featureModel.iterateFeatures(
          (feature) => {
            if (!instance.usedFeatures.includes(feature.id)) {
              if (!this.isFeatureEasyAddable(featureModel, instance, feature)) {
                isPossible = false;
                return true;
              } else {
                features.add(feature);
                hasMissingFeatures = true;
              }
            }
            return false;
          },
          (feature) => pattern.usedFeatures.includes(feature.id)
        );
        if (isPossible) {
          if (hasMissingFeatures) {
            hint.missingFeatures.push(...Array.from(features));
            patternHints.push(hint);
            features.forEach((feature) =>
              patternHintFeatureIds.add(feature.id)
            );
          } else {
            usedPatterns.push(pattern);
          }
        }
      }
    });

    return {
      patternHintFeatureIds: Array.from(patternHintFeatureIds),
      patternHints,
      usedPatterns,
    };
  }

  /**
   * Checks whether the feature can be easily added to the instance. Easily means that all requirements are satisfied and
   * the feature is not excluded by any other feature nor it is excluded by the tree relationship XOR and every parent
   * of this feature is already added to the instance or it would be possible to add it easily too.
   *
   * @param featureModel the feature model
   * @param instance the instance to add the feature to
   * @param feature the feature to add to the instance
   * @return whether it would be easily possible to add the feature
   */
  private isFeatureEasyAddable(
    featureModel: FeatureModel,
    instance: Instance,
    feature: Feature
  ): boolean {
    return (
      instance.usedFeatures.includes(feature.id) ||
      (feature.relationships
        .getRelationships('excludes')
        .every((id) => !instance.usedFeatures.includes(id)) &&
        instance.usedFeatures.every(
          (id) =>
            !featureModel
              .getFeature(id)
              .relationships.getRelationships('excludes')
              .includes(feature.id)
        ) &&
        (feature.parent === null ||
          feature.parent.subfeatureConnections !==
            SubfeatureConnectionsType.XOR ||
          Object.keys(feature.parent.subfeatures).every(
            (id) => !instance.usedFeatures.includes(id)
          )) &&
        feature.relationships
          .getRelationships('requires')
          .every((id) => instance.usedFeatures.includes(id)) &&
        (feature.parent === null ||
          this.isFeatureEasyAddable(featureModel, instance, feature.parent)))
    );
  }
}
