function add(num1, num2) {
    return num1 + num2
}

function subtract(num1, num2) {
    return num1 - num2
}

function multiply(num1, num2) {
    return num1 * num2
}

function divide(num1, num2) {
    return num1 / num2
}

function operate(op, num1, num2) {
    switch (op) {
        case '+':
            return add(num1, num2)
            break;
        case '-':
            return subtract(num1, num2)
            break;
        case '*':
            return multiply(num1, num2)
            break;
        case '/':
            if (num2 === 0) {
                buttons.forEach(button => button.setAttribute('disabled', 'true'));
                zero.setAttribute('disabled', 'true');
                return 'Math Error: Can Not Divide By Zero';
            } else {
                return divide(num1, num2)
            }
            break;
    }
}

const buttons = document.querySelectorAll('.btn');
const zero = document.querySelector('#zero');
const clear = document.querySelector('#clear')

clear.addEventListener('click', () => {
    clearDisplay();
})

zero.addEventListener('click', (e) => {
    populateNumber(e.target.textContent);
})

buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
        populateNumber(e.target.textContent);
    })
})

//Keyboard Support
document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) {
        populateNumber(e.key);
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '.') {
        populateNumber(e.key);
    } else if (e.key === 'e') {
        populateNumber('=');
    } else if (e.key === 'Backspace') {
        populateNumber('Del');
    } else if (e.key === 'c') {
        clearDisplay();
    }

})


const display = document.getElementById('displayContent');
const displayOp = document.getElementById('displayOperator');
let number = '';        //buffer
let operator = null;
let memory = [];
function populateNumber(e) {
    if (parseFloat(e) || e === '0') {
        number += e;
        display.textContent = +number;
    }
    //Triggered when a input in not a number (either to save the number or to perform an operation)
    if (isNaN(parseFloat(e))) {
        if (number != '' && number !== undefined && number !== null) {
            //Checks for floats or backspace
            switch (e) {
                case '.':
                    if (number.includes('.')) {
                        break;
                    } else {
                        number += e
                        display.textContent = number
                    }
                    break;
                case 'Del':
                    number = number.slice(0, -1);
                    if (number === '') {
                        number = 0;
                    }
                    display.textContent = number;
                    break;
                default:
                    memory.push(number);
            }
        }
        //Keeps memory in as a length of 2 by removing the first element if exceeded the limit
        if (memory.length > 2) {
            memory.splice(0, 1);
        }
        switch (e) {
            case '=':
                //Checks if operator is null due to a prevoius EQUALS press, and checks if memory is filled
                if (memory.length >= 2 && operator != null) {
                    number = operate(operator, parseFloat(memory[0]), parseFloat(memory[1]));
                    if (typeof number === 'string') {
                        display.textContent = number;
                    } else {
                        display.textContent = +number.toFixed(6); //Rounds to 6 decimal places and removes trailing zeros
                    }
                    operator = null;
                    memory = [];
                    memory.push(number);
                    number = '';
                    displayOp.textContent = '';
                } else if (operator == null) {
                    break;
                } else {
                    number = '';
                }
                break;
            case '.':
                break;
            case 'Del':
                break;
            default:
                if (memory.length >= 2) {
                    if (operator == null) {
                        //In case of trying to perfrom an operation after pressing EQUALS
                        operator = e;
                    }
                    number = operate(operator, parseFloat(memory[0]), parseFloat(memory[1]))
                    if (typeof number === 'string') {
                        display.textContent = number;
                    } else {
                        display.textContent = +number.toFixed(6);
                    }
                    memory = [];
                    memory.push(number);
                    number = '';
                } else {
                    number = '';
                }
                displayOp.textContent = e;
                operator = e;
        }
    }

}


function clearDisplay() {
    number = '';
    memory = [];
    operator = null;
    display.textContent = '0';
    displayOp.textContent = '';
    buttons.forEach(button => button.removeAttribute('disabled'));
    zero.removeAttribute('disabled');
}
