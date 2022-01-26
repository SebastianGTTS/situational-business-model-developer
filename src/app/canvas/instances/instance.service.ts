import { Injectable } from '@angular/core';
import { FeatureModel } from '../../canvas-meta-model/feature-model';
import { Instance } from '../../canvas-meta-model/instance';
import { Feature } from '../../canvas-meta-model/feature';
import { CompanyModel } from '../../canvas-meta-model/company-model';

@Injectable({
  providedIn: 'root',
})
export class InstanceService {
  /**
   * Generates a name for an adaption of an instance from the current name
   *
   * @param currentName the current name
   * @return the adapted name
   */
  getAdaptionName(currentName: string): string {
    const nameSplit = currentName.split(' - Adaptation#');
    let adaptationName;
    if (
      nameSplit.length > 1 &&
      !isNaN(parseInt(nameSplit[nameSplit.length - 1], 10))
    ) {
      adaptationName =
        nameSplit[0] +
        ' - Adaptation#' +
        (parseInt(nameSplit[nameSplit.length - 1], 10) + 1);
    } else {
      adaptationName = nameSplit[0] + ' - Adaptation#1';
    }
    return adaptationName;
  }

  /**
   * Compare two instances and get a feature map with comparison percentages per feature
   *
   * @param featureModel the feature model of the instances
   * @param instanceA the id of the first instance
   * @param instanceB the id of the second instance
   * @return a mapping with feature id to percentage
   */
  compareInstances(
    featureModel: FeatureModel,
    instanceA: Instance,
    instanceB: Instance
  ): { [id: string]: number } {
    const features: Feature[] = [];
    featureModel.iterateFeatures((feature) => {
      features.unshift(feature);
      return false;
    });
    const map: { [id: string]: number } = {};
    const outMap: { [id: string]: number } = {};
    for (const feature of features) {
      const inA = instanceA.usedFeatures.includes(feature.id);
      const inB = instanceB.usedFeatures.includes(feature.id);
      if (inA === inB) {
        if (inA) {
          const subfeatures = Object.keys(feature.subfeatures).filter(
            (id) => id in map
          );
          if (subfeatures.length > 0) {
            const count = subfeatures
              .map((id) => outMap[id])
              .reduce((agg, f) => agg + f, 0);
            map[feature.id] = count / subfeatures.length;
            outMap[feature.id] = (count + 100) / (subfeatures.length + 1);
          } else {
            map[feature.id] = 100;
            outMap[feature.id] = 100;
          }
        }
      } else {
        map[feature.id] = 0;
        outMap[feature.id] = 0;
      }
    }
    return map;
  }

  /**
   * Convert an expert instance to a company model instance. Requires that all features of the expert model are merged.
   *
   * @param companyModel the company model
   * @param expertModelId the id of the expert model
   * @param expertInstance the instance of the expert model
   * @return the converted instance
   */
  convertExpertInstance(
    companyModel: CompanyModel,
    expertModelId: string,
    expertInstance: Instance
  ): Instance {
    const instance = new Instance(undefined, expertInstance);
    instance.usedFeatures = instance.usedFeatures.map(
      (expertFeatureId) =>
        companyModel.expertModelTraces[expertModelId].expertFeatureIdMap[
          expertFeatureId
        ]
    );

    // Add missing main features to instance
    companyModel.iterateFeatures((feature) => {
      if (instance.usedFeatures.includes(feature.id)) {
        let parent = feature.parent;
        while (parent !== null) {
          if (!instance.usedFeatures.includes(parent.id)) {
            instance.usedFeatures.push(parent.id);
            parent = parent.parent;
          } else {
            break;
          }
        }
      }
      return false;
    });

    return instance;
  }
}
