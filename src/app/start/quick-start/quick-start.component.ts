import { Component } from '@angular/core';
import { QuickStartService, TreeItem } from './quick-start.service';

@Component({
  selector: 'app-quick-start',
  templateUrl: './quick-start.component.html',
  styleUrls: ['./quick-start.component.scss'],
  providers: [QuickStartService],
})
export class QuickStartComponent {
  constructor(private quickStartService: QuickStartService) {}

  next(index: number): void {
    this.quickStartService.next(index);
  }

  back(): void {
    this.quickStartService.back();
  }

  reset(): void {
    this.quickStartService.reset();
  }

  async execute(): Promise<void> {
    if (this.currentTreeItem.action != null) {
      await this.currentTreeItem.action();
    }
  }

  get currentTreeItem(): TreeItem {
    return this.quickStartService.currentTreeItem;
  }

  get depth(): number {
    return this.quickStartService.depth;
  }

  get text(): string {
    return this.quickStartService.text;
  }
}
