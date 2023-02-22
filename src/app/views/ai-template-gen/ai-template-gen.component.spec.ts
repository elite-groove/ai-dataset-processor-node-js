import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiTemplateGenComponent } from './ai-template-gen.component';

describe('AiTemplateGenComponent', () => {
  let component: AiTemplateGenComponent;
  let fixture: ComponentFixture<AiTemplateGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiTemplateGenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiTemplateGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
