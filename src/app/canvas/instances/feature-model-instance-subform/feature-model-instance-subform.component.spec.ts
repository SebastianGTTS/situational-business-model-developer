import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureModelInstanceSubformComponent } from './feature-model-instance-subform.component';

describe('FeatureModelInstanceSubformComponent', () => {
  let component: FeatureModelInstanceSubformComponent;
  let fixture: ComponentFixture<FeatureModelInstanceSubformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureModelInstanceSubformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureModelInstanceSubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
