document.addEventListener('DOMContentLoaded', function () {
    const layouts = document.querySelectorAll('#layout');
    if (!layouts.length) return;
    const lastLayout = layouts[layouts.length - 1];
    lastLayout.classList.add('last-layout');
    // you can also add a helper class to its pagemaker-widget(s)
    const widgets = lastLayout.querySelectorAll('.pagemaker-widget');
    widgets.forEach(w => w.classList.add('last-layout-pagemaker-widget'));
});