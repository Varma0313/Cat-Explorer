import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatCard } from './cat-card';

describe('CatCard', () => {
  let component: CatCard;
  let fixture: ComponentFixture<CatCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CatCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
