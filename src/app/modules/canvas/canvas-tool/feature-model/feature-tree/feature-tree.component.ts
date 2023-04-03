import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Feature } from '../../../canvas-meta-artifact/feature';
import { FeatureTree } from './feature-tree';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

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
export class FeatureTreeComponent
  implements OnChanges, AfterViewInit, OnDestroy, FeatureTree
{
  @Input() showUpdate = true;
  @Input() showDelete = true;
  @Input() extraButtons?: TemplateRef<unknown>;
  @Input() extra?: TemplateRef<unknown>;
  @Input() expanded = false;
  @Input() features?: { [id: string]: Feature };
  @Input() problemFeatureIds?: string[]; // problem feature ids of instantiation check
  @Input() supportsHurtsProblemFeatureIds?: string[];
  @Output() openDependenciesEmitter = new EventEmitter<string>();
  @Output() updateFeatureEmitter = new EventEmitter<string>();
  @Output() deleteFeatureEmitter = new EventEmitter<string>();

  internalExpanded = false;
  private changeSubscription?: Subscription;

  @ViewChildren(FeatureTreeComponent) featureTrees?: QueryList<FeatureTree>;
  @ViewChild(NgbAccordion) accordion?: NgbAccordion;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.expanded && changes.expanded.currentValue) {
      this.expandAll();
    }
  }

  ngAfterViewInit(): void {
    this.changeSubscription = this.accordion?.panelChange.subscribe(
      (change) => {
        if (!change.nextState) {
          this.internalExpanded = false;
        }
      }
    );
    if (this.expanded) {
      this.expandAll();
    }
  }

  ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
  }

  expandAll(): void {
    this.internalExpanded = true;
    this.featureTrees?.forEach((tree) => tree.expandAll());
    this.accordion?.expandAll();
  }

  collapseAll(): void {
    this.internalExpanded = false;
    this.accordion?.collapseAll();
  }

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

  trackBy(index: number, item: Feature): string {
    return item.id;
  }
}
