import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';
import { ElementLoaderService } from '../../database/element-loader.service';

@Injectable()
export class ProcessPatternLoaderService extends ElementLoaderService {
  processPattern?: ProcessPattern;

  constructor(
    private processPatternService: ProcessPatternService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const processPatternId = paramMap.get('id');
    if (processPatternId != null) {
      this.changesFeed = this.processPatternService
        .getChangesFeed(processPatternId)
        .subscribe(() => this.loadProcessPattern(processPatternId));
      void this.loadProcessPattern(processPatternId);
    } else {
      this.processPattern = undefined;
    }
  }

  private async loadProcessPattern(processPatternId: string): Promise<void> {
    this.processPattern = await this.processPatternService.get(
      processPatternId
    );
    this.elementLoaded();
  }
}
