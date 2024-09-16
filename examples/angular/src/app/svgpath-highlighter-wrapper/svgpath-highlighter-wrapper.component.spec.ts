import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SVGPathHighlighterWrapperComponent } from './svgpath-highlighter-wrapper.component';

describe('SVGPathHighlighterWrapperComponent', () => {
  let component: SVGPathHighlighterWrapperComponent;
  let fixture: ComponentFixture<SVGPathHighlighterWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SVGPathHighlighterWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SVGPathHighlighterWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
