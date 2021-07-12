import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { FormArray, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExecutionStepsFormService } from '../shared/execution-steps-form.service';

@Component({
  selector: 'app-development-method',
  templateUrl: './development-method.component.html',
  styleUrls: ['./development-method.component.css']
})
export class DevelopmentMethodComponent implements OnInit, OnDestroy {

  developmentMethod: DevelopmentMethod;

  private routeSubscription: Subscription;

  constructor(
    private developmentMethodService: DevelopmentMethodService,
    private executionStepsFormService: ExecutionStepsFormService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(map => this.loadDevelopmentMethod(map.get('id')));
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadDevelopmentMethod(id: string) {
    this.developmentMethodService.getDevelopmentMethod(id).then(
      developmentMethod => this.developmentMethod = developmentMethod
    ).catch(
      error => console.log('LoadDevelopmentMethod: ' + error)
    );
  }

  updateExecutionSteps(form: FormArray) {
    const executionSteps = this.executionStepsFormService.getExecutionSteps(form.value);
    this.updateDevelopmentMethodValue({executionSteps});
  }

  updateDevelopmentMethod(form: FormGroup) {
    return this.updateDevelopmentMethodValue(form.value);
  }

  updateDevelopmentMethodValue(value: any) {
    this.developmentMethodService.updateDevelopmentMethod(this.developmentMethod._id, value).then(
      () => this.loadDevelopmentMethod(this.developmentMethod._id)
    ).catch(
      error => console.log('UpdateDevelopmentMethod: ' + error)
    );
  }

}
