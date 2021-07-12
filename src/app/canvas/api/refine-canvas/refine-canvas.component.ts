import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessApiService } from '../process-api.service';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { Instance } from '../../../canvas-meta-model/instance';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CanvasResolveService } from '../../canvas-resolve.service';
import { ConformanceReport } from '../../../canvas-meta-model/conformance-report';
import { CanvasModelConsistencyService } from '../../../canvas-meta-model/canvas-model-consistency.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';

@Component({
  selector: 'app-refine-canvas',
  templateUrl: './refine-canvas.component.html',
  styleUrls: ['./refine-canvas.component.css']
})
export class RefineCanvasComponent implements OnInit, OnDestroy {

  companyModel: CompanyModel;
  instance: Instance;
  expertModels: ExpertModel[];

  conformanceIsChecked: boolean;
  conformance: ConformanceReport = new ConformanceReport();
  conformanceOptionsForm: FormGroup = this.fb.group({
    showWarnings: true,
    showStrengths: true,
    showHints: true,
    showPatternHints: true,
    showUsedPatterns: false,
  });

  patternInstance: Instance = null;

  private routeSubscription: Subscription;

  constructor(
    private canvasModelConsistencyService: CanvasModelConsistencyService,
    private canvasResolveService: CanvasResolveService,
    private companyModelService: CompanyModelService,
    private expertModelService: ExpertModelService,
    private fb: FormBuilder,
    public processApiService: ProcessApiService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.loadInstance(paramMap.get('companyModelId'), +paramMap.get('instanceId')).then();
    });
    this.processApiService.init(this.route);
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.processApiService.destroy();
  }

  finish() {
    this.canvasResolveService.resolveEditCanvas(this.processApiService.stepInfo, this.companyModel._id, this.instance.id);
  }

  uncheckConformance() {
    this.conformanceIsChecked = false;
    this.conformance = new ConformanceReport();
  }

  checkConformance() {
    this.clearPattern();
    this.conformance = this.canvasModelConsistencyService.checkConformanceOfInstance(
      this.companyModel,
      this.instance.id,
      this.expertModels.map((expertModel) => expertModel.getPatterns()).reduce(
        (prev, curr) => {
          prev.push(...curr);
          return prev;
        },
        []
      ),
    );
    this.conformanceIsChecked = true;
  }

  showPattern(patternInstance: Instance) {
    this.uncheckConformance();
    this.patternInstance = patternInstance;
  }

  clearPattern() {
    this.patternInstance = null;
  }

  async loadInstance(companyModelId: string, instanceId: number) {
    this.companyModel = await this.companyModelService.get(companyModelId);
    this.instance = this.companyModel.getInstance(instanceId);
    if (this.conformanceIsChecked) {
      this.checkConformance();
    } else {
      this.uncheckConformance();
    }
    await this.loadExpertModels();
  }

  async loadExpertModels() {
    const expertModels: ExpertModel[] = [];
    for (const expertModelId of this.companyModel.expertModelIds) {
      const expertModel = await this.expertModelService.get(expertModelId);
      const featureIds = expertModel.getFeatureList().map((feature) => feature.id);
      if (featureIds.every((id) => id in this.companyModel.expertModelTraces[expertModel._id].expertFeatureIdMap) &&
        expertModel.getPatterns().length > 0) {
        expertModels.push(expertModel);
      }
    }
    this.expertModels = expertModels;
  }

  async updateCompanyModel() {
    await this.companyModelService.save(this.companyModel);
    await this.loadInstance(this.companyModel._id, this.instance.id);
  }

}
