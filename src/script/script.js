
let saldo__inicial;  // Esta variável será usada para armazenar o saldo inicial

function startTheDay() {
    const startingBalance = document.querySelector(".input__daily-opening-balance").value;
    if (startingBalance) {
        saldo__inicial = parseFloat(startingBalance);  // Guardando o valor do saldo inicial
        document.getElementById('currentBalance').value = startingBalance;
        document.getElementById('lastWin').textContent = startingBalance;
        document.querySelector(".betting__wins").textContent = "0";
        document.querySelector(".betting__attempts").textContent = "0";
    } else {
        alert("Por favor, insira o saldo da sua banca do início do dia.");
    }
}

function saveInfo() {
    const monthlyGoal = parseFloat(document.getElementById('monthlyGoal').value);
    const daysPlaying = parseFloat(document.getElementById('daysPlaying').value);
    const gamesPerDay = parseFloat(document.getElementById('gamesPerDay').value);

    if (!isNaN(monthlyGoal) && !isNaN(daysPlaying) && !isNaN(gamesPerDay)) {
        const percentageResultPerDay = (monthlyGoal / daysPlaying).toFixed(2);
        const percentageResultPerGame = (percentageResultPerDay / gamesPerDay).toFixed(2);

        document.getElementById('calculateResult').textContent = `A meta diária foi definida como ${percentageResultPerDay} %.`;
        document.getElementById('calculateResult2').textContent = `A meta por jogo foi definida como ${percentageResultPerGame} %.`;
        return { percentageResultPerDay, percentageResultPerGame };
    } else {
        document.getElementById('calculateResult').textContent = "Por favor, preencha todos os campos corretamente.";
        document.getElementById('calculateResult2').textContent = "";
    }
}

function initializeDay() {
    startTheDay();
    const { percentageResultPerDay, percentageResultPerGame } = saveInfo();

    if (!isNaN(percentageResultPerDay) && saldo__inicial) {
        const goalOfTheDayValue = saldo__inicial + (saldo__inicial * percentageResultPerDay / 100);
        document.getElementById('goalOfTheDay').textContent = goalOfTheDayValue.toFixed(2);

        const currentBalance = parseFloat(document.getElementById('currentBalance').value);
        const nextGoalValue = currentBalance + (currentBalance * percentageResultPerGame / 100);
        document.getElementById('nextGoal').textContent = nextGoalValue.toFixed(2);
    }
}

// Agora, vinculamos a função initializeDay ao botão "Iniciar o Dia"
document.querySelector('.button_start-the-day').addEventListener('click', initializeDay);



// ... (other JavaScript code) ...

function onGreenButtonClick() {
    // Step 1: Add +1 to "games won today"
    const gamesWonElement = document.querySelector('.betting__wins');
    let gamesWon = parseInt(gamesWonElement.textContent.trim(), 10) || 0;
    gamesWonElement.textContent = gamesWon + 1;

    // Step 2: Overwrite the "last win" with the current balance value from the input
    const currentBalanceValue = parseFloat(document.getElementById('currentBalance').value);
    const lastWinElement = document.getElementById('lastWin');
    lastWinElement.textContent = currentBalanceValue.toFixed(2);

    // Step 3: Overwrite "number of attempts" with 0
    const attemptsElement = document.querySelector('.betting__attempts');
    attemptsElement.textContent = '0';

    // Step 4: Overwrite the "nextGoal" with the formula: lastWin+(lastWin*calculateResult2)
    const percentageResultPerGameText = document.getElementById('calculateResult2').textContent.trim();
    // Extracting the actual percentage value from the text
    const percentageMatch = percentageResultPerGameText.match(/(\d+(\.\d+)?)/);
    const percentageResultPerGame = percentageMatch ? parseFloat(percentageMatch[0]) : 0;

    if (!isNaN(currentBalanceValue) && !isNaN(percentageResultPerGame)) {
        const nextGoalValue = currentBalanceValue + (currentBalanceValue * percentageResultPerGame / 100);
        document.getElementById('nextGoal').textContent = nextGoalValue.toFixed(2);
    } else {
        console.error('Failed to calculate nextGoal. Check the values of currentBalance and calculateResult2.');
    }
}

