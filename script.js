'use strict';
let currentAccount = {};
let access = true;
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

// *********my code*********////////////////////////////////////////////////

const type = function (value) {
  if (value > 0) {
    return `deposit`;
  } else {
    return `withdrawal`;
  }
};

//adding html elements dynamically using  insertAdjacentHtml method//
const displayMovement = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const html = `
<div class="movements__row">
<div class="movements__type movements__type--${type(mov)}">${i + 1} ${type(
      mov
    )}</div>
<div class="movements__value">₹ ${mov}</div>
</div>
`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

displayMovement(account1.movements);

// calculating tottal price and replacing html of total with it//

const totalBalance = function (array) {
  const blc = array.reduce(function (acc, item) {
    return acc + item;
  });
  labelBalance.textContent = `₹ ${blc}`;
};

totalBalance(account1.movements);

/*
Adding short name to each account object
*/
const userName = function (acc) {
  acc.forEach(function (acc1) {
    acc1.user = acc1.owner
      .toLowerCase()
      .split(' ')
      .map(item => item[0])
      .join('');
  });
};
userName(accounts);
console.log(accounts);

// calculating total deposite price
const totalDeposite = function (array) {
  const deposite = array
    .filter(function (item) {
      return item > 0;
    })
    .reduce(function (acc, item) {
      return acc + item;
    }, 0);

  /// adding total blc here dynamically
  currentAccount.totalBlc = deposite;
  labelSumIn.textContent = `₹ ${deposite}`;
};
totalDeposite(account1.movements);

//// calculating  total withdrawls

const totalWithdrawls = function (array) {
  const withdrawls = array
    .filter(function (item) {
      return item < 0;
    })
    .reduce(function (acc, item) {
      return acc + item;
    }, 0);

  labelSumOut.textContent = `₹ ${Math.abs(withdrawls)}`;
};
totalWithdrawls(account1.movements);

///claculating intrest
const totalIntrest = function (acc) {
  const intrest = acc.movements
    .filter(item => item > 0)
    .map(item => (item * acc.interestRate) / 100)
    .filter(item => item => 1)
    .reduce((acc, item) => acc + item, 0);
  labelSumInterest.textContent = `₹ ${intrest}`;
};
//totalIntrest(account1.movements);

//// finding user with provided name and returning that object
const userFind = function (arrayOfUserObject, user) {
  let acc = arrayOfUserObject.find(item => item.user === user);
  return acc;
};

///authentacting with password
const checkPassword = function (acc, pin) {
  if (acc?.pin === pin) return true;
  else return false;
};

/// changing uI dynamically all data retriving dynamically
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();

  let userEntered = inputLoginUsername.value;
  let userPin = Number(inputLoginPin.value);

  currentAccount = userFind(accounts, userEntered);

  access = checkPassword(currentAccount, userPin);
  if (access) {
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    containerApp.style.opacity = '100';
    labelWelcome.textContent = `Welcome ${currentAccount.owner}`;
    displayMovement(currentAccount.movements);
    totalBalance(currentAccount.movements);
    totalDeposite(currentAccount.movements);
    totalWithdrawls(currentAccount.movements);
    totalIntrest(currentAccount);

    btnTransfer.addEventListener('click', function (event) {
      // event.preventDefault();
      const acceptingUser = inputTransferTo.value;
      console.log(`user name=${acceptingUser}`);
      const amtTransfer = Math.abs(Number(inputTransferAmount.value));
      console.log(`user name=${amtTransfer}`);

      if (amtTransfer < currentAccount.totalBlc) {
        console.log('sufficient blc');
        userFind(accounts, acceptingUser)?.movements.push(amtTransfer);
        console.log(userFind(accounts, acceptingUser));
        currentAccount.movements.push(-amtTransfer);
        console.log('transaction success full');
      }
    });
  }
});
