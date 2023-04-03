import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DbId } from '../../../../database/database-entry';
import { ElementLoaderService } from '../../../../database/element-loader.service';
import { Example } from '../../example-meta-artifact/example';
import { ExampleService } from '../../example-meta-artifact/example.service';

@Injectable()
export class ExampleLoaderService extends ElementLoaderService {
  example?: Example;

  constructor(private exampleService: ExampleService, route: ActivatedRoute) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const exampleId = paramMap.get('id');
    if (exampleId != null) {
      this.changesFeed = this.exampleService
        .getChangesFeed(exampleId)
        .subscribe(() => this.loadExample(exampleId));
      void this.loadExample(exampleId);
    } else {
      this.example = undefined;
    }
  }

  private async loadExample(exampleId: DbId): Promise<void> {
    this.example = await this.exampleService.get(exampleId);
    this.elementLoaded();
  }
}
