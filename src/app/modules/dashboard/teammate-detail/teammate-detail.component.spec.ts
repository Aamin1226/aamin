import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeammateDetailComponent } from './teammate-detail.component';

describe('TeammateDetailComponent', () => {
  let component: TeammateDetailComponent;
  let fixture: ComponentFixture<TeammateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeammateDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeammateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
