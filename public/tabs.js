// Função para alternar entre as abas
document.querySelectorAll('.tabs .tab a').forEach(tab => {
    tab.addEventListener('click', event => {
        event.preventDefault();

        // Remove a classe 'active' de todas as abas e conteúdo
        document.querySelectorAll('.tabs .tab a').forEach(a => a.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Adiciona a classe 'active' à aba e ao conteúdo correspondente
        tab.classList.add('active');
        const contentId = tab.getAttribute('data-tab');
        document.getElementById(contentId).classList.add('active');
    });
});
