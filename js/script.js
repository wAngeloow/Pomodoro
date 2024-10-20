// Seleciona a barra de progresso circular e o elemento que exibirá o valor do progresso
const circularProgressBar = document.querySelector("#circularProgressBar");
const circularProgressBarNumber = document.querySelector("#circularProgressBar .progress-value");

// Seleciona os botões que mudam o tipo de timer: Pomodoro, Break e Timer
const buttonTypePomodoro = document.querySelector("#buttonTypePomodoro");
const buttonTypeBreak = document.querySelector("#buttonTypeBreak");
const buttonTypeTimer = document.querySelector("#buttonTypeTimer");

// Seleciona o botão de iniciar o timer e o ícone dentro dele
const startButton = document.querySelector("#startButton");
const startButtonIcon = document.querySelector("#startButton i");

// Cria um objeto de áudio que tocará um alarme ao final do timer
const audio = new Audio('audio/alarm.mp3'); // Verifique se o caminho do arquivo está correto

// Define os tempos em segundos para o timer Pomodoro e para o intervalo
const pomodoroTimerInSeconds = 1500; // Alterar para 1500 para 25 minutos
const breakTimerInSeconds = 300; // Alterar para 300 para 5 minutos

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
    startButtonIcon.classList.remove("fa-play");
    startButtonIcon.classList.add("fa-pause");

    progressInterval = setInterval(() => {
        if (timerValue > 0) { // Verifica se o timer ainda está acima de 0
            timerValue--;
        }

        if (timerValue <= 0) {
            audio.play(); // Toca o som ao final do timer
            if (pomodoroType === TIMER_TYPE_POMODORO) {
                pomodoroType = TIMER_TYPE_BREAK;
                timerValue = breakTimerInSeconds; // Reinicia para o tempo de descanso
                
                // Simula um clique no botão de descanso
                buttonTypeBreak.click(); // Muda o tipo de timer para descanso
            } else if (pomodoroType === TIMER_TYPE_BREAK) {
                // Para o timer ao final do descanso e toca o som
                audio.play(); // Toca o som ao final do descanso
                stopTimer(); 
                // Simula um clique no botão de Pomodoro
                buttonTypePomodoro.click(); // Muda o tipo de timer para Pomodoro
            }
        }
        

        setInfoCircularProgressBar();
    }, 1000);
}

// Para o timer e reinicializa os ícones
const stopTimer = () => {
    clearInterval(progressInterval);
    isTimerRunning = false;
    startButtonIcon.classList.remove("fa-pause");
    startButtonIcon.classList.add("fa-play");
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

    startButtonIcon.classList.remove("fa-pause");
    startButtonIcon.classList.add("fa-play");
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

// Adiciona eventos ao botão de iniciar o timer e ao ícone dentro dele
const handleStartButtonClick = () => {
    startTimer();
};

startButton.addEventListener('click', handleStartButtonClick);
startButtonIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    handleStartButtonClick();
});

// Adiciona eventos aos botões de tipo de timer
buttonTypePomodoro.addEventListener('click', () => setPomodoroType(TIMER_TYPE_POMODORO));
buttonTypeBreak.addEventListener('click', () => setPomodoroType(TIMER_TYPE_BREAK));
buttonTypeTimer.addEventListener('click', () => setPomodoroType(TIMER_TYPE_TIMER));
