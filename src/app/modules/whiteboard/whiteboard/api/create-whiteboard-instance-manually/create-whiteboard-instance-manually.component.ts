import { Component, OnDestroy, OnInit } from '@angular/core';
import { WhiteboardResolveService } from '../../whiteboard-resolve.service';
import { ActivatedRoute } from '@angular/router';
import {
  WhiteboardTemplate,
  WhiteboardTemplateEntry,
} from '../../../whiteboard-meta-model/whiteboard-template';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { WhiteboardTemplateService } from '../../../whiteboard-meta-model/whiteboard-template.service';
import { Subscription } from 'rxjs';
import { WhiteboardInstanceService } from '../../../whiteboard-meta-model/whiteboard-instance.service';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';

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

  form: FormGroup = this.fb.group({
    whiteboardTemplate: [null, Validators.required],
    name: ['', Validators.required],
  });

  private changeSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private processApiService: ProcessApiService,
    private route: ActivatedRoute,
    private whiteboardInstanceService: WhiteboardInstanceService,
    private whiteboardResolveService: WhiteboardResolveService,
    private whiteboardTemplateService: WhiteboardTemplateService
  ) {}

  ngOnInit(): void {
    void this.loadWhiteboardTemplates();
    this.changeSubscription =
      this.whiteboardTemplateControl.valueChanges.subscribe((value) => {
        if (value != null) {
          this.whiteboardTemplate = new WhiteboardTemplate(value, undefined);
        } else {
          this.whiteboardTemplate = undefined;
        }
      });
  }

  ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
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

  async loadWhiteboardTemplates(): Promise<void> {
    this.whiteboardTemplates = await this.whiteboardTemplateService.getList();
  }

  get whiteboardTemplateControl(): FormControl {
    return this.form.get('whiteboardTemplate') as FormControl;
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }
}
