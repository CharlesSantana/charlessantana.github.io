document.addEventListener('DOMContentLoaded', function() {
    const curriculoContainer = document.getElementById('curriculoContent');
    
    // Mostra um loader enquanto carrega
    curriculoContainer.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-2">Carregando currículo...</p>
        </div>
    `;

    // Carrega o README.md
    fetch('read/index.md')
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar o arquivo');
            return response.text();
        })
        .then(markdown => {
            // Converte markdown para HTML
            const html = marked.parse(markdown);
            
            // Atualiza o container
            curriculoContainer.innerHTML = html;
            
            // Aplica estilos específicos
            aplicarEstilos();
        })
        .catch(error => {
            console.error('Erro:', error);
            curriculoContainer.innerHTML = `
                <div class="alert alert-danger">
                    Não foi possível carregar o currículo. Por favor, verifique o console para mais detalhes.
                </div>
                <div class="mt-3">
                    <h3>Professor Exemplo</h3>
                    <p><strong>Formação Acadêmica:</strong></p>
                    <ul>
                        <li>Doutorado em Educação - Universidade XYZ (2015-2019)</li>
                        <li>Mestrado em Metodologias de Ensino - Universidade ABC (2010-2012)</li>
                        <li>Licenciatura em Pedagogia - Universidade DEF (2005-2009)</li>
                    </ul>
                </div>
            `;
        });

    function aplicarEstilos() {
        // Estiliza as listas para manter consistência com seu design
        const uls = curriculoContainer.querySelectorAll('ul');
        uls.forEach(ul => {
            ul.style.listStyleType = 'disc';
            ul.style.paddingLeft = '20px';
            ul.style.marginBottom = '15px';
        });
        
        // Estiliza os cabeçalhos
        const h2s = curriculoContainer.querySelectorAll('h2');
        h2s.forEach(h2 => {
            h2.classList.add('mt-4', 'mb-3', 'pb-2', 'border-bottom');
        });
    }
});