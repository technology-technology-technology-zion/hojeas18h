const previsaoProgramadas = { 
    "8": [19,20,22,23,24,28,32,43,46,50,52,55,56, 57],
    "9": [0,5,8,10,12,13,19,20,26,29,31,34,36,53],
    "12": [11,12,27,28,30,37,38,44,50,51,53,],
    "13": [5,6,9,12,14,17,21,24,28,37,41,42,44,51,58],
    "14": [2,11,13,18,23,24,28,36,37,39,41,42,45,47,51,53,],
    "15": [0,2,9,13,16,21,25,26,32,35,37,38,47],
};

function gerarProtecao() {
    return parseFloat((Math.random() * (3.60 - 2.00) + 2.00).toFixed(2));
}

function gerarSaida() {
    return parseFloat((Math.random() * (8.00 - 5.00) + 5.00).toFixed(2));
}

let exibindoMensagens = false;
let protecaoPorHora = {};
let ultimoMinutoProcessado = null;
let proximoHorarioGlobal = null;

const TEMPO_EXIBICAO = 50000;
const TEMPO_ENTRADA = 3000;

function encontrarProximoHorario(agora) {
    // Converter as chaves e valores da lista de previsões em um único array ordenado
    const horariosOrdenados = Object.entries(previsaoProgramadas)
        .flatMap(([hora, minutos]) => minutos.map(minuto => {
            const horario = new Date();
            horario.setHours(parseInt(hora), minuto, 0, 0);
            return horario;
        }))
        .sort((a, b) => a - b); // Ordenar os horários

    // Procurar o próximo horário na lista ordenada
    for (const horario of horariosOrdenados) {
        if (horario > agora) return horario; // Encontrar o primeiro horário maior que o atual
    }

    // Se nenhum horário for encontrado (já passou por todos), reiniciar no primeiro do próximo dia
    const primeiroHorario = horariosOrdenados[0];
    primeiroHorario.setDate(primeiroHorario.getDate() + 1); // Avançar para o dia seguinte
    return primeiroHorario;
}


function exibirMensagens() {
    const agora = new Date();
    const horaAtual = agora.getHours();
    const minutoAtual = agora.getMinutes();
    const chaveProtecao = `${agora.getFullYear()}-${agora.getMonth()}-${agora.getDate()}-${horaAtual}-${minutoAtual}`;

    if (chaveProtecao === ultimoMinutoProcessado) return;
    ultimoMinutoProcessado = chaveProtecao;

    if (previsaoProgramadas[horaAtual]?.includes(minutoAtual) && !exibindoMensagens) {
        exibindoMensagens = true;
    
        // Manipulação segura do DOM
        const relogio = document.getElementById('relogio'); // Seleciona o relógio
        const imagemGirando = document.getElementById('imagem-girando');
        const waiting = document.getElementById('waiting');
        const mensagem = document.getElementById('mensagem');
    
        // Ocultar relógio ao exibir mensagens
        if (relogio) relogio.style.display = 'none';
        if (imagemGirando) imagemGirando.style.display = 'none';
        if (waiting) waiting.style.display = 'none';
    
        const somAlerta = new Audio('start.mp3');
        somAlerta.play().catch((error) => console.error("Erro ao reproduzir som:", error));
    
        if (!protecaoPorHora[chaveProtecao]) {
            protecaoPorHora[chaveProtecao] = gerarProtecao();
        }
    
        const protecao = protecaoPorHora[chaveProtecao];
        const saida = gerarSaida();
    
        if (mensagem) mensagem.innerText = "ENTRADA CONFIRMADA";
    
        setTimeout(() => {
            // Exibir PROTEÇÃO e SAÍDA
            if (mensagem) {
                mensagem.innerHTML = `
                    <strong>PROTEÇÃO</strong> ${protecao.toFixed(2)}x<br>
                    <strong>SAÍDA</strong> ${saida.toFixed(2)}x
                `;
            }
    
            setTimeout(() => {
                // Restaurar o estado original após exibição
                if (mensagem) mensagem.innerText = '';
                if (relogio) relogio.style.display = 'block'; // Mostrar o relógio novamente
                if (imagemGirando) imagemGirando.style.display = 'block';
                if (waiting) waiting.style.display = 'block';
    
                exibindoMensagens = false; 
            }, TEMPO_EXIBICAO);
        }, TEMPO_ENTRADA);
    }
    
}


