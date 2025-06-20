document.addEventListener('DOMContentLoaded', function() {
    // Carrega o conteúdo do markdown
    fetch('read/evento.md')
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar o arquivo');
            return response.text();
        })
        .then(markdown => {
            processarConteudo(markdown);
        })
        .catch(error => {
            console.error('Erro:', error);
            mostrarErro('Não foi possível carregar a galeria.');
        });

    function processarConteudo(markdown) {
        try {
            // Processa o slide principal
            const slideMatch = markdown.match(/## Slide Principal([\s\S]+?)## Galeria/);
            if (slideMatch) {
                const fotosDestaque = extrairFotos(slideMatch[1]);
                criarCarrossel(fotosDestaque);
            }

            // Processa a galeria completa
            const galeriaMatch = markdown.match(/## Galeria Completa([\s\S]+)/);
            if (galeriaMatch) {
                const galeriaFotos = extrairFotosPorSessao(galeriaMatch[1]);
                criarGaleria(galeriaFotos);
            }
        } catch (e) {
            console.error('Erro no processamento:', e);
            mostrarErro('Erro ao processar o conteúdo da galeria.');
        }
    }

    function extrairFotos(conteudo) {
        const fotos = [];
        const items = conteudo.matchAll(/- \[(.+?)\]\((.+?)\) "(.+?)"/g);
        
        for (const item of items) {
            fotos.push({
                titulo: item[1],
                caminho: item[2],
                descricao: item[3]
            });
        }
        
        return fotos;
    }

    function extrairFotosPorSessao(conteudo) {
        const sessoes = conteudo.split('### ');
        const galeria = [];
        
        sessoes.slice(1).forEach(sessao => {
            const [tituloSessao, ...resto] = sessao.split('\n');
            const fotos = extrairFotos(resto.join('\n'));
            
            if (fotos.length > 0) {
                galeria.push({
                    sessao: tituloSessao.trim(),
                    fotos: fotos
                });
            }
        });
        
        return galeria;
    }

    function criarCarrossel(fotos) {
        const carrossel = document.getElementById('carrossel');
        const indicadores = document.getElementById('indicadores-carrossel');
        
        let slidesHTML = '';
        let indicadoresHTML = '';
        let active = 'active';
        
        fotos.forEach((foto, index) => {
            slidesHTML += `
                <div class="carousel-item ${active}">
                    <img src="${foto.caminho}" class="d-block w-100" alt="${foto.titulo}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${foto.titulo}</h5>
                        <p>${foto.descricao}</p>
                    </div>
                </div>
            `;
            
            indicadoresHTML += `
                <button type="button" data-bs-target="#carrossel" 
                        data-bs-slide-to="${index}" class="${active}" 
                        aria-current="${index === 0 ? 'true' : 'false'}">
                </button>
            `;
            
            active = '';
        });
        
        carrossel.querySelector('.carousel-inner').innerHTML = slidesHTML;
        indicadores.innerHTML = indicadoresHTML;
        
        // Ativa o carrossel
        new bootstrap.Carousel(carrossel);
    }

    function criarGaleria(sessoes) {
        const galeriaContainer = document.getElementById('galeria-container');
        let galeriaHTML = '';
        
        sessoes.forEach(sessao => {
            galeriaHTML += `
                <div class="row mb-4">
                    <h3 class="mb-3">${sessao.sessao}</h3>
                    ${sessao.fotos.map(foto => `
                        <div class="col-md-3 mb-3">
                            <div class="card h-100">
                                <img src="${foto.caminho}" class="card-img-top" alt="${foto.titulo}">
                                <div class="card-body">
                                    <h5 class="card-title">${foto.titulo}</h5>
                                    <p class="card-text">${foto.descricao}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        });
        
        galeriaContainer.innerHTML = galeriaHTML;
    }

    function mostrarErro(mensagem) {
        const container = document.getElementById('galeria-container') || document.body;
        container.innerHTML = `
            <div class="alert alert-danger">
                <h4>Erro</h4>
                <p>${mensagem}</p>
            </div>
        `;
    }
});