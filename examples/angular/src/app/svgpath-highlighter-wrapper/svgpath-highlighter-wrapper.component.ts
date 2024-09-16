import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  SimpleChanges,
  OnChanges,
  ViewChild,
} from '@angular/core';
import SVGPathHighlighter from 'svg-path-highlighter';
import { loadConfig } from 'svg-path-highlighter/configLoader';

@Component({
  selector: 'app-svg-path-highlighter-wrapper',
  standalone: true,
  template: '<div #svgContainer style="width: 500px; height: 500px;"></div>',
})
export class SVGPathHighlighterWrapperComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() config: 'HumanBodyFront' | 'HumanBodyBack' = 'HumanBodyFront';
  @Input() groups: Record<string, string[]> = {};
  @Input() selectedPaths: string[] = [];
  @Input() setSelectedPaths: (paths: string[]) => void = () => {};

  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;

  private highlighter: SVGPathHighlighter | null = null;

  constructor(private el: ElementRef) {}

  async ngOnInit() {
    console.log('SVGPathHighlighterWrapperComponent initialized');
    try {
      const configData = await loadConfig(this.config);
      console.log('Config Data Loaded:', configData);
      const svgContainer = this.svgContainer.nativeElement;
      if (svgContainer) {
        this.highlighter = new SVGPathHighlighter(
          svgContainer,
          configData,
          this.groups
        );
        this.highlighter.setSelectedPaths(this.selectedPaths);
        console.log('SVGPathHighlighter initialized:', this.highlighter);

        svgContainer.addEventListener(
          'selectionChange',
          this.handleSelectionChange.bind(this)
        );
      } else {
        console.error('SVG Container not found');
      }
    } catch (error) {
      console.error(
        'Error loading config or initializing SVGPathHighlighter:',
        error
      );
    }
  }

  ngOnDestroy() {
    console.log('SVGPathHighlighterWrapperComponent destroyed');
    if (this.highlighter) {
      this.highlighter.destroy();
    }
    const svgContainer = this.svgContainer.nativeElement;
    if (svgContainer) {
      svgContainer.removeEventListener(
        'selectionChange',
        this.handleSelectionChange.bind(this)
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('SVGPathHighlighterWrapperComponent changes', changes);
    if (this.highlighter && changes['selectedPaths']) {
      this.highlighter.setSelectedPaths(
        Array.isArray(this.selectedPaths) ? this.selectedPaths : []
      );
    }
  }

  private handleSelectionChange(event: CustomEvent) {
    const paths = Array.isArray(event.detail) ? event.detail : [];
    this.setSelectedPaths(JSON.parse(JSON.stringify(paths)));
  }
}
