import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Feature } from '../../../canvas-meta-model/feature';

@Component({
  selector: 'app-feature-tree',
  templateUrl: './feature-tree.component.html',
  styleUrls: ['./feature-tree.component.css'],
})
/**
 * Internal class to display single features of the feature tree.
 *
 * @author Sebastian Gottschalk
 */
export class FeatureTreeComponent {
  @Input() features?: { [id: string]: Feature };
  @Input() problemFeatureIds?: string[]; // problem feature ids of instantiation check
  @Input() supportsHurtsProblemFeatureIds?: string[];
  @Output() openDependenciesEmitter = new EventEmitter<string>();
  @Output() updateFeatureEmitter = new EventEmitter<string>();
  @Output() deleteFeatureEmitter = new EventEmitter<string>();

  /**
   * Emit Event to open dependencies of current feature.
   * @param featureId current feature
   */
  openDependencies(featureId: string): void {
    this.openDependenciesEmitter.emit(featureId);
  }

  /**
   * Forward event emitter to open dependencies of current feature.
   * @param featureId current feature
   */
  openDependenciesForwardEmitter(featureId: string): void {
    this.openDependencies(featureId);
  }

  /**
   * Emit Event to update current feature.
   * @param featureId current feature
   */
  updateFeature(featureId: string): void {
    this.updateFeatureEmitter.emit(featureId);
  }

  /**
   * Forward event emitter to update current feature.
   * @param featureId current feature
   */
  updateFeatureForwardEmitter(featureId: string): void {
    this.updateFeature(featureId);
  }

  /**
   * Emit Event to delete current feature.
   * @param featureId current feature
   */
  deleteFeature(featureId: string): void {
    this.deleteFeatureEmitter.emit(featureId);
  }

  /**
   * Forward event emitter to delete current feature.
   * @param featureId current feature
   */
  deleteFeatureForwardEmitter(featureId: string): void {
    this.deleteFeature(featureId);
  }

  getFeatures(): Feature[] {
    return Object.values(this.features ?? {});
  }

  hasExpertTraces(feature: Feature): boolean {
    return Object.keys(feature.expertModelTrace).length > 0;
  }
}
