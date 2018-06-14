class SplitLayout {
  public readonly gutter: HTMLElement;
  private isResizing: boolean = false;
  private rect: DOMRect;

  constructor(public readonly container: HTMLElement) {
    if (!container.classList.contains('split-pane-container')) {
      throw new Error('Cannot initialize Split Layout in a container without the "split-pane-container" class.');
    }
    this.gutter = this.container.querySelector('.split-pane-gutter');

    this.gutter.addEventListener('mousedown', e => {
      e.stopPropagation();
      this.isResizing = true;
      this.rect = <DOMRect>this.container.getBoundingClientRect();
      this.container.addEventListener('mousemove', this.resize);
    });

    window.addEventListener('mouseup', e => {
      if (this.isResizing) {
        e.stopPropagation();
        this.isResizing = false;
        this.container.removeEventListener('mousemove', this.resize);
      }
    });
  }

  private resize = e => {
    const min = 100;
    const max = 700;
    const pos = e.clientX - this.rect.left;

    if (pos < min || pos > max) {
      return;
    }

    const gridTemplateColumns = `${pos}px 5px 5px auto`;
    this.container.style.gridTemplateColumns = gridTemplateColumns;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SplitLayout(document.querySelector('#le-layout'));
});
