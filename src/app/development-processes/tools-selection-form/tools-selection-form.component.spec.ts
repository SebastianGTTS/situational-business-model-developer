import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsSelectionFormComponent } from './tools-selection-form.component';

describe('ToolsSelectionFormComponent', () => {
  let component: ToolsSelectionFormComponent;
  let fixture: ComponentFixture<ToolsSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolsSelectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
