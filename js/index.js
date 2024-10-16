// Seleciona a barra de progresso circular e o elemento que exibirá o valor do progresso
const circularProgressBar = document.querySelector("#circularProgressBar");
const circularProgressBarNumber = document.querySelector("#circularProgressBar .progress-value");

// Seleciona os botões que mudam o tipo de timer: Pomodoro, Break e Timer
const buttonTypePomodoro = document.querySelector("#buttonTypePomodoro");
const buttonTypeBreak = document.querySelector("#buttonTypeBreak");
const buttonTypeTimer = document.querySelector("#buttonTypeTimer");

// Seleciona o botão de iniciar o timer
const startButton = document.querySelector("#startButton i");

// Cria um objeto de áudio que tocará um alarme ao final do timer
const audio = new Audio('audio/alarm.mp3');

// Define os tempos em segundos para o timer Pomodoro e para o intervalo
const pomodoroTimerInSeconds = 3; // Alterar para 1500 para 25 minutos
const breakTimerInSeconds = 2; // Alterar para 300 para 5 minutos

// Tipos de timer que podem ser utilizados
const TIMER_TYPE_POMODORO = 'POMODORO';
const TIMER_TYPE_BREAK = 'BREAK';
const TIMER_TYPE_TIMER = 'TIMER';

// Variáveis para controlar o estado do timer e do progresso
let progressInterval;
let pomodoroType = TIMER_TYPE_POMODORO; // Começa com o tipo Pomodoro
let timerValue = pomodoroTimerInSeconds; // Inicia com o tempo do Pomodoro
let isTimerRunning = false; // Indica se o timer está em execução

// Função que formata um número em string no formato mm:ss
function formatNumberInStringMinute(number) {
    const minutes = Math.trunc(number / 60).toString().padStart(2, '0');
    const seconds = Math.trunc(number % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

// Atualiza o título da página com o tempo restante formatado
const updatePageTitle = () => {
    document.title = formatNumberInStringMinute(timerValue);
}

// Inicia o timer, gerenciando seu estado e ícones
const startTimer = () => {
    if (isTimerRunning) {
        stopTimer();
        return;
    }

    isTimerRunning = true;
    startButton.classList.remove("fa-play");
    startButton.classList.add("fa-pause");

    progressInterval = setInterval(() => {
        if (pomodoroType === TIMER_TYPE_POMODORO || pomodoroType === TIMER_TYPE_BREAK) {
            timerValue--;
            if (timerValue < 0) {
                audio.play();
                if (pomodoroType === TIMER_TYPE_POMODORO) {
                    pomodoroType = TIMER_TYPE_BREAK;
                    timerValue = breakTimerInSeconds;
                } else {
                    pomodoroType = TIMER_TYPE_POMODORO;
                    timerValue = pomodoroTimerInSeconds;
                }
            }
        } else if (pomodoroType === TIMER_TYPE_TIMER) {
            timerValue++;
        }

        setInfoCircularProgressBar();
    }, 1000);
}

// Para o timer e reinicializa os ícones
const stopTimer = () => {
    clearInterval(progressInterval);
    isTimerRunning = false;
    startButton.classList.remove("fa-pause");
    startButton.classList.add("fa-play");
}

// Reinicializa o timer de acordo com o tipo atual
const resetTimer = () => {
    clearInterval(progressInterval);
    isTimerRunning = false;

    if (pomodoroType === TIMER_TYPE_POMODORO) {
        timerValue = pomodoroTimerInSeconds;
    } else if (pomodoroType === TIMER_TYPE_BREAK) {
        timerValue = breakTimerInSeconds;
    } else {
        timerValue = 0;
        circularProgressBar.style.background = `conic-gradient(var(--red-secondary) 360deg, var(--gray) 0deg)`;
    }

    setInfoCircularProgressBar();

    startButton.classList.remove("fa-pause");
    startButton.classList.add("fa-play");
}

// Atualiza a barra de progresso circular e o título da página
const setInfoCircularProgressBar = () => {
    circularProgressBarNumber.textContent = `${formatNumberInStringMinute(timerValue)}`;
    if (pomodoroType === TIMER_TYPE_TIMER) {
        circularProgressBar.style.background = `conic-gradient(var(--red-secondary) 360deg, var(--gray) 0deg)`;
    } else {
        circularProgressBar.style.background = `conic-gradient(var(--red-secondary) ${(timerValue / (pomodoroType === TIMER_TYPE_POMODORO ? pomodoroTimerInSeconds : breakTimerInSeconds)) * 360}deg, var(--gray) 0deg)`;
    }
    updatePageTitle();
}

// Define o tipo de timer e reinicializa o timer
const setPomodoroType = (type) => {
    stopTimer();
    pomodoroType = type;

    buttonTypePomodoro.classList.toggle("active", type === TIMER_TYPE_POMODORO);
    buttonTypeBreak.classList.toggle("active", type === TIMER_TYPE_BREAK);
    buttonTypeTimer.classList.toggle("active", type === TIMER_TYPE_TIMER);

    resetTimer();
}

// Adiciona um evento ao botão de iniciar o timer
startButton.addEventListener('click', startTimer);
