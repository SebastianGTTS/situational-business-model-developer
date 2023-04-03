import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Feature, FeatureInit } from '../../../canvas-meta-artifact/feature';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FeatureModel } from '../../../canvas-meta-artifact/feature-model';
import { Instance } from '../../../canvas-meta-artifact/instance';
import { ConformanceReport } from '../../../canvas-meta-artifact/conformance-report';

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.css'],
})
export class InstanceComponent {
  @Input() featureModel!: FeatureModel;
  @Input() instance!: Instance;

  @Input() editable = true;

  @Input() conformanceIsChecked = false;
  @Input() conformance: ConformanceReport = new ConformanceReport();
  @Input() conformanceOptions: {
    showWarnings: boolean;
    showStrengths: boolean;
    showHints: boolean;
    showPatternHints: boolean;
  } = {
    showHints: false,
    showPatternHints: false,
    showStrengths: false,
    showWarnings: false,
  };

  @Input() patternInstance?: Instance;

  @Input() compareInstance?: Instance;
  @Input() percentages?: { [id: string]: number };

  @Output() addFeature = new EventEmitter<{
    parentId: string;
    feature: FeatureInit;
  }>();
  @Output() addDecision = new EventEmitter<string>();
  @Output() removeDecision = new EventEmitter<string>();

  private modalReference?: NgbModalRef;
  modalFeature?: Feature;

  @ViewChild('addModal', { static: true }) addModal: unknown;
  @ViewChild('deleteModal', { static: true }) deleteModal: unknown;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLDivElement>;

  constructor(private modalService: NgbModal) {}

  get isInFullscreenMode(): boolean {
    return document.fullscreenElement != null;
  }

  /**
   * Opens the add modal to add a decision.
   *
   * @param featureId id of the parent feature
   */
  openAddDecisionModal(featureId: string): void {
    this.modalFeature = this.featureModel.getFeature(featureId);
    this.modalReference = this.modalService.open(this.addModal, {
      size: 'lg',
      container: this.isInFullscreenMode ? this.canvas.nativeElement : 'body',
    });
  }

  /**
   * Opens the delete modal to delete a decision.
   *
   * @param featureId id of the feature to delete
   */
  openDeleteDecisionModal(featureId: string): void {
    this.modalFeature = this.featureModel.getFeature(featureId);
    this.modalReference = this.modalService.open(this.deleteModal, {
      size: 'lg',
      container: this.isInFullscreenMode ? this.canvas.nativeElement : 'body',
    });
  }

  closeModal(): void {
    this.modalReference?.close();
    this.modalFeature = undefined;
    this.modalReference = undefined;
  }
}
