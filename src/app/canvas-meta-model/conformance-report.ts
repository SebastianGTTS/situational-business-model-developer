export class ConformanceReport {

  errorFeatureIds: string[] = [];
  errors: string[] = [];
  warningFeatureIds: string[] = [];
  warnings: string[] = [];
  strengthFeatureIds: string[] = [];
  strengths: string[] = [];
  hintFeatureIds: string[] = [];
  hints: string[] = [];
  patternHintFeatureIds: string[] = [];
  patternHints: string[] = [];
  usedPatterns: string[] = [];

  constructor(conformanceReport: Partial<ConformanceReport> = {}) {
    Object.assign(this, conformanceReport);
  }

}
