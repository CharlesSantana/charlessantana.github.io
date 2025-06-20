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
            // Processa o markdown antes de converter
            const processedMarkdown = processProfilePhoto(markdown);
            
            // Converte markdown para HTML
            const html = marked.parse(processedMarkdown);
            
            // Atualiza o container
            curriculoContainer.innerHTML = html;
            
            // Aplica estilos específicos
            aplicarEstilos();
            
            // Extrai e exibe a foto de perfil separadamente
            extractAndDisplayProfilePhoto(markdown);
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

    function processProfilePhoto(markdown) {
        // Remove a seção de foto de perfil do markdown principal
        return markdown.replace(/## Foto de Perfil[^#]*/i, '');
    }

    function extractAndDisplayProfilePhoto(markdown) {
        // Extrai o link da foto do markdown
        const photoMatch = markdown.match(/!\[.*\]\((.*)\)/i);
        if (photoMatch && photoMatch[1]) {
            const photoUrl = photoMatch[1];
            
            // Cria um container para a foto no topo da página
            const profileHeader = document.createElement('div');
            profileHeader.className = 'profile-header text-center mb-4';
            profileHeader.innerHTML = `
                <img src="${photoUrl}" alt="Foto do Professor" class="profile-photo img-thumbnail rounded-circle mb-3" style="width: 200px; height: 200px; object-fit: cover;">
                <h1>Charles Alves dos Santos Santana</h1>
                <p class="lead">Educação, Consultoria e Tecnologia</p>
            `;
            
            // Insere antes do currículo
            curriculoContainer.parentNode.insertBefore(profileHeader, curriculoContainer);
        }
    }

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