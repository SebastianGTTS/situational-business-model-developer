import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TutorialStep } from '../tutorial-manager.service';
import { detectOverflow, Obj, Options, State } from '@popperjs/core';
import { Modifier } from '@popperjs/core/lib/types';

const detectOverflowModifier: Partial<Modifier<'detectOverflowModifier', Obj>> =
  {
    name: 'detectOverflowModifier',
    enabled: true,
    phase: 'main',
    requiresIfExists: ['offset'],
    fn({ state }: { state: State }): void {
      if (state.placement === 'top') {
        const overflow = detectOverflow(state);
        if (
          overflow.top > 0 ||
          overflow.bottom > 0 ||
          overflow.left > 0 ||
          overflow.right > 0
        ) {
          state.placement = 'bottom';
          state.reset = true;
        }
      }
    },
  };

/**
 * A popover that contains default templates for tutorials.
 * Additionally, it automatically opens, when created.
 */
@Component({
  selector: 'app-tutorial-popover',
  templateUrl: './tutorial-popover.component.html',
  styleUrls: ['./tutorial-popover.component.scss'],
})
export class TutorialPopoverComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() tutorialStep!: TutorialStep;
  @Input() targetElement!: HTMLElement;

  @Output() closePopover = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() restart = new EventEmitter<void>();

  @ViewChild(NgbPopover) popover?: NgbPopover;

  currentTutorialStep?: TutorialStep;
  currentTargetElement?: HTMLElement;

  popperOptions: (options: Partial<Options>) => Partial<Options> = (
    options: Partial<Options>
  ) => {
    return {
      ...options,
      modifiers: [...(options.modifiers ?? []), detectOverflowModifier],
    };
  };

  private closeRequest = false;
  private reopen = false;

  ngOnInit(): void {
    this.currentTutorialStep = this.tutorialStep;
    this.currentTargetElement = this.targetElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.tutorialStep &&
        !changes.tutorialStep.firstChange &&
        changes.tutorialStep.currentValue != null) ||
      (changes.targetElement &&
        !changes.targetElement.firstChange &&
        changes.targetElement.currentValue != null)
    ) {
      this.reopen = true;
      this.currentTargetElement = this.targetElement;
      this.popover?.close();
    }
  }

  ngAfterViewInit(): void {
    this.popover?.open();
  }

  ngOnDestroy(): void {
    this.popover?.close();
  }

  close(): void {
    this.popover?.close();
    this.closeRequest = true;
  }

  previousStep(): void {
    this.previous.emit();
  }

  nextStep(): void {
    this.next.emit();
  }

  restartTutorial(): void {
    this.restart.emit();
  }

  hidden(): void {
    if (this.closeRequest) {
      this.closePopover.emit();
    } else if (this.reopen) {
      this.currentTutorialStep = this.tutorialStep;
      this.popover?.open();
    }
    this.closeRequest = false;
    this.reopen = false;
  }
}
