import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DatabaseEntry, DbId } from '../database/database-entry';
import { ActivatedRoute, Router } from '@angular/router';
import {
  StartDataProvider,
  TutorialManagerService,
  TutorialStep,
} from './tutorial-manager.service';
import { SIDENAV_CONTROL, SidenavControl } from '../sidenav-control';

export interface ElementStartData extends DatabaseEntry {
  id?: DbId;
}

@Injectable()
export abstract class DefaultTutorialService
  implements StartDataProvider, OnDestroy
{
  protected abstract get tutorialId(): string;

  protected abstract readonly tutorialSteps: TutorialStep[];

  protected constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    @Inject(SIDENAV_CONTROL) private sidenavControl: SidenavControl,
    protected tutorialManagerService: TutorialManagerService
  ) {}

  async init(created: boolean, startTutorial: boolean): Promise<void> {
    this.tutorialManagerService.setTutorial(
      this.tutorialId,
      this,
      this.tutorialSteps
    );
    if (
      startTutorial ||
      (created && this.tutorialManagerService.isFirstStep())
    ) {
      await this.tutorialManagerService.resumeTutorial();
    }
  }

  ngOnDestroy(): void {
    this.tutorialManagerService.setTutorial(undefined, undefined, undefined);
  }

  getStartData(): ElementStartData | undefined {
    return {
      id: this.route.snapshot.paramMap.get('id') ?? undefined,
    };
  }

  protected async navigateToUrl(url: string[]): Promise<void> {
    await this.router.navigate(url, {
      relativeTo: this.route,
    });
  }

  protected openSidenav(): void {
    if (!this.sidenavControl.isSidenavShown()) {
      this.sidenavControl.toggleSidenav();
    }
  }
}
