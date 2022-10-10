import { Instance } from './instance';
import { Feature } from './feature';

export interface PatternHint {
  pattern: Instance;
  missingFeatures: Feature[];
}

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
  patternHints: PatternHint[] = [];
  usedPatterns: Instance[] = [];

  constructor(conformanceReport: Partial<ConformanceReport> = {}) {
    Object.assign(this, conformanceReport);
  }
}
