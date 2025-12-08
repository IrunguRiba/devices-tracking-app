import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMap } from './all-map';

describe('AllMap', () => {
  let component: AllMap;
  let fixture: ComponentFixture<AllMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
