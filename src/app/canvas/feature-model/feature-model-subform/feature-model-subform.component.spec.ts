import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureModelSubformComponent } from './feature-model-subform.component';

describe('FeatureModelSubformComponent', () => {
  let component: FeatureModelSubformComponent;
  let fixture: ComponentFixture<FeatureModelSubformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureModelSubformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureModelSubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
