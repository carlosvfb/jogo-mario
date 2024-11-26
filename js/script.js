const personagem = document.getElementById("personagem");
const inimigo = document.getElementById("inimigo");
const cenario = document.getElementById("cenario");
const botaoReiniciar = document.getElementById("reiniciar");
const botaoIniciar = document.getElementById("iniciar");
const bloco = document.getElementById("bloco");
const tempo = document.getElementById("tempo");
const vidas = document.getElementById("vidas");
const moedas = document.getElementById("moedas");
const pontos = document.getElementById("pontos");
const gameOver = document.querySelectorAll(".desabilitado")
console.log(gameOver);

const audioEsperando = document.getElementById("audioEsperando");
const audioJogoNormal = document.getElementById("audioJogoNormal");
const audioPulo = document.getElementById("audioPulo");
const audioMoeda = document.getElementById("audioMoeda");
const audioVidaExtra = document.getElementById("audioVidaExtra");
const audioPerdeuVida = document.getElementById("audioPerdeuVida");
const audioGameOver = document.getElementById("audioGameOver");
const audioMissaoRapido = document.getElementById("audioMissaoRapido");
const audioTempoAcabando = document.getElementById("audioTempoAcabando");

const larguraCenario = cenario.offsetWidth;
const larguraPersonagem = personagem.offsetWidth;

let posicao = 0;
let direcao = 0;
let velocidade = 12;

let tempoAtual = 400;

let jogoIniciado = false;

let vidasAtual = parseInt(localStorage.getItem("vidasAtual")) || 5;
vidas.textContent = vidasAtual;
let moedasAtual = parseInt(localStorage.getItem("moedasAtual")) || 0;
moedas.textContent = moedasAtual;
let pontosAtual = parseInt(localStorage.getItem("pontosAtual")) || 0;
pontos.textContent = pontosAtual;

let checarMovimentos;
let checarColisaoComInimigo;
let checarColisaoComBloco;
let checarRelogio;
let checarPulo;

let colidiu = false;

function teclaPressionada(event) {
    if (event.key === "ArrowRight") {
        direcao = 1;
        personagem.style.backgroundImage = "url(../image/marioAndandoLadoDireito.gif)";
    } else if (event.key === "ArrowLeft") {
        direcao = -1;
        personagem.style.backgroundImage = "url(../image/marioAndandoLadoEsquerdo.gif)";
    } else if (event.key === " ") {
        personagem.classList.add("puloPersonagem");
        audioPulo.play();
        if (colidiu) {
            clearTimeout(checarPulo);
        } else {
            colidiu = false;
            checarPulo = setTimeout(() => {
                personagem.classList.remove("puloPersonagem");
            }, 500);
        }
    }
}

function teclaSolta(event) {
    if (event.key === "ArrowRight") {
        direcao = 0;
        personagem.style.backgroundImage = "url(../image/marioParadoLadoDireito.png)";
    } else if (event.key === "ArrowLeft") {
        direcao = 0;
        personagem.style.backgroundImage = "url(../image/marioParadoLadoEsquerdo.png)";
    }
}

function atualizarMovimentos() {
    posicao += direcao * velocidade;
    if (posicao < 0) {
        posicao = 0;
    } else if (posicao + larguraPersonagem > larguraCenario) {
        posicao = larguraCenario - larguraPersonagem;
    }
    personagem.style.left = posicao + "px";
}

function colisaoComInimigo() {
    const checarPersonagem = personagem.getBoundingClientRect();
    const checarInimigo = inimigo.getBoundingClientRect();
    if (
        checarInimigo.left < checarPersonagem.right &&
        checarInimigo.right > checarPersonagem.left &&
        checarInimigo.top < checarPersonagem.bottom &&
        checarInimigo.bottom > checarPersonagem.top
    ) {
        clearInterval(checarMovimentos);
        clearTimeout(checarPulo);
        removerTeclas();
        clearInterval(checarRelogio);
        clearInterval(checarColisaoComInimigo);
        vidasAtual--;
        vidas.textContent = vidasAtual;
        localStorage.setItem("vidasAtual", vidasAtual);
        personagem.style.backgroundImage = "url(../image/marioMorto.gif)";
        setTimeout(() => {
            personagem.classList.add("personagem-morto");
        }, 700)
        setTimeout(() => {
            personagem.style.display = "none";
        },1900)
        inimigo.style.display = "none";
        colidiu = true;
        audioJogoNormal.volume = 0;
        audioMissaoRapido.volume = 0;
        audioPerdeuVida.play();
        setTimeout(() => {
            checarJogo();
        }, 3500);
    }
}

