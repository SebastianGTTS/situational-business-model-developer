import { Component, OnInit } from '@angular/core';
import {
  TutorialOverview,
  TutorialStatsService,
} from '../tutorial-stats.service';
import { Role, UserService } from '../../role/user.service';

@Component({
  selector: 'app-tutorial-overview',
  templateUrl: './tutorial-overview.component.html',
  styleUrls: ['./tutorial-overview.component.scss'],
})
export class TutorialOverviewComponent implements OnInit {
  tutorials?: { [role: string]: TutorialOverview[] };

  constructor(
    private tutorialStatsService: TutorialStatsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadTutorialsOverview();
  }

  async start(tutorial: TutorialOverview): Promise<void> {
    const result = await this.tutorialStatsService.startTutorial(tutorial.id);
    if (!result) {
      this.loadTutorialsOverview();
    }
  }

  async reset(tutorial: TutorialOverview): Promise<void> {
    await this.tutorialStatsService.updateTutorialStep(
      tutorial.id,
      0,
      undefined
    );
    this.loadTutorialsOverview();
  }

  private loadTutorialsOverview(): void {
    const tutorialsOverview = this.tutorialStatsService.getTutorialsOverview();
    this.tutorials = {};
    for (const role of this.roles) {
      this.tutorials[role.id] = tutorialsOverview.filter(
        (tutorial) => tutorial.role === role.id
      );
    }
  }

  get roles(): Role[] {
    return this.userService.roles;
  }
}
