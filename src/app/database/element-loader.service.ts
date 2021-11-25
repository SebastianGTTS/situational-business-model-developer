import { Injectable, OnDestroy } from '@angular/core';
import { asapScheduler, Observable, Subject, Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { subscribeOn, tap } from 'rxjs/operators';

@Injectable()
export abstract class ElementLoaderService implements OnDestroy {
  private _loadedObservable: Observable<void> = null;
  private _loaded: Subject<void> = null;
  get loaded(): Observable<void> {
    return this._loadedObservable;
  }

  private routeSubscription: Subscription = null;
  private _changesFeed: Subscription = null;
  protected set changesFeed(changesFeed: Subscription) {
    this._changesFeed = changesFeed;
  }

  protected constructor(private route: ActivatedRoute) {
    this.init();
  }

  private init(): void {
    this._loaded = new Subject<void>();
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
  protected abstract initParams(paramMap: ParamMap);

  ngOnDestroy(): void {
    this.checkUnsubscribeChangesFeed();
    this.routeSubscription.unsubscribe();
    this._loaded.complete();
  }

  private checkUnsubscribeChangesFeed(): void {
    if (this._changesFeed) {
      this._changesFeed.unsubscribe();
      this._changesFeed = null;
    }
  }

  protected elementLoaded(): void {
    this._loaded.next();
  }
}
