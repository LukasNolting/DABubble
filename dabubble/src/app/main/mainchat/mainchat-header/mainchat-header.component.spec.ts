import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainchatHeaderComponent } from './mainchat-header.component';

describe('MainchatHeaderComponent', () => {
  let component: MainchatHeaderComponent;
  let fixture: ComponentFixture<MainchatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainchatHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainchatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
