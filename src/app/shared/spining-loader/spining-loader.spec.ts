import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpiningLoader } from './spining-loader';

describe('SpiningLoader', () => {
  let component: SpiningLoader;
  let fixture: ComponentFixture<SpiningLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpiningLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpiningLoader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
