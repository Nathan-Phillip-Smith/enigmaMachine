let alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];
let encryptRotor1 = createRotor(alphabet);
let encryptRotor2 = createRotor(alphabet);
let encryptRotor3 = createRotor(alphabet);
let encryptReflector = createRotor(alphabet);
let decryptRotor1 = [...encryptRotor1];
let decryptRotor2 = [...encryptRotor2];
let decryptRotor3 = [...encryptRotor3];
let decryptReflector = [...encryptReflector];
let rotor1Count = 0;
let rotor2Count = 0;
let rotor3Count = 0;

let plugPairs = [
  ['a', 'k'],
  ['b', 'i'],
  ['c', 'g'],
  ['u', 'd'],
  ['z', 'l'],
  ['f', 'r'],
  ['e', 's'],
  ['q', 'p'],
  ['t', 'n'],
  ['j', 'x'],
];
let reflectorPairs = [
  ['a', 'i'],
  ['b', 'k'],
  ['c', 'd'],
  ['u', 'g'],
  ['z', 'r'],
  ['f', 'l'],
  ['e', 'p'],
  ['q', 's'],
  ['t', 'x'],
  ['j', 'n'],
  ['h', 'm'],
  ['o', 'v'],
  ['w', 'y'],
];

function createRotor(alphabet) {
  let newAlphabet = [...alphabet];
  let length = newAlphabet.length;
  let rotor = [];
  for (let i = 0; i < length; i++) {
    let index = Math.floor(Math.random() * newAlphabet.length);
    rotor.push(newAlphabet[index]);
    newAlphabet.splice(index, 1);
  }
  return rotor;
}

function plugBoard(letter, pairs) {
  for (let pair of pairs) {
    if (pair.includes(letter)) {
      let index = pair.indexOf(letter);
      return index === 0 ? pair[1] : pair[0];
    }
  }
  return letter;
}

function rotor(letter, rotorA, rotorB) {
  let index = rotorA.indexOf(letter);
  let result = rotorB[index];
  return result;
}

function decryptRotateRotor() {
  if (rotor1Count < 26) {
    decryptRotor1.unshift(decryptRotor1.pop());
    rotor1Count++;
  } else if (rotor1Count === 26 && rotor2Count < 26) {
    decryptRotor1.unshift(decryptRotor1.pop());
    decryptRotor2.unshift(decryptRotor2.pop());
    rotor1Count = 0;
    rotor2Count++;
  } else if (rotor1Count === 26 && rotor2Count === 26) {
    decryptRotor1.unshift(decryptRotor1.pop());
    decryptRotor2.unshift(decryptRotor2.pop());
    decryptRotor3.unshift(decryptRotor3.pop());
    rotor1Count = 0;
    rotor2Count = 0;
  }
}
function encryptRotateRotor() {
  if (rotor1Count < 26) {
    encryptRotor1.unshift(encryptRotor1.pop());
    rotor1Count++;
  } else if (rotor1Count === 26 && rotor2Count < 26) {
    encryptRotor1.unshift(encryptRotor1.pop());
    encryptRotor2.unshift(encryptRotor2.pop());
    encryptRotor1Count = 0;
    rotor2Count++;
  } else if (rotor1Count === 26 && rotor2Count === 26) {
    encryptRotor1.unshift(encryptRotor1.pop());
    encryptRotor2.unshift(encryptRotor2.pop());
    encryptRotor3.unshift(encryptRotor3.pop());
    rotor1Count = 0;
    rotor2Count = 0;
  }
}

let input = process.stdin;
input.setEncoding('utf-8');

input.on('data', (response) => {
  response = response.trim();
  response = response.toLowerCase();
  response = response.split(' ');
  if (response[0] === 'exit') {
    process.exit();
  } else if (response[0] === 'encrypt') {
    response.splice(0, 1);
    let charArray = response.join(' ').split('');
    let encrypted = [];
    for (let letter of charArray) {
      if (alphabet.includes(letter)) {
        let newLetter = letter;
        newLetter = plugBoard(newLetter, plugPairs);
        newLetter = rotor(newLetter, encryptRotor1, encryptRotor2);
        newLetter = rotor(newLetter, encryptRotor2, encryptRotor3);
        newLetter = rotor(newLetter, encryptRotor3, encryptReflector);
        newLetter = plugBoard(newLetter, reflectorPairs);
        newLetter = rotor(newLetter, encryptReflector, encryptRotor3);
        newLetter = rotor(newLetter, encryptRotor3, encryptRotor2);
        newLetter = rotor(newLetter, encryptRotor2, encryptRotor1);
        newLetter = plugBoard(newLetter, plugPairs);
        encrypted.push(newLetter);
        encryptRotateRotor();
      } else {
        encrypted.push(letter);
      }
    }
    console.log(`${response.join(' ')} encrypted to ${encrypted.join('')}`);
  } else if (response[0] === 'decrypt') {
    response.splice(0, 1);
    let charArray = response.join(' ').split('');
    let decrypted = [];
    for (let letter of charArray) {
      if (alphabet.includes(letter)) {
        let newLetter = letter;
        newLetter = plugBoard(newLetter, plugPairs);
        newLetter = rotor(newLetter, decryptRotor1, decryptRotor2);
        newLetter = rotor(newLetter, decryptRotor2, decryptRotor3);
        newLetter = rotor(newLetter, decryptRotor3, decryptReflector);
        newLetter = plugBoard(newLetter, reflectorPairs);
        newLetter = rotor(newLetter, decryptReflector, decryptRotor3);
        newLetter = rotor(newLetter, decryptRotor3, decryptRotor2);
        newLetter = rotor(newLetter, decryptRotor2, decryptRotor1);
        newLetter = plugBoard(newLetter, plugPairs);
        decrypted.push(newLetter);
        decryptRotateRotor();
      } else {
        decrypted.push(letter);
      }
    }
    console.log(`${response.join(' ')} decrypted to ${decrypted.join('')}`);
  } else {
    console.log('invalid input');
  }
});
