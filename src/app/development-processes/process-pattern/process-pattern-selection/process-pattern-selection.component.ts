import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ProcessPatternLoaderService } from '../../shared/process-pattern-loader.service';
import { ProcessPattern } from '../../../development-process-registry/process-pattern/process-pattern';
import { ProcessPatternService } from '../../../development-process-registry/process-pattern/process-pattern.service';
import { Updatable, UPDATABLE } from '../../../shared/updatable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-process-pattern-selection',
  templateUrl: './process-pattern-selection.component.html',
  styleUrls: ['./process-pattern-selection.component.scss'],
})
export class ProcessPatternSelectionComponent
  implements OnInit, OnDestroy, Updatable
{
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  typesCorrectlyDefined = true;
  private loadedSubscription?: Subscription;

  constructor(
    private processPatternLoaderService: ProcessPatternLoaderService,
    private processPatternService: ProcessPatternService
  ) {}

  ngOnInit(): void {
    this.loadedSubscription = this.processPatternLoaderService.loaded.subscribe(
      () => {
        if (this.processPattern != null) {
          this.typesCorrectlyDefined = this.processPattern.types.length > 0;
        } else {
          this.typesCorrectlyDefined = true;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.loadedSubscription?.unsubscribe();
  }

  async updateProcessPatternValue(
    value: Partial<ProcessPattern>
  ): Promise<void> {
    if (this.processPattern != null) {
      await this.processPatternService.update(this.processPattern._id, value);
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get processPattern(): ProcessPattern | undefined {
    return this.processPatternLoaderService.processPattern;
  }
}
