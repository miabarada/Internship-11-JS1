const display = document.querySelector('.display');
const buttons = document.querySelector('.buttons');

let displayValue = '';
let firstOperand = null;
let operator = null;
let secondOperand = null;

const buttonsDefinition = [
   { label: '7', type: 'number' },
   { label: '8', type: 'number' },
   { label: '9', type: 'number' },
   { label: '+', shiftlabel: '!', type: 'operator', func: (a, b) => a + b, shiftFunc: factoriel},
   { label: '4', type: 'number' },
   { label: '5', type: 'number' },
   { label: '6', type: 'number' },
   { label: '-', shiftlabel: 'x³', type: 'operator', func: (a, b) => a - b, shiftFunc: (a) => a*a*a },
   { label: '1', type: 'number' },
   { label: '2', type: 'number' },
   { label: '3', type: 'number' },
   { label: 'x', shiftlabel: 'log', type: 'operator', func: (a, b) => a * b, shiftFunc: (a) => Math.log10(a) },
   { label: '=', type: 'equals' },
   { label: '0', type: 'number' },
   { label: 'x²', shiftlabel:'√', type: 'operator', func: (a) => a * a, shiftFunc: (a) => Math.sqrt(a) },
   { label: '/', shiftlabel:'³√', type: 'operator', func: (a, b) => b === 0 ? 'MATH ERROR' : a / b, shiftFunc: (a) => Math.cbrt(a) }
];

function factoriel(a) {
   let result = 1;
   for(let i = 1; i <= a; i++)
      result *= i;
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
      operator = button.label;
      displayValue = '';
      display.textContent = displayValue;
   }

   if (button.type === 'equals') {
      if (displayValue === '' || operator === null)
         return;

      secondOperand = Number(displayValue);
      let result;

      if(operator === '+')
         result = firstOperand + secondOperand;

      if(operator === '-')
         result = firstOperand - secondOperand;

      if(operator === 'x')
         result = firstOperand * secondOperand;

      if(operator === '/') {
         if (secondOperand === 0) {
            display.textContent = 'MATH ERROR';
            displayValue = '';
            firstOperand = null;
            operator = null;
            return;
         }
         result = firstOperand / secondOperand;
      }

      display.textContent = result;
      displayValue = result.toString();
      return;
   }
}

