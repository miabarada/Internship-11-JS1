const display = document.querySelector('.display');
const buttons = document.querySelector('.buttons');
const shiftBottun = document.querySelector('.shift-button');

let displayValue = '';
let firstOperand = null;
let operator = null;
let secondOperand = null;
let inShiftMode = null;

const buttonsDefinition = [
   { label: '7', type: 'number' },
   { label: '8', type: 'number' },
   { label: '9', type: 'number' },
   { label: '+', unary: 'no', shiftLabel: '!', shiftUnary: 'yes', type: 'operator', func: (a, b) => a + b, shiftFunc: factoriel},
   { label: '4', type: 'number' },
   { label: '5', type: 'number' },
   { label: '6', type: 'number' },
   { label: '-', unary: 'no', shiftLabel: 'x³', shiftUnary: 'yes', type: 'operator', func: (a, b) => a - b, shiftFunc: (a) => a*a*a },
   { label: '1', type: 'number' },
   { label: '2', type: 'number' },
   { label: '3', type: 'number' },
   { label: 'x', unary: 'no', shiftLabel: 'log', shiftUnary: 'yes', type: 'operator', func: (a, b) => a * b, shiftFunc: (a) => Math.log10(a) },
   { label: '=', type: 'equals' },
   { label: '0', type: 'number' },
   { label: 'x²', unary: 'yes', shiftLabel:'√', shiftUnary: 'yes', type: 'operator', func: (a) => a * a, shiftFunc: (a) => Math.sqrt(a) },
   { label: '/', unary: 'no', shiftLabel:'³√', shiftUnary: 'yes', type: 'operator', func: (a, b) => b === 0 ? 'MATH ERROR' : a / b, shiftFunc: (a) => Math.cbrt(a) }
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
      } else {
         if (displayValue === '') return;
         secondOperand = Number(displayValue);
         result = operator.func(firstOperand, secondOperand);
      }

      display.textContent = result;
      displayValue = result.toString();
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