function calcularTempoRestante() {
    const agora = new Date();
    if (!proximoHorarioGlobal || proximoHorarioGlobal <= agora) {
        proximoHorarioGlobal = encontrarProximoHorario(agora);
    }

    if (proximoHorarioGlobal) {
        const tempoRestante = proximoHorarioGlobal - agora;
        const horasRestantes = Math.floor(tempoRestante / 3600000); 
        const minutosRestantes = Math.floor((tempoRestante % 3600000) / 60000);
        const segundosRestantes = Math.floor((tempoRestante % 60000) / 1000);

        let tempoFormatado = '';
        if (horasRestantes > 0) tempoFormatado += `${horasRestantes}h `;
        if (minutosRestantes > 0 || horasRestantes > 0) tempoFormatado += `${minutosRestantes}m `;
        tempoFormatado += `${segundosRestantes}s`;

        const relogio = document.getElementById('relogio');
        const proximaPrevia = document.getElementById('proxima-previa');
        const waiting = document.getElementById('waiting');

        if (minutosRestantes > 40) {
            // Adicionando log para verificar minutosRestantes
            console.log("Minutos Restantes (maior que 40):", minutosRestantes);
            
            if (waiting) {
                // Verifica se o texto da mensagem não está configurado corretamente antes de definir
                if (waiting.innerText !== '⏳ANALISANDO O GRÁFICO...') {
                    waiting.innerText = '⏳ANALISANDO O GRÁFICO...';
                }
                // Aplica animação para análise do gráfico
                waiting.style.animation = 'pontosAnimacao 1.5s steps(4, end) infinite';
            }
        
            if (proximaPrevia) {
                proximaPrevia.innerText = `Volte quando for ${proximoHorarioGlobal.getHours()}h ${proximoHorarioGlobal.getMinutes().toString().padStart(2, '0')}`;
                proximaPrevia.style.display = 'block';
            }
        
            if (relogio) relogio.style.display = 'none';
        } else {
            // Adicionando log para verificar minutosRestantes quando for menor que 40
            console.log("Minutos Restantes (menor que 40):", minutosRestantes);
        
            if (waiting) {
                waiting.innerText = 'WAIT FOR THE NEXT SIGNAL';
            }
        
            if (relogio) {
                relogio.innerText = `⌚ ${tempoFormatado}`;
                relogio.style.display = 'block';
            }
        
            if (proximaPrevia) proximaPrevia.style.display = 'block';
        }
    }
}


setInterval(exibirMensagens, 1000);
setInterval(calcularTempoRestante, 1000);



const frases = [
    "NA TRAJETÓRIA DO AVIATOR, O MATRIX É SEU COPILOTO.",
    "O GRÁFICO PODE SER IMPREVISÍVEL, MAS A ESTRATÉGIA NUNCA É.",
    "O FUTURO NÃO É SORTE, É CÁLCULO - CONFIE NO MATRIX V50.",
    "OBVERSA SEMPRE AS MUDANÇAS DO JOGO E AS QUEBRAS DE PADRÃO",
    "PRESTE SEMPRE ATENÇÃO AS MUDANÇAS DO JOGO!"
];


function mostrarFraseAleatoria() {
    const indice = Math.floor(Math.random() * frases.length); 
    const rodape = document.getElementById("rodape"); 
    rodape.textContent = frases[indice]; 
}

mostrarFraseAleatoria();
setInterval(mostrarFraseAleatoria, 10000);
