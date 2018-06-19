// Split Layout Examples
document.addEventListener('DOMContentLoaded', () => {
  new SplitLayout(document.querySelector('#horizontal-example'), 'horizontal');
  new SplitLayout(document.querySelector('#vertical-example'), 'vertical', 20);
});
