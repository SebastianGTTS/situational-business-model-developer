import { Component, OnDestroy, OnInit } from '@angular/core';
import { WhiteboardToolResolveService } from '../../whiteboard-tool-resolve.service';
import { ActivatedRoute } from '@angular/router';
import {
  WhiteboardTemplate,
  WhiteboardTemplateEntry,
} from '../../../whiteboard-meta-artifact/whiteboard-template';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { WhiteboardTemplateService } from '../../../whiteboard-meta-artifact/whiteboard-template.service';
import { Subscription } from 'rxjs';
import { WhiteboardInstanceService } from '../../../whiteboard-meta-artifact/whiteboard-instance.service';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { DbId } from '../../../../../database/database-entry';
import { ArtifactService } from '../../../../../development-process-registry/method-elements/artifact/artifact.service';
import { WhiteboardMetaArtifactData } from '../../../whiteboard-meta-artifact/whiteboard-meta-artifact-data';

@Component({
  selector: 'app-create-whiteboard-instance-manually',
  templateUrl: './create-whiteboard-instance-manually.component.html',
  styleUrls: ['./create-whiteboard-instance-manually.component.css'],
  providers: [ProcessApiService],
})
export class CreateWhiteboardInstanceManuallyComponent
  implements OnInit, OnDestroy
{
  whiteboardTemplates?: WhiteboardTemplateEntry[];

  whiteboardTemplate?: WhiteboardTemplate;

  form: UntypedFormGroup = this.fb.group({
    whiteboardTemplate: [null, Validators.required],
    name: ['', Validators.required],
  });

  private changeSubscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(
    private artifactService: ArtifactService,
    private fb: UntypedFormBuilder,
    private processApiService: ProcessApiService,
    private route: ActivatedRoute,
    private whiteboardInstanceService: WhiteboardInstanceService,
    private whiteboardResolveService: WhiteboardToolResolveService,
    private whiteboardTemplateService: WhiteboardTemplateService
  ) {}

  ngOnInit(): void {
    this.changeSubscription =
      this.whiteboardTemplateControl.valueChanges.subscribe((value) => {
        if (value != null) {
          this.whiteboardTemplate = new WhiteboardTemplate(value, undefined);
          if (this.nameControl.value === '') {
            this.setDefaultName();
          }
        } else {
          this.whiteboardTemplate = undefined;
        }
      });
    this.routeSubscription = this.route.paramMap.subscribe((params) =>
      this.loadArtifact(params.get('id') ?? undefined)
    );
  }

  ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }

  setDefaultName(): void {
    if (this.whiteboardTemplate != null) {
      this.nameControl.setValue(this.whiteboardTemplate.name);
    }
  }

  async submit(): Promise<void> {
    const artifactId = this.route.snapshot.paramMap.get('id');
    if (
      this.processApiService.runningProcess != null &&
      this.whiteboardTemplate != null &&
      artifactId != null
    ) {
      const instance = await this.whiteboardInstanceService.addByTemplate(
        this.nameControl.value,
        this.whiteboardTemplate
      );
      await this.whiteboardResolveService.resolveCreateWhiteboardInstanceManually(
        this.processApiService.runningProcess._id,
        instance._id,
        artifactId
      );
    }
  }

  async loadArtifact(id?: DbId): Promise<void> {
    await this.loadWhiteboardTemplates();
    if (id != null) {
      const artifact = await this.artifactService.get(id);
      const metaArtifactData = artifact.metaArtifactData as
        | WhiteboardMetaArtifactData
        | undefined;
      if (metaArtifactData?.templateId != null) {
        const whiteboardTemplate = this.whiteboardTemplates?.find(
          (template) => template._id === metaArtifactData.templateId
        );
        this.whiteboardTemplateControl.setValue(whiteboardTemplate);
        this.whiteboardTemplateControl.disable();
      } else {
        this.whiteboardTemplateControl.enable();
      }
    } else {
      this.whiteboardTemplateControl.enable();
    }
  }

  async loadWhiteboardTemplates(): Promise<void> {
    this.whiteboardTemplates = await this.whiteboardTemplateService.getList();
  }

  get whiteboardTemplateControl(): UntypedFormControl {
    return this.form.get('whiteboardTemplate') as UntypedFormControl;
  }

  get nameControl(): UntypedFormControl {
    return this.form.get('name') as UntypedFormControl;
  }
}
