'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-04-08T14:11:59.604Z',
    '2024-04-14T17:01:17.194Z',
    '2024-04-15T23:36:17.929Z',
    '2024-04-16T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-04-15T18:49:59.371Z',
    '2024-04-16T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
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

/////////////////////////////////////////////////
// Functions
const formatMovements = function (movDate, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), movDate);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} Days Ago`;
  else {
    // const date = `${movDate.getDate()}`.padStart(2, 0);
    // const month = `${movDate.getMonth() + 1}`.padStart(2, 0);
    // const year = movDate.getFullYear();
    // return `${month}/${date}/${year}`;

    return new Intl.DateTimeFormat(locale).format(movDate);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const movDate = new Date(acc.movementsDates[i]);

    const displayDate = formatMovements(movDate, acc.locale);

    // const formattedMov = new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const startLogOutTimer = function () {
  let time = 200;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);
    // Setting timer value
    labelTimer.textContent = `${min}:${seconds}`;
    // if timer is zero log out
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to Get Started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  // decresase timer
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

const resetTimer = function () {
  clearInterval(timer);
  timer = startLogOutTimer();
};

//////FAKE ALWAYS LOGIN///////

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//Experimenting with Date API

///////////////////////////////

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Create current date
    // const now = new Date();
    // const date = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${month}/${date}/${year}, ${hour}:${min}`;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // const locale = currentAccount.locale;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Start Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Adding date to transfer
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset Timer
    resetTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add movement date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 5000);

    // Reset Timer
    resetTimer();

    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// TIMERS

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('300inchcocks', 10));

console.log(Number.parseFloat('2.5rem'));
console.log(Number.parseInt('2.5rem'));


console.log(Math.sqrt(25)); // square root
console.log(25 ** (1 / 2)); // also square root

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

console.log(randomInt(100, 200));
console.log(randomInt(1, 50));

//ROUNDING INTEGERS

console.log(Math.trunc(69.9));

// Ceil() - Rounds up to the highest whole number
console.log(Math.ceil(54.6));
console.log(Math.ceil(54.1));

// round() - Rounds to the nearest whole number

console.log(Math.round(54.6));
console.log(Math.round(54.1));

//floor() - Rounds down to the nearest whole number

console.log(Math.floor(54.6));
console.log(Math.floor(54.1));

// Trunc working with negative numbers // JUST DONT DO IT WITH NEGATIVE NUMBERS OR IF YOU CAN GET NEGATIVE NUMBERS. Trunc lops off while floor actually rounds.

console.log((2.7).toFixed());
console.log(+(2.7).toFixed());

//REMAINDER OPERATOR
console.log(5 % 2);

console.log(70 % 4);

const isEven = n => n % 2 === 0;
console.log(isEven(9));
console.log(isEven(24));
console.log(isEven(110));

btnLogin.addEventListener('click', function () {
  const movementsRows = [
    ...document.querySelectorAll('.movements__row'),
  ].forEach(function (row, i) {
    if (isEven(i)) {
      row.style.backgroundColor = '#e7eaf6';
    }
  });
});

// Numeric Separator
const diameter = 287_460_000_000;
console.log(diameter);
const price = 345_99;
console.log(price);


// BIGINT

console.log(20n === '20');
console.log(20n == '20');
console.log(20n > 10);
console.log(20n === 20);


// Create a date

console.log(new Date(2020, 10, 11, 20, 10));
console.log(new Date());
console.log(new Date(0));
console.log(new Date(10 * 24 * 60 * 60 * 1000));


// Working with dates
const future = new Date(2060, 10, 11, 20, 10);
console.log(future.getFullYear());
console.log(future.getMonth() + 1);
console.log(future.getDate());
console.log(future.getDay());
console.log(future.toISOString());
console.log(future.getTime());
console.log(new Date(2867454600000));

console.log(Date.now());

future.setFullYear(2065);
console.log(future);


// OPERATIONS WITH DATES

const future = new Date(2060, 10, 11, 20, 10);
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));
const days1 = calcDaysPassed(new Date(2024, 5, 14), new Date(2024, 5, 24));
const days2 = calcDaysPassed(new Date(2024, 5, 14), new Date(2024, 5, 4));
console.log(days1);
console.log(days2);


// INTERNATIONALIZING DATA
// WORKED ON MAKING THE DATE BETTER DYNAMICALLY USING THE API SEE BELOW NOTES

//Create current date
    // const now = new Date();
    // const date = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${month}/${date}/${year}, ${hour}:${min}`;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // const locale = currentAccount.locale;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);


// INTERNATIONALIZING DATA - FORMATTING NUMBERS
const num = 789456912.25;

console.log(`US:` + new Intl.NumberFormat('en-US').format(num));
console.log(`Italy:` + new Intl.NumberFormat('it-it').format(num));
console.log(`Portugal:` + new Intl.NumberFormat('pt-PT').format(num));


// SET TIMEOUT FUNCTION

const ingredients = ['pepperoni', 'olives', 'sausage'];
const pizzaTimer = setTimeout(
  (ing1, ing2, ing3) =>
    console.log(
      `Here is your pizza you fucking jag off with ${ing1}, ${ing2}, and ${ing3}`
    ),
  5000,
  ...ingredients // every argument after the milisecond can be used as a function argument
);

// SET INTERVAL

setInterval(function () {
  const now = new Date();
  const seconds = now.getSeconds();

  console.log(seconds);
}, 1000);
*/

// setInterval(function () {
//   const now = new Date();
//   // const hours = now.getHours();
//   // const mins = now.getMinutes();
//   // const secs = now.getSeconds();

//   console.log(
//     new Intl.DateTimeFormat('en-US', {
//       hour: 'numeric',
//       minute: 'numeric',
//       second: 'numeric',
//     }).format(now)
//   );
// }, 1000);
