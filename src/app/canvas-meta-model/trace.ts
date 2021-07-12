export class Trace {

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

  toPouchDb(): any {
    return {
      expertFeatureIdMap: this.expertFeatureIdMap,
    };
  }

}
