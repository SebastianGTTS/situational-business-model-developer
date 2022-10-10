import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Domain } from '../../development-process-registry/knowledge/domain';

enum Status {
  ADDED,
  REMOVED,
}

@Component({
  selector: 'app-domains-list',
  templateUrl: './domains-list.component.html',
  styleUrls: ['./domains-list.component.css'],
})
export class DomainsListComponent implements OnChanges {
  @Input() domains!: Domain[];
  @Input() newDomains?: Domain[];

  combinedList?: { domain: Domain; status?: Status }[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.domains || changes.newDomains) {
      this.generateCombinedList();
    }
  }

  private generateCombinedList(): void {
    if (this.newDomains == null) {
      this.combinedList = this.domains.map((domain) => {
        return { domain: domain };
      });
    } else {
      const newDomainIds = new Set<string>(
        this.newDomains.map((domain) => domain._id)
      );
      const domainIds = new Set<string>();
      this.combinedList = [];
      for (const domain of this.domains) {
        domainIds.add(domain._id);
        if (newDomainIds.has(domain._id)) {
          this.combinedList.push({ domain: domain });
        } else {
          this.combinedList.push({ domain: domain, status: Status.REMOVED });
        }
      }
      for (const domain of this.newDomains) {
        if (!domainIds.has(domain._id)) {
          this.combinedList.push({ domain: domain, status: Status.ADDED });
        }
      }
    }
  }

  get status(): typeof Status {
    return Status;
  }
}
