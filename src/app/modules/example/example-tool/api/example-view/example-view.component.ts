import { Component, OnInit } from '@angular/core';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { ExampleLoaderService } from '../../shared/example-loader.service';
import { ExampleToolResolveService } from '../../example-tool-resolve.service';
import { Example } from '../../../example-artifact/example';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-example-view',
  templateUrl: './example-view.component.html',
  styleUrls: ['./example-view.component.css'],
  providers: [ExampleLoaderService, ProcessApiService],
})
export class ExampleViewComponent implements OnInit {
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(
    private exampleLoaderService: ExampleLoaderService,
    private exampleToolResolveService: ExampleToolResolveService,
    private fb: FormBuilder,
    private processApiService: ProcessApiService
  ) {}

  ngOnInit(): void {
    this.exampleLoaderService.loaded.subscribe(() => {
      this.form.setValue({
        name: this.example?.name,
        description: this.example?.description,
      });
    });
  }

  finish(): void {
    if (this.example != null && this.processApiService.stepInfo != null) {
      this.exampleToolResolveService.resolve(
        this.processApiService.stepInfo,
        this.example._id
      );
    }
  }

  get example(): Example | undefined {
    return this.exampleLoaderService.example;
  }

  isCorrectStep(): boolean {
    return (
      this.processApiService.runningMethod != null &&
      this.processApiService.isCorrectStep()
    );
  }
}
