let displayValue = '0';           // Current value shown on display
let firstOperand = null;          // First number in calculation
let waitingForNewOperand = false; // Flag to track if waiting for new input
let operator = null;              // Current mathematical operator
let lastOperation = null;         // Store last operation for repeat calculations

// Get display element reference
const display = document.getElementById('display');

function updateDisplay() {
    display.textContent = displayValue;
}

/**
 * Handle number input from calculator buttons
 * @param {string} num - The number string to input
 */
function inputNumber(num) {
    if (waitingForNewOperand) {
        displayValue = num;
        waitingForNewOperand = false;
    } else {
        displayValue = displayValue === '0' ? num : displayValue + num;
    }
    updateDisplay();
}

/**
 * Handle decimal point input
 * Prevents multiple decimal points in a single number
 */
function inputDecimal() {
    if (waitingForNewOperand) {
        displayValue = '0.';
        waitingForNewOperand = false;
    } else if (displayValue.indexOf('.') === -1) {
        displayValue += '.';
    }
    updateDisplay();
}

/**
 * Handle operator input (+, -, *, /)
 * @param {string} nextOperator - The operator to apply
 */
function inputOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    // If this is the first operand, store it
    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        // If there's already an operator, perform the calculation
        const currentValue = firstOperand || 0;
        const newValue = performCalculation(operator, currentValue, inputValue);

        displayValue = String(newValue);
        firstOperand = newValue;
        updateDisplay();
    }

    waitingForNewOperand = true;
    operator = nextOperator;

    // Visual feedback for operator selection
    highlightOperator(nextOperator);
}

/**
 * Perform mathematical calculations
 * @param {string} operator - The mathematical operator
 * @param {number} firstOperand - First number
 * @param {number} secondOperand - Second number
 * @returns {number} - Result of the calculation
 */
function performCalculation(operator, firstOperand, secondOperand) {
    switch (operator) {
        case '+':
            return firstOperand + secondOperand;
        case '-':
            return firstOperand - secondOperand;
        case '*':
            return firstOperand * secondOperand;
        case '/':
            // Handle division by zero
            if (secondOperand === 0) {
                alert('Error: Cannot divide by zero!');
                return firstOperand;
            }
            return firstOperand / secondOperand;
        default:
            return secondOperand;
    }
}


function calculate() {
    const inputValue = parseFloat(displayValue);

    if (firstOperand !== null && operator && !waitingForNewOperand) {
        const newValue = performCalculation(operator, firstOperand, inputValue);
        

        lastOperation = {
            operator: operator,
            operand: inputValue
        };

        displayValue = String(newValue);
        firstOperand = null;
        operator = null;
        waitingForNewOperand = true;
        
        // Add visual feedback animation
        display.parentElement.classList.add('flash-animation');
        setTimeout(() => {
            display.parentElement.classList.remove('flash-animation');
        }, 300);
        
        updateDisplay();
    }
}


function clearDisplay() {
    displayValue = '0';
    firstOperand = null;
    waitingForNewOperand = false;
    operator = null;
    lastOperation = null;
    
    // Remove any active operator highlighting
    const operatorButtons = document.querySelectorAll('[data-operator]');
    operatorButtons.forEach(btn => btn.classList.remove('active-operator'));
    
    updateDisplay();
}

function deleteLast() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    updateDisplay();
}

/**
 * Highlight the currently active operator button
 * @param {string} op - The operator to highlight
 */
function highlightOperator(op) {
    const operatorButtons = document.querySelectorAll('[data-operator]');
    operatorButtons.forEach(btn => {
        btn.classList.remove('active-operator');
        if (btn.dataset.operator === op) {
            btn.classList.add('active-operator');
        }
    });
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Handle number keys (0-9)
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    }
    // Handle operator keys
    else if (key === '+') {
        inputOperator('+');
    }
    else if (key === '-') {
        inputOperator('-');
    }
    else if (key === '*') {
        inputOperator('*');
    }
    else if (key === '/') {
        event.preventDefault(); // Prevent browser's default search behavior
        inputOperator('/');
    }
    // Handle decimal point
    else if (key === '.' || key === ',') {
        inputDecimal();
    }
    // Handle equals/enter key
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    // Handle clear operations
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    }
    // Handle backspace/delete
    else if (key === 'Backspace' || key === 'Delete') {
        deleteLast();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    console.log('Calculator initialized successfully!');
    alert('Welcome to the Calculator! Use number keys, operators, and Enter to calculate.');
    document.body.focus();
});

window.addEventListener('resize', function() {
    console.log('Window resized - Calculator remains responsive');
});


window.addEventListener('error', function(event) {
    console.error('Calculator error:', event.error);
    alert('An error occurred in the calculator. Please try again.');
    clearDisplay();
});