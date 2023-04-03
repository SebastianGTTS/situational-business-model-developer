import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { TutorialPopoverComponent } from '../tutorial-popover/tutorial-popover.component';
import { Subscription } from 'rxjs';
import {
  TutorialManagerService,
  TutorialStep,
} from '../tutorial-manager.service';

@Component({
  selector: 'app-tutorial-popover-wrapper',
  templateUrl: './tutorial-popover-wrapper.component.html',
  styleUrls: ['./tutorial-popover-wrapper.component.scss'],
})
export class TutorialPopoverWrapperComponent implements OnInit, OnDestroy {
  @ViewChild(TutorialPopoverComponent) popover?: TutorialPopoverComponent;

  tutorialStep?: TutorialStep;
  targetElement?: HTMLElement;

  private mutationObserver?: MutationObserver;
  private tutorialStepChangeSubscription?: Subscription;
  private clickListener?: () => void;

  constructor(
    private renderer2: Renderer2,
    private tutorialManagerService: TutorialManagerService
  ) {}

  ngOnInit(): void {
    this.tutorialStepChangeSubscription =
      this.tutorialManagerService.tutorialStepChangeObserver.subscribe(
        (tutorialStep) => this.tryOpenTutorial(tutorialStep)
      );
  }

  ngOnDestroy(): void {
    this.tutorialStepChangeSubscription?.unsubscribe();
    this.clickListener?.();
    this.mutationObserver?.disconnect();
  }

  private async tryOpenTutorial(
    tutorialStep: TutorialStep | undefined
  ): Promise<void> {
    this.clickListener?.();
    this.mutationObserver?.disconnect();
    if (tutorialStep == null) {
      this.tutorialStep = undefined;
      this.targetElement = undefined;
      return;
    }
    this.tutorialStep = tutorialStep;
    const targetId = tutorialStep.targetId;
    this.targetElement = undefined;
    this.targetElement = await this.waitForElement(targetId);

    if (this.tutorialStep.onClickAction != null) {
      this.clickListener = this.renderer2.listen(
        this.targetElement,
        'click',
        () => void this.tutorialStep?.onClickAction?.()
      );
    }

    this.mutationObserver = new MutationObserver(() => {
      const queryElement = document.getElementById(targetId);
      if (queryElement == null) {
        this.mutationObserver?.disconnect();
        this.clickListener?.();
        this.targetElement = undefined;
        void this.tutorialManagerService.stopTutorial();
      }
    });
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private async waitForElement(id: string): Promise<HTMLElement> {
    this.mutationObserver?.disconnect();
    let element = document.getElementById(id);
    if (element == null) {
      element = await new Promise<HTMLElement>((resolve) => {
        this.mutationObserver = new MutationObserver(() => {
          const queryElement = document.getElementById(id);
          if (queryElement != null) {
            this.mutationObserver?.disconnect();
            resolve(queryElement);
          }
        });
        this.mutationObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      });
    }
    return element;
  }

  async close(): Promise<void> {
    await this.tutorialManagerService.stopTutorial();
  }

  async previousStep(): Promise<void> {
    await this.tutorialManagerService.previousStep();
  }

  async nextStep(): Promise<void> {
    await this.tutorialManagerService.nextStep();
  }

  async restart(): Promise<void> {
    await this.tutorialManagerService.startTutorial();
  }
}
