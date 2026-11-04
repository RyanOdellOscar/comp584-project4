// Javascript for the calculator app
var currentText = document.querySelector('.current-value');
var currentValue = 0;
const clear = document.querySelector('.clear-button');
const back = document.querySelector('.back-button');
let operatorButtons = document.querySelectorAll('.operator-button');
let numberButtons = document.querySelectorAll('.number-button, .zero-button');
const equals = document.querySelector('.equals-button');
var pushedOperator = false;
var limitReached = false;
var resultFound = false;

// array of numbers and operators in the calculator with max length of 10
let numbers = [];


numberButtons.forEach(button => {
    console.log(button.textContent);
    button.addEventListener('click', () => {
        if (!limitReached && !resultFound) {
            addDigit(parseInt(button.textContent));
        }
    })
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => addOperator(button.textContent));
})

clear.addEventListener('click', () => {
    limitReached = false;
    pushedOperator = false;
    resultFound = false;
    numbers = [];
    currentValue = 0;
    currentText.textContent = currentValue;
})

back.addEventListener('click', () => {
    limitReached = false;
    if (currentValue > 0) {
        currentValue = Math.floor(currentValue / 10);
    } else if (pushedOperator || typeof numbers[numbers.length - 1] === 'string') {
        numbers.pop();
        currentValue = numbers.pop() || 0;
        pushedOperator = false;
    }
    updateDisplay();
})

// continues adding digits as long as no operator is pressed and only pushes the final number
// the limit for a single number is 15 digits otherwise the numbers go off the display
function addDigit(value) {
    if (currentValue.toString().length < 15 && currentText.textContent.length < 15) {
        currentValue = currentValue * 10 + value;
        pushedOperator = false;
        updateDisplay();
    } else {
        limitReached = true;
        currentText.textContent = "limit reached";
    }
}

// allows only one operator between numbers and pushes it to operators array
function addOperator(operator) {
    if (!pushedOperator && !limitReached) {
        numbers.push(currentValue);
        numbers.push(operator);
        currentValue = 0;
        currentText.textContent += " " + operator + " ";
        pushedOperator = true;
        resultFound = false;
    }
}

equals.addEventListener('click', () => {
    if (!pushedOperator && !limitReached) {
        numbers.push(currentValue);
        currentValue = evaluateExpression(numbers);
        numbers = [];
        updateDisplay();
    }
});

function evaluateExpression(numbers) {
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i += 2) {
        const operator = numbers[i];
        const nextNumber = numbers[i + 1];
        switch (operator) {
            case '+':
                result += nextNumber;
                break;
            case '-':
                result -= nextNumber;
                break;
            case 'X':
                result *= nextNumber;
                break;
            case '/':
                // round to 2 decimal places to save space
                result /= nextNumber;
                result = Math.round(result * 100) / 100;
                break;
        }
    }
    resultFound = true;
    return result;
}

function updateDisplay() {
    if (numbers.length === 0) {
        currentText.textContent = currentValue;
    } else if (pushedOperator) {
        currentText.textContent = numbers.join(" ") + " ";
    } else {
        currentText.textContent = numbers.join(" ") + " " + currentValue;
    }
}
