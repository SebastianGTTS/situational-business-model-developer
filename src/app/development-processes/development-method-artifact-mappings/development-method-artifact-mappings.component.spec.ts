import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentMethodArtifactMappingsComponent } from './development-method-artifact-mappings.component';

describe('DevelopmentMethodArtifactMappingsComponent', () => {
  let component: DevelopmentMethodArtifactMappingsComponent;
  let fixture: ComponentFixture<DevelopmentMethodArtifactMappingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevelopmentMethodArtifactMappingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopmentMethodArtifactMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
