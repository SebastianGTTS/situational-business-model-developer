import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BmPatternProcessService } from '../../../development-process-registry/bm-process/bm-pattern-process.service';
import { BmPhaseProcessService } from '../../../development-process-registry/bm-process/bm-phase-process.service';
import { BmProcess } from '../../../development-process-registry/bm-process/bm-process';
import { BmProcessService } from '../../../development-process-registry/bm-process/bm-process.service';
import { Updatable, UPDATABLE } from '../../../shared/updatable';
import { BmProcessLoaderService } from '../../shared/bm-process-loader.service';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import { SelectionInit } from '../../../development-process-registry/development-method/selection';
import { SituationalFactorInit } from '../../../development-process-registry/method-elements/situational-factor/situational-factor';
import { BmPhaseProcess } from '../../../development-process-registry/bm-process/bm-phase-process';
import { BmPatternProcess } from '../../../development-process-registry/bm-process/bm-pattern-process';
import { Subscription } from 'rxjs';

enum CompositionTypes {
  PATTERN,
  PHASE,
}

@Component({
  selector: 'app-bm-process-init',
  templateUrl: './bm-process-init.component.html',
  styleUrls: ['./bm-process-init.component.css'],
})
export class BmProcessInitComponent implements OnInit, OnDestroy {
  typeForm = this.fb.group({
    type: this.fb.control<CompositionTypes | null>(null, Validators.required),
  });

  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  private loadedSubscription?: Subscription;

  constructor(
    protected bmPatternProcessService: BmPatternProcessService,
    protected bmPhaseProcessService: BmPhaseProcessService,
    private bmProcessLoaderService: BmProcessLoaderService,
    protected bmProcessService: BmProcessService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadedSubscription = this.bmProcessLoaderService.loaded.subscribe(
      () => {
        if (this.bmProcess instanceof BmPatternProcess) {
          this.typeForm.setValue({
            type: CompositionTypes.PATTERN,
          });
          this.typeForm.disable();
        } else if (this.bmProcess instanceof BmPhaseProcess) {
          this.typeForm.setValue({
            type: CompositionTypes.PHASE,
          });
          this.typeForm.disable();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.loadedSubscription?.unsubscribe();
  }

  async finishInitialization(): Promise<void> {
    if (this.bmProcess != null) {
      for (const update of this.updatable) {
        update.update();
      }
      if (this.bmProcess instanceof BmPatternProcess) {
        await this.bmPatternProcessService.finishInitialization(
          this.bmProcess._id
        );
      } else if (this.bmProcess instanceof BmPhaseProcess) {
        await this.bmPhaseProcessService.finishInitialization(
          this.bmProcess._id
        );
      } else {
        await this.bmProcessService.finishInitialization(this.bmProcess._id);
      }
      if (this.typeForm.getRawValue().type === CompositionTypes.PATTERN) {
        await this.bmPatternProcessService.convertBmProcess(this.bmProcess._id);
        await this.router.navigate(
          ['/', 'bmprocess', 'bmprocessview', this.bmProcess._id, 'pattern'],
          {
            queryParams: { created: true },
          }
        );
      } else {
        await this.bmPhaseProcessService.convertBmProcess(this.bmProcess._id);
        await this.router.navigate(
          ['/', 'bmprocess', 'bmprocessview', this.bmProcess._id, 'phase'],
          {
            queryParams: { created: true },
          }
        );
      }
    }
  }

  async updateDomains(domains: Domain[]): Promise<void> {
    if (this.bmProcess != null) {
      if (this.bmProcess instanceof BmPatternProcess) {
        await this.bmPatternProcessService.updateDomains(
          this.bmProcess._id,
          domains
        );
      } else if (this.bmProcess instanceof BmPhaseProcess) {
        await this.bmPhaseProcessService.updateDomains(
          this.bmProcess._id,
          domains
        );
      } else {
        await this.bmProcessService.updateDomains(this.bmProcess._id, domains);
      }
    }
  }

  async updateSituationalFactors(
    situationalFactors: SelectionInit<SituationalFactorInit>[]
  ): Promise<void> {
    if (this.bmProcess != null) {
      if (this.bmProcess instanceof BmPatternProcess) {
        await this.bmPatternProcessService.updateSituationalFactors(
          this.bmProcess._id,
          situationalFactors
        );
      } else if (this.bmProcess instanceof BmPhaseProcess) {
        await this.bmPhaseProcessService.updateSituationalFactors(
          this.bmProcess._id,
          situationalFactors
        );
      } else {
        await this.bmProcessService.updateSituationalFactors(
          this.bmProcess._id,
          situationalFactors
        );
      }
    }
  }

  get compositionTypes(): typeof CompositionTypes {
    return CompositionTypes;
  }

  get bmProcess(): BmProcess | undefined {
    return this.bmProcessLoaderService.bmProcess;
  }
}
