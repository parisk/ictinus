import { BaseLayout } from './base';


export class BareSplitLayout extends BaseLayout {
  public readonly gutter: HTMLElement;
  public readonly orientation: 'horizontal' | 'vertical';
  private readonly dimension: 'width' | 'height';
  private readonly axis: 'clientX' | 'clientY';
  private readonly rectAxis: 'left' | 'top';
  private rect: DOMRect;

  constructor(
    container: HTMLElement,
    public readonly onResize: Function = null)
  {
    super(container);
    this.orientation = (
      this.container.classList.contains('split-vertical')
    ) ? 'vertical' : 'horizontal';
    this.dimension = (this.orientation == 'horizontal') ? 'width' : 'height';
    this.axis = (this.orientation == 'horizontal') ? 'clientX' : 'clientY';
    this.rectAxis = (this.orientation == 'horizontal') ? 'left' : 'top';

    // We are not using querySelector, since we require the gutter to be an immediate child.
    for (const element of this.container.children) {
      if (element.classList.contains('split-layout-gutter')) {
        this.gutter = <HTMLElement>element;
        break;
      }
    }

    this.gutter.addEventListener('mousedown', this.startResize);
  }

  public cancelSelection = e => {
    e.preventDefault();
  }

  public startResize = e => {
    e.stopPropagation();
    this.rect = <DOMRect>this.container.getBoundingClientRect();
    window.addEventListener('mousemove', this.resize);
    window.addEventListener('mouseup', this.stopResize);
    window.addEventListener('selectstart', this.cancelSelection);
  }

  public resize = e => {
    const size = e[this.axis] - this.rect[this.rectAxis];

    this.setSize(size);
  }

  public setSize(size: number) {
    const ratio = size / this.rect[this.dimension] * 100;
    const element = <HTMLElement>this.container.querySelector('.split-layout-element:first-child');

    element.style[this.dimension] = `${ratio.toFixed(3)}%`;

    if (this.onResize) {
      this.onResize.call(this, ratio);
    }
  }

  public stopResize = e => {
    e.stopPropagation();
    window.removeEventListener('mousemove', this.resize);
    window.removeEventListener('mouseup', this.stopResize);
    window.removeEventListener('selectstart', this.cancelSelection);
  }
}


export class SplitLayout extends BareSplitLayout {
  constructor(
    container: HTMLElement,
    orientation: 'horizontal' | 'vertical',
    onResize: Function = null,
    elementA: HTMLElement = document.createElement('div'),
    gutter: HTMLElement = document.createElement('div'),
    elementB: HTMLElement = document.createElement('div'))
  {
    container.classList.add('split-layout-container', `split-${orientation}`);
    elementA.classList.add('split-layout-element');
    gutter.classList.add('split-layout-gutter');
    elementB.classList.add('split-layout-element');

    container.appendChild(elementA);
    container.appendChild(gutter);
    container.appendChild(elementB);

    super(container, onResize);
  }
}
