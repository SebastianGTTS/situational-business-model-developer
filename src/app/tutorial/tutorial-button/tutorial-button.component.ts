import { Component } from '@angular/core';
import { TutorialManagerService } from '../tutorial-manager.service';

@Component({
  selector: 'app-tutorial-button',
  templateUrl: './tutorial-button.component.html',
  styleUrls: ['./tutorial-button.component.scss'],
})
export class TutorialButtonComponent {
  constructor(private tutorialManagerService: TutorialManagerService) {}

  async resumeTutorial(): Promise<void> {
    await this.tutorialManagerService.resumeTutorial();
  }

  hasTutorial(): boolean {
    return this.tutorialManagerService.hasTutorial();
  }

  isRunning(): boolean {
    return this.tutorialManagerService.isRunning();
  }
}
