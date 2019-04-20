/**
 * This function gets the constructor function which might be responsible
 * for creating this assumed instance. The constructor function does not
 * need to be the function which created this object but it is very likely.
 * 
 * Please keep in mind that the constructor function is easily spoofed.
 * 
 * If no constructor function was found, null will be returned.
 */
export const getValidConstructorFunction = (inst: any) => {
    const proto = Object.getPrototypeOf(inst);
    if (// has a prototype
        proto &&
        // the prototype has a constructor (might be overwritten or replaced)
        typeof proto.constructor == 'function' &&
        // the given constructor and its prototype defined are the same object
        // as the prototype of this object(is really an instance of this
        // constructor) this is euqal to instanceof
        proto.constructor.prototype == proto)
        return proto.constructor;
    else return null;
}

/**
 * This function is in essence a more versatile `typeof` function.
 * See the example table for a more in depth comparison.
 * 
 * Just be aware that this function is about 6 times slower then `typeof` is.
 */
export const stringObjectName = (() => {
    const tsFnc = ({}).toString;
    return (o: any): string => tsFnc.call(o).slice(8, -1);
})();

/**
 * This function can help to guess the the type of function which was given.
 * Please don't rely on the result and take it more as an reasonable guess.
 * 
 * If the current JavaScript runtime is not able to assume the function type
 * this function will return undefined in any case. This function will throw
 * an error if it can not guess the function type and `typeof` returned 'function'.
 */
export const functionType = (() => {
    const det = (o: any) => {
        if (typeof o != 'function')
            return undefined;

        const str = '' + o;

        if (str.startsWith('class '))
            return 'class';

        if (str.startsWith('('))
            return 'arrow';

        if (str.startsWith('function '))
            return 'function';

        throw new TypeError('can not determine the type of the given function');
    }

    // test wether this approach can determine with witch literal this function was created
    {
        let worked = true;

        try {
            const valA = /** some obfuscation */() => { };
            const valB = /** some obfuscation */class EXClass { };
            const valC = /** some obfuscation */function bac() { };

            worked =
                det(valA) == 'arrow' &&
                det(valB) == 'class' &&
                det(valC) == 'function';

        } catch (e) { worked = false; }

        return worked ? det : (): undefined => undefined;
    }
})();

/**
 * This function is the most versatile of all provided helper.
 * It tries to determine the type of the given value.
 * 
 * Please see the table in the README for examples.
 * 
 * Note that the returned class might not be unique.
 * There can be multiple separate functions which have the same
 * name and therefore result in the same string when applied to
 * this function.
 * 
 * You should not rely on the result of this function if you
 * want to be me certain some instance was created by some
 * desired constructor use the getValidConstructorFunction
 * instead and compare the resulting function with the function
 * you expected. Either way you should keep the reminder at the
 * getValidConstructorFunction in mind as well.
 */
export const type = (o: any) => {
    const type = typeof o;

    switch (type) {
        case 'object':
            if (o === null)
                return 'null';

            const son = stringObjectName(o); // Catches BuildIn Objects like Math, global, Window, Document, ...
            if (son != 'Object')
                return son;

            const cf = getValidConstructorFunction(o);
            // you could prepend something (e.g. '_') before cf.name to ensure that user are not able to fake a type like Window, Date, ...
            return cf /* && cf != Object */ ? cf.name : 'object';

        case 'number':
            if (Infinity == o)
                return 'Infinity';

            if (-Infinity == o)
                return '-Infinity';

            if (o !== o)
                return 'NaN';

            return type;

        default:
            return type;
    }
};