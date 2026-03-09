import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorPlantes } from './administrador-plantes';

describe('AdministradorPlantes', () => {
  let component: AdministradorPlantes;
  let fixture: ComponentFixture<AdministradorPlantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministradorPlantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministradorPlantes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
