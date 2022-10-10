import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  MethodElement,
  MethodElementInit,
} from '../../development-process-registry/method-elements/method-element';
import { MethodElementService } from '../../development-process-registry/method-elements/method-element.service';
import { ElementLoaderService } from '../../database/element-loader.service';

@Injectable()
export class MethodElementLoaderService<
  T extends MethodElement,
  S extends MethodElementInit
> extends ElementLoaderService {
  methodElement?: T;
  listNames: string[] = [];

  constructor(
    private methodElementService: MethodElementService<T, S>,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const methodElementId = paramMap.get('id');
    if (methodElementId != null) {
      this.changesFeed = this.methodElementService
        .getChangesFeed(methodElementId)
        .subscribe(() => this.loadMethodElement(methodElementId));
      void this.loadMethodElement(methodElementId);
    } else {
      this.methodElement = undefined;
      this.listNames = [];
    }
  }

  private async loadMethodElement(methodElementId: string): Promise<void> {
    this.methodElement = await this.methodElementService.get(methodElementId);
    this.listNames = (await this.methodElementService.getLists()).map(
      (list) => list.listName
    );
    this.elementLoaded();
  }
}
