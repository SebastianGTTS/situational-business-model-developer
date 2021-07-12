import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { DomainService } from '../../development-process-registry/knowledge/domain.service';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css']
})
export class DomainComponent implements OnInit, OnDestroy {

  domain: Domain;

  private routeSubscription: Subscription;

  constructor(
    private domainService: DomainService,
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

  async updateDescription(description: string) {
    this.domain.description = description;
    await this.domainService.save(this.domain);
    await this.load(this.domain._id);
  }

  async load(id: string) {
    this.domain = await this.domainService.get(id);
  }

}
