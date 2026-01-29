const display = document.querySelector('.display');
const buttons = document.querySelector('.buttons');

let displayValue = '';
let firstOperand = null;
let operator = null;

const buttonsDefinition = [
   { label: "7", type: 'number' },
   { label: '8', type: 'number' },
   { label: '9', type: 'number' },
   { label: '+', type: 'operator' },
   { label: '4', type: 'number' },
   { label: '5', type: 'number' },
   { label: '6', type: 'number' },
   { label: '-', type: 'operator' },
   { label: '1', type: 'number' },
   { label: '2', type: 'number' },
   { label: '3', type: 'number' },
   { label: 'x', type: 'operator' },
   { label: '0', type: 'number' },
   { label: '=', type: 'equals' },
   { label: '/', type: 'operator' }
];

buttonsDefinition.forEach(definition => {
   const button = document.createElement('button');
   button.textContent = definition.label;

   button.addEventListener('click', () => {
      displayValue += definition.label;
      displayValue += ' ';
      display.textContent = displayValue;
   });

   buttons.appendChild(button);
});
