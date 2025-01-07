import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenutogglerComponent } from './menutoggler.component';

describe('MenutogglerComponent', () => {
  let component: MenutogglerComponent;
  let fixture: ComponentFixture<MenutogglerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenutogglerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenutogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
