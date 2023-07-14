import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveDocumentComponent } from './move-document.component';

describe('MoveDocumentComponent', () => {
  let component: MoveDocumentComponent;
  let fixture: ComponentFixture<MoveDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
