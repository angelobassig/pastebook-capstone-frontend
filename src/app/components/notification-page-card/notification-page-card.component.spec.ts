import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPageCardComponent } from './notification-page-card.component';

describe('NotificationPageCardComponent', () => {
  let component: NotificationPageCardComponent;
  let fixture: ComponentFixture<NotificationPageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationPageCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
