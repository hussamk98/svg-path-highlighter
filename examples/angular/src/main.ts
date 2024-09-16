import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SVGPathHighlighterWrapperComponent } from './app/svgpath-highlighter-wrapper/svgpath-highlighter-wrapper.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="container">
      <app-svg-path-highlighter-wrapper
        [config]="'HumanBodyFront'"
        [groups]="groupsFront"
        [selectedPaths]="selectedPathsFront"
        [setSelectedPaths]="setSelectedPathsFront"
      ></app-svg-path-highlighter-wrapper>
      <app-svg-path-highlighter-wrapper
        [config]="'HumanBodyBack'"
        [groups]="groupsBack"
        [selectedPaths]="selectedPathsBack"
        [setSelectedPaths]="setSelectedPathsBack"
      ></app-svg-path-highlighter-wrapper>
      <div class="json-container">
        <pre><code>{{ selectedPathsFront | json }}</code></pre>
        <pre><code>{{ selectedPathsBack | json }}</code></pre>
      </div>
    </div>
  `,
  imports: [CommonModule, SVGPathHighlighterWrapperComponent],
  styles: [
    `
    .container {
      display: flex;
      gap: 1rem;
    }
    .json-container {
      width: 100%;
      border: 1px solid #ccc;
      padding: 10px;
      background-color: #f9f9f9;
      border-radius: 5px;
      overflow-x: auto;
      max-width: 400px;
    }
    pre {
      margin: 0;
      font-family: monospace;
    }
  `,
  ],
})
export class App {
  selectedPathsFront: string[] = [];
  selectedPathsBack: string[] = [];

  groupsFront = { group1: ['1', '2'] };
  groupsBack = { group1: ['1', '2'] };

  setSelectedPathsFront = (paths: string[]) => {
    this.selectedPathsFront = Array.isArray(paths) ? paths : [];
    console.log('Selected Paths Front:', this.selectedPathsFront);
  };

  setSelectedPathsBack = (paths: string[]) => {
    this.selectedPathsBack = Array.isArray(paths) ? paths : [];
    console.log('Selected Paths Back:', this.selectedPathsBack);
  };
}

bootstrapApplication(App);
