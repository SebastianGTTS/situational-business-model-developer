import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactsSelectionFormComponent } from './artifacts-selection-form.component';

describe('ArtifactsSelectionFormComponent', () => {
  let component: ArtifactsSelectionFormComponent;
  let fixture: ComponentFixture<ArtifactsSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtifactsSelectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtifactsSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