// Link the function to the Green button
document.querySelector('.button__green').addEventListener('click', onGreenButtonClick);


// ... (rest of the JavaScript code) ...
function onRedButtonClick() {
    // Step 1: Add +1 to "number of attempts"
    const attemptsElement = document.querySelector('.betting__attempts');
    let attempts = parseInt(attemptsElement.textContent, 10) || 0;
    attemptsElement.textContent = attempts + 1;
}

// Assuming your Red button has the class "button__red", you can attach the event listener like this:
document.querySelector('.button__red').addEventListener('click', onRedButtonClick);

function updateGoalOfTheDay() {
    const calculateResultValue = parseFloat(document.getElementById('calculateResult').textContent);
    const startTheDayValue = parseFloat(document.getElementById('currentBalance').value);
    
    if (!isNaN(calculateResultValue) && !isNaN(startTheDayValue)) {
        const goalOfTheDayValue = calculateResultValue * startTheDayValue + 1;
        document.getElementById('goalOfTheDay').textContent = goalOfTheDayValue.toFixed(2);
    }
}


document.getElementById('oddValue').addEventListener('input', function() {
    const button = document.getElementById('calculateButton');
    if (this.value.trim() === '') {
        button.disabled = true;
    } else {
        button.disabled = false;
    }
});



let oddCaptured, oddMastigada, diferencaDosDois, metaDoJogo, primeiraParte, bestStake;

function extractNumberFromString(str) {
    const matched = str.match(/(\d+(\.\d+)?)/);
    return matched ? parseFloat(matched[0]) : null;
}

function captureOdd() {
    let oddValueStr = document.getElementById('oddValue').value;
    oddValueStr = oddValueStr.replace(',', '.'); // substitui a vírgula por ponto
    oddCaptured = parseFloat(oddValueStr);

    if (oddCaptured) {
        oddMastigada = 1 - oddCaptured;
    }
    console.log("Valor capturado da Odd:", oddCaptured);
    console.log("Odd mastigada:", oddMastigada);
}

function calculateBase() {
    const lastGoal = parseFloat(document.getElementById('nextGoal').textContent);
    const lastWin = parseFloat(document.getElementById('lastWin').textContent);
    const percentageResultPerGameText = document.getElementById('calculateResult2').textContent;
    const extractedNumber = extractNumberFromString(percentageResultPerGameText);

    if (extractedNumber !== null) {
        metaDoJogo = 1 + extractedNumber;
    }

    diferencaDosDois = lastGoal - lastWin;
    
    console.log("Diferença entre LastGoal e LastWin:", diferencaDosDois);
    console.log("Meta do jogo:", metaDoJogo);
}

function segundaCamadaDeCalculo() {
    if (oddMastigada && oddMastigada !== 0 && diferencaDosDois && metaDoJogo) {
        primeiraParte = (diferencaDosDois / oddMastigada) * -1;
        bestStake = primeiraParte; // Removendo a multiplicação por metaDoJogo
        console.log("Primeira parte:", primeiraParte);
        console.log("Melhor stake:", bestStake);
    } else {
        console.error("Erro ao calcular. Valores: oddMastigada =", oddMastigada, ", diferencaDosDois =", diferencaDosDois, ", metaDoJogo =", metaDoJogo);
    }
}

function printResult() {
    if (bestStake) {
        if (bestStake < 0.75) {
            bestStake = 0.75;
        }
        const stakeCalculationResult = document.getElementById('stakeCalculationResult');
        stakeCalculationResult.textContent = `R$ ${bestStake.toFixed(2)}`;
    }
    console.log("Resultado impresso.");
}






function calculateStakeValue() {
    captureOdd();
    calculateBase();
    segundaCamadaDeCalculo();
    printResult();

}



let typingTimer;
document.getElementById('oddValue').addEventListener('input', function() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(calculateStakeValue, 300);
});