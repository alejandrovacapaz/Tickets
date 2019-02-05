//****** Linq for Javascript
Array.prototype.where = Array.prototype.filter || function (predicate, context) {
    context = context || window;
    var arr = [];
    var l = this.length;
    for (var i = 0; i < l; i++)
        if (predicate.call(context, this[i], i, this) === true) arr.push(this[i]);
    return arr;
};

Array.prototype.select = Array.prototype.map || function (selector, context) {
    context = context || window;
    var arr = [];
    var l = this.length;
    for (var i = 0; i < l; i++)
        arr.push(selector.call(context, this[i], i, this));
    return arr;
};

Array.prototype.selectMany = function (selector, resSelector) {
    resSelector = resSelector || function (i, res) { return res; };
    return this.aggregate(function (a, b, i) {
        return a.concat(selector(b, i).select(function (res) { return resSelector(b, res) }));
    }, []);
};

Array.prototype.take = function (c) {
    return this.slice(0, c);
};

Array.prototype.skip = function (c) {
    return this.slice(c);
};

Array.prototype.first = function (predicate, def) {
    var l = this.length;
    if (!predicate) return l ? this[0] : def == null ? null : def;
    for (var i = 0; i < l; i++)
        if (predicate(this[i], i, this))
            return this[i];
    return def == null ? null : def;
};

Array.prototype.last = function (predicate, def) {
    var l = this.length;
    if (!predicate) return l ? this[l - 1] : def == null ? null : def;
    while (l-- > 0)
        if (predicate(this[l], l, this))
            return this[l];
    return def == null ? null : def;
};

Array.prototype.union = function (arr) {
    return this.concat(arr).distinct();
};

Array.prototype.intersect = function (arr, comparer) {
    comparer = comparer || DefaultEqualityComparer;
    return this.distinct(comparer).where(function (t) {
        return arr.contains(t, comparer);
    });
};

Array.prototype.except = function (arr, comparer) {
    if (!(arr instanceof Array)) arr = [arr];
    comparer = comparer || DefaultEqualityComparer;
    var l = this.length;
    var res = [];
    for (var i = 0; i < l; i++) {
        var k = arr.length;
        var t = false;
        while (k-- > 0) {
            if (comparer(this[i], arr[k]) === true) {
                t = true;
                break;
            }
        }
        if (!t) res.push(this[i]);
    }
    return res;
};

Array.prototype.distinct = function (comparer) {
    var arr = [];
    var l = this.length;
    for (var i = 0; i < l; i++) {
        if (!arr.contains(this[i], comparer))
            arr.push(this[i]);
    }
    return arr;
};

Array.prototype.zip = function (arr, selector) {
    return this
        .take(Math.min(this.length, arr.length))
        .select(function (t, i) {
            return selector(t, arr[i]);
        });
};

Array.prototype.indexOf = Array.prototype.indexOf || function (o, index) {
    var l = this.length;
    for (var i = Math.max(Math.min(index, l), 0) || 0; i < l; i++)
        if (this[i] === o) return i;
    return -1;
};

Array.prototype.lastIndexOf = Array.prototype.lastIndexOf || function (o, index) {
    var l = Math.max(Math.min(index || this.length, this.length), 0);
    while (l-- > 0)
        if (this[l] === o) return l;
    return -1;
};

Array.prototype.remove = function (item) {
    var i = this.indexOf(item);
    if (i != -1)
        this.splice(i, 1);
};

Array.prototype.removeAll = function (predicate) {
    var item;
    var i = 0;
    while (item = this.first(predicate)) {
        i++;
        this.remove(item);
    }
    return i;
};

Array.prototype.orderBy = function (selector, comparer) {
    comparer = comparer || DefaultSortComparer;
    var arr = this.slice(0);
    var fn = function (a, b) {
        return comparer(selector(a), selector(b));
    };

    arr.thenBy = function (selector, comparer) {
        comparer = comparer || DefaultSortComparer;
        return arr.orderBy(DefaultSelector, function (a, b) {
            var res = fn(a, b);
            return res === 0 ? comparer(selector(a), selector(b)) : res;
        });
    };

    arr.thenByDescending = function (selector, comparer) {
        comparer = comparer || DefaultSortComparer;
        return arr.orderBy(DefaultSelector, function (a, b) {
            var res = fn(a, b);
            return res === 0 ? -comparer(selector(a), selector(b)) : res;
        });
    };

    return arr.sort(fn);
};

Array.prototype.orderByDescending = function (selector, comparer) {
    comparer = comparer || DefaultSortComparer;
    return this.orderBy(selector, function (a, b) { return -comparer(a, b) });
};

Array.prototype.innerJoin = function (arr, outer, inner, result, comparer) {
    comparer = comparer || DefaultEqualityComparer;
    var res = [];

    this.forEach(function (t) {
        arr.where(function (u) {
            return comparer(outer(t), inner(u));
        })
            .forEach(function (u) {
                res.push(result(t, u));
            });
    });

    return res;
};

