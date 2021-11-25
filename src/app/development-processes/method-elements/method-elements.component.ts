import { Component } from '@angular/core';

interface MethodElementLink {
  name: string;
  route: string[];
}

@Component({
  selector: 'app-method-elements',
  templateUrl: './method-elements.component.html',
  styleUrls: ['./method-elements.component.css'],
})
export class MethodElementsComponent {
  methodElementLinks: MethodElementLink[] = [
    { name: 'Artifacts', route: ['/', 'artifacts'] },
    { name: 'Situational Factors', route: ['/', 'situationalFactors'] },
    { name: 'Stakeholders', route: ['/', 'stakeholders'] },
    { name: 'Tools', route: ['/', 'tools'] },
    { name: 'Types', route: ['/', 'types'] },
  ];
}
