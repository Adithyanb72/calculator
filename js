var prevEl = document.getElementById('prev');
var currEl = document.getElementById('curr');
var keys = document.getElementById('keys');
var clickSound = document.getElementById('clickSound');

var current = '0';
var previous = '';
var operator = null;
var justEvaluated = false;

function playClickSound() {
  if (!clickSound) {
    return;
  }
  clickSound.currentTime = 0;
  clickSound.play();
}

function updateDisplay() {
  currEl.textContent = current;
  if (previous && operator) {
    prevEl.textContent = previous + ' ' + operator;
  } else {
    prevEl.textContent = '';
  }
}

function append(num) {
  if (justEvaluated && !operator) {
    current = '0';
    justEvaluated = false;
  }
  if (num === '.' && current.includes('.')) {
    return;
  }
  if (current === '0' && num !== '.') {
    current = num;
  } else {
    current = current + num;
  }
}

function chooseOperation(op) {
  if (operator && previous !== '' && current !== '') {
    compute();
  }
  operator = op;
  previous = current;
  current = '0';
  justEvaluated = false;
}

function compute() {
  var a = parseFloat(previous);
  var b = parseFloat(current);
  if (isNaN(a) || isNaN(b)) {
    return;
  }

  var result;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = (b === 0) ? 'Error' : a / b; break;
    case '%': result = a % b; break;
    default: return;
  }
  current = String(result);
  previous = '';
  operator = null;
  justEvaluated = true;
}

function clearAll() {
  current = '0';
  previous = '';
  operator = null;
  justEvaluated = false;
}

function deleteOne() {
  if (justEvaluated) {
    clearAll();
    return;
  }
  if (current.length <= 1) {
    current = '0';
  } else {
    current = current.slice(0, -1);
  }
}

keys.addEventListener('click', function(event) {
  var button = event.target.closest('button');
  if (!button) {
    return;
  }

  playClickSound();

  var num = button.dataset.num;
  var op = button.dataset.op;
  var action = button.dataset.action;

  if (num) {
    append(num);
  } else if (op) {
    chooseOperation(op);
  } else if (action === 'equals') {
    compute();
  } else if (action === 'clear') {
    clearAll();
  } else if (action === 'delete') {
    deleteOne();
  }
  
  updateDisplay();
});

window.addEventListener('keydown', function(event) {
  var key = event.key;

  if ('0123456789.+-*/%'.includes(key) || ['Enter', 'Escape', 'Backspace', '='].includes(key)) {
    playClickSound();
  }
  
  if (key >= '0' && key <= '9' || key === '.') {
    append(key);
  } else if (['+', '-', '*', '/', '%'].includes(key)) {
    chooseOperation(key);
  } else if (key === 'Enter' || key === '=') {
    compute();
  } else if (key === 'Escape') {
    clearAll();
  } else if (key === 'Backspace') {
    deleteOne();
  }

  updateDisplay();
});

updateDisplay();
