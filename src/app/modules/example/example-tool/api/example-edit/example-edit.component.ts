import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessApiMixin } from '../../../../../development-process-view/shared/process-api.mixin';
import { RunningProcessMethodCommentsMixin } from '../../../../../development-process-view/shared/running-process-method-comments.mixin';
import { EmptyClass } from '../../../../../shared/utils';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';
import { Example } from '../../../example-meta-artifact/example';
import { ExampleLoaderService } from '../../shared/example-loader.service';
import { ExampleToolResolveService } from '../../example-tool-resolve.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { ExampleService } from '../../../example-meta-artifact/example.service';

@Component({
  selector: 'app-example-edit',
  templateUrl: './example-edit.component.html',
  styleUrls: ['./example-edit.component.css'],
  providers: [ExampleLoaderService, ProcessApiService],
})
export class ExampleEditComponent
  extends ProcessApiMixin(RunningProcessMethodCommentsMixin(EmptyClass))
  implements OnInit, OnDestroy
{
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });
  changed = false;

  private changeSubscription?: Subscription;

  constructor(
    private exampleLoaderService: ExampleLoaderService,
    private exampleService: ExampleService,
    private exampleToolResolveService: ExampleToolResolveService,
    private fb: FormBuilder,
    protected processApiService: ProcessApiService,
    protected runningProcessService: RunningProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.changeSubscription = this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => {
          if (this.example == null) {
            this.changed = false;
          } else {
            this.changed =
              this.example.name !== value.name ||
              this.example.description !== value.description;
          }
        })
      )
      .subscribe();
    this.exampleLoaderService.loaded.subscribe(() => {
      if (this.example != null) {
        this.nameControl.setValue(this.example.name);
        this.descriptionControl.setValue(this.example.description);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  async submit(): Promise<void> {
    if (this.example != null) {
      await this.exampleService.update(
        this.example._id,
        this.form.value.name,
        this.form.value.description
      );
    }
  }

  async finish(): Promise<void> {
    if (
      this.example != null &&
      this.processApiService.stepInfo != null &&
      this.processApiService.stepInfo.step != null
    ) {
      this.exampleToolResolveService.resolve(
        this.processApiService.stepInfo,
        this.example._id
      );
    } else if (
      this.runningProcess != null &&
      this.processApiService.artifactVersionId != null
    ) {
      await this.exampleToolResolveService.resolveEditManually(
        this.runningProcess._id,
        this.processApiService.artifactVersionId
      );
    }
  }

  get example(): Example | undefined {
    return this.exampleLoaderService.example;
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }
}
