import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SituationalFactorService } from '../../development-process-registry/method-elements/situational-factor/situational-factor.service';
import { SituationalFactorDefinition } from '../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { MethodElementLoaderService } from '../shared/method-element-loader.service';
import { MethodElementService } from '../../development-process-registry/method-elements/method-element.service';

@Component({
  selector: 'app-situational-factor',
  templateUrl: './situational-factor.component.html',
  styleUrls: ['./situational-factor.component.css'],
  providers: [
    MethodElementLoaderService,
    { provide: MethodElementService, useExisting: SituationalFactorService },
  ],
})
export class SituationalFactorComponent implements OnInit, OnDestroy {
  orderedForm: FormGroup = this.fb.group({
    ordered: [false, Validators.required],
  });

  private orderedSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private situationalFactorLoaderService: MethodElementLoaderService<SituationalFactorDefinition>,
    private situationalFactorService: SituationalFactorService
  ) {}

  ngOnInit() {
    this.situationalFactorLoaderService.loaded.subscribe(() => {
      this.orderedForm.patchValue(this.situationalFactor, { emitEvent: false });
    });
    this.orderedSubscription = this.orderedForm.valueChanges.subscribe(
      (formValue) => this.updateSituationalFactorValue(formValue)
    );
  }

  ngOnDestroy() {
    if (this.orderedSubscription) {
      this.orderedSubscription.unsubscribe();
    }
  }

  async updateSituationalFactor(form: FormGroup) {
    await this.updateSituationalFactorValue(form.value);
  }

  async updateSituationalFactorValue(value: any) {
    await this.situationalFactorService.update(
      this.situationalFactor._id,
      value
    );
  }

  get situationalFactor() {
    return this.situationalFactorLoaderService.methodElement;
  }

  get listNames() {
    return this.situationalFactorLoaderService.listNames;
  }
}
