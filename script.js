const display = document.querySelector('.display');
const buttons = document.querySelector('.buttons');
const shiftBottun = document.querySelector('.shift-button');
const historyButton = document.querySelector('.history-button');
const historyModal = document.querySelector('.history-modal');
const historyOverlay = document.querySelector('.history-overlay');
const historyContent = document.querySelector('.history-content')
const closeHistoryButton = document.querySelector('.close-history');

let displayValue = '';
let firstOperand = null;
let operator = null;
let secondOperand = null;
let inShiftMode = false;
let history = [];

const buttonsDefinition = [
   { label: '7', type: 'number' },
   { label: '8', type: 'number' },
   { label: '9', type: 'number' },
   { label: '+', unary: false, shiftLabel: '!', shiftUnary: true, type: 'operator', func: (a, b) => a + b, shiftFunc: factoriel},
   { label: '4', type: 'number' },
   { label: '5', type: 'number' },
   { label: '6', type: 'number' },
   { label: '-', unary: false, shiftLabel: 'x³', shiftUnary: true, type: 'operator', func: (a, b) => a - b, shiftFunc: (a) => a*a*a },
   { label: '1', type: 'number' },
   { label: '2', type: 'number' },
   { label: '3', type: 'number' },
   { label: 'x', unary: false, shiftLabel: 'log', shiftUnary: true, type: 'operator', func: (a, b) => a * b, shiftFunc: (a) => Math.log10(a) },
   { label: '=', type: 'equals' },
   { label: '0', type: 'number' },
   { label: 'x²', unary: true, shiftLabel:'√', shiftUnary: true, type: 'operator', func: (a) => a * a, shiftFunc: (a) => Math.sqrt(a) },
   { label: '/', unary: false, shiftLabel:'³√', shiftUnary: true, type: 'operator', func: (a, b) => b === 0 ? 'MATH ERROR' : a / b, shiftFunc: (a) => Math.cbrt(a) }
];

function factoriel(a) {
   let result = 1;
   for(let i = 1; i <= a; i++)
      result *= i;
   return result;
}

buttonsDefinition.forEach(definition => {
   const button = document.createElement('button');
   button.textContent = definition.label;

   button.addEventListener('click', () => handleClick(definition));

   buttons.appendChild(button);
});

function handleClick(button) {
   if (button.type === 'number') {
      displayValue += button.label
      display.textContent = displayValue;
   }

   if (button.type === 'operator') {
      if (displayValue === '')
         return;

      firstOperand = Number(displayValue);
      operator = button;
      displayValue = '';
      display.textContent = displayValue;
   }

   if (button.type === 'equals') {
      if (operator === null)
         return;

      let result;

      if (inShiftMode && operator.shiftFunc) {
         result = operator.shiftFunc(firstOperand);
      } else if (!inShiftMode && operator.label === 'x²'){
         result = operator.func(firstOperand);
      } else {
         if (displayValue === '') return;
         secondOperand = Number(displayValue);
         result = operator.func(firstOperand, secondOperand);
      }

      display.textContent = result;
      displayValue = result.toString();

      if (operator.unary || (inShiftMode && operator.shiftUnary)) {
         addToHistory(firstOperand, operator, undefined, result);
      } else {
         addToHistory(firstOperand, operator, secondOperand, result);
}

      operator = null;
   }
}

shiftBottun.addEventListener('click', () => {
   inShiftMode = !inShiftMode;
   updateButtons();
});

function updateButtons() {
   document.querySelectorAll('.buttons button').forEach((btn, index) => {
      const data = buttonsDefinition[index];
      btn.textContent = inShiftMode && data.shiftLabel ? data.shiftLabel : data.label;
   })
}

function addToHistory(first, op, second, result) {
   history.push({first, op, second, result});
   renderHistory();
}

function renderHistory() {
   historyContent.innerHTML = '';
   history.forEach(entry => {
      const div = document.createElement('div');
      div.classList.add('history-entry');
      div.textContent = entry.second !== undefined
         ? `${entry.first} ${entry.op.label} ${entry.second} = ${entry.result}`
         : `${entry.op.shiftLabel || entry.op.label}(${entry.first}) = ${entry.result}`;
      historyContent.appendChild(div);
   });
}

historyButton.addEventListener('click', () => {
  historyModal.classList.add('active');
});

closeHistoryButton.addEventListener('click', () => {
  historyModal.classList.remove('active');
});

historyModal.addEventListener('click', (e) => {
  if (!historyOverlay.contains(e.target)) {
    historyModal.classList.remove('active');
  }
});


