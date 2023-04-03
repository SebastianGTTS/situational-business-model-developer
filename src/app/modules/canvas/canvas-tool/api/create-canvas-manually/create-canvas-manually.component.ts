import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  CompanyModel,
  CompanyModelEntry,
} from '../../../canvas-meta-artifact/company-model';
import { CompanyModelService } from '../../../canvas-meta-artifact/company-model.service';
import { Subscription } from 'rxjs';
import {
  InstanceInit,
  InstanceType,
} from '../../../canvas-meta-artifact/instance';
import { CanvasToolResolveService } from '../../canvas-tool-resolve.service';
import { ActivatedRoute } from '@angular/router';
import { Artifact } from '../../../../../development-process-registry/method-elements/artifact/artifact';
import { DbId } from '../../../../../database/database-entry';
import { ArtifactService } from '../../../../../development-process-registry/method-elements/artifact/artifact.service';
import { CanvasMetaArtifactData } from '../../../canvas-meta-artifact/canvas-meta-artifact-data';

@Component({
  selector: 'app-create-canvas-manually',
  templateUrl: './create-canvas-manually.component.html',
  styleUrls: ['./create-canvas-manually.component.css'],
  providers: [ProcessApiService],
})
export class CreateCanvasManuallyComponent implements OnInit, OnDestroy {
  artifact?: Artifact;

  companyModels?: CompanyModelEntry[];

  companyModel?: CompanyModel;

  form: UntypedFormGroup = this.fb.group({
    companyModel: [null, Validators.required],
    name: ['', Validators.required],
    description: [''],
  });

  private changeSubscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(
    private artifactService: ArtifactService,
    private canvasResolveService: CanvasToolResolveService,
    private companyModelService: CompanyModelService,
    private fb: UntypedFormBuilder,
    private processApiService: ProcessApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.changeSubscription = this.companyModelControl.valueChanges.subscribe(
      (value) => {
        if (value != null) {
          this.companyModel = new CompanyModel(value, undefined);
        } else {
          this.companyModel = undefined;
        }
      }
    );
    this.routeSubscription = this.route.paramMap.subscribe((params) =>
      this.loadArtifact(params.get('id') ?? undefined)
    );
  }

  ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }

  async submit(): Promise<void> {
    const artifactId = this.route.snapshot.paramMap.get('id');
    if (
      this.processApiService.runningProcess != null &&
      this.companyModel != null &&
      artifactId != null
    ) {
      const companyModel = this.companyModel;
      const instance: Omit<InstanceInit, 'id'> = {
        type: InstanceType.EXAMPLE,
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
      };
      companyModel.resetDatabaseState();
      const instanceId = companyModel.addInstance(instance).id;
      companyModel.createdByMethod = true;
      await this.companyModelService.save(companyModel);
      await this.canvasResolveService.resolveCreateCanvasManually(
        this.processApiService.runningProcess._id,
        companyModel._id,
        instanceId,
        artifactId
      );
    }
  }

  async loadCompanyModels(definitionId?: DbId): Promise<void> {
    this.companyModels = await this.companyModelService.getList(definitionId);
  }

  async loadArtifact(id?: DbId): Promise<void> {
    if (id != null) {
      this.artifact = await this.artifactService.get(id);
      const metaArtifactData = this.artifact.metaArtifactData as
        | CanvasMetaArtifactData
        | undefined;
      await this.loadCompanyModels(metaArtifactData?.definitionId);
    } else {
      this.artifact = undefined;
    }
  }

  get companyModelControl(): UntypedFormControl {
    return this.form.get('companyModel') as UntypedFormControl;
  }
}
