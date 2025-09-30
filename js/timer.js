// --- Histórico ---
const historyList = document.getElementById('history-list');
let history = [];

/**
 * Adiciona um registro ao histórico
 * @param {string} tipo - 'Cronômetro' ou 'Temporizador'
 * @param {string} tempo - tempo final
 */
function addToHistory(tipo, tempo) {
	const item = { tipo, tempo, id: Date.now() };
	history.unshift(item); // mais recente no topo
	renderHistory();
}

/**
 * Remove um item do histórico pelo id
 */
function removeFromHistory(id) {
	history = history.filter(item => item.id !== id);
	renderHistory();
}

/**
 * Renderiza o histórico na tela
 */
function renderHistory() {
	historyList.innerHTML = '';
	history.forEach(item => {
		const li = document.createElement('li');
		li.innerHTML = `<strong>${item.tipo}</strong>: ${item.tempo} <button class="remove-history" data-id="${item.id}">Apagar</button>`;
		historyList.appendChild(li);
	});
	// Adiciona eventos aos botões de apagar
	document.querySelectorAll('.remove-history').forEach(btn => {
		btn.onclick = function() {
			const id = Number(this.getAttribute('data-id'));
			removeFromHistory(id);
		};
	});
}
/**
 * Timer e Temporizador em JavaScript
 * Autores: Abdias, Vinicius Palmieri e Vinicius Fernando
 *
 * Este script implementa um timer (cronômetro) e um temporizador (contagem regressiva)
 * com funções de iniciar, pausar e resetar. O tempo é exibido no formato HH:MM:SS:ms.
 */

// Seletores dos elementos do DOM
const display = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Cria e insere controles para modo e entrada de tempo
let mode = 'timer'; // 'timer' (cronômetro) ou 'temporizador'
let inputDiv = document.getElementById('timer-input-div');
if (!inputDiv) {
	inputDiv = document.createElement('div');
	inputDiv.id = 'timer-input-div';
	inputDiv.style.marginBottom = '15px';
	inputDiv.innerHTML = `
		<label for="mode-select">Modo:</label>
		<select id="mode-select">
			<option value="timer">Cronômetro</option>
			<option value="temporizador">Temporizador</option>
		</select>
		<input type="text" id="input-time" placeholder="HH:MM:SS" style="display:none; width:110px; margin-left:10px;">
	`;
	document.querySelector('.timer-container').insertBefore(inputDiv, display);
}
const modeSelect = document.getElementById('mode-select');
const inputTime = document.getElementById('input-time');

// Variáveis de controle
let timer = null;
let elapsedMs = 0; // milissegundos
let running = false;
let countdownTarget = 0; // usado no temporizador

/**
 * Atualiza o display no formato HH:MM:SS:ms
 */
function updateDisplay() {
	let ms = elapsedMs % 1000;
	let totalSeconds = Math.floor(elapsedMs / 1000);
	let hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
	let minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
	let seconds = String(totalSeconds % 60).padStart(2, '0');
	let msStr = String(Math.floor(ms / 10)).padStart(2, '0'); // mostra 2 dígitos de ms
	display.textContent = `${hours}:${minutes}:${seconds}:${msStr}`;
}

/**
 * Inicia o timer ou temporizador
 */
function startTimer() {
	if (!running) {
		if (mode === 'temporizador' && elapsedMs <= 0) {
			alert('Defina o tempo do temporizador!');
			return;
		}
		let lastTime = Date.now();
		timer = setInterval(() => {
			const now = Date.now();
			const delta = now - lastTime;
			lastTime = now;
			if (mode === 'timer') {
				elapsedMs += delta;
			} else if (mode === 'temporizador') {
				elapsedMs -= delta;
				if (elapsedMs <= 0) {
					elapsedMs = 0;
					updateDisplay();
					pauseTimer();
					// Salva no histórico o tempo decorrido
					let decorridoMs = countdownTarget;
					let ms = decorridoMs % 1000;
					let totalSeconds = Math.floor(decorridoMs / 1000);
					let hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
					let minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
					let seconds = String(totalSeconds % 60).padStart(2, '0');
					let msStr = String(Math.floor(ms / 10)).padStart(2, '0');
					addToHistory('Temporizador', `${hours}:${minutes}:${seconds}:${msStr}`);
					alert('Tempo esgotado!');
					return;
				}
			}
			updateDisplay();
		}, 10); // atualiza a cada 10ms
		running = true;
	}
}

/**
 * Pausa o timer/temporizador
 */
function pauseTimer() {
	if (running) {
		clearInterval(timer);
		running = false;
	}
}

/**
 * Reseta o timer/temporizador
 */
function resetTimer() {
	// Salva no histórico antes de resetar, se não for zero
	if (mode === 'timer' && elapsedMs > 0) {
		let ms = elapsedMs % 1000;
		let totalSeconds = Math.floor(elapsedMs / 1000);
		let hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
		let minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
		let seconds = String(totalSeconds % 60).padStart(2, '0');
		let msStr = String(Math.floor(ms / 10)).padStart(2, '0');
		addToHistory('Cronômetro', `${hours}:${minutes}:${seconds}:${msStr}`);
	} else if (mode === 'temporizador' && countdownTarget > 0 && elapsedMs !== countdownTarget) {
		// Calcula o tempo decorrido: tempo inicial - tempo restante
		let decorridoMs = countdownTarget - elapsedMs;
		if (decorridoMs < 0) decorridoMs = 0;
		let ms = decorridoMs % 1000;
		let totalSeconds = Math.floor(decorridoMs / 1000);
		let hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
		let minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
		let seconds = String(totalSeconds % 60).padStart(2, '0');
		let msStr = String(Math.floor(ms / 10)).padStart(2, '0');
		addToHistory('Temporizador', `${hours}:${minutes}:${seconds}:${msStr}`);
	}
	pauseTimer();
	if (mode === 'timer') {
		elapsedMs = 0;
	} else if (mode === 'temporizador') {
		elapsedMs = countdownTarget;
	}
	updateDisplay();
}

// Eventos dos botões
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Evento para troca de modo
modeSelect.addEventListener('change', function() {
	mode = this.value;
	if (mode === 'temporizador') {
		inputTime.style.display = '';
		elapsedMs = 0;
		updateDisplay();
	} else {
		inputTime.style.display = 'none';
		elapsedMs = 0;
		updateDisplay();
	}
});

// Evento para definir tempo do temporizador
inputTime.addEventListener('change', function() {
	const val = this.value.trim();
	// Aceita HH:MM:SS
	const match = val.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
	if (match) {
		const h = parseInt(match[1], 10);
		const m = parseInt(match[2], 10);
		const s = parseInt(match[3], 10);
		countdownTarget = ((h * 3600) + (m * 60) + s) * 1000;
		elapsedMs = countdownTarget;
		updateDisplay();
	} else {
		alert('Formato inválido! Use HH:MM:SS');
		this.value = '';
	}
});

// Inicializa o display ao carregar a página
updateDisplay();
