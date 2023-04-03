import { Injectable, OnDestroy } from '@angular/core';
import { StatsService } from '../../stats.service';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatabaseEntry, DbId } from '../../database/database-entry';

export interface DevelopmentProcessesStats extends DatabaseEntry {
  lastVisitedRunningProcess?: DbId;
}

@Injectable({
  providedIn: 'root',
})
export class DevelopmentProcessesStatsService implements OnDestroy {
  static readonly id = 'DevelopmentProcessesStats';
  private routerSubscription?: Subscription;

  constructor(private router: Router, private statsService: StatsService) {}

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  init(): void {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationEnd &&
        this.router.isActive(
          this.router.createUrlTree(['runningprocess', 'runningprocessview']),
          {
            paths: 'subset',
            queryParams: 'ignored',
            matrixParams: 'ignored',
            fragment: 'ignored',
          }
        )
      ) {
        const id = this.findId(this.router.routerState.snapshot.root);
        if (id == null) {
          return;
        }
        const store = this.statsService.stats?.getStat(
          DevelopmentProcessesStatsService.id
        ) as DevelopmentProcessesStats | undefined;
        if (id !== store?.lastVisitedRunningProcess) {
          void this.statsService.updateStat(
            DevelopmentProcessesStatsService.id,
            {
              lastVisitedRunningProcess: id,
            } as DevelopmentProcessesStats
          );
        }
      }
    });
  }

  private findId(route: ActivatedRouteSnapshot): DbId | undefined {
    for (
      let current: ActivatedRouteSnapshot | null = route;
      current != null;
      current = current.firstChild
    ) {
      if (current.paramMap.has('id')) {
        return current.paramMap.get('id') ?? undefined;
      }
    }
    return undefined;
  }
}
