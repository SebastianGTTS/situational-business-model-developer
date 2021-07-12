import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentMethodArtifactMappingComponent } from './development-method-artifact-mapping.component';

describe('DevelopmentMethodArtifactMappingComponent', () => {
  let component: DevelopmentMethodArtifactMappingComponent;
  let fixture: ComponentFixture<DevelopmentMethodArtifactMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevelopmentMethodArtifactMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopmentMethodArtifactMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
