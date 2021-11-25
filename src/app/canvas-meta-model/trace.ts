import { DatabaseModelPart } from '../database/database-model-part';

export class Trace implements DatabaseModelPart {
  // stored
  expertFeatureIdMap: { [expertModelFeatureId: string]: string } = {};

  constructor(trace: Partial<Trace>) {
    Object.assign(this, trace);
  }

  addTrace(expertFeatureId: string, companyFeatureId: string) {
    this.expertFeatureIdMap[expertFeatureId] = companyFeatureId;
  }

  deleteTrace(expertFeatureId: string) {
    delete this.expertFeatureIdMap[expertFeatureId];
  }

  toDb(): any {
    return {
      expertFeatureIdMap: this.expertFeatureIdMap,
    };
  }
}
