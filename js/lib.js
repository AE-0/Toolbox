function deepCopy(_) { return Array.isArray(_) ? JSON.parse(JSON.stringify(_)).flat() : JSON.parse(JSON.stringify(_));}
function isPrimitive(_) { return (typeof _ === "string" || typeof _ === "number" || typeof _ === "boolean" || typeof _ === "undefined" || typeof _ === "symbol")};
function parse(s) {
  s.trim();
  if (s.match(",") != null) {
    return s.split(",").map(e => parseInt(e.trim()));
  }
  else if(t.match(" ") != null) {
    return s.split(" ");
  }
};
Number.prototype.roundTo = function() { return Math.round(this * 10 ** arguments[0]) / 10 ** arguments[0]};
String.prototype.reverse = function() { return this.split('').reverse().join('')};
String.prototype.cut = function(n) { return n > 0 ? this.substring(n, this.length) : this.reverse().substring(-n, this.length).reverse()};
Array.prototype.sum = function() {
  if (this.every(e => Array.isArray(e))) return this.map(e => e.reduce((e, i) => e + i));
  return this.reduce((e, i) => e + i);
}; // needs nested array rank polymorphism
Array.prototype.product = function() {return this.reduce((e, i) => e * i)};
Array.prototype.avg = function() { return this.reduce((e, i) => e + i) / this.length};
Array.prototype.min = function() { return Math.min(...this)};
Array.prototype.max = function() { return Math.max(...this)};
Array.prototype.minmax = function() { return [Math.min(...this), Math.max(...this)]};
Array.prototype.uniq = function() { return this.filter((e, i, a) => a.indexOf(e) === i)};
Array.prototype.xor = function () { return this.reduce((e, i) => e ^ i)} // optional lambda implementation
Array.prototype.zip = function(ys) { // needs refactoring
  const zipped = [];
  const n = Math.min(this.length, ys.length);
  for (let i = 0; i < n; i++) {
    zipped.push([this[i], ys[i]]);
  }
  return zipped;
};
Array.prototype.mapReduce = function(lambda, optional) { // check if nested array then this.map(e => e.reduce(optional)) also use sum()
  optional ??= (a, b) => a + b;
  return this.map(lambda).reduce(optional)
}
Array.prototype.rotate = function(n) { // APL port. needs refactoring
    let r = n % this.length;
    if (r < 0) r += this.length;
    return this.map((_, i) => {return this[(i + r) % this.length];}, this);
};
Array.prototype.scan = function(lambda, initial) {  // needs refactoring
  initial ??= 0;
  const result = [];
  let accumulator = initial;
  for (let i = 0; i < this.length; i++) {
    accumulator = lambda(accumulator, this[i], i, this);
    result.push(accumulator);
  }
  return result;
};
Array.prototype.outerProduct = function() { // APL port ∘.
  const arr = [];
  for (i = 0; i < this.length; i++) {
    arr.push(this.map(e => e + 1));
  }
  return arr;
};
Array.iota = function(start, end, n) {
  n ??= 1;
  if (!end) {
    end = start;
    start = 1;
  }
  let arr = new Array((end - start) / n);
  arr[0] = start;
  return arr.fill(0, 1).map((e, i) => arr[i + 1] = e + n);
};
Object.prototype.map = function(callback) {
  const mapped = {};
  for (const key in this) {
    if (this.hasOwnProperty(key)) {
      mapped[key] = callback(this[key], key, this);
    }
  }
  return mapped;
};
Object.prototype.mapKey = function(key, callback) {
  if (this.hasOwnProperty(key)) {
    const mapped = {};
    mapped[key] = callback(this[key], key, this);
    return mapped;
  }
};
Object.prototype.has = function(s, n) {
  if (this.hasOwnProperty(s)) {
    if (this[s] === n) {
      return true;
    }
  }
  for (let key in this) {
    if (typeof this[key] === 'object') {
      if ( this[key].has(s, n)) return true;
    }
  }
  return false;
}
Function.prototype.flip = function(...args) { // Haskell port needs recursion
  return this.apply(this, args.reverse());
};
Function.prototype.const = function(...args) { // Haskell port needs recursion
  return this.apply(this, [args[0]]);
};

Array.prototype.has = Object.prototype.has;
