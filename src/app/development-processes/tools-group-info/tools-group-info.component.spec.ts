import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsGroupInfoComponent } from './tools-group-info.component';

describe('ToolsGroupInfoComponent', () => {
  let component: ToolsGroupInfoComponent;
  let fixture: ComponentFixture<ToolsGroupInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolsGroupInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsGroupInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
