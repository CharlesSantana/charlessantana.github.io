document.addEventListener('DOMContentLoaded', () => {
    // Caminho para o arquivo menu.md
    // Certifique-se de que o arquivo menu.md está na pasta 'read/'
    fetch('read/menu.md')
        .then(response => {
            // Verifica se a resposta HTTP foi bem-sucedida (status 200 OK)
            if (!response.ok) {
                // Se houver um erro (ex: 404 Not Found), lança uma exceção
                throw new Error(`Erro HTTP! Status: ${response.status} ao carregar 'read/menu.md'. Verifique o caminho e se o servidor local está rodando.`);
            }
            // Retorna o conteúdo do arquivo como texto
            return response.text();
        })
        .then(markdownContent => {
            // Processa o conteúdo Markdown e gera o HTML do menu
            const menuHtml = parseMenuMarkdown(markdownContent);
            // Encontra a div no HTML onde o menu será injetado
            const navbarNavContainer = document.getElementById('navbarNav'); 
            
            if (navbarNavContainer) {
                // Cria o elemento <ul> que será o contêiner dos itens do menu
                const ulElement = document.createElement('ul');
                ulElement.classList.add('navbar-nav');
                ulElement.innerHTML = menuHtml; // Adiciona os itens de menu gerados

                // Limpa qualquer conteúdo existente dentro de #navbarNav antes de adicionar o novo menu
                while (navbarNavContainer.firstChild) {
                    navbarNavContainer.removeChild(navbarNavContainer.firstChild);
                }
                // Adiciona o novo <ul> com os itens do menu ao DOM
                navbarNavContainer.appendChild(ulElement);
            } else {
                // Mensagem de erro se o elemento #navbarNav não for encontrado
                console.error("Erro: Elemento com ID 'navbarNav' não encontrado no HTML. O menu não pode ser injetado.");
            }
        })
        .catch(error => {
            // Captura e exibe qualquer erro que ocorra durante o carregamento ou processamento do menu
            console.error('Erro fatal ao carregar ou processar menu.md:', error);
        });

    /**
     * Função para converter o conteúdo Markdown do menu em HTML de menu Bootstrap.
     * @param {string} markdown - Conteúdo do arquivo menu.md.
     * @returns {string} - HTML gerado para os itens do menu.
     */
    function parseMenuMarkdown(markdown) {
        // Divide o Markdown em linhas, remove espaços em branco extras e linhas vazias
        const lines = markdown.split('\n').map(line => line.trimEnd()).filter(line => line.length > 0);
        let html = ''; // String para construir o HTML final
        let currentIndentLevel = 0; // Nível de indentação atual
        let stack = []; // Pilha para controlar o aninhamento de <ul> e <li> de submenus

        // Helper: Calcula o nível de indentação de uma linha (baseado em 4 espaços por nível)
        function getIndentLevel(line) {
            const leadingSpaces = line.match(/^\s*/)[0].length;
            return leadingSpaces / 4; 
        }

        // Helper: Remove o hífen e os espaços iniciais de uma linha
        function cleanLine(line) {
            return line.replace(/^\s*-\s*/, '');
        }

        // Itera sobre cada linha do conteúdo Markdown
        lines.forEach(line => {
            const indentLevel = getIndentLevel(line);
            const cleanedLine = cleanLine(line);

            if (indentLevel > currentIndentLevel) {
                // Se a indentação aumentou, abre um novo submenu (dropdown-menu)
                html += '<ul class="dropdown-menu">';
                stack.push('</ul>'); // Adiciona o fechamento da UL à pilha
            } else if (indentLevel < currentIndentLevel) {
                // Se a indentação diminuiu, fecha os submenus anteriores até o nível correto
                while (indentLevel < currentIndentLevel && stack.length > 0) {
                    html += stack.pop(); // Fecha as ULs de submenus
                    // Se o item que estamos fechando era um <li> de dropdown, também fechamos o </li>
                    if (stack.length > 0 && stack[stack.length - 1] === '</li>') {
                        html += stack.pop(); 
                    }
                    currentIndentLevel--;
                }
            }
            
            // Atualiza o nível de indentação atual
            currentIndentLevel = indentLevel;

            if (cleanedLine.includes(':')) {
                // Se a linha contém ':', é um item de menu com link
                const [text, href] = cleanedLine.split(':').map(s => s.trim());
                // Verifica a URL atual para marcar o link como 'active'
                const currentPath = window.location.pathname.split('/').pop(); // Obtém o nome do arquivo da URL
                // Lógica para 'active': se o href corresponder ao arquivo atual, ou se for 'index.html' e a URL for a raiz
                const isActive = (href === currentPath || (href === 'index.html' && currentPath === '')) ? ' active' : '';

                if (stack.length > 0 && stack[stack.length - 1] === '</ul>') { 
                    // Se o último item da pilha é '</ul>', estamos dentro de um dropdown-menu (submenu)
                    html += `<li><a class="dropdown-item" href="${href}">${text}</a></li>`;
                } else { 
                    // Se for um item de nível superior (diretamente na barra de navegação)
                    html += `<li class="nav-item"><a class="nav-link${isActive}" href="${href}">${text}</a></li>`;
                }
            } else {
                // Se a linha NÃO contém ':', é um item pai de submenu (dropdown-toggle)
                const text = cleanedLine.trim();
                // Gera um ID único para o dropdown (ex: materiasDropdown)
                const dropdownId = text.toLowerCase().replace(/\s/g, '') + 'Dropdown';
                html += `
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="${dropdownId}" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            ${text}
                        </a>
                `;
                // Adiciona o fechamento do </li> deste item de dropdown à pilha
                stack.push('</li>'); 
            }
        });

        // Fechar quaisquer tags de submenu (<ul> e <li>) que ainda estejam abertas no final
        while (stack.length > 0) {
            html += stack.pop();
        }

        return html;
    }
});