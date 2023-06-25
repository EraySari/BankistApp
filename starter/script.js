'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Eray Sari',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2023-03-08T14:11:59.604Z',
    '2023-03-14T17:01:17.194Z',
    '2023-03-16T23:36:17.929Z',
    '2023-03-18T09:48:16.867Z',
  ],
  currency: 'EUR',
  locale: 'at-AT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
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

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const minute = now.getMinutes();

const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  console.log(daysPassed);
  if (daysPassed === 0) return 'today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed > 1 && daysPassed < 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const displayMovements = function (account, sort = false) {
  const mov = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  containerMovements.innerHTML = '';
  mov.forEach(function (mov, i) {
    const date = new Date(account.movementsDates[i]);

    const displayDate = formatMovementDate(date);
    const type = mov < 0 ? 'withdrawal' : 'deposit';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${mov.toFixed(2)}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  const balance = account.movements.reduce((acc, mov) => acc + mov);
  labelBalance.textContent = `${balance}€`;
  account.balance = balance;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * (1.2 / 100))
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

createUsernames(accounts);

/////////////////////////////////////////
// Event handlers

let currentAccount, timer;

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  let time = 5 * 60;
  const tick = function () {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sek = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sek}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    labelDate.textContent = `${day}/${month}/${year} ${hour}:${minute}`;

    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

labelDate.textContent = `${day}/${month}/${year} ${hour}:${minute}`;

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const now = new Date();
  console.log(currentAccount.movementsDates);

  const amount = Number(inputTransferAmount.value);

  const transferTo = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    transferTo &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    transferTo?.username !== currentAccount.username
  ) {
    inputTransferTo.value = inputTransferAmount.value = '';
    setTimeout(function () {
      transferTo.movements.push(amount);
      currentAccount.movements.push(-amount);

      currentAccount.movementsDates.push(now.toISOStrin(g));
      transferTo.movementsDates.push(now.toISOString());

      updateUI(currentAccount);

      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  const now = new Date();

  if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
    inputLoanAmount.value = '';
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(now.toISOString());
      updateUI(currentAccount);
    }, 2500);
  }

  clearInterval(timer);
  timer = startLogoutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const deleteIndex = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );

    accounts.splice(deleteIndex, deleteIndex);
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = '';

    console.log(accounts);
  }
});

let sort = true;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, sort);

  sort = !sort;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// *** JSde sayilar floattir(1 = 1.0 gibi)

// console.log(0.2 + 0.1); //0.30000000000000004
// console.log(0.4 + 0.2); //0.6000000000000001
// console.log(0.2 + 0.3); //0.5

// //Parsing
// console.log(Number.parseInt('45w451')); //45
// console.log(Number.parseFloat('1.5kdf')); //1.5

// console.log(Number(isNaN(10)));
// console.log(Number(isNaN('d')));

// // Roundind integers
// console.log(Math.trunc(23.3));

// console.log(Math.round(23.3));
// console.log(Math.round(23.7));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.7));

// console.log(Math.floor(23.3));
// console.log(Math.floor(23.7));

// console.log((2.38).toFixed(1)); //number degil string dondurur

///////////////////////////////////////
// Numeric Separators

// 287,460,000,000
// const diameter = 287_460_000_000;
// console.log(diameter);

// const price = 345_99;
// console.log(price);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// const PI = 3.1415;
// console.log(PI);

// console.log(Number('230_000'));
// console.log(parseInt('230_000'));

// console.log(2 ** 53 - 1); //JSde yazdirilabilecek en büyük sayi

// console.log(2 ** 53 + 1); //hatali sonuclar verir
// console.log(2 ** 53 + 2); //hatali sonuclar verir

// //Bundan daha büyük sayilarla caloismak icin bigInt vardir.

// console.log(32165465426842684642654264264642n);

// const huge = 135161548467874874654545n;
// const num = 23;
// console.log(huge * BigInt(num));

// ///////////////////////////////////////
// //Creating Dates

const now1 = new Date(2038, 10, 25, 15, 23);
// console.log(now);

// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[0]));

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// const calcDaysPassed = (date1, date2) =>
//   (date2 - date1) / (1000 * 60 * 60 * 24);
// console.log(calcDaysPassed(Number(future), Number(now1)));
// console.log(calcDaysPassed(Number(future), Number(now1)));

// console.log(future.getFullYear());
// console.log(future.toISOString());

///////////////////////////////////////
// Timers
const ingredients = ['olives', 'spinach'];

const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your Pizza with ${ing1} and ${ing2}`),
  4000,
  ...[ingredients]
);
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 1000);