botaoReiniciar.addEventListener("click", () => {
    moedasAtual = 0;
    moedas.textContent = moedasAtual;
    localStorage.setItem("moedasAtual", moedasAtual);
    pontosAtual = 0;
    pontos.textContent = pontosAtual;
    localStorage.setItem("pontosAtual", pontosAtual);
    vidasAtual = 5;
    vidas.textContent = vidasAtual;
    localStorage.setItem("vidasAtual", vidasAtual);
    location.reload();
})

function colisaoComBloco() {
    const checarPersonagem = personagem.getBoundingClientRect();
    const checarBloco = bloco.getBoundingClientRect();
    if (
        checarBloco.left < checarPersonagem.right &&
        checarBloco.right > checarPersonagem.left &&
        checarBloco.top < checarPersonagem.bottom &&
        checarBloco.bottom > checarPersonagem.top
    ) {
        clearInterval(checarColisaoComBloco);
        moedasAtual++;
        moedas.textContent = moedasAtual;
        localStorage.setItem("moedasAtual", moedasAtual);
        pontosAtual += +10;
        pontos.textContent = pontosAtual;
        localStorage.setItem("pontosAtual", pontosAtual);
        audioMoeda.play();
        checarMoedas();
        bloco.style.top = "475px";
        setTimeout(() => {
            bloco.style.top = "485px";
        }, 100);
        setTimeout(() => {
            checarColisaoComBloco = setInterval(colisaoComBloco, 10);
        }, 500);
    }
}

function checarMoedas() {
    if (moedasAtual === 20 || moedasAtual === 40 || moedasAtual === 50) {
        moedasAtual = 0;
        moedas.textContent = moedasAtual;
        vidasAtual++;
        vidas.textContent = vidasAtual;
        audioVidaExtra.play();
    }
}

function relogio() {
    tempoAtual--;
    tempo.textContent = tempoAtual;
    if (tempoAtual === 100) {
        audioJogoNormal.volume = 0;
        audioTempoAcabando.play();
        setTimeout(() => {
            audioJogoNormal.volume = 0;
            audioTempoAcabando.volume = 0;
            audioMissaoRapido.play();
        }, 3000)
    } else if (tempoAtual === 0) {
        removerTeclas()
        clearInterval(checarRelogio);
        personagem.style.backgroundImage = "url(../image/marioMorto.gif)";
        setTimeout(() => {
            personagem.classList.add("personagem-morto");
        }, 700)
        setTimeout(() => {
            personagem.style.display = "none";
        },1900)
        inimigo.style.display = "none";
        audioEsperando.pause();
        audioJogoNormal.pause();
        audioMissaoRapido.pause();
        audioPerdeuVida.play();
        setTimeout(() => {
            botaoReiniciar.style.display = "block";
            gameOver[1].classList.remove("desabilitado");
            gameOver[0].classList.remove("desabilitado");
            audioGameOver.play();
        }, 2100);
        vidasAtual = 0;
        vidas.textContent = vidasAtual;
    }
}

function checarJogo() {
    if (vidasAtual >= 1) {
        location.reload();
    } else {
        botaoReiniciar.style.display = "block";
        gameOver[1].classList.remove("desabilitado");
        gameOver[0].classList.remove("desabilitado");
        console.log(gameOver);
        audioEsperando.pause();
        audioJogoNormal.pause();
        audioMissaoRapido.pause();
        audioGameOver.play();
    }
}

function removerTeclas() {
    document.removeEventListener("keydown", teclaPressionada);
    document.removeEventListener("keyup", teclaSolta);
}

botaoIniciar.addEventListener("click", () => {
    botaoIniciar.style.display = "none";
    inimigo.classList.add("animarInimigo");
    document.addEventListener("keydown", teclaPressionada);
    document.addEventListener("keyup", teclaSolta);
    checarMovimentos = setInterval(atualizarMovimentos, 50);
    checarColisaoComBloco = setInterval(colisaoComBloco, 10);
    checarColisaoComInimigo = setInterval(colisaoComInimigo, 10);
    checarRelogio = setInterval(relogio, 1000);
    jogoIniciado = true;
    audioEsperando.volume = 0;
    audioJogoNormal.play();
})

document.addEventListener("keydown", () => {
    if (!jogoIniciado && event.key === "Enter") {
        botaoIniciar.style.display = "none";
        inimigo.classList.add("animarInimigo");
        document.addEventListener("keydown", teclaPressionada);
        document.addEventListener("keyup", teclaSolta);
        checarMovimentos = setInterval(atualizarMovimentos, 50);
        checarColisaoComBloco = setInterval(colisaoComBloco, 10);
        checarColisaoComInimigo = setInterval(colisaoComInimigo, 10);
        checarRelogio = setInterval(relogio, 1000);
        jogoIniciado = true;
        audioEsperando.volume = 0;
        audioJogoNormal.play();
    } else if (jogoIniciado && event.key === "Enter") {
        alert("O Jogo ja foi iniciado");
    }
})
