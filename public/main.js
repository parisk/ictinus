class SplitLayout {
    constructor(element) {
        console.debug('init split layout in', element);
        this.element = element;
        this.gutter = this.element.querySelector('.split-pane-gutter');
        console.debug('init split layout gutter', this.gutter);
        this.gutter.draggable = true;

        this.gutter.addEventListener('drag', e => {
            const rect = e.target.getBoundingClientRect();
            const parentRect = e.target.parentElement.getBoundingClientRect();
            const base = rect.x - parentRect.x - (rect.width / 2);
            const pos = base + e.offsetX;
            const gridTemplateColumns = `${pos}px 5px 5px auto`;
            this.element.style.gridTemplateColumns = gridTemplateColumns;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const layout = new SplitLayout(document.querySelector('#le-layout'));
});
