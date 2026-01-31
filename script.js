const display = document.querySelector('.display');
const buttons = document.querySelector('.buttons');
const shiftBottun = document.querySelector('.shift-button');
const historyButton = document.querySelector('.history-button');
const historyModal = document.querySelector('.history-modal');
const historyOverlay = document.querySelector('.history-overlay');
const historyContent = document.querySelector('.history-content')
const closeHistoryButton = document.querySelector('.close-history');
const filterInput = document.querySelector('.filter-input');
const filterOperationSelect = document.querySelector('.filter-operation');
const onOffButton = document.querySelector('.on-off');
const clearButton = document.querySelector('.clear-button');
const miniDisplay = document.querySelector('.mini-display');

let displayValue = '';
let firstOperand = null;
let operator = null;
let secondOperand = null;
let inShiftMode = false;
let history = [];
let isOn = true;

const buttonsDefinition = [
   { label: '7', type: 'number' },
   { label: '8', type: 'number' },
   { label: '9', type: 'number' },
   { label: '+', unary: false, shiftLabel: '!', shiftUnary: true, type: 'operator', func: (a, b) => a + b, shiftFunc: (a) => a < 0 ? 'MATH ERROR' : factoriel(a)},
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

   if (definition.type === 'number') {
      button.classList.add('button-number');
   } else if (definition.type === 'operator') {
      button.classList.add('button-operator');
   } else if (definition.type === 'equals') {
      button.classList.add('button-equals');
   }

   button.addEventListener('click', () => handleClick(definition));
   buttons.appendChild(button);
});

function handleClick(button) {
   if(!isOn) return;

   if (button.type === 'number') {
      displayValue += button.label
      display.textContent = displayValue;
   }

   if (button.type === 'operator') {
     if (button.label === '-' && displayValue === '') {
         displayValue = '-';
         display.textContent = displayValue;
         return;
      }

      if (displayValue === '' || displayValue === '-') return;

      firstOperand = Number(displayValue);
      operator = button;

      miniDisplay.textContent = `${firstOperand} ${button.label}`;

      if (inShiftMode && button.shiftUnary) {
         miniDisplay.textContent = `${button.shiftLabel}(${firstOperand})`;
      } else if (button.unary) {
         miniDisplay.textContent = `${button.label}(${firstOperand})`;
      } else {
         miniDisplay.textContent = `${firstOperand} ${button.label}`;
      }

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
         if (displayValue === '') {
            showMathError();
            return;
         }
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

      if (operator.unary || (inShiftMode && operator.shiftUnary)) {
         miniDisplay.textContent += ` =`;
      } else {
         miniDisplay.textContent += ` ${secondOperand} =`;
      }

      operator = null;
   }
}

function showMathError() {
   display.textContent = 'ERROR';
   displayValue = '';
   firstOperand = null;
   secondOperand = null;
   operator = null;
}

shiftBottun.addEventListener('click', () => {
   if(!isOn) return;
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

filterInput.addEventListener('input', renderHistory);
filterOperationSelect.addEventListener('change', renderHistory)


function renderHistory() {
   const textFilter = filterInput.value.toUpperCase();
   const operationFilter = filterOperationSelect.value;

   historyContent.innerHTML = '';

   history
   .filter(entry => {
      let entryText;
      if (entry.second !== undefined)
         entryText = `${entry.first} ${entry.op.label} ${entry.second} = ${entry.result}`
      else entryText = `${entry.op.shiftLabel || entry.op.label}(${entry.first}) = ${entry.result}`;

      const entryTextNoSpaces = entryText.replace(/\s/g, '').toUpperCase();
      const matchesText = entryTextNoSpaces.toUpperCase().includes(textFilter);

      const opLabel = entry.second !== undefined ? entry.op.label : entry.op.shiftLabel || entry.op.label;
      const matchesOp = operationFilter === '' || opLabel === operationFilter;

      return matchesText && matchesOp;
   })
   .forEach(entry => {
      const div = document.createElement('div');
      div.classList.add('history-entry');
      if (entry.second !== undefined)
         div.textContent = `${entry.first} ${entry.op.label} ${entry.second} = ${entry.result}`
      else div.textContent = `${entry.op.shiftLabel || entry.op.label}(${entry.first}) = ${entry.result}`;
      historyContent.appendChild(div);
   });
}

historyButton.addEventListener('click', () => {
   if(!isOn) return;
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

onOffButton.addEventListener('click', () => {
   isOn = !isOn;
   if(!isOn) {
      turnOffCalculator();
   } else {
      turnOnCalculator();
   }
});

function turnOffCalculator() {
  display.textContent = 'OFF';
  displayValue = '';
  firstOperand = null;
  secondOperand = null;
  operator = null;
  miniDisplay.textContent = '';

  history = [];
  renderHistory();
}

function turnOnCalculator() {
  display.textContent = '';
  miniDisplay.textContent = '';
  displayValue = '';
}

clearButton.addEventListener('click', () => {
   if(!isOn) return;
   clear();
});

function clear() {
   displayValue= '';
   firstOperand = null;
   secondOperand = null;
   operator = null;
   display.textContent = '';
   miniDisplay.textContent = '';
}
