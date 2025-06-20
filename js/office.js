document.addEventListener('DOMContentLoaded', function() {
    // Caminho relativo corrigido para o arquivo markdown
    fetch('read/office.md')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar arquivo: Status ${response.status}`);
            }
            return response.text();
        })
        .then(markdown => {
            console.log('Conteúdo carregado com sucesso:', markdown); // Log para debug
            processarConteudo(markdown);
        })
        .catch(error => {
            console.error('Erro no carregamento:', error);
            mostrarErro(`Falha ao carregar conteúdo: ${error.message}`);
        });

    function processarConteudo(markdown) {
        try {
            // Processa cabeçalho
            const tituloMatch = markdown.match(/Título: (.+)/);
            const subtituloMatch = markdown.match(/Subtítulo: (.+)/);
            
            if (tituloMatch) {
                document.querySelector('.materia-header h1').textContent = tituloMatch[1].trim();
            }
            if (subtituloMatch) {
                document.querySelector('.materia-header .lead').textContent = subtituloMatch[1].trim();
            }

            // Processa conteúdo da aula
            const conteudoMatch = markdown.match(/## Conteúdo da Aula([\s\S]+?)## Atividades/);
            if (conteudoMatch) {
                const conteudoCompleto = conteudoMatch[1].trim();
                const temaMatch = conteudoCompleto.match(/## Tema: (.+)/);
                
                let conteudoHTML = '<h2>Conteúdo da Aula</h2><div class="alert alert-info">';
                
                if (temaMatch) {
                    conteudoHTML += `<h4>Tema da Aula: ${temaMatch[1].trim()}</h4>`;
                    conteudoHTML += converterMarkdownParaHTML(conteudoCompleto.replace(/## Tema: .+/, ''));
                } else {
                    conteudoHTML += converterMarkdownParaHTML(conteudoCompleto);
                }
                
                conteudoHTML += '</div>';
                document.querySelector('.conteudo-aula').innerHTML = conteudoHTML;
            }

            // Processa atividades
            const atividadesMatch = markdown.match(/## Atividades([\s\S]+)/);
            if (atividadesMatch) {
                const atividadesHTML = processarAtividades(atividadesMatch[1]);
                document.querySelector('.row').innerHTML = atividadesHTML;
            }
        } catch (e) {
            console.error('Erro no processamento:', e);
            mostrarErro('Erro ao processar o conteúdo do arquivo.');
        }
    }

    function processarAtividades(conteudoAtividades) {
        const categorias = conteudoAtividades.split('### ').slice(1);
        let html = '';
        
        categorias.forEach(categoria => {
            const [titulo, ...itens] = categoria.split('\n');
            const atividades = itens.filter(item => item.trim().startsWith('-'));
            
            if (atividades.length > 0) {
                html += `
                    <div class="col-md-4">
                        <div class="card atividade-card">
                            <div class="card-body">
                                <h5 class="card-title">${titulo.trim()}</h5>
                                ${atividades.map(item => {
                                    const linkMatch = item.match(/\[(.+?)\]\((.+?)\)/);
                                    if (linkMatch) {
                                        return `
                                        <p class="card-text">${linkMatch[1].trim()}</p>
                                        <a href="${linkMatch[2].trim()}" class="btn btn-primary btn-sm d-block mb-2"
                                           onclick="downloadAtividade('${titulo.trim().toLowerCase()}')">
                                            Baixar PDF
                                        </a>`;
                                    }
                                    return `<p>${item.substring(2).trim()}</p>`;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        return html;
    }

    function converterMarkdownParaHTML(markdown) {
        return markdown
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/_(.+?)_/g, '<em>$1</em>')
            .replace(/^- (.+)/gm, '<li>$1</li>')
            .replace(/(<li>.+<\/li>)/gs, '<ul>$1</ul>')
            .replace(/\n{2,}/g, '<br><br>')
            .replace(/\n/g, ' ');
    }

    function mostrarErro(mensagem) {
        const container = document.querySelector('.conteudo-aula') || document.body;
        container.innerHTML = `
            <div class="alert alert-danger">
                <h4>Erro</h4>
                <p>${mensagem}</p>
                <p><small>Verifique o console (F12) para detalhes</small></p>
            </div>
        `;
    }
});