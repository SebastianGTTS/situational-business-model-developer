import { Injectable, OnDestroy } from '@angular/core';
import { PouchdbService } from './database/pouchdb.service';
import { Stats, StatsEntry } from './model/stats';
import { AuthService } from './database/auth.service';
import { Subscription } from 'rxjs';
import { DatabaseEntry } from './database/database-entry';

@Injectable({
  providedIn: 'root',
})
export class StatsService implements OnDestroy {
  private _stats?: Stats;

  get stats(): Stats | undefined {
    return this._stats;
  }

  private statsChangeSubscription?: Subscription;
  private dbChangeSubscription: Subscription;
  private dbResetSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private pouchdbService: PouchdbService
  ) {
    this.dbChangeSubscription = this.pouchdbService.dbChangeObserver.subscribe(
      (init) => {
        if (init) {
          void this.init();
        } else {
          this._stats = undefined;
        }
      }
    );
    this.dbResetSubscription =
      this.pouchdbService.dbDataResetObserver.subscribe((reset) => {
        if (reset) {
          this._stats = undefined;
        } else {
          void this.init();
        }
      });
  }

  ngOnDestroy(): void {
    this.statsChangeSubscription?.unsubscribe();
    this.dbChangeSubscription.unsubscribe();
  }

  private async init(): Promise<void> {
    const statsList = await this.pouchdbService.find<StatsEntry>(
      Stats.typeName,
      {
        selector: {
          username: this.authService.username,
        },
      }
    );
    if (statsList.length === 0) {
      this._stats = new Stats(undefined, {
        username: this.authService.username,
      });
      await this.pouchdbService.put(this._stats);
      await this.reloadStats();
    } else {
      this._stats = new Stats(statsList[0], undefined);
    }
    this.statsChangeSubscription?.unsubscribe();
    this.statsChangeSubscription = this.pouchdbService
      .getChangesFeed(this._stats._id)
      .subscribe(() => this.reloadStats());
  }

  private async reloadStats(): Promise<void> {
    if (this._stats == null) {
      return;
    }
    this._stats = new Stats(
      await this.pouchdbService.get<StatsEntry>(this._stats._id),
      undefined
    );
  }

  async updateStat(key: string, value: DatabaseEntry): Promise<void> {
    if (this._stats == null) {
      return;
    }
    this._stats.updateStat(key, value);
    await this.pouchdbService.put(this._stats);
  }

  async removeStat(key: string): Promise<void> {
    if (this._stats == null) {
      return;
    }
    this._stats.removeStat(key);
    await this.pouchdbService.put(this._stats);
  }
}
