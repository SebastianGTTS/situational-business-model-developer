import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { DomainService } from '../../development-process-registry/knowledge/domain.service';
import { ElementLoaderService } from '../../database/element-loader.service';

@Injectable()
export class DomainLoaderService extends ElementLoaderService {
  domain: Domain = null;

  constructor(private domainService: DomainService, route: ActivatedRoute) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const domainId = paramMap.get('id');
    this.changesFeed = this.domainService
      .getChangesFeed(domainId)
      .subscribe(() => this.loadDomain(domainId));
    void this.loadDomain(domainId);
  }

  private async loadDomain(domainId: string): Promise<void> {
    this.domain = await this.domainService.get(domainId);
    this.elementLoaded();
  }
}
