'use strict';


const account1 = {
  owner: 'Emmanuel Kosy',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, 
  pin: 1234,

  movementsDates: [
    '2019-01-28T09:15:04.904Z',
    '2019-04-01T10:17:24.185Z',
    '2019-05-27T17:01:17.194Z',
    '2019-07-11T23:36:17.929Z',
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-03-08T14:11:59.604Z',
    '2020-03-12T10:51:36.790Z',
  ],
  currency: 'NGN',
  locale: 'en-NG', 
};

const account2 = {
  owner: 'Dike Chiagozie',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2345,

  movementsDates: [
    '2019-01-25T14:18:46.235Z',
    '2019-02-05T16:33:06.386Z',
    '2019-03-10T14:43:26.374Z',
    '2019-04-25T18:49:59.371Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-02-26T12:01:20.894Z',
  ],
  currency: 'NGN',
  locale: 'en-NG',
};

const accounts = [account1, account2];

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const startLogOutTimer = function () {

  const tick = function () {
    let minutes = String(parseInt(time / 60, 10)).padStart(2, '0');
    let seconds = String(parseInt(time % 60, 10)).padStart(2, '0');
  
    labelTimer.textContent = `${minutes}:${seconds}`;

    
    if (time === 0) {
    
      clearInterval(timer);

      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };
  let time = 10 * 60;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const printWelcome = function (name) {
  const now = new Date();
  const greetings = new Map([
    [[6, 7, 8, 9, 10], 'Good Morning'],
    [[11, 12, 13, 14], 'Good Day'],
    [[15, 16, 17, 18], 'Good Afternoon'],
    [[19, 20, 21, 22], 'Good Evening'],
    [[23, 0, 1, 2, 3, 4, 5], 'Good Night'],
  ]);

  const arr = [...greetings.keys()].find(key => key.includes(now.getHours()));
  const greet = greetings.get(arr);
  labelWelcome.textContent = `${greet}, ${name}!`;
};
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round((date1 - date2) / (60 * 60 * 24 * 1000));
  const now = new Date();
  const daysPassed = calcDaysPassed(now, date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
const printMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const mov = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  mov.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    let printDate = '';
    if (account.movementsDates) {
      const date = new Date(account.movementsDates[i]);
      printDate = formatMovementDate(date, account.locale);
    }

   
    
    const formattedMov = formatCur(mov, account.locale, account.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${printDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
printMovements(account1);

const createUsernames = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
const calcPrintBalance = function (account) {
  const balance = account.movements.reduce((accum, cur) => accum + cur, 0);
  currentAccount.balance = balance;
  labelBalance.textContent = formatCur(
    balance,
    account.locale,
    account.currency,
  );
};

const calcPrintSummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = formatCur(incomes, account.locale, account.currency);

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(out),
    account.locale,
    account.currency,
  );

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (currentAccount.interestRate / 100))
    .filter(int => int > 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = formatCur(
    interest,
    account.locale,
    account.currency,
  );
};
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value,
  );

  if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
    console.log(currentAccount);
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 100;
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    printWelcome(`${currentAccount.owner.split(' ')[0]}`);
    const now = new Date();
    const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options,
    ).format(now);
    printMovements(currentAccount);
    calcPrintBalance(currentAccount);
    calcPrintSummary(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  const amount = +inputTransferAmount.value;

  if (
    receiver &&
    amount &&
    currentAccount.balance >= amount &&
    receiver.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    receiver.movementsDates.push(new Date());
    printMovements(currentAccount);
    calcPrintBalance(currentAccount);
    calcPrintSummary(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputTransferTo.value = inputTransferAmount.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(+inputLoanAmount.value);

  if (currentAccount.movements.some(mov => mov >= amount / 10) && amount > 0) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    setTimeout(() => {
      printMovements(currentAccount);
      calcPrintBalance(currentAccount);
      calcPrintSummary(currentAccount);
    }, 2500);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username,
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function () {
  printMovements(currentAccount, !sorted);
  sorted = !sorted;
});