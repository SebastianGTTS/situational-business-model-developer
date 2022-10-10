import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { RunningMethod } from '../../../../../development-process-registry/running-process/running-method';
import { HypoMoMapTreeService } from '../../../hypo-mo-map-meta-model/hypo-mo-map-tree.service';
import { HypoMoMapResolveService } from '../../hypo-mo-map-resolve.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-hypo-mo-map',
  templateUrl: './create-hypo-mo-map.component.html',
  styleUrls: ['./create-hypo-mo-map.component.css'],
  providers: [ProcessApiService],
})
export class CreateHypoMoMapComponent {
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private hypoMoMapResolveService: HypoMoMapResolveService,
    private hypoMoMapTreeService: HypoMoMapTreeService,
    private processApiService: ProcessApiService,
    private route: ActivatedRoute
  ) {}

  async submit(): Promise<void> {
    const artifactId = this.route.snapshot.paramMap.get('id');
    if (artifactId != null) {
      if (this.processApiService.runningProcess != null) {
        const instance = await this.hypoMoMapTreeService.addByName(
          this.nameControl.value
        );
        await this.hypoMoMapResolveService.resolveCreateHypoMoMapManually(
          this.processApiService.runningProcess._id,
          instance._id,
          artifactId
        );
      }
    } else {
      if (this.processApiService.stepInfo != null) {
        const instance = await this.hypoMoMapTreeService.addByName(
          this.nameControl.value
        );
        await this.hypoMoMapResolveService.resolve(
          this.processApiService.stepInfo,
          instance._id
        );
      }
    }
  }

  get runningMethod(): RunningMethod | undefined {
    return this.processApiService.runningMethod;
  }

  isCorrectStep(): boolean {
    return this.processApiService.isCorrectStep();
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  isManually(): boolean {
    return this.processApiService.stepInfo?.step == null;
  }
}
