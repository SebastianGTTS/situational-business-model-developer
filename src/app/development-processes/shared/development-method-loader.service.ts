import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { ElementLoaderService } from '../../database/element-loader.service';

@Injectable()
export class DevelopmentMethodLoaderService extends ElementLoaderService {
  developmentMethod: DevelopmentMethod = null;

  constructor(
    private developmentMethodService: DevelopmentMethodService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const developmentMethodId = paramMap.get('id');
    this.changesFeed = this.developmentMethodService
      .getChangesFeed(developmentMethodId)
      .subscribe(() => this.loadDevelopmentMethod(developmentMethodId));
    void this.loadDevelopmentMethod(developmentMethodId);
  }

  private async loadDevelopmentMethod(
    developmentMethodId: string
  ): Promise<void> {
    this.developmentMethod = await this.developmentMethodService.get(
      developmentMethodId
    );
    this.elementLoaded();
  }
}
