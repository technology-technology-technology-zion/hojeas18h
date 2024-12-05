const previsaoProgramadas = { 
    "0": [],
    "1": [0,12,19,20,21,25,33,36,41,58],
    "2": [2,4],
    "3": [3,6,11,14,17,20,24,31,34,44,46,47,53,57,59],
    "4": [17,49,57],
    "5": [3,18,22,31,35,40,44,59],
    "6": [11,12,21,52],
    "7": [19,22,24,26,28,29,33,42,49,54],
    "8": [1,2,13,15,27,32,41,53,55],
    "9": [13,19,29,46,49,57],
    "10": [1, 16, 28, 51],
    "11": [23,42],
    "12": [1,16,28,51],
    "13": [4,7,10,18,20,23,26,27,29,24,33,34,38,41,43,45,49,55,58,59],
    "14": [1,2,8,9,17,20,21,30,31,37,40,49,51,53,54,59],
    "15": [0,2,4,6,8,9,12,13,14,16,17,22,27,30,32,37,47,59],
    "16": [7,11,38,40,46,48,49,52,53,56,59],
    "17": [0,2,4,8,11,19,26,32,50,58,59],
    "18": [0,5,7,17,18,20,23,28,32,34,37,39,54],
    "19": [3,6,8,11,24,30,32,36,38,39,41,45,51],
    "20": [6,10,16,19,20,22,24,25,28,43,45,53,55,59],
    "21": [8,9,11,18,22,27,32,34,37,45,47,48,52,54,56],
    "22": [8,9,11,18,24,28,29,37,39,42,55],
    "23": [8,9,11,18,22,27,29,37,39,42,44],
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


