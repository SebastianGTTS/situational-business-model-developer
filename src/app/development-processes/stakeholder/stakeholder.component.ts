import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Stakeholder } from '../../development-process-registry/method-elements/stakeholder/stakeholder';
import { StakeholderService } from '../../development-process-registry/method-elements/stakeholder/stakeholder.service';

@Component({
  selector: 'app-stakeholder',
  templateUrl: './stakeholder.component.html',
  styleUrls: ['./stakeholder.component.css']
})
export class StakeholderComponent implements OnInit, OnDestroy {

  stakeholder: Stakeholder;
  listNames: string[] = [];

  private routeSubscription: Subscription;

  constructor(
    private stakeholderService: StakeholderService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(map => this.load(map.get('id')));
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  load(id: string) {
    this.stakeholderService.get(id).then((stakeholder) => {
      this.stakeholder = stakeholder;
    }).catch(error => console.log('Load: ' + error));
    this.stakeholderService.getLists().then((lists) => this.listNames = lists.map((list) => list.listName)).catch(
      error => console.log('LoadLists: ' + error)
    );
  }

  updateValue(value: any) {
    const update = (currentElement: Stakeholder) => {
      currentElement.update(value);
      return currentElement;
    };
    this.stakeholderService.update(this.stakeholder._id, update).then(
      () => this.load(this.stakeholder._id)
    ).catch((error) => console.log('UpdateValue: ' + error));
  }

}
