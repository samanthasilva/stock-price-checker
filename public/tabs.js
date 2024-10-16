document.querySelectorAll('.tabs .tab a').forEach(tab => {
    tab.addEventListener('click', event => {
        event.preventDefault();

        document.querySelectorAll('.tabs .tab a').forEach(a => a.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        tab.classList.add('active');
        const contentId = tab.getAttribute('data-tab');
        document.getElementById(contentId).classList.add('active');
    });
});
