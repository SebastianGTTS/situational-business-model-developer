import { Component, OnInit } from '@angular/core';
import { Instance } from '../../../canvas-meta-model/instance';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InstanceService } from '../instance.service';
import { DbId } from '../../../../../database/database-entry';

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.css'],
})
export class PatternComponent implements OnInit {
  expertModel?: ExpertModel;
  pattern?: Instance;

  private routeSubscription?: Subscription;

  constructor(
    private expertModelService: ExpertModelService,
    private instanceService: InstanceService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const expertModelId = paramMap.get('id');
      const patternIdStr = paramMap.get('patternId');
      const patternId = patternIdStr ? +patternIdStr : undefined;

      if (expertModelId != null && patternId != null) {
        void this.load(expertModelId, patternId);
      }
    });
  }

  async load(expertModelId: DbId, patternId: number): Promise<void> {
    const expertModel = await this.expertModelService.get(expertModelId);
    this.expertModel = expertModel;
    this.pattern = expertModel.getInstance(patternId);
  }

  async updateExpertModel(): Promise<void> {
    if (this.expertModel != null && this.pattern != null) {
      await this.expertModelService.save(this.expertModel);
      await this.load(this.expertModel._id, this.pattern.id);
    }
  }

  /**
   * Create adaptation of the pattern
   */
  async createAdaptation(): Promise<void> {
    if (this.expertModel != null && this.pattern != null) {
      const adaptationName = this.instanceService.getAdaptionName(
        this.pattern.name
      );
      this.expertModel.adaptInstance(this.pattern.id, adaptationName);
      const instance =
        this.expertModel.instances[this.expertModel.instances.length - 1];
      await this.expertModelService.save(this.expertModel);
      await this.router.navigate([
        'expertModels',
        this.expertModel._id,
        'patterns',
        instance.id,
      ]);
    }
  }
}
