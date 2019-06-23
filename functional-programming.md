# Map

`map()` je
[metoda](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
nad `Array` objektom koja izvršava zadanu transformaciju nad svakim elemetom u
array-u i vraća _novi_ array sa transformiranim elementima.

## Primjer

Konvertiranje svih stringova u array-u u uppercase:

```javascript
const pets = ['dog', 'snake', 'cat', 'hamster'];
const loudPets = pets.map(pet => pet.toUpperCase());
console.log(loudPets);
```

Za usporedbu, ista operacija koristeći `for` petlju:

```javascript
const pets = ['dog', 'snake', 'cat', 'hamster'];
const loudPets = [];
for (let i = 0; i < pets.length; i++) {
  loudPets.push(pets[i].toUpperCase());
}
console.log(loudPets);
```

Prednosti:

- kraća sintaksa
- manje logike (za iteriranje po array-u se interno brine `map()` metoda)
- jasniji kôd
- ne modificira originalni array
- dopušta method chaining sa drugim array metodama

# Filter

`filter()` je
[metoda](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
nad `Array` objektom koja vraća novi array sastavljen samo od elemenata
originalnog array-a koji zadovoljavaju test koji implementira zadana funkcija.

## Primjer

Želimo filtrirati samo mačke iz polja kućnih ljubimaca:

```javascript
const pets = [
  { name: 'Doug', type: 'dog' },
  { name: 'Keanu', type: 'cat' },
  { name: 'Ghost', type: 'direwolf' },
  { name: 'Stevens', type: 'cat' },
];
const cats = pets.filter(pet => pet.type === 'cat');
console.log(cats);
```

Implementacija iste funkcionalnosti koristeći `for` petlju:

```javascript
const pets = [
  { name: 'Doug', type: 'dog' },
  { name: 'Keanu', type: 'cat' },
  { name: 'Ghost', type: 'direwolf' },
  { name: 'Stevens', type: 'cat' },
];
const cats = [];
for (let i = 0; i < pets.length; i++) {
  if (pets[i].type === 'cat') {
    cats.push(pets[i]);
  }
}
console.log(cats);
```

Novi array ima samo one elemente za koje test funkcija vraća `true`.

Prednosti: iste kao i za `map()` metodu.

# Reduce

Swiss army knife array funkcija. Izvršava tzv. `reducer` funkciju nad svakim
elementom zadanog array-a i vraća rezultat.

## Ulazni parametri

**Reducer** - funkcija koja prima do četiri vrijednosti, redom:

1. Accumulator
2. Trenutnu vrijednost
3. Trenutni index
4. Izvorni array

Vrijednost koju reducer vraća postaje novi Accumulator koji se prosljeđuje u
reducer u idućoj iteraciji. Vrijednost accumulatora koju reducer vrati u zadnjoj
iteraciji postaje povratna vrijednost `reduce()` metode.

**Početna vrijednost accumulatora** - vrijednost koja se šalje kao accumulator u
`reducer` funkciju u prvoj iteraciji. Ako nije zadana, koristi se prvi element
array-a.

## Primjer 1. Zbroj svih brojeva u array-u

```javascript
const numbers = [1, 2, 3, 4, 5];
const sumOfNumbers = numbers.reduce(
  (accumulator, value) => accumulator + value,
  0,
);
console.log(sumOfNumbers); // 15
```

## Primjer 2. Implementacije `map()` i `filter()` metoda

`reduce()` je vrlo moćan alat s kojim možemo napraviti i našu implementaciju
`map()` i `filter()` metoda.

### Map

```javascript
const pets = ['dog', 'snake', 'cat', 'hamster'];
function map(array, callback) {
  return array.reduce((accumulator, value) => {
    accumulator.push(callback(value));
    return accumulator;
  }, []);
}
const loudPets = map(pets, value => value.toUpperCase());

console.log(loudPets);
```

### Filter

```javascript
const pets = [
  { name: 'Doug', type: 'dog' },
  { name: 'Keanu', type: 'cat' },
  { name: 'Ghost', type: 'direwolf' },
  { name: 'Stevens', type: 'cat' },
];
function filter(array, testCallback) {
  return array.reduce((accumulator, value) => {
    if (testCallback(value)) {
      accumulator.push(value);
    }
    return accumulator;
  }, []);
}
const cats = filter(pets, pet => pet.type === 'cat');
console.log(cats);
```

## Primjer 3. Uklanjanje duplikata iz array-a

```javascript
const pets = ['dog', 'snake', 'dog', 'cat', 'hamster', 'cat', 'cat', 'snake'];
const oneOfEachPet = pets.reduce((accumulator, pet) => {
  if (accumulator.indexOf(pet) === -1) {
    accumulator.push(pet);
  }
  return accumulator;
}, []);
console.log(oneOfEachPet);
```

# Currying

[Currying](https://en.wikipedia.org/wiki/Currying) je tehnika pozivanja funkcije
gdje funkcija ne prima sve argumente odjednom. Umjesto toga prima prvi argument
i vraća novu funkciju koja prima drugi argument i vraća novu funkciju (ili
rezultat ako se radi o funkciji sa dva argumenta), itd...

Na primjer, gdje običnu `add` funkciju pozivamo ovako:

```javascript
add(1, 2, 3);
```

_curried_ verzija bi se pozivala ovako:

```javascript
add(1)(2)(3);
```

Primjer implementacije:

```javascript
function add(a, b) {
  return a + b;
}

function curriedAdd(a) {
  return function(b) {
    return a + b;
  };
}

console.log(add(5, 3));
console.log(curriedAdd(5)(3));
```

Funkcija `curriedAdd()` se može kraće napisati koristeći arrow funkcije:

```javascript
const curriedAdd = a => b => a + b;
console.log(curriedAdd(5)(3));
```

## Zašto koristiti currying?

Currying je koristan za pripremu argumenata unaprijed za npr. map, filter,
reduce, event handlere i sl.

```javascript
const pets = [
  { name: 'Doug', type: 'dog' },
  { name: 'Keanu', type: 'cat' },
  { name: 'Ghost', type: 'direwolf' },
  { name: 'Stevens', type: 'cat' },
];

const isType = type => pet => pet.type === type;
const cats = pets.filter(isType('cat'));
const direwolfs = pets.filter(isType('direwolf'));
console.log('cats', cats);
console.log('direwolfs', direwolfs);
```

# Dependency injection (sa funkcijama)

[Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) je
jednostavna tehnika koju koristimo u objektno orijentiranom programiranju gdje
objektu kroz konstruktor dajemo druge objekte (tzv. ovisnosti) koji mu trebaju.
Ovo radimo kako bi naš kôd učinili lakšim za održavanje, reuse i testiranje.

Dependency injection u funkcionalnom programiranju nam olakšava
[bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
metoda. S ovom tehnikom možemo neke argumente funkciji zadati unaprijed bez da
ju pozovemo.

## Primjer

Recimo da želimo implementirati metodu koja vraća ime korisnika za zadani `id`.
Ova metoda vrši [ajax](<https://en.wikipedia.org/wiki/Ajax_(programming)>) poziv
na server i dohvaća ime korisnika iz server response-a. U primjerima koristimo
[jQuery](https://api.jquery.com/jquery.get/) `.get()` metodu za izvršavanje ajax
poziva.

Primjer bez dependecy injection:

```javascript
function getUserName(id) {
  return $.get(`https://www.example.com/users/${id}`).then(user => user.name);
}

getUserName(id);
```

Gornji primjer nije testabilan, jer u unit testovima ne želimo zaista vršiti
ajax pozive. Kako bi rješili ovaj problem, promijeniti ćemo `getUserName()`
funkciju da prima dva parametra, gdje je prvi ajax funkcija koju će koristiti:

```javascript
function getUserName($get, id) {
  return $get(`https://www.example.com/users/${id}`).then(user => user.name);
}

getUserName($.get, id);
```

Unit test sada može funkciji `getUserName()` dati svoju implementaciju `$.get`
koja ne vrši ajax poziv.

Naravno, ne želimo svaki put kada koristimo ovu funkciju u produkciji slati i
`$.get` parametar, pa ćemo za produkciju definirati novu funkciju
`makeGetUserName()` koja vraća `getUserName` sa unaprijed zadanim `$get`
parametrom:

```javascript
// Ovu funkciju koristimo u produkciji
export default function makeGetUserName($get) {
  // Prvi argument bind funkcije definira vrijednost od this (nije bitan jer ga
  // getUserName() ne koristi)
  return getUserName.bind(null, $.get);
}

// Ovu funkciju koristimo u testovima
export function getUserName($get, id) {
  return $get(`https://www.example.com/users/${id}`).then(user => user.name);
}
```

Ako smo sigurni da ćemo uvijek koristiti `$.get`, možemo definirati _wrapper_
funkciju koja nekonfiguriranoj funkciji proslijeđuje `$.get` kao prvi parametar.

```javascript
// Ovu funkciju koristimo u produkciji
export default function getUserName(id) {
  return getUserNameUnconfigured($.get, id);
}

// Ovu funkciju koristimo u testovima
export function getUserNameUnconfigured($get, id) {
  return $get(`https://www.example.com/users/${id}`).then(user => user.name);
}
```
