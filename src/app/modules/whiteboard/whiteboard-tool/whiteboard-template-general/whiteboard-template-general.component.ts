import { Component, QueryList, ViewChildren } from '@angular/core';
import { WhiteboardTemplateLoaderService } from '../shared/whiteboard-template-loader.service';
import { WhiteboardTemplate } from '../../whiteboard-meta-artifact/whiteboard-template';
import { WhiteboardTemplateService } from '../../whiteboard-meta-artifact/whiteboard-template.service';
import { IconInit } from '../../../../model/icon';
import { AuthorInit } from '../../../../model/author';
import { Updatable, UPDATABLE } from '../../../../shared/updatable';

@Component({
  selector: 'app-whiteboard-template-general',
  templateUrl: './whiteboard-template-general.component.html',
  styleUrls: ['./whiteboard-template-general.component.scss'],
  providers: [
    { provide: UPDATABLE, useExisting: WhiteboardTemplateGeneralComponent },
  ],
})
export class WhiteboardTemplateGeneralComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private whiteboardTemplateLoaderService: WhiteboardTemplateLoaderService,
    private whiteboardTemplateService: WhiteboardTemplateService
  ) {}

  async updateInformation(name: string, description: string): Promise<void> {
    if (this.whiteboardTemplate != null) {
      await this.whiteboardTemplateService.updateInformation(
        this.whiteboardTemplate._id,
        name,
        description
      );
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.whiteboardTemplate != null) {
      await this.whiteboardTemplateService.updateIcon(
        this.whiteboardTemplate._id,
        icon
      );
    }
  }

  async updateAuthor(author: AuthorInit): Promise<void> {
    if (this.whiteboardTemplate != null) {
      await this.whiteboardTemplateService.updateAuthor(
        this.whiteboardTemplate._id,
        author
      );
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get whiteboardTemplate(): WhiteboardTemplate | undefined {
    return this.whiteboardTemplateLoaderService.whiteboardTemplate;
  }
}
