import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandPanelComponent } from './command-panel.component';

describe('CommandPanelComponent', () => {
  let component: CommandPanelComponent;
  let fixture: ComponentFixture<CommandPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
