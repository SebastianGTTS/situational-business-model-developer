import { Component, OnInit } from '@angular/core';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';
import { Instance } from '../../../canvas-meta-model/instance';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { InstanceService } from '../instance.service';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConformanceReport } from '../../../canvas-meta-model/conformance-report';
import { CanvasModelConsistencyService } from '../../../canvas-meta-model/canvas-model-consistency.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {

  expertModel: ExpertModel;
  example: Instance;

  // Conformance Checking
  conformanceIsChecked: boolean;
  conformance: ConformanceReport;
  conformanceOptionsForm: FormGroup = this.fb.group({
    showWarnings: true,
    showStrengths: true,
    showHints: false,
    showPatternHints: false,
    showUsedPatterns: false,
  });

  // used patterns
  usedPatterns: string[] = null;

  // Compare / Heatmap
  selectOtherInstanceForm: FormGroup = this.fb.group({instance: [null, Validators.required]});
  compareInstance: Instance = null;
  percentages: { [id: string]: number } = null;

  // Show pattern
  selectPatternForm: FormGroup = this.fb.group({pattern: [null, Validators.required]});
  patternInstance: Instance = null;

  activeId: string;

  private routeSubscription: Subscription;

  constructor(
    private canvasModelConsistencyService: CanvasModelConsistencyService,
    private fb: FormBuilder,
    private expertModelService: ExpertModelService,
    private instanceService: InstanceService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const expertModelId = paramMap.get('id');
      const exampleId = +paramMap.get('exampleId');

      this.activeId = 'stepCreate';

      this.clearView();
      this.initConformanceOptionsForm(this.activeId);

      this.load(expertModelId, exampleId);
    });
  }

  async load(expertModelId, exampleId) {
    const expertModel = await this.expertModelService.get(expertModelId);
    this.expertModel = expertModel;
    this.example = expertModel.getInstance(exampleId);
    if (this.compareInstance) {
      this.compare();
    }
    if (this.patternInstance) {
      this.showPattern();
    }
    if (this.usedPatterns) {
      this.showUsedPatterns();
    }
    if (this.conformanceIsChecked) {
      this.checkConformance();
    } else {
      this.uncheckConformance();
    }
  }

  async updateExpertModel() {
    await this.expertModelService.save(this.expertModel);
    this.load(this.expertModel._id, this.example.id);
  }

  /**
   * Create adaptation of the business model.
   */
  async createAdaptation() {
    const adaptationName = this.instanceService.getAdaptionName(this.example.name);
    this.expertModel.adaptInstance(this.example.id, adaptationName);
    const instance = this.expertModel.instances[this.expertModel.instances.length - 1];
    await this.expertModelService.save(this.expertModel);
    this.router.navigate(['expertModels', this.expertModel._id, 'examples', instance.id]);
  }

  switchView(event: NgbNavChangeEvent) {
    this.clearView();
    this.initConformanceOptionsForm(event.nextId);
  }

  private clearView() {
    this.uncheckConformance();
    this.clearCompare();
    this.clearPattern();
    this.hideUsedPatterns();
  }

  /**
   * Uncheck the conformance.
   */
  uncheckConformance() {
    this.conformanceIsChecked = false;
    this.conformance = new ConformanceReport();
  }

  /**
   * Check the conformance.
   */
  checkConformance() {
    this.clearCompare();
    this.clearPattern();
    this.conformance = this.canvasModelConsistencyService.checkConformanceOfInstance(
      this.expertModel,
      this.example.id,
      this.expertModel.getPatterns(),
    );
    this.conformanceIsChecked = true;
  }


  /**
   * Compare this instance with another instance and generate a heatmap
   */
  compare() {
    this.uncheckConformance();
    this.clearPattern();
    const id = this.selectOtherInstanceForm.value.instance;
    this.compareInstance = this.expertModel.getInstance(id);
    this.percentages = this.instanceService.compareInstances(this.expertModel, this.example, this.compareInstance);
    this.selectOtherInstanceForm.get('instance').disable();
  }

  /**
   * Clear comparison and remove heatmap
   */
  clearCompare() {
    this.compareInstance = null;
    this.percentages = null;
    this.selectOtherInstanceForm.get('instance').enable();
  }

  /**
   * Show pattern in business model canvas
   */
  showPattern() {
    this.uncheckConformance();
    this.clearCompare();
    const id = this.selectPatternForm.value.pattern;
    this.patternInstance = this.expertModel.getInstance(id);
    this.selectPatternForm.get('pattern').disable();
  }

  /**
   * Do not show pattern in business model canvas any longer
   */
  clearPattern() {
    this.patternInstance = null;
    this.selectPatternForm.get('pattern').enable();
  }

  showUsedPatterns() {
    this.usedPatterns = this.canvasModelConsistencyService.getPatternHints(
      this.expertModel,
      this.example,
      this.expertModel.getPatterns(),
    ).usedPatterns;
  }

  hideUsedPatterns() {
    this.usedPatterns = null;
  }

  private initConformanceOptionsForm(activeId: string) {
    if (activeId === 'stepHints') {
      this.conformanceOptionsForm.setValue({
        showWarnings: true,
        showStrengths: true,
        showHints: true,
        showPatternHints: true,
        showUsedPatterns: false,
      });
    } else {
      this.conformanceOptionsForm.setValue({
        showWarnings: false,
        showStrengths: false,
        showHints: false,
        showPatternHints: false,
        showUsedPatterns: false,
      });
    }
  }

}
