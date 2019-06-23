# Scope

**Scope**: dio kôda unutar kojeg varijablu ili funkciju možemo referencirati po
imenu

- global scope
- function scope - varijable i funkcije se mogu referencirati samo unutar
  funkcije gdje su deklarirane
- block scope - unutar npr. `for` petlje ili `if` uvjeta, varijable definirane
  preko `let` i `const` su _block scoped_

**Scope hoisting**: JavaScript automatski prebacuje **deklaraciju** (ne i
inicijalizaciju) varijable ili funkcije na vrh _scope_-a koji ih sadrži
(_function scope_ ili _global scope_). Vrši se za:

- varijable definirane `var` ključnom riječi
- funkcije definirane koristeći `function declaration`

## Primjeri

Sljedeći kôd će u strict modu javiti grešku:

```javascript
'use strict';
console.log(foo); // ReferenceError: foo is not defined
```

Ali ako varijablu foo definiramo nakon korištenja:

```javascript
'use strict';
console.log(foo); // undefined
var foo = 5;
```

([Link na CodePen](https://codepen.io/anon/pen/YoZoYX?editors=0011))

Ovo je zato jer gornji kôd JavaScript implicitno razumije kao:

```javascript
'use strict';
var foo; // deklaracija foo podignuta na vrh njenog scope-a
console.log(foo); // undefined
foo = 5;
```

Block scope:

```javascript
if (true) {
  const foo = 'const je zakon';
}
console.log(foo); // ReferenceError: foo is not defined
```

([Link na CodePen](https://codepen.io/anon/pen/gNmNvL?editors=0010#0), greška se
vidi u browser konzoli)

```javascript
for (let i = 1; i <= 3; i++) {
  console.log(i); // 1, 2, 3 redom
}
console.log(i); // ReferenceError: i is not defined
```

([Link na CodePen](https://codepen.io/anon/pen/NZpZya?editors=0011), greška se
vidi u browser konzoli)

# Funkcije u JavaScriptu

Razlikujemo nekoliko načina definiranja funkcija:

- **Function declaration**

  ```javascript
  foo(); // Ispisuje 'can be called before declaration'
  function foo() {
    console.log('can be called before declaration');
  }
  ```

  ([Link na CodePen](https://codepen.io/anon/pen/JQWQpQ?editors=0011))

- **Function expression**: spremanje funkcije u varijablu

  - definicija funkcije nije hoist-ana, samo naziv varijable
  - ne može se koristiti prije deklaracije

  ```javascript
  bar(); // TypeError: bar is not a function
  var bar = function() {
    console.log("can't be called before declaration");
  };
  ```

  ([Link na CodePen](https://codepen.io/anon/pen/BgWgrR?editors=0011), greška se
  vidi u browser konzoli)

- **Function constructor** - funkcije definirane na ovaj način imaju pristup
  samo varijablama iz _globalnog scope-a_, ne iz parent scope-a. **\*Ne
  preporučuje se** korištenje ovog načina iz security i performance razloga\*
  ```javascript
  var adder = new Function('a', 'b', 'return a + b');
  console.log(adder(2, 3)); // 5
  ```
  ([Link na CodePen](https://codepen.io/anon/pen/agJgYx?editors=0011))

## Arrow funkcije

Novi način definiranja funkcija uveden u
[EcmaScript 6](http://es6-features.org/):

- kraća sintaksa
- nemaju svoj `this`
- implicitni `return`
- bez `arguments` i `super`

Primjeri sintakse:

<!-- prettier-ignore-start -->
```javascript
(param1, param2, param3) => { console.log(param1, param2, param3) };

// implicitno vraća rezultat a + b, ali samo ako tijelo funkcije nije unutar {} zagrada
(a, b) => a + b; 
// poziv ove funkcije će vratiti undefined
(a, b) => { a + b }; 

// zagrade oko argumenta su opcionalne ako funkcija ima samo jedan parametar
singleParam => { /* tijelo funkcije */ };

// funckija bez ulaznih parametara
() => { console.log('Hello world') };
```
<!-- prettier-ignore-end -->

Za razliku od arrow funkcija, svaka funkcija definirana `function` ključnom
riječju ima svoj `this` objekt, koji ovisi o načinu na koji je pozvana. Arrow
funkcije uvijek koriste `this` od parent scope-a.

Na primjer, za
[addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#The_value_of_this_within_the_handler)
vrijednost od `this` unutar funkcije je referenca na element, ali ako je handler
arrow funkcija, naslijediti će `this` objekt od parent scope-a:

```javascript
const button = document.createElement('button');
button.textContent = 'Click me';
document.body.appendChild(button);

button.addEventListener('click', function() {
  console.log('this je ', this); // button element na koji smo kliknuli
});

button.addEventListener('click', () => {
  console.log('this je ', this); // Window objekt ili undefined
});
```

([Link na CodePen](https://codepen.io/anon/pen/bPqPMr?editors=0011))

## Closures

**Closure** je funkcija koja ima pristup varijablama iz njezinog parent scope-a,
tj. mjesta gdje je deklarirana.

**Sve funkcije** u JavaScriptu su _closure_ funkcije.

```javascript
let name = 'Ana Anić';
function greet() {
  console.log(`Hello ${name}`);
}

greet(); // Hello Ana Anić
name = 'Mate Matić';
greet(); // Hello Mate Matić
```

([Link na CodePen](https://codepen.io/anon/pen/mZWZqP?editors=0011))

Ugniježdena funkcija _vidi_ varijable iz njenog parent scope-a i parent scope-a
funkcija koje ju sadrže:

```javascript
let punctuationMark = '!';
function makeGreeter(name) {
  function greet() {
    console.log(`Hello ${name}${punctuationMark}`);
  }

  return greet;
}

const greetWorld = makeGreeter('world');
const greetMary = makeGreeter('Mary Lou');
greetWorld(); // Hello world!
punctuationMark = '?';
greetWorld(); // Hello world?
greetMary(); // Hello Mary Lou?
```

([Link na CodePen](https://codepen.io/anon/pen/mZWZBP?editors=0011))

**Vježba** Što će sljedeći kôd ispisati u konzolu?

```javascript
var foo = 1;
function print1() {
  var foo = 2;
  print2();

  function print2() {
    var foo = 3;
    console.log('foo je', foo);
  }
}

console.log('foo je', foo);
print1();
```

([Link na CodePen](https://codepen.io/anon/pen/xoqorB?editors=0011))

## Closure unutar `for` petlje

Closure funkcije su moćan alat u funkcionalnom programiranju, ali postoje
(rijetki) slučajevi gdje closure funkcije rade na način koji se na prvu ruku
čini ne-intuitivnim.

Sljedeći kôd u svakoj iteraciji `for` petlje stvara closure funkciju koja
ispisuje vrijednost od `i` i sprema je u `closures` array. Nakon što se petlja
izvrti poziva se svaki od spremljenih closure-a:

```javascript
var closures = [];
for (var i = 0; i < 3; i++) {
  closures.push(() => console.log(i));
}

closures.forEach(closure => closure());
```

Očekivali bi da ovo u konzolu ispiše:

```
0
1
2
```

ali zapravo će ispisati `3` tri puta.
([Link na CodePen](https://codepen.io/anon/pen/bPqXdM?editors=0011))

Razlog je što closure nije samo funkcija, već funkcija **i scope** u kojem se
nalazi. U ovom slučaju sve tri funkcije dijele isti scope (u ovom slučaju
globalni) unutar kojeg je definirana varijabla `i`. Kako se petlja već izvrtila
u trenutku poziva, vrijednost od `i` je 3 i to je ono što sve funkcije ispisuju
u konzolu.

Srećom, ovo možemo lako popraviti ako koristimo ES6 `let` umjesto `var`:

```javascript
var closures = [];
for (let i = 0; i < 3; i++) {
  closures.push(() => console.log(i));
}

closures.forEach(closure => closure());
```

([Link na CodePen](https://codepen.io/anon/pen/dBvxYp?editors=0011))

Ovo radi kako bi očekivali jer je `i` varijabla definirana sa `let` _block
scoped_ unutar `for` petlje pa je svaki closure vezan na svoju `i` varijablu.

# Stvaranje objekata u JavaScriptu

Postoji veliki broj različitih načina stvaranja objekata u JavaScriptu, što može
biti zbunjujuće za početnike i one koji dolaze iz više objektno orijentiranih
programskih jezika poput Jave ili C#. Ovdje su navedena tri načina i razlozi
zašto u Adriatic.hr-u preferiramo zadnji :)

## 1. Koristeći funkcije, `new` keyword i prototype

```javascript
function Person(name, surname) {
  this.name = name;
  this.surname = surname;
}

Person.prototype.getFullName = function() {
  return `${this.name} ${this.surname}`;
};

Person.prototype.introduce = function() {
  console.log(this.getFullName());
};

const a = new Person('Mate', 'Matić');
a.introduce(); // Mate Matić
```

([Link na CodePen](https://codepen.io/anon/pen/PrprWz?editors=0011))

Svaki property na ovako stvorenom objektu je javan.

## 2. Klase

- uvedene u [EcmaScript 6](http://es6-features.org/#ClassDefinition)
- [syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) za
  _prototype-based_ nasljeđivanje iz prošlog poglavlja
- [za sada](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Field_declarations)
  nema privatne metode i property-je

```javascript
class Person {
  constructor(name, surname) {
    this.name = name;
    this.surname = surname;
  }

  getFullName() {
    return `${this.name} ${this.surname}`;
  }

  introduce() {
    console.log(this.getFullName());
  }
}

const mate = new Person('Mate', 'Matić');
mate.introduce(); // Mate Matić

const button = document.createElement('button');
button.textContent = 'Introduce Mate';
document.body.appendChild(button);

// TypeError: this.getFullName is not a function, jer addEventListener bind-a svoj this na funkciju
button.addEventListener('click', mate.introduce);
// Da bi ovo radilo, moramo na introduce funkciju bind-ati objekt
button.addEventListener('click', mate.introduce.bind(mate));
```

([Link na CodePen](https://codepen.io/anon/pen/rEygRp?editors=0011))

## 3. Object factories

Koristimo moć closure funkcija. Primjer:

```javascript
function createPerson(name, surname) {
  // Privatna metoda
  const getFullName = () => `${name} ${surname}`;

  // Javne metode i properties idu ovdje
  return {
    introduce() {
      console.log(getFullName());
    },
  };
}

const ante = createPerson('Ante', 'Antić');
ante.introduce(); // Ante Antić

const button = document.createElement('button');
button.textContent = 'Introduce Ante';
document.body.appendChild(button);
// Ovo radi
button.addEventListener('click', ante.introduce);
```

([Link na CodePen](https://codepen.io/anon/pen/KjWLba?editors=0011))

Prednosti:

- imamo privatne metode
- nema `this` komplikacija
- ako koristimo transpiler kao što je [Babel](https://babeljs.io/) kako bi nam
  kôd radio u starijim preglednicima,
  [klase](https://babeljs.io/repl/#?babili=false&browsers=ie%209&build=&builtIns=false&spec=false&loose=false&code_lz=MYGwhgzhAEAKCmAnCB7AdtA3gKGtY6EALogK7BEqIAUaYAtvADTQSmJ2MCUWue0RABYBLCADpO8aAF5okgNx88Q0WLYcGU2eoV8Avtj4BzeEQBipECABym6jxz9oiU-wwADACSYV4yXuhvXzU3TT13RTwDPmE0EhQAE3J4e14nAjRUEHgxEBQjamCTc0sbOy4uSOgDPSA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env&prettier=false&targets=&version=7.4.3&externalPlugins=)
  rezultiraju sa puno više kôda od
  [object factory-ja](https://babeljs.io/repl/#?babili=false&browsers=ie%209&build=&builtIns=false&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABBATgUwIZTQBTSgZwQAowMBbNAGkQJBTMoEpEBvAKEUQHpvEcUMAG5YyiSlDgATDJ2QICURAHM0UAGIgANloByFNIgC8iYiyMA-RAAMAJK0ZoAvont0GBp9YDc7Ob0QAKQwhMEMJaUMYRAAHFDgY_Fg0AkQYKRBEOCEpACs0OXQoeiQOLi4YMCh4jIg0MzY5cvkwIi00ADotOGViVQ1tPQMzJl9mpyo5J18nIA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env&prettier=false&targets=&version=7.4.3&externalPlugins=).

Mane:

- lošije performanse od klasa (duplo sporije po nekim mjerenjima)

# Korisni linkovi

- [Factory Functions in JavaScript](https://www.youtube.com/watch?v=ImwrezYhw4w)
  | Fun Fun Function
- [Composition over Inheritance](https://www.youtube.com/watch?v=wfMtDGfHWpA) |
  Fun Fun Function