Array.prototype.groupJoin = function (arr, outer, inner, result, comparer) {
    comparer = comparer || DefaultEqualityComparer;
    return this
        .select(function (t) {
            var key = outer(t);
            return {
                outer: t,
                inner: arr.where(function (u) { return comparer(key, inner(u)); }),
                key: key
            };
        })
        .select(function (t) {
            t.inner.key = t.key;
            return result(t.outer, t.inner);
        });
};

Array.prototype.groupBy = function (selector, comparer) {
    var grp = [];
    var l = this.length;
    comparer = comparer || DefaultEqualityComparer;
    selector = selector || DefaultSelector;

    for (var i = 0; i < l; i++) {
        var k = selector(this[i]);
        var g = grp.first(function (u) { return comparer(u.key, k); });

        if (!g) {
            g = [];
            g.key = k;
            grp.push(g);
        }

        g.push(this[i]);
    }
    return grp;
};

Array.prototype.toDictionary = function (keySelector, valueSelector) {
    var o = {};
    var l = this.length;
    while (l-- > 0) {
        var key = keySelector(this[l]);
        if (key == null || key == "") continue;
        o[key] = valueSelector(this[l]);
    }
    return o;
};

Array.prototype.aggregate = Array.prototype.reduce || function (func, seed) {
    var arr = this.slice(0);
    var l = this.length;
    if (seed == null) seed = arr.shift();

    for (var i = 0; i < l; i++)
        seed = func(seed, arr[i], i, this);

    return seed;
};

Array.prototype.min = function (s) {
    s = s || DefaultSelector;
    var l = this.length;
    var min = s(this[0]);
    while (l-- > 0)
        if (s(this[l]) < min) min = s(this[l]);
    return min;
};

Array.prototype.max = function (s) {
    s = s || DefaultSelector;
    var l = this.length;
    var max = s(this[0]);
    while (l-- > 0)
        if (s(this[l]) > max) max = s(this[l]);
    return max;
};

Array.prototype.sum = function (s) {
    s = s || DefaultSelector;
    var l = this.length;
    var sum = 0;
    while (l-- > 0) sum += s(this[l]);
    return sum;
};

Array.prototype.any = function (predicate, context) {
    context = context || window;
    var f = this.some || function (p, c) {
        var l = this.length;
        if (!p) return l > 0;
        while (l-- > 0)
            if (p.call(c, this[l], l, this) === true) return true;
        return false;
    };
    return f.apply(this, [predicate, context]);
};

Array.prototype.all = function (predicate, context) {
    context = context || window;
    predicate = predicate || DefaultPredicate;
    var f = this.every || function (p, c) {
        return this.length == this.where(p, c).length;
    };
    return f.apply(this, [predicate, context]);
};

Array.prototype.takeWhile = function (predicate) {
    predicate = predicate || DefaultPredicate;
    var l = this.length;
    var arr = [];
    for (var i = 0; i < l && predicate(this[i], i) === true; i++)
        arr.push(this[i]);

    return arr;
};

Array.prototype.skipWhile = function (predicate) {
    predicate = predicate || DefaultPredicate;
    var l = this.length;
    var i = 0;
    for (i = 0; i < l; i++)
        if (predicate(this[i], i) === false) break;

    return this.skip(i);
};

Array.prototype.contains = function (o, comparer) {
    comparer = comparer || DefaultEqualityComparer;
    var l = this.length;
    while (l-- > 0)
        if (comparer(this[l], o) === true) return true;
    return false;
};

Array.prototype.forEach = Array.prototype.forEach || function (callback, context) {
    context = context || window;
    var l = this.length;
    for (var i = 0; i < l; i++)
        callback.call(context, this[i], i, this);
};

Array.prototype.defaultIfEmpty = function (val) {
    return this.length == 0 ? [val == null ? null : val] : this;
};

String.prototype.formatDate = function () {
    return this.split("/")[2] + "/" + this.split("/")[1] + "/" + this.split("/")[0];
};

String.prototype.toFormatDate = function (formatDate) {
    formatDate = formatDate || 'DD/MM/YYYY';
    return moment(this).format('DD/MM/YYYY');
};

function getCurrentTime(element) {
    var date = new Date();
    var hour = date.getHours().toString();
    var minute = date.getMinutes().toString();
    $('#' + element).val((hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute));
    $('#' + element).timeEntry({ show24Hours: true, useMouseWheel: false, noSeparatorEntry: true });
}

function DefaultEqualityComparer(a, b) {
    return a === b || a.valueOf() === b.valueOf();
};

function DefaultSortComparer(a, b) {
    if (a === b) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a == "string") return a.toString().localeCompare(b.toString());
    return a.valueOf() - b.valueOf();
};

