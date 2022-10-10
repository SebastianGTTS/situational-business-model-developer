import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SituationalFactorService } from '../../development-process-registry/method-elements/situational-factor/situational-factor.service';
import {
  SituationalFactorDefinition,
  SituationalFactorDefinitionInit,
} from '../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
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

  private orderedSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private situationalFactorLoaderService: MethodElementLoaderService<
      SituationalFactorDefinition,
      SituationalFactorDefinitionInit
    >,
    private situationalFactorService: SituationalFactorService
  ) {}

  ngOnInit(): void {
    this.situationalFactorLoaderService.loaded.subscribe(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.orderedForm.patchValue(this.situationalFactor!, {
        emitEvent: false,
      });
    });
    this.orderedSubscription = this.orderedForm.valueChanges.subscribe(
      (formValue) => this.updateSituationalFactorValue(formValue)
    );
  }

  ngOnDestroy(): void {
    if (this.orderedSubscription != null) {
      this.orderedSubscription.unsubscribe();
    }
  }

  async updateSituationalFactor(form: FormGroup): Promise<void> {
    await this.updateSituationalFactorValue(form.value);
  }

  async updateSituationalFactorValue(
    value: SituationalFactorDefinitionInit
  ): Promise<void> {
    if (this.situationalFactor != null) {
      await this.situationalFactorService.update(
        this.situationalFactor._id,
        value
      );
    }
  }

  get situationalFactor(): SituationalFactorDefinition | undefined {
    return this.situationalFactorLoaderService.methodElement;
  }

  get listNames(): string[] {
    return this.situationalFactorLoaderService.listNames;
  }
}
