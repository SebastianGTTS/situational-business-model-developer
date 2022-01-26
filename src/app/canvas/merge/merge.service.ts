import { Injectable } from '@angular/core';
import { ExpertModelService } from '../../canvas-meta-model/expert-model.service';
import { CompanyModelService } from '../../canvas-meta-model/company-model.service';
import { Feature, FeatureInit } from '../../canvas-meta-model/feature';
import { RelationshipType } from '../../canvas-meta-model/relationships';
import { ExpertModelEntry } from '../../canvas-meta-model/expert-model';
import {
  CanvasDefinition,
  CanvasDefinitionEntry,
} from '../../canvas-meta-model/canvas-definition';

@Injectable({
  providedIn: 'root',
})
export class MergeService {
  constructor(
    private companyModelService: CompanyModelService,
    private expertModelService: ExpertModelService
  ) {}

  async selectExpertModel(
    companyModelId: string,
    expertModelId: string
  ): Promise<void> {
    const companyModel = await this.companyModelService.get(companyModelId);
    companyModel.addExpertModel(expertModelId);
    await this.companyModelService.save(companyModel);
  }

  async unselectExpertModel(
    companyModelId: string,
    expertModelId: string
  ): Promise<void> {
    const companyModel = await this.companyModelService.get(companyModelId);
    companyModel.removeExpertModel(expertModelId);
    await this.companyModelService.save(companyModel);
  }

  async getSelectedExpertModels(
    companyModelId: string
  ): Promise<ExpertModelEntry[]> {
    const companyModel = await this.companyModelService.get(companyModelId);
    return this.expertModelService.getList({
      _id: { $in: Object.keys(companyModel.expertModelTraces) },
    });
  }

  async getUnselectedExpertModels(
    companyModelId: string
  ): Promise<ExpertModelEntry[]> {
    const companyModel = await this.companyModelService.get(companyModelId);
    const getRootFeatureIds = (
      canvasDefinition: CanvasDefinition | CanvasDefinitionEntry
    ): string[] => {
      const rootFeatureIds: string[] = [];
      canvasDefinition.rows.forEach((row) =>
        row
          .filter((cell) => !cell.isSpacer)
          .forEach((cell) => {
            rootFeatureIds.push(cell.id);
          })
      );
      return rootFeatureIds;
    };
    const definitionIds = getRootFeatureIds(companyModel.definition);
    return (
      await this.expertModelService.getList({
        $not: {
          _id: { $in: Object.keys(companyModel.expertModelTraces) },
        },
      })
    ).filter((expertModel: ExpertModelEntry) => {
      const ids = getRootFeatureIds(expertModel.$definition);
      return (
        ids.length === definitionIds.length &&
        ids.every((id) => definitionIds.includes(id))
      );
    });
  }

  async addFeatureMerge(
    featureModelId: string,
    feature: FeatureInit,
    subfeatureOf: string,
    expertModelId: string,
    expertModelFeatureId: string
  ): Promise<void> {
    const expertModel = await this.expertModelService.get(expertModelId);
    const companyModel = await this.companyModelService.get(featureModelId);
    const newFeature = companyModel.addFeature(feature, subfeatureOf);
    companyModel.addExpertModelTrace(
      expertModel,
      expertModelFeatureId,
      newFeature.id
    );
    await this.companyModelService.save(companyModel);
  }

  async addAllSubfeaturesMerge(
    featureModelId: string,
    expertModelId: string,
    expertModelFeatureId: string
  ): Promise<void> {
    const expertModel = await this.expertModelService.get(expertModelId);
    const companyModel = await this.companyModelService.get(featureModelId);
    let subfeatures: Feature[];
    if (expertModelFeatureId) {
      const expertFeature = expertModel.getFeature(expertModelFeatureId);
      subfeatures = expertFeature.getAllSubfeatures();
    } else {
      subfeatures = Object.values(expertModel.getFeatureMap());
    }
    subfeatures
      .filter(
        (feature) =>
          !companyModel.expertModelTraces[expertModelId].expertFeatureIdMap[
            feature.id
          ]
      )
      .forEach((feature) => {
        const newFeature = companyModel.addFeature(
          {
            name: feature.name,
            description: feature.description,
            type: feature.type,
            subfeatureConnections: feature.subfeatureConnections,
          },
          companyModel.expertModelTraces[expertModelId].expertFeatureIdMap[
            feature.parent.id
          ]
        );
        companyModel.addExpertModelTrace(
          expertModel,
          feature.id,
          newFeature.id
        );
      });
    await this.companyModelService.save(companyModel);
  }

  async addTrace(
    featureModelId: string,
    featureId: string,
    expertModelId: string,
    expertModelFeatureId: string
  ): Promise<void> {
    const expertModel = await this.expertModelService.get(expertModelId);
    const companyModel = await this.companyModelService.get(featureModelId);
    companyModel.addExpertModelTrace(
      expertModel,
      expertModelFeatureId,
      featureId
    );
    await this.companyModelService.save(companyModel);
  }

  async deleteTrace(
    featureModelId: string,
    featureId: string,
    expertModelId: string
  ): Promise<void> {
    const companyModel = await this.companyModelService.get(featureModelId);
    companyModel.removeTrace(featureId, expertModelId);
    await this.companyModelService.save(companyModel);
  }

  async updateFeature(
    featureModelId: string,
    featureId: string,
    feature: Partial<Feature>,
    subfeatureOf: string
  ): Promise<void> {
    const companyModel = await this.companyModelService.get(featureModelId);
    companyModel.updateFeature(featureId, subfeatureOf, feature);
    await this.companyModelService.save(companyModel);
  }

  async deleteFeature(
    featureModelId: string,
    featureId: string
  ): Promise<void> {
    const companyModel = await this.companyModelService.get(featureModelId);
    companyModel.removeFeature(featureId);
    await this.companyModelService.save(companyModel);
  }

  async addRelationship(
    featureModelId: string,
    relationshipType: RelationshipType,
    fromFeatureId: string,
    toFeatureId: string
  ): Promise<void> {
    const companyModel = await this.companyModelService.get(featureModelId);
    companyModel.addRelationship(relationshipType, fromFeatureId, toFeatureId);
    await this.companyModelService.save(companyModel);
  }

  async removeRelationship(
    featureModelId: string,
    relationshipType: RelationshipType,
    fromFeatureId: string,
    toFeatureId: string
  ): Promise<void> {
    const companyModel = await this.companyModelService.get(featureModelId);
    companyModel.removeRelationship(
      relationshipType,
      fromFeatureId,
      toFeatureId
    );
    await this.companyModelService.save(companyModel);
  }
}
