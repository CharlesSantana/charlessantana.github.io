// js/lerCurriculo.js
document.addEventListener('DOMContentLoaded', function() {
    // Função para carregar e exibir o README.md
    async function carregarCurriculo() {
        try {
            // Faz o fetch do arquivo README.md
            const response = await fetch('README.md');
            
            if (!response.ok) {
                throw new Error('Não foi possível carregar o arquivo');
            }
            
            const conteudo = await response.text();
            const curriculoContainer = document.getElementById('curriculoContent');
            
            // Converte Markdown para HTML (simplificado)
            const html = converterMarkdownParaHTML(conteudo);
            
            // Insere no DOM
            curriculoContainer.innerHTML = html;
        } catch (erro) {
            console.error('Erro ao carregar o currículo:', erro);
            document.getElementById('curriculoContent').innerHTML = 
                '<p>Não foi possível carregar o currículo. Por favor, tente novamente mais tarde.</p>';
        }
    }
    
    // Função simples para converter Markdown para HTML
    function converterMarkdownParaHTML(markdown) {
        // Converte cabeçalhos
        let html = markdown
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>');
        
        // Converte listas
        html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
        
        // Converte negrito
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        return html;
    }
    
    // Chama a função quando a página carrega
    carregarCurriculo();
});