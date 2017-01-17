//: Playground - noun: a place where people can play

import UIKit

let str = "Hello, playground"

switch str.characters.count {
case 5...10:
    print("long name")
default:
    print("some length")
}

var number = 0

while number < 10 {
    number += 2
}

for number in 0..<10 {
    number
}

var animals:[String] = ["cow","dog"]

for animal in animals {
    animal
}


// Dictionaries
var cuteness = ["cow" : "ugly", "dog" : "cute"]

for animal in animals {
    cuteness[animal]
}

// Functions

func doMath(operation:String, on a:Double, and b:Double) -> Double {
    print(a, operation, b)
    var result:Double = 0
    switch operation {
    case "+":
        result = a + b
    case "-":
        result = a - b
    default:
        print("bad operation: ",operation)
    }
    return result
}

doMath("+", on: 10, and: 11)
