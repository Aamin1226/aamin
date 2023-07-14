import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartNewComponent } from './start-new.component';

describe('StartNewComponent', () => {
  let component: StartNewComponent;
  let fixture: ComponentFixture<StartNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
