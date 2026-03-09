import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrePlantes } from './registre-plantes';

describe('RegistrePlantes', () => {
  let component: RegistrePlantes;
  let fixture: ComponentFixture<RegistrePlantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrePlantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrePlantes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
