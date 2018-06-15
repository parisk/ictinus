export class BareSplitLayout {
  public readonly elementA: HTMLElement;
  public readonly gutter: HTMLElement;
  public readonly elementB: HTMLElement;
  private readonly dimension: 'width' | 'height';
  private readonly axis: 'clientX' | 'clientY';
  private readonly rectAxis: 'left' | 'top';
  private max: number;
  private rect: DOMRect;

  constructor(
    public readonly container: HTMLElement,
    public readonly orientation: 'horizontal' | 'vertical',
    public readonly min: number = 100)
  {
    this.dimension = (this.orientation == 'horizontal') ? 'width' : 'height';
    this.axis = (this.orientation == 'horizontal') ? 'clientX' : 'clientY';
    this.rectAxis = (this.orientation == 'horizontal') ? 'left' : 'top';
    this.gutter = this.container.querySelector('.split-layout-gutter');
    this.gutter.addEventListener('mousedown', this.startResize);
  }

  public startResize = e => {
    e.stopPropagation();
    this.rect = <DOMRect>this.container.getBoundingClientRect();
    this.max = this.rect[this.dimension] - this.min;
    this.container.addEventListener('mousemove', this.resize);
    window.addEventListener('mouseup', this.stopResize);
  }

  public resize = e => {
    const size = e[this.axis] - this.rect[this.rectAxis];
    this.setSize(size);
  }

  public setSize(size) {
    if (size < this.min || size > this.max) {
      return;
    }

    const ratio = size / this.rect[this.dimension] * 100;
    const cssProperty = (this.orientation == 'horizontal') ? 'gridTemplateColumns' : 'gridTemplateRows';

    this.container.style[cssProperty] = `${ratio.toFixed(3)}% 5px 5px auto`;
  }

  public stopResize = e => {
    e.stopPropagation();
    this.container.removeEventListener('mousemove', this.resize);
  }
}


export class SplitLayout extends BareSplitLayout {

  constructor(
    container: HTMLElement,
    orientation: 'horizontal' | 'vertical',
    min: number = 100,
    elementA: HTMLElement = document.createElement('div'),
    gutter: HTMLElement = document.createElement('div'),
    elementB: HTMLElement = document.createElement('div'),)
  {
    container.classList.add('split-layout-container', `split-${orientation}`);
    elementA.classList.add('split-layout-element');
    gutter.classList.add('split-layout-gutter');
    elementB.classList.add('split-layout-element');

    container.appendChild(elementA);
    container.appendChild(gutter);
    container.appendChild(elementB);

    super(container, orientation, min);
  }
}
