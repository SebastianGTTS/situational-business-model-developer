import { Injectable } from '@angular/core';
import { StatsService } from '../stats.service';
import { DatabaseEntry } from '../database/database-entry';
import { InternalRoles } from '../role/user.service';

export interface TutorialStartService {
  start(startData: DatabaseEntry | undefined): Promise<boolean>;
}

export interface Tutorial {
  id: string;
  role: InternalRoles;
  name: string;
  steps: number;
}

export interface TutorialOverview {
  id: string;
  role: InternalRoles;
  name: string;
  steps: number;
  step: number;
}

interface TutorialsStats extends DatabaseEntry {
  tutorials: {
    [id: string]: {
      step: number;
      startData?: DatabaseEntry;
    };
  };
}

@Injectable()
export class TutorialStatsService {
  static readonly id = 'TutorialStats';

  private readonly tutorials: { [id: string]: Tutorial } = {};
  private readonly tutorialStarter: { [id: string]: TutorialStartService } = {};

  constructor(private statsService: StatsService) {}

  registerTutorial(
    tutorial: Tutorial,
    tutorialStartService: TutorialStartService
  ): void {
    this.tutorials[tutorial.id] = tutorial;
    this.tutorialStarter[tutorial.id] = tutorialStartService;
  }

  getTutorialsOverview(): TutorialOverview[] {
    let stats = this.statsService.stats?.getStat(TutorialStatsService.id) as
      | TutorialsStats
      | undefined;
    if (stats == null) {
      stats = {
        tutorials: {},
      };
    }
    const overview: TutorialOverview[] = [];
    for (const tutorial of Object.values(this.tutorials)) {
      overview.push({
        ...tutorial,
        step: stats.tutorials[tutorial.id]?.step ?? 0,
      });
    }
    return overview;
  }

  getTutorialStep(tutorialId: string | undefined): number {
    if (tutorialId == null) {
      return 0;
    }
    const stats = this.statsService.stats?.getStat(TutorialStatsService.id) as
      | TutorialsStats
      | undefined;
    return stats?.tutorials[tutorialId]?.step ?? 0;
  }

  getTutorialStartData(
    tutorialId: string | undefined
  ): DatabaseEntry | undefined {
    if (tutorialId == null) {
      return undefined;
    }
    const stats = this.statsService.stats?.getStat(TutorialStatsService.id) as
      | TutorialsStats
      | undefined;
    return stats?.tutorials[tutorialId]?.startData;
  }

  async updateTutorialStep(
    tutorialId: string | undefined,
    step: number | undefined,
    startData: DatabaseEntry | undefined
  ): Promise<void> {
    if (tutorialId == null || step == null) {
      return;
    }
    let stats = this.statsService.stats?.getStat(TutorialStatsService.id) as
      | TutorialsStats
      | undefined;
    if (stats == null) {
      stats = {
        tutorials: {},
      };
    }
    if (stats.tutorials[tutorialId] == null) {
      stats.tutorials[tutorialId] = {
        step: step,
        startData: startData,
      };
      await this.statsService.updateStat(TutorialStatsService.id, stats);
    } else if (
      stats.tutorials[tutorialId].step !== step ||
      (startData == null && stats.tutorials[tutorialId].startData != null)
    ) {
      stats.tutorials[tutorialId].step = step;
      stats.tutorials[tutorialId].startData = startData;
      await this.statsService.updateStat(TutorialStatsService.id, stats);
    }
  }

  async startTutorial(tutorialId: string): Promise<boolean> {
    return this.tutorialStarter[tutorialId].start(
      this.getTutorialStartData(tutorialId)
    );
  }
}
