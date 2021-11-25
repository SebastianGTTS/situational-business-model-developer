import { FeatureModel } from './feature-model';
import { Trace } from './trace';
import { RelationshipType } from './relationships';
import { Feature } from './feature';
import { ExpertModel } from './expert-model';

export class CompanyModel extends FeatureModel {
  static readonly typeName = 'CompanyModel';

  // stored
  expertModelTraces: { [expertModelId: string]: Trace };
  createdByMethod: boolean;

  constructor(companyModel: Partial<CompanyModel>) {
    super(companyModel, CompanyModel.typeName);
    Object.entries(this.expertModelTraces).forEach(
      ([id, trace]) => (this.expertModelTraces[id] = new Trace(trace))
    );
  }

  protected init(): void {
    super.init();
    this.expertModelTraces = {};
    this.createdByMethod = false;
  }

  protected cleanReferences(
    featureIdList: string[],
    featureList: Feature[]
  ): void {
    super.cleanReferences(featureIdList, featureList);

    // ** Traces
    for (const f of featureList) {
      for (const [expertModelId, expertModelFeatureId] of Object.entries(
        f.expertModelTrace
      )) {
        this.expertModelTraces[expertModelId].deleteTrace(expertModelFeatureId);
      }
    }
  }

  // Expert Models

  /**
   * Add expert model to this company model
   *
   * @param expertModelId the expert model id
   */
  addExpertModel(expertModelId: string): void {
    this.expertModelTraces[expertModelId] = new Trace({});
    for (const feature of Object.values(this.features)) {
      this.expertModelTraces[expertModelId].addTrace(feature.id, feature.id);
      feature.addTrace(expertModelId, feature.id);
    }
  }

  /**
   * Remove expert model from this company model
   *
   * @param expertModelId the expert model id
   */
  removeExpertModel(expertModelId: string): void {
    delete this.expertModelTraces[expertModelId];
    this.iterateFeatures((feature) => {
      feature.removeTrace(expertModelId);
      return false;
    });
  }

  /**
   * Add a trace to an expert model for a company feature. Also adds cross tree relationships if possible.
   *
   * @param expertModel the expert model to trace to
   * @param expertFeatureId the feature id of the feature in the expert model
   * @param companyFeatureId the feature id of the feature in the company model
   */
  addExpertModelTrace(
    expertModel: ExpertModel,
    expertFeatureId: string,
    companyFeatureId: string
  ): void {
    const expertFeature = expertModel.getFeature(expertFeatureId);
    const companyFeature = this.getFeature(companyFeatureId);
    companyFeature.addTrace(expertModel._id, expertFeatureId);
    this.expertModelTraces[expertModel._id].addTrace(
      expertFeatureId,
      companyFeatureId
    );

    // Add cross tree relationships
    const relationshipTypes = expertModel.definition.relationshipTypes;
    relationshipTypes.forEach((type) =>
      this.addTraceRelationship(
        expertModel._id,
        expertFeature,
        companyFeatureId,
        type
      )
    );

    const addRelationship = (eF: Feature): boolean => {
      relationshipTypes.forEach((type) => {
        if (eF.relationships.hasRelationship(type, expertFeatureId)) {
          const cFId =
            this.expertModelTraces[expertModel._id].expertFeatureIdMap[eF.id];
          if (cFId != null) {
            this.addRelationship(type, cFId, companyFeatureId);
          }
        }
      });
      return false;
    };
    expertModel.iterateFeatures(addRelationship);
  }

  /**
   * Adds traces to the feature
   *
   * @param expertModelId the expert model id
   * @param expertFeature the expert feature to lookup the relationships
   * @param companyFeatureId the id of the company feature to add the relationships to
   * @param relationshipType the relationship type to handle
   */
  private addTraceRelationship(
    expertModelId: string,
    expertFeature: Feature,
    companyFeatureId: string,
    relationshipType: RelationshipType
  ): void {
    const relationships: string[] =
      expertFeature.relationships.getRelationships(relationshipType);
    for (const relExpertFeatureId of relationships) {
      const relCompanyFeatureId =
        this.expertModelTraces[expertModelId].expertFeatureIdMap[
          relExpertFeatureId
        ];
      if (relCompanyFeatureId) {
        this.addRelationship(
          relationshipType,
          companyFeatureId,
          relCompanyFeatureId
        );
      }
    }
  }

  /**
   * Remove a trace to an expert feature
   *
   * @param companyFeatureId the id of the company feature that has a trace to the expert feature
   * @param expertModelId the id of the expert model
   */
  removeTrace(companyFeatureId: string, expertModelId: string): void {
    const feature = this.getFeature(companyFeatureId);
    if (companyFeatureId in this.features) {
      throw new Error('Can not delete trace of main features');
    }
    const features = feature.getAllSubfeatures();
    features.push(feature);
    for (const featureTraceToDelete of features) {
      this.expertModelTraces[expertModelId].deleteTrace(
        featureTraceToDelete.expertModelTrace[expertModelId]
      );
      featureTraceToDelete.removeTrace(expertModelId);
    }
  }

  /**
   * Get all ids of merged expert models
   */
  get expertModelIds(): string[] {
    return Object.keys(this.expertModelTraces);
  }

  toDb(): any {
    const expertModelTraces = {};
    Object.entries(this.expertModelTraces).forEach(
      ([id, trace]) => (expertModelTraces[id] = trace.toDb())
    );
    return {
      ...super.toDb(),
      expertModelTraces,
      createdByMethod: this.createdByMethod,
    };
  }
}
