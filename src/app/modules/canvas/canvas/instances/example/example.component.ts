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
import { DbId } from '../../../../../database/database-entry';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css'],
})
export class ExampleComponent implements OnInit {
  expertModel?: ExpertModel;
  example?: Instance;

  // Conformance Checking
  conformanceIsChecked = false;
  conformance: ConformanceReport = new ConformanceReport();
  conformanceOptionsForm: FormGroup = this.fb.group({
    showWarnings: true,
    showStrengths: true,
    showHints: false,
    showPatternHints: false,
    showUsedPatterns: false,
  });

  // used patterns
  usedPatterns?: Instance[];

  // Compare / Heatmap
  selectOtherInstanceForm: FormGroup = this.fb.group({
    instance: [null, Validators.required],
  });
  compareInstance?: Instance;
  percentages?: { [id: string]: number };

  // Show pattern
  selectPatternForm: FormGroup = this.fb.group({
    pattern: [null, Validators.required],
  });
  patternInstance?: Instance;

  activeId = 'stepCreate';

  private routeSubscription?: Subscription;

  constructor(
    private canvasModelConsistencyService: CanvasModelConsistencyService,
    private fb: FormBuilder,
    private expertModelService: ExpertModelService,
    private instanceService: InstanceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const expertModelId = paramMap.get('id');
      const exampleIdStr = paramMap.get('exampleId');
      const exampleId = exampleIdStr ? +exampleIdStr : undefined;

      this.activeId = 'stepCreate';

      this.clearView();
      this.initConformanceOptionsForm(this.activeId);

      if (expertModelId != null && exampleId != null) {
        void this.load(expertModelId, exampleId);
      }
    });
  }

  async load(expertModelId: DbId, exampleId: number): Promise<void> {
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

  async updateExpertModel(): Promise<void> {
    if (this.expertModel != null && this.example != null) {
      await this.expertModelService.save(this.expertModel);
      await this.load(this.expertModel._id, this.example.id);
    }
  }

  /**
   * Create adaptation of the business model.
   */
  async createAdaptation(): Promise<void> {
    if (this.expertModel != null && this.example != null) {
      const adaptationName = this.instanceService.getAdaptionName(
        this.example.name
      );
      this.expertModel.adaptInstance(this.example.id, adaptationName);
      const instance =
        this.expertModel.instances[this.expertModel.instances.length - 1];
      await this.expertModelService.save(this.expertModel);
      await this.router.navigate([
        'expertModels',
        this.expertModel._id,
        'examples',
        instance.id,
      ]);
    }
  }

  switchView(event: NgbNavChangeEvent): void {
    this.clearView();
    this.initConformanceOptionsForm(event.nextId);
  }

  private clearView(): void {
    this.uncheckConformance();
    this.clearCompare();
    this.clearPattern();
    this.hideUsedPatterns();
  }

  /**
   * Uncheck the conformance.
   */
  uncheckConformance(): void {
    this.conformanceIsChecked = false;
    this.conformance = new ConformanceReport();
  }

  /**
   * Check the conformance.
   */
  checkConformance(): void {
    if (this.expertModel != null && this.example != null) {
      this.clearCompare();
      this.clearPattern();
      this.conformance =
        this.canvasModelConsistencyService.checkConformanceOfInstance(
          this.expertModel,
          this.example.id,
          this.expertModel.getPatterns()
        );
      this.conformanceIsChecked = true;
    }
  }

  /**
   * Compare this instance with another instance and generate a heatmap
   */
  compare(): void {
    if (this.expertModel != null && this.example != null) {
      this.uncheckConformance();
      this.clearPattern();
      const id = this.selectOtherInstanceForm.value.instance;
      this.compareInstance = this.expertModel.getInstance(id);
      if (this.compareInstance == null) {
        throw new Error('Compare instance does not exist');
      }
      this.percentages = this.instanceService.compareInstances(
        this.expertModel,
        this.example,
        this.compareInstance
      );
      this.selectOtherInstanceForm.get('instance')?.disable();
    }
  }

  /**
   * Clear comparison and remove heatmap
   */
  clearCompare(): void {
    this.compareInstance = undefined;
    this.percentages = undefined;
    this.selectOtherInstanceForm.get('instance')?.enable();
  }

  /**
   * Show pattern in business model canvas
   */
  showPattern(): void {
    this.uncheckConformance();
    this.clearCompare();
    this.patternInstance = this.selectPatternForm.value.pattern;
    this.selectPatternForm.get('pattern')?.disable();
  }

  /**
   * Do not show pattern in business model canvas any longer
   */
  clearPattern(): void {
    this.patternInstance = undefined;
    this.selectPatternForm.get('pattern')?.enable();
  }

  showUsedPatterns(): void {
    if (this.expertModel != null && this.example != null) {
      this.usedPatterns = this.canvasModelConsistencyService.getPatternHints(
        this.expertModel,
        this.example,
        this.expertModel.getPatterns()
      ).usedPatterns;
    }
  }

  hideUsedPatterns(): void {
    this.usedPatterns = undefined;
  }

  get selectedPattern(): Instance | undefined {
    return this.selectPatternForm.value.pattern;
  }

  private initConformanceOptionsForm(activeId: string): void {
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
