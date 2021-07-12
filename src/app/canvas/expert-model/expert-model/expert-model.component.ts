import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportExportService } from '../../feature-model/import-export.service';
import { Instance, InstanceType } from '../../../canvas-meta-model/instance';
import { FormGroup } from '@angular/forms';
import { Domain } from '../../../development-process-registry/knowledge/domain';

@Component({
  selector: 'app-expert-model',
  templateUrl: './expert-model.component.html',
  styleUrls: ['./expert-model.component.css']
})
export class ExpertModelComponent implements OnInit, OnDestroy {

  expertModel: ExpertModel;

  private routeSubscription: Subscription;

  constructor(
    private expertModelService: ExpertModelService,
    private importExportService: ImportExportService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.loadExpertModel(paramMap.get('id'));
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  exportModel() {
    this.importExportService.exportExpertModel(this.expertModel._id);
  }

  update(description: any) {
    this.expertModel.update(description);
    this.updateExpertModel();
  }

  async updateDomains(domains: Domain[]) {
    this.expertModel.updateDomains(domains);
    await this.updateExpertModel();
  }

  updateFeatureModelAuthor(authorInfo: any) {
    this.expertModel.updateAuthor(authorInfo);
    this.updateExpertModel();
  }

  /**
   * Add a new instance.
   */
  addInstance(instanceForm: FormGroup, type = InstanceType.EXAMPLE) {
    this.expertModel.addInstance({name: instanceForm.value.name, type});
    this.updateExpertModel();
  }

  /**
   * Navigate to a single business model.
   *
   * @param businessModelId id of the business model
   */
  viewExample(businessModelId: number): void {
    this.router.navigate(['expertModels', this.expertModel._id, 'examples', businessModelId]);
  }

  /**
   * Navigate to a component to view the pattern
   *
   * @param patternId the id of the pattern
   */
  viewPattern(patternId: number) {
    this.router.navigate(['expertModels', this.expertModel._id, 'patterns', patternId]);
  }

  /**
   * Delete an instance by id.
   *
   * @param instanceId id of the instance
   */
  deleteInstance(instanceId: number): void {
    this.expertModel.removeInstance(instanceId);
    this.updateExpertModel();
  }

  async updateExpertModel() {
    await this.expertModelService.save(this.expertModel);
    this.loadExpertModel(this.expertModel._id);
  }

  async loadExpertModel(expertModelId: string) {
    this.expertModel = await this.expertModelService.get(expertModelId);
  }

  getExampleInstances(): Instance[] {
    return this.expertModel.instances.filter((instance) => instance.type === InstanceType.EXAMPLE);
  }

  getPatternInstances(): Instance[] {
    return this.expertModel.instances.filter((instance) => instance.type === InstanceType.PATTERN);
  }

  getPatternInstanceType() {
    return InstanceType.PATTERN;
  }

}