function DefaultPredicate() {
    return true;
};

function DefaultSelector(t) {
    return t;
};

var UNIDADES = ["", "un ", "dos ", "tres ", "cuatro ", "cinco ", "seis ", "siete ", "ocho ", "nueve "];
var DECENAS = ["diez ", "once ", "doce ", "trece ", "catorce ", "quince ", "dieciseis ",
    "diecisiete ", "dieciocho ", "diecinueve", "veinte ", "treinta ", "cuarenta ",
    "cincuenta ", "sesenta ", "setenta ", "ochenta ", "noventa "];
var CENTENAS = ["", "ciento ", "doscientos ", "trecientos ", "cuatrocientos ", "quinientos ", "seiscientos ",
    "setecientos ", "ochocientos ", "novecientos "];

function Convertir(numero, mayusculas) {
    var literal = "";
    var parte_decimal;

    //si el numero utiliza (.) en lugar de (,) -> se reemplaza
    numero = numero.replace(".", ",");

    //si el numero no tiene parte decimal, se le agrega ,00
    if (numero.indexOf(",") == -1) {
        numero = numero + ",00";
    }
    //se valida formato de entrada -> 0,00 y 999 999 999,00

    //se divide el numero 0000000,00 -> entero y decimal
    var Num = numero.split(',');

    if (Num.length > 0) {
        //de da formato al numero decimal
        parte_decimal = Num[1] + "/100 Bolivianos";
        //se convierte el numero a literal
        if (parseInt(Num[0]) == 0) {//si el valor es cero                
            literal = "cero ";
        }
        else if (parseInt(Num[0]) > 999999) {//si es millon
            literal = getMillones(Num[0]);
        }
        else if (parseInt(Num[0]) > 999) {//si es miles
            literal = getMiles(Num[0]);
        }
        else if (parseInt(Num[0]) > 99) {//si es centena
            literal = getCentenas(Num[0]);
        }
        else if (parseInt(Num[0]) > 9) {//si es decena
            literal = getDecenas(Num[0]);
        }
        else {//sino unidades -> 9
            literal = getUnidades(Num[0]);
        }
        //devuelve el resultado en mayusculas o minusculas
        if (mayusculas) {
            return (literal + parte_decimal).ToUpper();
        }
        else {
            return (literal + parte_decimal);
        }
    }
    else {//error, no se puede convertir
        return literal = null;
    }
}

/* funciones para convertir los numeros a literales */

function getUnidades(numero) {   // 1 - 9            
    //si tuviera algun 0 antes se lo quita -> 09 = 9 o 009=9
    var num = numero.substring(numero.Length - 1);
    return UNIDADES[parseInt(num)];
}

function getDecenas(num) {// 99                        
    var n = parseInt(num);
    if (n < 10) {//para casos como -> 01 - 09
        return getUnidades(num);
    }
    else if (n > 19) {//para 20...99
        var u = getUnidades(num);
        if (!u) { //para 20,30,40,50,60,70,80,90
            return DECENAS[parseInt(num.substring(0, 1)) + 8];
        }
        else {
            return DECENAS[parseInt(num.substring(0, 1)) + 8] + "y " + u;
        }
    }
    else {//numeros entre 11 y 19
        return DECENAS[n - 10];
    }
}

function getCentenas(num) {// 999 o 099
    if (parseInt(num) > 99) {//es centena
        if (parseInt(num) == 100) {//caso especial
            return " cien ";
        }
        else {
            return CENTENAS[parseInt(num.substring(0, 1))] + getDecenas(num.substring(1));
        }
    }
    else {//por Ej. 099 
        //se quita el 0 antes de convertir a decenas
        return getDecenas(parseInt(num) + "");
    }
}

function getMiles(numero) {// 999 999
    //obtiene las centenas
    var c = numero.substring(numero.Length - 3);
    //obtiene los miles
    var m = numero.substring(0, numero.Length - 3);
    var n = "";
    //se comprueba que miles tenga valor entero
    if (parseInt(m) > 0) {
        n = getCentenas(m);
        return n + "mil " + getCentenas(c);
    }
    else {
        return "" + getCentenas(c);
    }

}

function getMillones(numero) { //000 000 000        
    //se obtiene los miles
    var miles = numero.substring(numero.Length - 6);
    //se obtiene los millones
    var millon = numero.substring(0, numero.Length - 6);
    var n = "";
    if (millon.Length > 1) {
        n = getCentenas(millon) + "millones ";
    }
    else {
        n = getUnidades(millon) + "millon ";
    }
    return n + getMiles(miles);
}

Object.defineProperty(Object.prototype, 'mapper',{
  value : function(modelTarget) {
      var modelSource = this;

    for (var key in modelSource) {
        if (modelSource.hasOwnProperty(key))
            modelSource[key] = modelTarget[key];
    }
    return modelSource;
  },
  enumerable : false
});