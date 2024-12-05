const previsaoProgramadas = { 
    "0": [3,6,19,23,39,49,52,53,56,58],
    "1": [4,8,12,13,14,47,50,57],
    "2": [51,54,58],
    "3": [11,17,20,23,27,28,32,34,44,58],
    "4": [12,27,40],
    "5": [7,20,28,30,54],
    "6": [2,14,48,51],
    "7": [35,41,50,51,55,58],
    "8": [0,1,28,40,45,57],
    "9": [2,4,8,9,13,15,18,22,24,33,36,37,38,39,41,42,46,47,49,51,53,55,56],
    "10": [2.5,7,9,14,16,19,22,23,28,32,33,37,38,40,42,43,45,48,50,53,55,56],
    "11": [0,1,4,5,11 ,15,17 ,20,21,25,32 ,33 ,35,37,38 ,39 ,43,46,49,51],
    "12": [10,13,14,16,18,20,30,31,36,37,38,55,56],
    "13": [5,10,16,18,24,27,28,33,37,40,48,50,55,57],
    "14": [0,2,5,15,17,19,28,36,37,41,43,55],
    "15": [0,2,4,7,8,11,13,15,18,19,22,27,29,31,32],
    "16": [23,28,32,33,35,42,43,47,50,57],
    "17": [4,8,22,25,30,38,40,42,43],
    "18": [41,45,48,50,53,56],
    "19": [9,6,20,23,26,28,31,36,41,43,45],
    "20": [0,11,21,28,31,36,37,43,53],
    "21": [8,16,23,24,26,28,51,53,55,56],
    "22": [3,16,18,19,23,44,49,54,56],
    "23": [2,4,11,12,18,25,30,35,38,45,47,58],
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

        if (!exibindoMensagens) { 
            // Só exibe o relógio quando não está exibindo mensagens
            if (relogio) {
                relogio.innerText = `⌚ ${tempoFormatado}`;
                relogio.style.display = 'block';
            }
        } else {
            // Certifica-se de que o relógio está oculto durante a exibição de mensagens
            if (relogio) relogio.style.display = 'none';
        }

        if (minutosRestantes > 40) {
            if (waiting) {
                waiting.innerText = '⏳ANALISANDO O GRÁFICO...';
                waiting.style.animation = 'pontosAnimacao 1.5s steps(4, end) infinite';
            }
        
            if (proximaPrevia) {
                proximaPrevia.innerText = `Volte quando for ${proximoHorarioGlobal.getHours()}h ${proximoHorarioGlobal.getMinutes().toString().padStart(2, '0')}`;
                proximaPrevia.style.display = 'block';
            }
        } else {
            if (waiting) {
                waiting.innerText = 'WAIT FOR THE NEXT SIGNAL';
            }
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



