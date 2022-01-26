import { Injectable, OnDestroy } from '@angular/core';
import {
  asapScheduler,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
} from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { subscribeOn, tap } from 'rxjs/operators';

@Injectable()
export abstract class ElementLoaderService implements OnDestroy {
  private readonly _loadedObservable: Observable<void>;
  private readonly _loaded: Subject<void>;
  get loaded(): Observable<void> {
    return this._loadedObservable;
  }

  private readonly routeSubscription: Subscription;
  private _changesFeed?: Subscription;
  protected set changesFeed(changesFeed: Subscription) {
    this._changesFeed = changesFeed;
  }

  protected constructor(private route: ActivatedRoute) {
    this._loaded = new ReplaySubject<void>(1);
    this._loadedObservable = this._loaded.asObservable();
    this.routeSubscription = this.route.paramMap
      .pipe(
        tap(() => this.checkUnsubscribeChangesFeed()),
        subscribeOn(asapScheduler) // needs to subscribe after the initialization of the subclass
      )
      .subscribe((paramMap) => this.initParams(paramMap));
  }

  /**
   * Called if the param map observable has new values
   *
   * @param paramMap the param map
   */
  protected abstract initParams(paramMap: ParamMap): void;

  ngOnDestroy(): void {
    this.checkUnsubscribeChangesFeed();
    this.routeSubscription.unsubscribe();
    this._loaded.complete();
  }

  private checkUnsubscribeChangesFeed(): void {
    if (this._changesFeed) {
      this._changesFeed.unsubscribe();
      this._changesFeed = undefined;
    }
  }

  protected elementLoaded(): void {
    this._loaded.next();
  }
}
