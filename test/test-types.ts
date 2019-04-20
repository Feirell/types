import { type, stringObjectName, functionType } from "../type";

/*
const cases = [
    `Object.create(null)`, // object (has no prototype)

    `[]`, // Array
    `new Array()`, // Array

    `{}`, // Object
    `new Object()`, // Object

    `Symbol('Test Symbol')`, // symbol
    `"String Literal"`, // string
    `new String('String Wrapper Object')`, // String
    `true`, // boolean
    `undefined`, // undefined
    `null`, // null

    `new (class ClassExample { })()`, // ClassExample
    `new (function FunctionExample() { })()`, // FunctionExample
    `new Date(0)`, // Date
    `Math`, // Math
    `global`, // global (with node js)
    `window`, // Window (with a browser)
    `new WeakMap()`,
    `new Map()`,

    `() => { }`, // function
    `function () { }`, // function
    `class OtherExample { }`, // function
    `new Function('')`,

    `-123`, // number
    `new Number(123)`, // Number
    `NaN`, // NaN
    `BigInt(123)`, // bigint if available
    `Infinity`, // Infinity
    `-Infinity`, // -Infinity
];
*/

const cases = [
    `Object.create(null)`, // object

    `[]`, // Array
    `new Array()`, // Array

    `{}`, // Object
    `new Object()`, // Object

    `Symbol("Test Symbol")`, // symbol
    `"String Literal"`, // string
    `new String("String Wrapper Object")`, // String
    `true`, // boolean
    `undefined`, // undefined
    `null`, // null

    `new (class ClassExample { })()`, // ClassExample
    `new (function FunctionExample() { })()`, // FunctionExample
    `new Date(0)`, // Date
    `Math`, // Math
    `global`, // global
    `window`, // Window
    `new WeakMap()`, // WeakMap
    `new Map()`, // Map

    `() => { }`, // function
    `function () { }`, // function
    `class OtherExample { }`, // function
    `new Function("")`, // function

    `-123`, // number
    `new Number(123)`, // Number
    `NaN`, // NaN
    `BigInt(123)`, // bigint
    `Infinity`, // Infinity
    `-Infinity`, // -Infinity
];

const printCouldNotEvaluate = true;

const expandedTypes = cases
    .map(code => {
        try {
            const evaluated = new Function('return ' + code)();
            return { code, evaluated };
        } catch (e) {
            if (printCouldNotEvaluate)
                console.info('could not evaluate "' + code + '"');
            return null;
        }
    })
    .filter(v => v != null)
    .map(({ code, evaluated }, i) => {
        return {
            'JavaScript': code,
            'console.log(v)': evaluated,
            '"" + v': type(evaluated) != 'object' && type(evaluated) != 'symbol' ? '' + evaluated : undefined,
            'stringObjectName(v)': stringObjectName(evaluated),
            'typeof v': typeof evaluated,
            'type(v)': type(evaluated),
            'functionType(v)': functionType(evaluated)
        }
    });

console.table(expandedTypes);
// console.log(expandedTypes.map(o => '    `' + o['JavaScript'] + '`, // ' + o['type(v)']).join('\n'))