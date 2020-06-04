'operator-overloading enabled'


let x1 = {a:1, b:2}
delete x1['a']
delete x1.b

let x2 = 1
~x2
+x2

let j1 = 1
console.log(j1)
console.log(++j1)
console.log(j1++)
console.log(+j1)
console.log(-j1)
console.log(typeof j1)
console.log(j1)

const x = 1.2
const y = 3.4
const z = x + y
console.log(z)

class Point {
  
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  [Symbol.for('+')](other) {
    const x = this.x + other.x
    const y = this.y + other.y
    return new Point(x, y)
  }

  [Symbol.for('prefix-increment')]() {
    ++this.x
    ++this.y
    return this
  }

  [Symbol.for('postfix-increment')]() {
    const pre = new Point(this.x, this.y)
    this.x++
    this.y++
    return pre
  }

  [Symbol.for('==')](other) {
    return this.x == other.x && this.y == other.y
  }

  toString() {
    return `x=${this.x}, y=${this.y}`
  }
}

const p1 = new Point(5, 5)
const p2 = new Point(2, 3)
const p3 = p1 + p2
console.log(p3.toString())

const p4 = new Point(5, 5)
let p5 = new Point(2, 3)
p5 += p4
console.log(p5.toString())

console.log(p1 == p1)
console.log(p1 == p2)

