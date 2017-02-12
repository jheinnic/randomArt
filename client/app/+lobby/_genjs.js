module.exports = {};
var ocamljs$caml_named_value = function () {
  function Ma(a, c, d) {
    function R(a, c) {
      var b, d = [];
      for (b = 0; b < a.length; b++)d.push(a[b]);
      for (b = 0; b < c.length; b++)d.push(c[b]);
      return d
    }

    for (var q, t; ;)if (q = d.length, t = a.length, q < t)switch (t - q) {
      case 1:
        return b(function (b) {
          return a.apply(c, R(d, arguments))
        });
      case 2:
        return b(function (b, q) {
          return a.apply(c, R(d, arguments))
        });
      case 3:
        return b(function (b, q, t) {
          return a.apply(c, R(d, arguments))
        });
      case 4:
        return b(function (b, q, t, h) {
          return a.apply(c, R(d, arguments))
        });
      case 5:
        return b(function (b,
                           q, t, h, e) {
          return a.apply(c, R(d, arguments))
        });
      case 6:
        return b(function (b, q, t, h, e, g) {
          return a.apply(c, R(d, arguments))
        });
      case 7:
        return b(function (b, q, t, h, e, g, I) {
          return a.apply(c, R(d, arguments))
        });
      default:
        throw"unimplemented";
    } else {
      if (q == t)return a.apply(c, d);
      c = a = Ba(a, c, d.slice(0, t));
      d = d.slice(t)
    }
  }

  function Ea(a, c, b) {
    var d;
    if (a.$oc)return S ? (b.$m = a, b.$t = c, b.$tr = !0, b) : Ba(a, c, b);
    d = S;
    S = !1;
    try {
      return a.apply(c, b)
    } finally {
      S = d
    }
  }

  function d(a, c) {
    return Ea(a, a, c)
  }

  function Ba(a, c, b) {
    var d, q;
    if (a.$oc) {
      d = S;
      S = !0;
      try {
        for (q =
               Ea(a, c, b); q && q.$tr;)q = Ma(q.$m, q.$t, q);
        return q
      } finally {
        S = d
      }
    } else {
      d = S;
      S = !1;
      try {
        return a.apply(c, b)
      } finally {
        S = d
      }
    }
  }

  function c(a, c) {
    return Ba(a, a, c)
  }

  function b(a) {
    a.$oc = !0;
    return a
  }

  function wa(a, c) {
    var b, d = c.length, q = Array(d);
    for (b = 0; b < d; b++)q[b] = c[b];
    q.t = a;
    return q
  }

  function a() {
    return wa(0, arguments)
  }

  function M() {
    return wa(1, arguments)
  }

  function T() {
    return wa(2, arguments)
  }

  function W() {
    return wa(3, arguments)
  }

  function v(a, c) {
    return c < a.length ? a[c] : e[0]("index out of bounds")
  }

  function E(a, c, b) {
    return c <
    a.length ? a[c] = b : e[0]("index out of bounds")
  }

  function Ca(a) {
    this.a = a;
    this.length = a.length
  }

  function X(a) {
    return new Ca(Array(a))
  }

  function da(a, c) {
    return "string" == typeof a ? a.charCodeAt(c) : a.a[c]
  }

  function la(a, c) {
    return c < a.length ? da(a, c) : e[0]("index out of bounds")
  }

  var fa = function (a, c, b, d, e) {
    var q;
    for (q = 0; q < e; q++) {
      var R = da(a, c + q);
      b.a[d + q] = R
    }
  }, ma = function (c, b, d) {
    var q, e, g;
    if (c == b && d)return 0;
    q = typeof c;
    e = typeof b;
    if (q == e)switch (q) {
      case "boolean":
        return c < b ? -1 : c > b ? 1 : 0;
      case "number":
        if (c < b)return -1;
        if (c >
          b)return 1;
        if (c != b) {
          if (!d)return -2;
          if (c == c)return 1;
          if (b == b)return -1
        }
        return 0;
      case "string":
        return c < b ? -1 : c > b ? 1 : 0;
      case "function":
        throw a("Invalid_argument", "equal: functional value");
      case "object":
        if (null == c)return null == b ? 0 : -1;
        if (null == b)return 1;
        if (c instanceof Date)return q = c.getTime(), e = b.getTime(), q < e ? -1 : q > e ? 1 : 0;
        if (c instanceof Array) {
          if (c.t < b.t)return -1;
          if (c.t > b.t)return 1;
          q = c.length;
          e = b.length;
          if (q < e)return -1;
          if (q > e)return 1;
          if (0 == q)return 0;
          for (e = 0; e < q; e++)if (g = ma(c[e], b[e], d), 0 != g)return g;
          return 0
        }
        return c instanceof Ca ? (c = c.toString(), b = b.toString(), c < b ? -1 : c > b ? 1 : 0) : null != c._m && null != b._m ? (c = c[1], b = b[1], c < b ? -1 : c > b ? 1 : 0) : -2;
      default:
        return -2
    }
    return null == c ? null == b ? 0 : -1 : null == b ? 1 : "boolean" == q || "boolean" == e ? c < b ? -1 : c > b ? 1 : 0 : "string" == q || "string" == e ? (c = c.toString(), b = b.toString(), c < b ? -1 : c > b ? 1 : 0) : "number" == q ? -1 : "number" == e ? 1 : -2
  }, na = function (a, c) {
    var b = ma(a, c, 1);
    return 0 > b ? -1 : 0 < b ? 1 : 0
  }, ja = function (a, c) {
    return 0 == ma(a, c, 0)
  }, oa = function (a) {
    switch (a) {
      case "9218868437227405312":
        return Number.POSITIVE_INFINITY;
      case "-4503599627370496":
        return Number.NEGATIVE_INFINITY;
      case "9218868437227405313":
        return Number.NaN;
      case "9218868437227405311":
        return Number.MAX_VALUE;
      case "4503599627370496":
        return Number.MIN_VALUE;
      case "4372995238176751616":
        return 0;
      default:
        return 0
    }
  }, J = function (a, c) {
    var b, d = Array(a);
    for (b = 0; b < a; b++)d[b] = c;
    return d
  }, Fa = function () {
    throw"caml_ml_channel_size";
  }, Ga = function () {
    throw"caml_ml_channel_size_64";
  }, xa = function () {
    throw"caml_ml_close_channel";
  }, Ha = function () {
    throw"caml_ml_input_char";
  }, Ia =
    function () {
      throw"caml_ml_set_binary_mode";
    }, pa = function (a) {
    var c, b = a.length, d = Array(b);
    for (c = 0; c < b; c++)d[c] = a[c];
    d.t = a.t;
    return d
  }, Ja = {}, S = !1;
  Ca.prototype.toString = function () {
    return String.fromCharCode.apply(null, this.a)
  };
  "undefined" != typeof Number.prototype.toFixed && function () {
    function a(a, c, b) {
      if (0 < b.length)for (; a.length < c;)a = b + a;
      return a
    }

    Number.prototype.toFixed = function (c) {
      var b = 0 > this ? "-" : "";
      var d = Math.abs(this), e, g;
      g = String(Math.round(d * Number("1e" + c)));
      if (g.search && -1 != g.search(/\D/)) c = "" +
        d; else with (String(a(g, 1 + c, "0")))c = substring(0, e = length - c) + "." + substring(e);
      return b + c
    }
  }();
  var sa = function () {
    var a, c, b, d, e, g, r, l, y, h, n, D, A, F;
    (!arguments || 1 > arguments.length) && alert("sprintf:ERROR: not enough arguments 1");
    a = 0;
    c = "";
    for (b = arguments[a++]; d = /^([^%]*)%(\d+$)?([-#0 +']+)?(\*|\d+)?(\.\*|\.\d+)?([%dioulLnNxXfFgGcs])(.*)$/.exec(b);) {
      b = d[1];
      e = d[2];
      g = d[3];
      r = d[4];
      l = d[5];
      y = d[6];
      d = d[7];
      if ("%" == y) h = "%"; else {
        n = " ";
        D = !0;
        g ? (0 <= g.indexOf("0") && (n = "0"), 0 <= g.indexOf("-") && (n = " ", D = !1)) : g = "";
        A = -1;
        r && ("*" ==
        r ? (F = a++, F >= arguments.length && alert("sprintf:ERROR: not enough arguments 2"), A = arguments[F]) : A = parseInt(r, 10));
        r = -1;
        l && (".*" == l ? (F = a++, F >= arguments.length && alert("sprintf:ERROR: not enough arguments 3"), r = arguments[F]) : r = parseInt(l.substring(1), 10));
        F = a++;
        e && (F = parseInt(e.substring(0, e.length - 1), 10));
        F >= arguments.length && alert("sprintf:ERROR: not enough arguments 4");
        e = "";
        switch (y) {
          case "d":
          case "i":
            h = arguments[F];
            "number" != typeof h && (h = 0);
            h = h.toString(10);
            0 <= g.indexOf("#") && 0 <= h && (h = "+" + h);
            0 <= g.indexOf(" ") &&
            0 <= h && (h = " " + h);
            break;
          case "o":
            h = arguments[F];
            "number" != typeof h && (h = 0);
            h = h.toString(8);
            break;
          case "u":
          case "l":
          case "L":
          case "n":
          case "N":
            h = arguments[F];
            "number" != typeof h && (h = 0);
            h = Math.abs(h);
            h = h.toString(10);
            break;
          case "x":
            h = arguments[F];
            "number" != typeof h && (h = 0);
            h = h.toString(16).toLowerCase();
            0 <= g.indexOf("#") && (e = "0x");
            break;
          case "X":
            h = arguments[F];
            "number" != typeof h && (h = 0);
            h = h.toString(16).toUpperCase();
            0 <= g.indexOf("#") && (e = "0X");
            break;
          case "f":
          case "F":
          case "g":
          case "G":
            h = arguments[F];
            "number" != typeof h && (h = 0);
            h = 0 + h;
            -1 < r && (h.toFixed ? h = h.toFixed(r) : (h = Math.round(h * Math.pow(10, r)) / Math.pow(10, r), h += "0000000000", h = h.substr(0, h.indexOf(".") + r + 1)));
            h = "" + h;
            if (0 <= g.indexOf("'"))for (g = 0, y = h.length - 1 - 3; 0 <= y; y -= 3)h = h.substring(0, y) + (0 == g ? "." : ",") + h.substring(y), g = (g + 1) % 2;
            h = h.replace("Infinity", "inf");
            h = h.replace("NaN", "nan");
            break;
          case "c":
            h = arguments[F];
            "number" != typeof h && (h = 0);
            h = String.fromCharCode(h);
            break;
          case "s":
            h = arguments[F], -1 < r && (h = h.substr(0, r)), "string" != typeof h && (h = "")
        }
        A = A - h.toString().length -
          e.toString().length;
        0 < A && (A = Array(A + 1), h = D ? A.join(n) + h : h + A.join(n));
        h = e + h
      }
      c = c + b + h;
      b = d
    }
    return c + b
  }, e = function () {
    var e = b(function (c) {
        throw a("Failure", c);
      }), g = b(function (c) {
        throw a("Invalid_argument", c);
      }), l = a("Pervasives.Exit"), n = b(function (a, c) {
        return -1 >= ma(a, c, 0) - 1 ? a : c
      }), K = b(function (a, c) {
        return 0 <= ma(a, c, 0) ? a : c
      }), I = b(function (a) {
        return 0 <= a ? a : -a
      }), r = b(function (a) {
        return a ^ -1
      }), G = 1 << 62, y = G - 1, h = oa("9218868437227405312"), L = oa("-4503599627370496"), D = oa("9218868437227405313"), A = oa("9218868437227405311"),
      F = oa("4503599627370496"), O = oa("4372995238176751616"), v = b(function (a, c) {
        return a.toString() + c.toString()
      }), Y = b(function (a) {
        return 0 > a || 255 < a ? d(g, ["char_of_int"]) : a
      }), Z = b(function (a) {
        return a ? "true" : "false"
      }), aa = b(function (a) {
        return a.toString() == "false".toString() ? !1 : a.toString() != "true".toString() ? d(g, ["bool_of_string"]) : !0
      }), ba = b(function (a) {
        return sa("%d", a)
      });
    a();
    var U = b(function (a) {
      var c = a.length, m = b(function (b) {
        var u;
        if (b >= c)return d(v, [a, "."]);
        u = la(a, b);
        a:{
          if (!(48 <= u)) {
            if (45 === u) {
              u = !0;
              break a
            }
            return a
          }
          if (58 <=
            u)return a;
          u = !0
        }
        if (u)return d(m, [b + 1])
      });
      return d(m, [0])
    }), ca = b(function (a) {
      return d(U, [sa("%.12g", a)])
    }), k = b(function (b, d) {
      return b ? a(b[0], c(k, [b[1], d])) : d
    }), ga = b(function (a, c, b) {
      throw"caml_sys_open";
    }), f = b(function (c) {
      return d(ga, [a(1, a(3, a(4, a(7, 0)))), 438, c])
    }), w = b(function (c) {
      return d(ga, [a(1, a(3, a(4, a(6, 0)))), 438, c])
    }), qa = b(function (a) {
      var c = b(function (a) {
        return a ? d(c, [a[1]]) : 0
      });
      return d(c, [0])
    }), N = b(function (a, c) {
      print_verbatim(c)
    }), ka = b(function (a, c, b, m) {
      if (0 > b || 0 > m || b > c.length - m)return d(g,
        ["output"]);
      print_verbatim(c)
    }), ya = b(function (a, c) {
      throw"caml_output_value";
    }), V = b(function (a) {
      return xa(a)
    }), za = b(function (a) {
      try {
        return xa(a)
      } catch (Oa) {
        return 0
      }
    }), ua = b(function (a, c, b) {
      throw"caml_sys_open";
    }), ha = b(function (c) {
      return d(ua, [a(0, a(7, 0)), 0, c])
    }), Q = b(function (c) {
      return d(ua, [a(0, a(6, 0)), 0, c])
    }), z = b(function (a, c, b, m) {
      if (0 > b || 0 > m || b > c.length - m) a = d(g, ["input"]); else throw"caml_ml_input";
      return a
    }), E = b(function (a, c, b, d) {
      if (0 >= d)return 0;
      throw"caml_ml_input";
    }), x = b(function (a, c, b, m) {
      return 0 >
      b || 0 > m || b > c.length - m ? d(g, ["really_input"]) : d(E, [a, c, b, m])
    }), P = b(function (a) {
      var c = b(function (a, b, m) {
        var u, f;
        return m ? (u = m[0], f = u.length, fa(u, 0, a, b - f, f), d(c, [a, b - f, m[1]])) : a
      });
      a = b(function (a, c) {
        throw"caml_ml_input_scan_line";
      });
      return d(a, [0, 0])
    }), m = b(function (a) {
      try {
        return xa(a)
      } catch (Oa) {
        return 0
      }
    }), u = b(function (a) {
    }), Pa = b(function (a) {
      return d(N, [0, a])
    }), Qa = b(function (a) {
      return d(N, [0, c(ba, [a])])
    }), Ra = b(function (a) {
      return d(N, [0, c(ca, [a])])
    }), Sa = b(function (a) {
      c(N, [0, a])
    }), Ta = b(function (a) {
    }), Ua =
      b(function (a) {
      }), Va = b(function (a) {
      return d(N, [0, a])
    }), Wa = b(function (a) {
      return d(N, [0, c(ba, [a])])
    }), Xa = b(function (a) {
      return d(N, [0, c(ca, [a])])
    }), Ya = b(function (a) {
      c(N, [0, a])
    }), M = b(function (a) {
    }), J = b(function (a) {
      return d(P, [0])
    }), Za = b(function (b) {
      b = c(J, [0]);
      b = parseInt(b, 10);
      if (isNaN(b))throw a("Failure", "int_of_string");
      return b
    }), B = b(function (b) {
      b = c(J, [0]);
      b = parseFloat(b);
      if (isNaN(b))throw a("Failure", "float_of_string");
      return b
    });
    a();
    var H = b(function (a, b) {
      return c(v, [a, b])
    }), p = b(function (a) {
      var c =
        a.length, b = X(c);
      fa(a, 0, b, 0, c);
      return b
    }), C = a(qa), va = b(function (a) {
      var m = C[0];
      return C[0] = b(function (b) {
        c(a, [0]);
        return d(m, [0])
      })
    }), ta = b(function (a) {
      return d(C[0], [0])
    }), $a = b(function (a) {
      c(ta, [0]);
      throw"caml_sys_exit";
    });
    Ja["Pervasives.do_at_exit"] = ta;
    return a(g, e, l, n, K, I, y, G, r, h, L, D, A, F, O, v, Y, Z, aa, ba, ca, k, 0, 0, 0, u, Pa, Qa, Ra, Sa, Ta, Ua, Va, Wa, Xa, Ya, M, J, Za, B, f, w, ga, b(function (a) {
    }), qa, b(function (a, c) {
    }), N, ka, b(function (a, c) {
    }), b(function (a, c) {
      throw"caml_ml_output_int";
    }), ya, b(function (a, c) {
      throw"caml_ml_seek_out";
    }), b(function (a) {
      throw"caml_ml_pos_out";
    }), b(function (a) {
      return Fa(a)
    }), V, za, b(function (a, c) {
      return Ia(a, c)
    }), ha, Q, ua, b(function (a) {
      return Ha(a)
    }), P, z, x, b(function (a) {
      return Ha(a)
    }), b(function (a) {
      throw"caml_ml_input_int";
    }), b(function (a) {
      throw"caml_input_value";
    }), b(function (a, c) {
      throw"caml_ml_seek_in";
    }), b(function (a) {
      throw"caml_ml_pos_in";
    }), b(function (a) {
      return Fa(a)
    }), b(function (a) {
      return xa(a)
    }), m, b(function (a, c) {
      return Ia(a, c)
    }), a(b(function (a, c) {
      throw"caml_ml_seek_out_64";
    }), b(function (a) {
      throw"caml_ml_pos_out_64";
    }), b(function (a) {
      return Ga(a)
    }), b(function (a, c) {
      throw"caml_ml_seek_in_64";
    }), b(function (a) {
      throw"caml_ml_pos_in_64";
    }), b(function (a) {
      return Ga(a)
    })), p, H, $a, va, U, E, ta)
  }(), Aa = function () {
    var c = b(function (a) {
      return 0 > a || 255 < a ? d(e[0], ["Char.chr"]) : a
    }), g = b(function (a) {
      var c;
      a:{
        if (39 === a)return "\\'";
        if (92 === a)return "\\\\";
        if (14 <= a) c = !0; else switch (a) {
          case 0:
            c = !0;
            break a;
          case 1:
            c = !0;
            break a;
          case 2:
            c = !0;
            break a;
          case 3:
            c = !0;
            break a;
          case 4:
            c = !0;
            break a;
          case 5:
            c = !0;
            break a;
          case 6:
            c = !0;
            break a;
          case 7:
            c = !0;
            break a;
          case 8:
            return "\\b";
          case 9:
            return "\\t";
          case 10:
            return "\\n";
          case 11:
            c = !0;
            break a;
          case 12:
            c = !0;
            break a;
          case 13:
            return "\\r";
          default:
            return null
        }
      }
      if (c) {
        if (31 < a && 127 > a)return c = X(1), c.a[0] = a, c;
        c = X(4);
        c.a[0] = 92;
        c.a[1] = 48 + (a / 100 >> 0);
        c.a[2] = 48 + (a / 10 >> 0) % 10;
        c.a[3] = 48 + a % 10;
        return c
      }
    }), l = b(function (a) {
      return 65 <= a && 90 >= a || 192 <= a && 214 >= a || 216 <= a && 222 >= a ? a + 32 : a
    }), n = b(function (a) {
      return 97 <= a && 122 >= a || 224 <= a && 246 >= a || 248 <= a && 254 >= a ? a - 32 : a
    }), K = b(function (a, c) {
      return a - c
    });
    return a(c, g, l, n, K)
  }(), n = function () {
    var g =
      b(function (a, c) {
        return c ? d(g, [a + 1, c[1]]) : a
      }), q = b(function (a) {
      return d(g, [0, a])
    }), l = b(function (a) {
      return a ? a[0] : d(e[1], ["hd"])
    }), n = b(function (a) {
      return a ? a[1] : d(e[1], ["tl"])
    }), K = b(function (a, c) {
      var m;
      if (0 > c)return d(e[0], ["List.nth"]);
      m = b(function (a, c) {
        return a ? 0 === c ? a[0] : d(m, [a[1], c - 1]) : d(e[1], ["nth"])
      });
      return d(m, [a, c])
    }), v = e[21], r = b(function (c, b) {
      return c ? d(r, [c[1], a(c[0], b)]) : b
    }), G = b(function (a) {
      return d(r, [a, 0])
    }), y = b(function (a) {
      return a ? d(e[21], [a[0], c(y, [a[1]])]) : 0
    }), h = b(function (b, d) {
      var m;
      return d ? (m = c(b, [d[0]]), a(m, c(h, [b, d[1]]))) : 0
    }), L = b(function (m, u) {
      var f = b(function (b, u) {
        return u ? d(f, [a(c(m, [u[0]]), b), u[1]]) : b
      });
      return d(f, [0, u])
    }), D = b(function (a, b) {
      return b ? (c(a, [b[0]]), d(D, [a, b[1]])) : 0
    }), A = b(function (a, b, f) {
      return f ? d(A, [a, c(a, [b, f[0]]), f[1]]) : b
    }), F = b(function (a, b, f) {
      return b ? d(a, [b[0], c(F, [a, b[1], f])]) : f
    }), O = b(function (b, u, f) {
      var m;
      a:{
        if (!u) {
          if (f) {
            b = !0;
            break a
          }
          return 0
        }
        if (f)return m = c(b, [u[0], f[0]]), a(m, c(O, [b, u[1], f[1]]));
        b = !0
      }
      if (b)return d(e[0], ["List.map2"])
    }), Da = b(function (m,
                         u, f) {
      var x = b(function (b, f, u) {
        a:{
          if (!f) {
            if (u) {
              b = !0;
              break a
            }
            return b
          }
          if (u)return d(x, [a(c(m, [f[0], u[0]]), b), f[1], u[1]]);
          b = !0
        }
        if (b)return d(e[0], ["List.rev_map2"])
      });
      return d(x, [0, u, f])
    }), Y = b(function (a, b, f) {
      a:{
        if (!b) {
          if (f) {
            a = !0;
            break a
          }
          return 0
        }
        if (f)return c(a, [b[0], f[0]]), d(Y, [a, b[1], f[1]]);
        a = !0
      }
      if (a)return d(e[0], ["List.iter2"])
    }), Z = b(function (a, b, f, x) {
      a:{
        if (!f) {
          if (x) {
            a = !0;
            break a
          }
          return b
        }
        if (x)return d(Z, [a, c(a, [b, f[0], x[0]]), f[1], x[1]]);
        a = !0
      }
      if (a)return d(e[0], ["List.fold_left2"])
    }), aa = b(function (a,
                         b, f, x) {
      a:{
        if (!b) {
          if (f) {
            a = !0;
            break a
          }
          return x
        }
        if (f)return d(a, [b[0], f[0], c(aa, [a, b[1], f[1], x])]);
        a = !0
      }
      if (a)return d(e[0], ["List.fold_right2"])
    }), ba = b(function (a, b) {
      return b ? c(a, [b[0]]) && c(ba, [a, b[1]]) : !0
    }), U = b(function (a, b) {
      return b ? c(a, [b[0]]) || c(U, [a, b[1]]) : !1
    }), ca = b(function (a, b, f) {
      a:{
        if (!b) {
          if (f) {
            a = !0;
            break a
          }
          return !0
        }
        if (f)return c(a, [b[0], f[0]]) && c(ca, [a, b[1], f[1]]);
        a = !0
      }
      if (a)return d(e[0], ["List.for_all2"])
    }), k = b(function (a, b, f) {
      a:{
        if (!b) {
          if (f) {
            a = !0;
            break a
          }
          return !1
        }
        if (f)return c(a, [b[0], f[0]]) ||
          c(k, [a, b[1], f[1]]);
        a = !0
      }
      if (a)return d(e[0], ["List.exists2"])
    }), ga = b(function (a, b) {
      return b ? 0 === na(b[0], a) || c(ga, [a, b[1]]) : !1
    }), f = b(function (a, b) {
      return b ? b[0] === a || c(f, [a, b[1]]) : !1
    }), w = b(function (c, b) {
      var f;
      if (b)return f = b[0], 0 === na(f[0], c) ? f[1] : d(w, [c, b[1]]);
      throw a("Not_found");
    }), qa = b(function (c, b) {
      var f;
      if (b)return f = b[0], f[0] === c ? f[1] : d(qa, [c, b[1]]);
      throw a("Not_found");
    }), N = b(function (a, b) {
      return b ? 0 === na(b[0][0], a) || c(N, [a, b[1]]) : !1
    }), ka = b(function (a, b) {
      return b ? b[0][0] === a || c(ka, [a, b[1]]) :
        !1
    }), ya = b(function (b, d) {
      var f, m;
      return d ? (f = d[1], m = d[0], 0 === na(m[0], b) ? f : a(m, c(ya, [b, f]))) : 0
    }), V = b(function (b, d) {
      var f, m;
      return d ? (f = d[1], m = d[0], m[0] === b ? f : a(m, c(V, [b, f]))) : 0
    }), za = b(function (b, f) {
      var m;
      if (f)return m = f[0], c(b, [m]) ? m : d(za, [b, f[1]]);
      throw a("Not_found");
    }), ua = b(function (f) {
      var m = b(function (b, x) {
        var u, e;
        return x ? (u = x[1], e = x[0], c(f, [e]) ? d(m, [a(e, b), u]) : d(m, [b, u])) : d(G, [b])
      });
      return d(m, [0])
    }), ha = b(function (f, x) {
      var m = b(function (b, x, u) {
        var e;
        return u ? (e = u[1], u = u[0], c(f, [u]) ? d(m, [a(u, b),
              x, e]) : d(m, [b, a(u, x), e])) : a(c(G, [b]), c(G, [x]))
      });
      return d(m, [0, 0, x])
    }), Q = b(function (b) {
      var d;
      return b ? (d = b[0], b = c(Q, [b[1]]), a(a(d[0], b[0]), a(d[1], b[1]))) : a(0, 0)
    }), E = b(function (b, f) {
      var m;
      a:{
        if (!b) {
          if (f) {
            m = !0;
            break a
          }
          return 0
        }
        if (f)return a(a(b[0], f[0]), c(E, [b[1], f[1]]));
        m = !0
      }
      if (m)return d(e[0], ["List.combine"])
    }), z = b(function (b, d, f) {
      var m, x;
      return d ? f ? (m = f[0], x = d[0], 0 >= c(b, [x, m]) ? a(x, c(z, [b, d[1], f])) : a(m, c(z, [b, d, f[1]]))) : d : f
    }), x = b(function (b, c) {
      if (0 === b)return c;
      if (c)return d(x, [b - 1, c[1]]);
      throw a("Assert_failure",
        a("ocaml/stdlib/list.ml", 213, 11));
    }), P = b(function (f, e) {
      var m = b(function (b, x, e) {
        var g, w;
        return b ? x ? (g = x[0], w = b[0], 0 >= c(f, [w, g]) ? d(m, [b[1], x, a(w, e)]) : d(m, [b, x[1], a(g, e)])) : d(r, [b, e]) : d(r, [x, e])
      }), g = b(function (b, x, m) {
        var e, w;
        return b ? x ? (e = x[0], w = b[0], 0 < c(f, [w, e]) ? d(g, [b[1], x, a(w, m)]) : d(g, [b, x[1], a(e, m)])) : d(r, [b, m]) : d(r, [x, m])
      }), w = b(function (b, m) {
        var e, w, k;
        a:{
          if (2 === b) {
            if (!m) {
              e = !0;
              break a
            }
            e = m[1];
            if (!e) {
              e = !0;
              break a
            }
            e = e[0];
            w = m[0];
            return 0 >= c(f, [w, e]) ? a(w, a(e, 0)) : a(e, a(w, 0))
          }
          if (3 === b && m && (w = m[1]) && (e =
              w[1]))return e = e[0], w = w[0], k = m[0], 0 >= c(f, [k, w]) ? 0 >= c(f, [w, e]) ? a(k, a(w, a(e, 0))) : 0 >= c(f, [k, e]) ? a(k, a(e, a(w, 0))) : a(e, a(k, a(w, 0))) : 0 >= c(f, [k, e]) ? a(w, a(k, a(e, 0))) : 0 >= c(f, [w, e]) ? a(w, a(e, a(k, 0))) : a(e, a(w, a(k, 0)));
          e = !0
        }
        if (e)return k = b >>> 1, e = b - k, w = c(x, [k, m]), k = c(u, [k, m]), e = c(u, [e, w]), d(g, [k, e, 0])
      }), u = b(function (b, e) {
        var k, g, u;
        a:{
          if (2 === b) {
            if (!e) {
              k = !0;
              break a
            }
            k = e[1];
            if (!k) {
              k = !0;
              break a
            }
            k = k[0];
            g = e[0];
            return 0 < c(f, [g, k]) ? a(g, a(k, 0)) : a(k, a(g, 0))
          }
          if (3 === b && e && (g = e[1]) && (k = g[1]))return k = k[0], g = g[0], u = e[0], 0 < c(f,
            [u, g]) ? 0 < c(f, [g, k]) ? a(u, a(g, a(k, 0))) : 0 < c(f, [u, k]) ? a(u, a(k, a(g, 0))) : a(k, a(u, a(g, 0))) : 0 < c(f, [u, k]) ? a(g, a(u, a(k, 0))) : 0 < c(f, [g, k]) ? a(g, a(k, a(u, 0))) : a(k, a(g, a(u, 0)));
          k = !0
        }
        if (k)return u = b >>> 1, k = b - u, g = c(x, [u, e]), u = c(w, [u, e]), k = c(w, [k, g]), d(m, [u, k, 0])
      }), k = c(q, [e]);
      return 2 > k ? e : d(w, [k, e])
    });
    return a(q, l, n, K, G, v, r, y, y, D, h, L, A, F, Y, O, Da, Z, aa, ba, U, ca, k, ga, f, za, ua, ua, ha, w, qa, N, ka, ya, V, Q, E, P, P, P, z)
  }(), ia = function () {
    var g = b(function (a, b) {
      var c = X(a), d;
      for (d = 0; d < a; d++)c.a[0 + d] = b;
      return c
    }), l = b(function (a) {
      var b = a.length,
        c = X(b);
      fa(a, 0, c, 0, b);
      return c
    }), t = b(function (a, b, c) {
      var f;
      if (0 > b || 0 > c || b > a.length - c)return d(e[0], ["String.sub"]);
      f = X(c);
      fa(a, b, f, 0, c);
      return f
    }), v = b(function (a, b, c, k) {
      if (0 > b || 0 > c || b > a.length - c)return d(e[0], ["String.fill"]);
      var f;
      for (f = 0; f < c; f++)a.a[b + f] = k
    }), K = b(function (a, b, c, k, g) {
      return 0 > g || 0 > b || b > a.length - g || 0 > k || k > c.length - g ? d(e[0], ["String.blit"]) : fa(a, b, c, k, g)
    }), I = b(function (a, b) {
      var d;
      for (d = 0; d <= b.length - 1; d++)c(a, [da(b, d)])
    }), r = b(function (d, e) {
      var f, k, g, w, h;
      return e ? (f = e[0], k = a(0), g = a(0),
          c(n[9], [b(function (a) {
            k[0]++;
            return g[0] += a.length
          }), e]), w = X(g[0] + d.length * (k[0] - 1)), fa(f, 0, w, 0, f.length), h = a(f.length), c(n[9], [b(function (a) {
          fa(d, 0, w, h[0], d.length);
          h[0] += d.length;
          fa(a, 0, w, h[0], a.length);
          return h[0] += a.length
        }), e[1]]), w) : ""
    }), G = b(function (a) {
      var b, c, d = 0;
      for (b = 0; b <= a.length - 1; b++)(function (b) {
        var c = d;
        a:{
          var f = da(a, b), e = !1;
          b:{
            c:{
              if (!(14 <= f)) {
                if (!(11 <= f)) {
                  if (!(8 <= f)) {
                    b = !0;
                    break c
                  }
                  e = !0;
                  break b
                }
                if (!(13 <= f)) {
                  b = !0;
                  break c
                }
                e = !0;
                break b
              }
              if (34 === f) {
                e = !0;
                break b
              }
              if (92 === f) {
                e = !0;
                break b
              }
              b = !0
            }
            if (b) {
              b =
                31 < f && 127 > f ? 1 : 4;
              break a
            }
          }
          b = e ? 2 : void 0
        }
        d = c + b
      })(b);
      if (d === a.length)return a;
      c = X(d);
      for (b = d = 0; b <= a.length - 1; b++)(function (b) {
        var f = da(a, b), e = !1;
        a:if (b = -34 + f, 0 > b || 58 < b)if (-20 <= b) e = !0; else switch (34 + b) {
          case 0:
            e = !0;
            break a;
          case 1:
            e = !0;
            break a;
          case 2:
            e = !0;
            break a;
          case 3:
            e = !0;
            break a;
          case 4:
            e = !0;
            break a;
          case 5:
            e = !0;
            break a;
          case 6:
            e = !0;
            break a;
          case 7:
            e = !0;
            break a;
          case 8:
            c.a[d] = 92;
            d = 1 + d;
            c.a[d] = 98;
            break;
          case 9:
            c.a[d] = 92;
            d = 1 + d;
            c.a[d] = 116;
            break;
          case 10:
            c.a[d] = 92;
            d = 1 + d;
            c.a[d] = 110;
            break;
          case 11:
            e = !0;
            break a;
          case 12:
            e = !0;
            break a;
          case 13:
            c.a[d] = 92, d = 1 + d, c.a[d] = 114
        } else 0 > -1 + b || 56 < -1 + b ? (c.a[d] = 92, d = 1 + d, c.a[d] = f) : e = !0;
        e && (31 < f && 127 > f ? c.a[d] = f : (c.a[d] = 92, d = 1 + d, c.a[d] = 48 + (f / 100 >> 0), d = 1 + d, c.a[d] = 48 + (f / 10 >> 0) % 10, d = 1 + d, c.a[d] = 48 + f % 10));
        d = 1 + d
      })(b);
      return c
    }), y = b(function (a, b) {
      var d, f, e = b.length;
      if (0 === e)return b;
      d = X(e);
      for (f = 0; f <= e - 1; f++) {
        var k = c(a, [da(b, f)]);
        d.a[f] = k
      }
      return d
    }), h = b(function (a) {
      return d(y, [Aa[3], a])
    }), L = b(function (a) {
      return d(y, [Aa[2], a])
    }), D = b(function (a, b) {
      var d;
      if (0 === b.length)return b;
      d = c(l, [b]);
      var f =
        c(a, [da(b, 0)]);
      d.a[0] = f;
      return d
    }), A = b(function (a) {
      return d(D, [Aa[3], a])
    }), F = b(function (a) {
      return d(D, [Aa[2], a])
    }), O = b(function (b, c, e, k) {
      if (e >= c)throw a("Not_found");
      return da(b, e) === k ? e : d(O, [b, c, e + 1, k])
    }), z = b(function (a, b) {
      return d(O, [a, a.length, 0, b])
    }), Y = b(function (a, b, c) {
      var f = a.length;
      return 0 > b || b > f ? d(e[0], ["String.index_from"]) : d(O, [a, f, b, c])
    }), Z = b(function (b, c, e) {
      if (0 > c)throw a("Not_found");
      return da(b, c) === e ? c : d(Z, [b, c - 1, e])
    }), aa = b(function (a, b) {
      return d(Z, [a, a.length - 1, b])
    }), ba = b(function (a,
                         b, c) {
      return -1 > b || b >= a.length ? d(e[0], ["String.rindex_from"]) : d(Z, [a, b, c])
    }), U = b(function (a, b, k) {
      var f = a.length;
      if (0 > b || b > f)return d(e[0], ["String.contains_from"]);
      try {
        return c(O, [a, f, b, k]), !0
      } catch (ka) {
        if ("Not_found" === ka[0])return !1;
        throw ka;
      }
    }), ca = b(function (a, b) {
      return d(U, [a, 0, b])
    }), k = b(function (a, b, k) {
      if (0 > b || b >= a.length)return d(e[0], ["String.rcontains_from"]);
      try {
        return c(Z, [a, b, k]), !0
      } catch (N) {
        if ("Not_found" === N[0])return !1;
        throw N;
      }
    }), ga = b(function (a, b) {
      return na(a, b)
    });
    return a(g, l, t, v, K,
      r, I, G, z, aa, Y, ba, ca, U, k, h, L, A, F, ga)
  }(), ab = function () {
    var g = b(function (b, d) {
        var e, f;
        if (0 === b)return a();
        e = J(b, c(d, [0]));
        for (f = 1; f <= -1 + b; f++)e[f] = c(d, [f]);
        return e
      }), l = b(function (b, c, d) {
        var f, e = J(b, a());
        for (f = 0; f <= -1 + b; f++)e[f] = J(c, d);
        return e
      }), t = b(function (b) {
        var c, d, f = b.length;
        if (0 === f)return a();
        c = J(f, b[0]);
        for (d = 1; d <= -1 + f; d++)c[d] = b[d];
        return c
      }), n = b(function (b, c) {
        var d, f, e = b.length, k = c.length;
        if (0 === e && 0 === k)return a();
        d = J(e + k, (0 < e ? b : c)[0]);
        for (f = 0; f <= e - 1; f++)d[f] = b[f];
        for (f = 0; f <= k - 1; f++)d[f + e] =
          c[f];
        return d
      }), K = b(function (a, e) {
        var k = b(function (a, b) {
          return b ? d(k, [a + b[0].length, b[1]]) : a
        }), f = J(c(k, [0, e]), a), g = b(function (a, b) {
          var c, e;
          if (b) {
            c = b[0];
            for (e = 0; e <= c.length - 1; e++)f[a + e] = c[e];
            return d(g, [a + c.length, b[1]])
          }
          return 0
        });
        c(g, [0, e]);
        return f
      }), I = b(function (c) {
        var e = b(function (b) {
          var f;
          return b ? (f = b[0], 0 < f.length ? d(K, [f[0], c]) : d(e, [b[1]])) : a()
        });
        return d(e, [c])
      }), r = b(function (b, c, g) {
        var f, k;
        if (0 > c || 0 > g || c > b.length - g)return d(e[0], ["Array.sub"]);
        if (0 === g)return a();
        f = J(g, b[c]);
        for (k = 1; k <= g -
        1; k++)f[k] = b[c + k];
        return f
      }), G = b(function (a, b, c, f) {
        var g;
        if (0 > b || 0 > c || b > a.length - c)return d(e[0], ["Array.fill"]);
        for (g = b; g <= b + c - 1; g++)a[g] = f
      }), y = b(function (a, b, c, f, g) {
        var k;
        if (0 > g || 0 > b || b > a.length - g || 0 > f || f > c.length - g)return d(e[0], ["Array.blit"]);
        if (b < f)for (k = g - 1; 0 <= k; k--)c[f + k] = a[b + k];
        for (k = 0; k <= g - 1; k++)c[f + k] = a[b + k]
      }), h = b(function (a, b) {
        var d;
        for (d = 0; d <= b.length - 1; d++)c(a, [b[d]])
      }), L = b(function (b, d) {
        var e, f, g = d.length;
        if (0 === g)return a();
        e = J(g, c(b, [d[0]]));
        for (f = 1; f <= g - 1; f++)e[f] = c(b, [d[f]]);
        return e
      }),
      D = b(function (a, b) {
        var d;
        for (d = 0; d <= b.length - 1; d++)c(a, [d, b[d]])
      }), A = b(function (b, d) {
        var e, f, g = d.length;
        if (0 === g)return a();
        e = J(g, c(b, [0, d[0]]));
        for (f = 1; f <= g - 1; f++)e[f] = c(b, [f, d[f]]);
        return e
      }), F = b(function (c) {
        var e = b(function (b, f) {
          return 0 > b ? f : d(e, [b - 1, a(c[b], f)])
        });
        return d(e, [c.length - 1, 0])
      }), O = b(function (a, b) {
        return b ? d(O, [1 + a, b[1]]) : a
      }), z = b(function (e) {
        var g, h;
        return e ? (g = J(c(O, [0, e]), e[0]), h = b(function (a, b) {
            return b ? (g[a] = b[0], d(h, [a + 1, b[1]])) : g
          }), d(h, [1, e[1]])) : a()
      }), Y = b(function (a, b, d) {
        var e =
          b;
        for (b = 0; b <= d.length - 1; b++)e = c(a, [e, d[b]]);
        return e
      }), Z = b(function (a, b, d) {
        var e = d;
        for (d = b.length - 1; 0 <= d; d--)e = c(a, [b[d], e]);
        return e
      }), aa = a("Array.Bottom"), ba = b(function (e, g) {
        var h, f, k = b(function (b, d) {
          var f = d + d + d + 1, h = f;
          if (f + 2 < b)return 0 > c(e, [v(g, f), v(g, f + 1)]) && (h = f + 1), 0 > c(e, [v(g, h), v(g, f + 2)]) && (h = f + 2), h;
          if (f + 1 < b && 0 > c(e, [v(g, f), v(g, f + 1)]))return f + 1;
          if (f < b)return f;
          throw a(aa, d);
        }), l = b(function (a, b, f) {
          var h = c(k, [a, b]);
          return 0 < c(e, [v(g, h), f]) ? (E(g, b, v(g, h)), d(l, [a, h, f])) : E(g, b, f)
        }), q = b(function (a,
                            b, d) {
          try {
            return c(l, [a, b, d])
          } catch (Q) {
            if (Q[0] === aa)return E(g, Q[1], d);
            throw Q;
          }
        }), r = b(function (a, b) {
          var e = c(k, [a, b]);
          E(g, b, v(g, e));
          return d(r, [a, e])
        }), t = b(function (a, b) {
          try {
            return c(r, [a, b])
          } catch (ha) {
            if (ha[0] === aa)return ha[1];
            throw ha;
          }
        }), V = b(function (b, f) {
          var h = (b - 1) / 3 >> 0;
          if (b === h)throw a("Assert_failure", a("ocaml/stdlib/array.ml", 208, 4));
          return 0 > c(e, [v(g, h), f]) ? (E(g, b, v(g, h)), 0 < h ? d(V, [h, f]) : E(g, 0, f)) : E(g, b, f)
        });
        f = g.length;
        for (h = ((f + 1) / 3 >> 0) - 1; 0 <= h; h--)c(q, [f, h, v(g, h)]);
        for (h = f - 1; 2 <= h; h--)(function (a) {
          var b =
            v(g, a);
          E(g, a, v(g, 0));
          c(V, [c(t, [a, 0]), b])
        })(h);
        return 1 < f ? (f = v(g, 1), E(g, 1, v(g, 0)), E(g, 0, f)) : 0
      }), U = b(function (a, e) {
        var g, f, h, k = b(function (f, g, h, k, l, q, r) {
          var V = f + g, x = k + l, P = b(function (b, f, g, k, l) {
            if (0 >= c(a, [f, k]))return E(q, l, f), b += 1, b < V ? d(P, [b, v(e, b), g, k, l + 1]) : d(y, [h, g, q, l + 1, x - g]);
            E(q, l, k);
            g += 1;
            return g < x ? d(P, [b, f, g, v(h, g), l + 1]) : d(y, [e, b, q, l + 1, V - b])
          });
          return d(P, [f, v(e, f), k, v(h, k), r])
        }), l = b(function (b, d, f, g) {
          var h;
          for (h = 0; h <= g - 1; h++) {
            for (var k = h, l = v(e, b + k), k = f + k - 1; k >= f && 0 < c(a, [v(d, k), l]);)E(d, k + 1, v(d,
              k)), k = -1 + k;
            E(d, k + 1, l)
          }
        }), q = b(function (a, b, f, g) {
          var h;
          if (5 >= g)return d(l, [a, b, f, g]);
          h = g / 2 >> 0;
          g -= h;
          c(q, [a + h, b, f + h, g]);
          c(q, [a, e, a + g, h]);
          return d(k, [a + g, h, b, f + h, g, b, f])
        });
        f = e.length;
        if (5 >= f)return d(l, [0, e, 0, f]);
        g = f / 2 >> 0;
        f -= g;
        h = J(f, v(e, 0));
        c(q, [g, h, 0, f]);
        c(q, [0, e, f, g]);
        return d(k, [f, g, h, 0, f, e, 0])
      });
    return a(g, l, l, n, I, r, t, G, y, F, z, h, L, D, A, Y, Z, ba, U, U)
  }(), bb = function () {
    var c = a("", a()), e = a("js", 32), g = e[1], l = (1 << g - 10) - 1, n = (g / 8 >> 0) * l - 1, v = a(!1), r = b(function (a, b) {
        throw"caml_install_signal_handler";
      }), G = a("Sys.Break"),
      y = b(function (c) {
        return c ? d(r, [-6, a(b(function (b) {
            throw a(G);
          }))]) : d(r, [-6, 0])
      });
    return a(c[1], c[0], v, e[0], g, n, l, r, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, G, y, "3.11.1")
  }(), cb = function () {
    var c = b(function (a) {
      return a + 1
    }), d = b(function (a) {
      return a - 1
    }), e = b(function (a) {
      return 0 <= a ? a : -a
    }), g = b(function (a) {
      return a ^ -1
    }), l = b(function (a) {
      return sa("%d", a)
    }), n = b(function (a, b) {
      return (a > b) - (a < b)
    });
    return a(0, 1, -1, c, d, e, 2147483647, -2147483648, g, l, n)
  }(), db = function () {
    var c = b(function (a) {
      return a +
        "1"
    }), d = b(function (a) {
      return a - 1
    }), e = b(function (a) {
      return "0" <= a ? a : -a
    }), g = b(function (a) {
      return a ^ -1
    }), l = b(function (a) {
      return sa("%d", a)
    }), n = b(function (a, b) {
      throw"caml_int64_compare";
    });
    return a("0", "1", "-1", c, d, e, "9223372036854775807", "-9223372036854775808", g, l, n)
  }(), eb = function () {
    var c = b(function (a) {
      return a + 1
    }), d = b(function (a) {
      return a - 1
    }), e = b(function (a) {
      return 0 <= a ? a : -a
    }), g = bb[4], l = 1 << g - 1, n = l - 1, r = b(function (a) {
      return a ^ -1
    }), v = b(function (a) {
      return sa("%d", a)
    }), y = b(function (a, b) {
      return (a > b) - (a < b)
    });
    return a(0, 1, -1, c, d, e, g, n, l, r, v, y)
  }();
  (function () {
    var c = b(function (b) {
      return null === b ? 0 : a(b)
    }), d = b(function (a) {
      return a ? a[0] : null
    }), e = b(function (a) {
      return ja(a, null)
    }), g = function () {
      var b = a();
      return a(b, 0)
    }();
    return a(c, d, e, g)
  })();
  var l = function () {
    var g = b(function (a) {
      return a[0][0]
    }), l = a(0, a(1, a(2, a(3, 0)))), n = b(function (a) {
      return d(e[15], ["{r=", c(e[15], [c(e[20], [a[0]]), c(e[15], [";", c(e[15], ["g=", c(e[15], [c(e[20], [a[1]]), c(e[15], [";", c(e[15], ["b=", c(e[15], [c(e[20], [a[2]]), "}"])])])])])])])])
    }), v = b(function (a) {
      switch (a) {
        case 0:
          return "bool";
        case 1:
          return "float";
        case 2:
          return "point";
        case 3:
          return "color";
        default:
          return null
      }
    });
    return a(g, l, n, v)
  }(), ra = function () {
    var g = function () {
      var g = b(function (b) {
        return a(J(55, 0), 0)
      }), h = b(function (a, b) {
        c(ab[8], [b[0], 0, a[0], 0, 55]);
        return a[1] = b[1]
      }), l = b(function (a, b) {
        var g = b.length;
        return g <= a ? d(e[15], [b, c(ia[0], [a - g, 97])]) : d(ia[2], [b, g - a, a])
      }), q = b(function (a, g) {
        var f, h, k = b(function (a, b) {
            return d(l, [16, c(e[15], [a, c(e[19], [b])])])
          }), q = b(function (a) {
            return la(a, 0) + (la(a, 1) << 8) + (la(a, 2) << 16) ^ la(a, 3) << 22
          }),
          n = g.length;
        for (f = 0; 54 >= f; f++)E(a[0], f, f);
        h = "x";
        for (f = 0; f <= 54 + c(e[4], [55, n]); f++)(function (b) {
          var d = b % 55;
          h = c(k, [h, v(g, b % n)]);
          E(a[0], d, v(a[0], d) ^ c(q, [h]))
        })(f);
        return a[1] = 0
      }), n = b(function (a) {
        var b = c(g, [0]);
        c(q, [b, a]);
        return b
      }), t = b(function (a) {
        var b = c(g, [0]);
        c(h, [b, a]);
        return b
      }), A = b(function (a) {
        var b;
        a[1] = (a[1] + 1) % 55;
        b = v(a[0], (a[1] + 24) % 55) + v(a[0], a[1]) & 1073741823;
        E(a[0], a[1], b);
        return b
      }), y = b(function (a, b) {
        var e = c(A, [a]), g = e % b;
        return e - g > 1073741823 - b + 1 ? d(y, [a, b]) : g
      }), r = b(function (a, b) {
        return 1073741823 <
        b || 0 >= b ? d(e[0], ["Myrandom.int"]) : d(y, [a, b])
      }), k = b(function (a, b) {
        var e = c(A, [a]), g = (c(A, [a]) & 1) << 30, e = e | g, g = e % b;
        return e - g > cb[6] - b + 1 ? d(k, [a, b]) : g
      }), D = b(function (a, b) {
        return 0 >= b ? d(e[0], ["Random.int32"]) : d(k, [a, b])
      }), f = b(function (a, b) {
        var e = c(A, [a]), g = c(A, [a]) << 30, h = (c(A, [a]) & 7) << 60, e = e | g | h, g = e % b;
        return e - g > db[6] - b + "1" ? d(f, [a, b]) : g
      }), w = b(function (a, b) {
        return "0" >= b ? d(e[0], ["Random.int64"]) : d(f, [a, b])
      }), z = 32 === eb[6] ? b(function (a, b) {
          return c(D, [a, b])
        }) : b(function (a, b) {
          return c(w, [a, b])
        }), R = b(function (a) {
        var b =
          c(A, [a]), d = c(A, [a]);
        a = c(A, [a]);
        return ((b / 1073741824 + d) / 1073741824 + a) / 1073741824
      }), L = b(function (a, b) {
        return c(R, [a]) * b
      }), G = b(function (a) {
        return 0 === (c(A, [a]) & 1)
      });
      return a(g, h, l, q, n, t, A, y, r, k, D, f, w, z, R, L, G)
    }(), l = a(pa(a(509760043, 399328820, 99941072, 112282318, 611886020, 516451399, 626288598, 337482183, 748548471, 808894867, 657927153, 386437385, 42355480, 977713532, 311548488, 13857891, 307938721, 93724463, 1041159001, 444711218, 1040610926, 233671814, 664494626, 1071756703, 188709089, 420289414, 969883075, 513442196, 275039308,
      918830973, 598627151, 134083417, 823987070, 619204222, 81893604, 871834315, 398384680, 475117924, 520153386, 324637501, 38588599, 435158812, 168033706, 585877294, 328347186, 293179100, 671391820, 846150845, 283985689, 502873302, 718642511, 938465128, 962756406, 107944131, 192910970)), 0), n = b(function (a) {
      return d(g[6], [l])
    }), z = b(function (a) {
      return d(g[8], [l, a])
    }), K = b(function (a) {
      return d(g[10], [l, a])
    }), I = b(function (a) {
      return d(g[13], [l, a])
    }), r = b(function (a) {
      return d(g[12], [l, a])
    }), G = b(function (a) {
      return d(g[15], [l, a])
    }), y =
      b(function (a) {
        return d(g[16], [l])
      }), h = b(function (a) {
      return d(g[3], [l, a])
    }), L = b(function (b) {
      return d(g[3], [l, a(b)])
    }), D = b(function (a) {
      return d(g[5], [l])
    }), A = b(function (a) {
      return d(g[1], [l, a])
    });
    return a(g, l, n, z, K, I, r, G, y, h, L, D, A)
  }(), g = function () {
    var g = Math.atan2(0, -1), l = b(function (a, b) {
      var c = a / b, d = Math.floor(Math.abs(c));
      return 0 <= c ? a - d * b : a + d * b
    }), t = b(function (a, b, d, e, g) {
      a = a ? a[0] : -1;
      b = b ? b[0] : 1;
      e = e ? e[0] : 1;
      return e - (e - (d ? d[0] : -1)) * Math.abs(c(l, [Math.abs(g - a), 2 * (b - a)]) / (b - a) - 1)
    }), z = b(function (a, b, c) {
      a =
        a ? a[0] : -1;
      return a + ((b ? b[0] : 1) - a) * (.5 + Math.atan(2 * c) / g)
    }), K = b(function (a) {
      return d(ra[7], [1])
    }), I = b(function (a, b) {
      return a + c(ra[3], [b - a + 1])
    }), r = b(function (a, b) {
      return a + c(ra[7], [b - a])
    }), G = b(function (g, f) {
      var h = b(function (a) {
        return v(a, c(ra[3], [a.length]))
      }), x = pa(a("pre", "sup", "sub", "anti", "de", "non", "a", "e", "ae", "u", "i")), k = b(function (b) {
        b = pa(a("a", "a", "ae", "e", "e", "ea", "ee", "y", "i", "o", "oo", "ou", "u"));
        var g = pa(a("b", "bl", "bv", "c", "ck", "ch", "d", "d", "f", "fl", "g", "gl", "gg", "h", "j", "k", "l", "ll", "m",
          "n", "nt", "ng", "p", "pr", "pl", "qu", "r", "rr", "s", "sh", "st", "sp", "t", "tr", "t", "v", "x")), g = c(h, [g]);
        b = c(h, [b]);
        return d(e[15], [g, b])
      }), l = b(function (b) {
        var d = pa(a("", "", "", "re", "er", "es", "ub", "imp", "ius", "or", "ors", "ack", "ent", "ies", "ry", "elp", "ay", "ays"));
        b = pa(a("", "", "", "ish", "er", "est", "al", "ary", "ing", "ight", "ough", "ich", "ed", "ian", "ast", "ool"));
        d = c(h, [d]);
        b = c(h, [b]);
        return a(d, b)
      }), P = b(function (a) {
        var b;
        if (0 >= a)return "";
        b = c(k, [0]);
        a = c(P, [a - 1]);
        return d(e[15], [b, a])
      }), l = c(l, [0]), n = c(e[15], [.5 > c(K, [0]) ?
        "" : c(h, [x]), c(P, [g])]), x = c(e[15], [.5 > c(K, [0]) ? "" : c(h, [x]), c(P, [f])]);
      return d(e[15], [x, c(e[15], [l[1], c(e[15], [" ", c(e[15], [n, l[0]])])])])
    }), y = b(function (b) {
      var d;
      try {
        return d = c(ia[8], [b, 32]), a(c(ia[2], [b, 0, d]), c(ia[2], [b, d + 1, b.length - d - 1]))
      } catch (m) {
        if ("Not_found" === m[0])return a(c(e[15], [b, " "]), b);
        throw m;
      }
    }), h = b(function (a, b, e) {
      return 0 >= e ? b : d(a, [c(h, [a, b, e - 1])])
    }), L = b(function (g, f) {
      var m = b(function (b) {
        var g, f = b[0];
        return !f && (g = b[1]) ? a(g[0] + 1, g[1]) : (b = b[1]) ? a(b[0], c(m, [a(f - 1, b[1])])) : d(e[1], ["rnd_partition: an impossible thing happened"])
      });
      return d(h, [b(function (b) {
        var e = c(I, [0, f - 1]);
        return d(m, [a(e, b)])
      }), c(h, [b(function (b) {
        return a(0, b)
      }), 0, f]), g])
    }), D = b(function (b, d, e) {
      var g;
      if (d > e)return 0;
      g = c(b, [d]);
      b = c(D, [b, d + 1, e]);
      return a(g, b)
    }), A = b(function (a, g) {
      var f = b(function (b, c, g) {
        var h;
        return g ? (h = g[1], g = g[0], !h || c <= b ? g : d(f, [b * (1 - a), c - b, h])) : d(e[1], ["pick_exp: empty list"])
      }), h = c(n[0], [g]), h = c(r, [0, 1 - Math.pow(1 - a, h)]);
      return d(f, [a, h, g])
    }), F = b(function (g, e) {
      var f = b(function (b, c, e) {
        return e ? c <= b ? a(e[0]) : d(f, [b * (1 - g), c - b, e[1]]) : 0
      }), h = c(r,
        [0, 1]);
      return d(f, [g, h, e])
    }), O = b(function (a) {
      return d(n[3], [a, c(I, [0, c(n[0], [a]) - 1])])
    }), Da = b(function (g, e) {
      var f = b(function (b, d) {
        var g, e;
        if (d) {
          g = d[1];
          e = d[0];
          if (0 === b)return a(e, g);
          g = c(f, [b - 1, g]);
          return a(g[0], a(e, g[1]))
        }
        throw a("Match_failure", a("util.ml", 115, 18));
      }), h = b(function (b, g, e) {
        var m;
        if (0 === b)return e;
        m = c(I, [0, c(n[0], [g]) - 1]);
        g = c(f, [m, g]);
        return d(h, [b - 1, g[1], a(g[0], e)])
      });
      return d(h, [g, e, 0])
    }), Y = b(function (a, b) {
      return b ? ja(a, b[0]) ? 0 : 1 + c(Y, [a, b[1]]) : d(e[1], ["index_of: empty list"])
    }), Z =
      b(function (g) {
        var e = b(function (b, d) {
          return d ? a(a(d[0], b), c(e, [b + 1, d[1]])) : 0
        });
        return d(e, [0, g])
      }), aa = b(function (b, d) {
      var g;
      return d ? (g = d[0], b === g ? d : a(g, c(aa, [b, d[1]]))) : a(b, 0)
    }), ba = b(function (g, e) {
      var f = c(n[10], [b(function (b) {
        return a(b, a(0))
      }), e]);
      c(n[9], [b(function (a) {
        return c(n[29], [a, f])[0]++
      }), g]);
      return d(n[10], [b(function (b) {
        return a(b[0], b[1][0])
      }), f])
    }), U = b(function (b, c, d) {
      return a(b, c, d)
    }), ca = b(function (b) {
      return a(c(z, [a(0), a(255), b[0]]) >> 0, c(z, [a(0), a(255), b[1]]) >> 0, c(z, [a(0), a(255), b[2]]) >>
        0)
    }), k = b(function (b, c, d) {
      var g, e;
      c = .5 >= d ? d * (1 + c) : d + c - d * c;
      if (0 >= c)return a(0, 0, 0);
      d = d + d - c;
      g = Math.abs(6 * b);
      b = (g >> 0) % 6;
      e = (c - d) / c * c * (g - Math.floor(g));
      g = d + e;
      e = c - e;
      if (0 > b || 4 < b)return a(c, d, e);
      switch (b) {
        case 0:
          return a(c, g, d);
        case 1:
          return a(e, c, d);
        case 2:
          return a(d, c, g);
        case 3:
          return a(d, e, c);
        case 4:
          return a(g, d, c);
        default:
          return null
      }
    }), ga = b(function (a) {
      a = c(r, [-1, 1]);
      var b = c(r, [-1, 1]), g = c(r, [-1, 1]);
      return d(U, [a, b, g])
    }), f = b(function (b, c) {
      var d = b[0] - c[0], g = b[1] - c[1], e = b[2] - c[2], f = 1 / (d * d + g * g + e * e);
      return a(d *
        f, g * f, e * f)
    }), w = b(function (g, e) {
      return d(n[12], [b(function (b, d) {
        var e, h = b[2], l = b[1], k = b[0];
        if (ja(d, g))return a(k, l, h);
        e = c(f, [g, d]);
        return a(k + e[0], l + e[1], h + e[2])
      }), a(0, 0, 0), e])
    }), qa = b(function (a) {
      return d(e[15], [c(e[20], [a[0]]), c(e[15], [", ", c(e[15], [c(e[20], [a[1]]), c(e[15], [", ", c(e[20], [a[2]])])])])])
    }), N = b(function (a) {
      return d(ia[5], ["\n", c(n[10], [qa, a])])
    }), ka = b(function (b, c, d) {
      var g = 1 - b;
      return a(b * c[0] + g * d[0], b * c[1] + g * d[1], b * c[2] + g * d[2])
    }), M = b(function (b, c, d, g, e) {
      var f = 1 - b - c;
      return a(b * d[0] + c *
        g[0] + f * e[0], b * d[1] + c * g[1] + f * e[1], b * d[2] + c * g[2] + f * e[2])
    }), V = b(function (b, c, d, g, e, f, h) {
      var l = 1 - b - c;
      return a(b * g[0] + c * e[0] + d * f[0] + l * h[0], b * g[1] + c * e[1] + d * f[1] + l * h[1], b * g[2] + c * e[2] + d * f[2] + l * h[2])
    }), T = b(function (a, g) {
      var f, h = b(function (b, g, e) {
        var f, l;
        return e ? (f = e[1], e = e[0], l = c(a, [e]), -1 > ma(g, l, 0) - 1 ? d(h, [b, g, f]) : d(h, [e, l, f])) : b
      });
      return g ? (f = g[0], d(h, [f, c(a, [f]), g[1]])) : d(e[1], ["minimize: empty list"])
    }), W = b(function (a, b) {
      return d(n[29], [a, b])
    }), ha = b(function (b, d, g) {
      var e, f;
      return g ? (e = g[1], g = g[0], f = g[0],
          ja(b, f) ? a(a(f, a(d, g[1])), e) : a(g, c(ha, [b, d, e]))) : a(a(b, a(d, 0)), 0)
    }), Q = b(function (b) {
      var g;
      return b ? (g = b[1], b = b[0], c(n[23], [b, g]) ? d(Q, [g]) : a(b, c(Q, [g]))) : 0
    }), S = b(function (a) {
      return d(n[37], [b(function (a, b) {
        return na(a, b)
      }), c(Q, [a])])
    }), X = b(function (b) {
      var c, g, e;
      if (b.toString() != "".toString()) {
        c = b.length;
        g = J(c, 0);
        for (e = 0; e <= c - 1; e++)E(g, e, e * e + la(b, e));
        return d(ra[9], [g])
      }
      return d(ra[9], [a(0)])
    });
    return a(g, l, t, z, K, I, r, G, y, h, L, D, A, F, O, Da, Y, Z, aa, ba, U, ca, k, ga, f, w, qa, N, ka, M, V, T, W, ha, Q, S, X)
  }(), z = function () {
    var v =
      b(function (c, d) {
        return a(c, 0, 1, b(function (a, b, c) {
          return M(d[0])
        }))
      }), q = b(function (c, d) {
      return a("pt", 0, 2, b(function (a, b, g) {
        return T(c[0], d[0])
      }))
    }), t = function () {
      var h = a("palette_f", a(1, 0), 3, b(function (d) {
        var e, f, h = !1;
        if (e = c(g[15], [2, d[2]]))if (f = e[1])if (f[1]) h = !0; else return b(function (d) {
          var h = !1;
          if (d)if (d[1]) h = !0; else return b(function (b) {
            b = c(l[0], [d[0]]);
            switch (b.t) {
              case 1:
                return W(c(g[28], [c(g[2], [0, 0, a(-1), a(2), b[0]]), e[0], f[0]]));
              default:
                throw a("Match_failure", a("op.ml", 34, 24));
            }
          }); else h = !0;
          if (h)throw a("Match_failure", a("op.ml", 33, 4));
        }); else h = !0; else h = !0;
        if (h)throw a("Match_failure", a("op.ml", 32, 6));
      })), q = a("palette_p", a(2, 0), 3, b(function (d) {
        var e, f, h = !1;
        if (e = c(g[15], [2, d[2]]))if (f = e[1])if (f[1]) h = !0; else return b(function (d) {
          var h = !1;
          if (d)if (d[1]) h = !0; else return b(function (b) {
            var h;
            h = c(l[0], [d[0]]);
            switch (h.t) {
              case 2:
                return b = Math.abs(h[0]), h = Math.abs(h[1]), W(c(g[28], [1 / (b + h) * b, e[0], f[0]]));
              default:
                throw a("Match_failure", a("op.ml", 46, 24));
            }
          }); else h = !0;
          if (h)throw a("Match_failure",
            a("op.ml", 45, 4));
        }); else h = !0; else h = !0;
        if (h)throw a("Match_failure", a("op.ml", 44, 6));
      })), t = a("palette_pf", a(2, a(1, 0)), 3, b(function (d) {
        var e, f, h, C = !1;
        if (e = c(g[15], [3, d[2]]))if (f = e[1])if (h = f[1])if (h[1]) C = !0; else return b(function (d) {
          var C, p = !1;
          if (d)if (C = d[1])if (C[1]) p = !0; else return b(function (b) {
            var p, k;
            k = c(l[0], [d[0]]);
            switch (k.t) {
              case 2:
                switch (p = c(l[0], [C[0]]), p.t) {
                  case 1:
                    return b = Math.abs(k[0]), k = Math.abs(k[1]), p = Math.abs(p[0]), p = 1 / (b + k + p), b = c(g[29], [b * p, k * p, e[0], f[0], h[0]]), W(b);
                  default:
                    throw a("Match_failure",
                      a("op.ml", 62, 24));
                }
              default:
                throw a("Match_failure", a("op.ml", 61, 24));
            }
          }); else p = !0; else p = !0;
          if (p)throw a("Match_failure", a("op.ml", 60, 4));
        }); else C = !0; else C = !0; else C = !0;
        if (C)throw a("Match_failure", a("op.ml", 59, 6));
      })), y = a("palette_pp", a(2, a(2, 0)), 3, b(function (d) {
        var e, f, h, C, k = !1;
        if (e = c(g[15], [4, d[2]]))if (f = e[1])if (h = f[1])if (C = h[1])if (C[1]) k = !0; else return b(function (d) {
          var k, p = !1;
          if (d)if (k = d[1])if (k[1]) p = !0; else return b(function (b) {
            var p, B, H;
            B = c(l[0], [d[0]]);
            switch (B.t) {
              case 2:
                switch (p = c(l[0],
                  [k[0]]), p.t) {
                  case 2:
                    return b = Math.abs(B[0]), B = Math.abs(B[1]), H = Math.abs(p[0]), p = Math.abs(p[1]), p = 1 / (b + B + H + p), W(c(g[30], [b * p, B * p, H * p, e[0], f[0], h[0], C[0]]));
                  default:
                    throw a("Match_failure", a("op.ml", 80, 24));
                }
              default:
                throw a("Match_failure", a("op.ml", 79, 24));
            }
          }); else p = !0; else p = !0;
          if (p)throw a("Match_failure", a("op.ml", 78, 4));
        }); else k = !0; else k = !0; else k = !0; else k = !0;
        if (k)throw a("Match_failure", a("op.ml", 77, 6));
      })), Y = a("saturate", a(3, a(1, 0)), 3, b(function (d, f) {
        var h, p = !1;
        if (f)if (h = f[1])if (h[1]) p = !0;
        else return b(function (b) {
            var d, p, k, C, B, H;
            b = c(l[0], [f[0]]);
            switch (b.t) {
              case 3:
                switch (b = b[0], d = b[2], p = b[1], k = b[0], C = c(l[0], [h[0]]), C.t) {
                  case 1:
                    return C = c(e[4], [1, c(g[2], [0, 0, a(0), a(1.1), C[0]])]), B = c(e[4], [k, c(e[4], [p, d])]) + .01, H = c(e[3], [k, c(e[3], [p, d])]) - .01, B = 1 / (B - H), W(c(g[28], [C, b, c(g[20], [2 * (k - H) * B - 1, 2 * (p - H) * B - 1, 2 * (d - H) * B - 1])]));
                  default:
                    throw a("Match_failure", a("op.ml", 96, 20));
                }
              default:
                throw a("Match_failure", a("op.ml", 95, 20));
            }
          }); else p = !0; else p = !0;
        if (p)throw a("Match_failure", a("op.ml", 94, 20));
      })), r = a("scalar", a(2, 0), 1, b(function (d) {
        var e = c(g[14], [d[0]]);
        d = c(g[14], [d[1]]);
        var f = Math.cos(2 * g[0] * d), h = Math.sin(2 * g[0] * d);
        return b(function (d) {
          var g = !1;
          if (d)if (d[1]) g = !0; else return b(function (b) {
            b = c(l[0], [d[0]]);
            switch (b.t) {
              case 2:
                return M((b[0] - e[0]) * f + (b[1] - e[1]) * h);
              default:
                throw a("Match_failure", a("op.ml", 118, 24));
            }
          }); else g = !0;
          if (g)throw a("Match_failure", a("op.ml", 117, 4));
        })
      })), D = a("pmult", a(2, a(2, 0)), 2, b(function (d) {
        d = c(g[14], [d[0]]);
        var e = d[1], f = d[0];
        return b(function (d) {
          var g, h = !1;
          if (d)if (g =
              d[1])if (g[1]) h = !0; else return b(function (b) {
            var h, p, k;
            p = c(l[0], [d[0]]);
            switch (p.t) {
              case 2:
                switch (h = c(l[0], [g[0]]), h.t) {
                  case 2:
                    return b = p[0] - f, p = p[1] - e, k = h[0] - f, h = h[1] - e, T(f + b * k - p * h, e + b * h + p * k);
                  default:
                    throw a("Match_failure", a("op.ml", 130, 24));
                }
              default:
                throw a("Match_failure", a("op.ml", 129, 24));
            }
          }); else h = !0; else h = !0;
          if (h)throw a("Match_failure", a("op.ml", 128, 5));
        })
      })), v = a("protfold", a(2, a(2, 0)), 2, b(function (d) {
        var e = g[0] / Math.ceil(c(g[2], [0, 0, a(1.5), a(12), c(g[14], [d[1]])]));
        return b(function (d) {
          var f,
            h = !1;
          if (d)if (f = d[1])if (f[1]) h = !0; else return b(function (b) {
            var h, p, k, C;
            C = c(l[0], [d[0]]);
            switch (C.t) {
              case 2:
                switch (h = c(l[0], [f[0]]), h.t) {
                  case 2:
                    return b = h[1], h = h[0], p = C[0] - h, k = C[1] - b, C = c(g[2], [a(-e), a(e), a(-g[0]), a(g[0]), Math.atan2(k, p)]), p = Math.sqrt(p * p + k * k), T(h + p * Math.cos(C), b + p * Math.sin(C));
                  default:
                    throw a("Match_failure", a("op.ml", 146, 24));
                }
              default:
                throw a("Match_failure", a("op.ml", 145, 24));
            }
          }); else h = !0; else h = !0;
          if (h)throw a("Match_failure", a("op.ml", 144, 4));
        })
      })), z = a("fold", a(2, a(2, a(1, 0))),
        2, b(function (d) {
          var f = d[1], h = c(e[4], [0, c(g[2], [0, 0, a(-1.1), a(.3), c(g[14], [f])])]), p = c(e[4], [0, c(g[2], [0, 0, a(-1.1), a(.3), c(g[14], [f])])]);
          d = c(g[14], [d[0]]);
          var k = (1 - h) * d[0], va = (1 - h) * d[1], ta = 2 * (1 - p) * g[0] * c(g[14], [f]);
          return b(function (d) {
            var f, C, B = !1;
            if (d)if (f = d[1])if (C = f[1])if (C[1]) B = !0; else return b(function (b) {
              var B, H, m, n, q;
              n = c(l[0], [d[0]]);
              switch (n.t) {
                case 2:
                  switch (B = c(l[0], [f[0]]), B.t) {
                    case 2:
                      switch (b = B[1], B = B[0], H = c(l[0], [C[0]]), H.t) {
                        case 1:
                          return m = k + h * n[0], n = va + h * n[1], q = ta + 2 * p * g[0] * H[0], H = Math.cos(q),
                            q = Math.sin(q), m = 2 * c(e[4], [0, (B - m) * H + (b - n) * q]), T(B - m * H, b - m * q);
                        default:
                          throw a("Match_failure", a("op.ml", 169, 24));
                      }
                    default:
                      throw a("Match_failure", a("op.ml", 168, 24));
                  }
                default:
                  throw a("Match_failure", a("op.ml", 167, 24));
              }
            }); else B = !0; else B = !0; else B = !0;
            if (B)throw a("Match_failure", a("op.ml", 166, 4));
          })
        })), ca = a("dist", a(2, a(2, 0)), 1, b(function (d) {
        var f = c(e[4], [0, c(g[2], [0, 0, a(-.2), a(.5), c(g[14], [d[1]])])]);
        d = c(g[14], [d[0]]);
        var h = (1 - f) * d[0], p = (1 - f) * d[1];
        return b(function (d) {
          var g, e = !1;
          if (d)if (g = d[1])if (g[1]) e = !0; else return b(function (b) {
            var e, k = c(l[0], [d[0]]);
            switch (k.t) {
              case 2:
                switch (e = c(l[0], [g[0]]), e.t) {
                  case 2:
                    return b = k[0] - h - f * e[0], e = k[1] - p - f * e[1], M(Math.sqrt(2 * (b * b + e * e)) - 1);
                  default:
                    throw a("Match_failure", a("op.ml", 192, 24));
                }
              default:
                throw a("Match_failure", a("op.ml", 191, 24));
            }
          }); else e = !0; else e = !0;
          if (e)throw a("Match_failure", a("op.ml", 190, 4));
        })
      })), k = a("rotate", a(2, a(2, a(1, 0))), 2, b(function (d) {
        var f = d[1], h = c(e[4], [0, c(g[2], [0, 0, a(-.5), a(.3), c(g[14], [f])])]), k = c(e[4], [0, c(g[2], [0, 0, a(-.5), a(.3),
          c(g[14], [f])])]);
        d = c(g[14], [d[0]]);
        var C = (1 - h) * d[0], va = (1 - h) * d[1], ta = 2 * (1 - k) * g[0] * c(g[14], [f]);
        return b(function (d) {
          var e, f, p = !1;
          if (d)if (e = d[1])if (f = e[1])if (f[1]) p = !0; else return b(function (b) {
            var p, B, H, m, n;
            H = c(l[0], [d[0]]);
            switch (H.t) {
              case 2:
                switch (p = c(l[0], [e[0]]), p.t) {
                  case 2:
                    switch (B = c(l[0], [f[0]]), B.t) {
                      case 1:
                        return b = C + h * H[0], H = va + h * H[1], m = p[0] - b, p = p[1] - H, n = ta + 2 * k * g[0] * B[0], B = Math.cos(n), n = Math.sin(n), T(b + B * m + n * p, H - n * m + B * p);
                      default:
                        throw a("Match_failure", a("op.ml", 214, 24));
                    }
                  default:
                    throw a("Match_failure",
                      a("op.ml", 213, 24));
                }
              default:
                throw a("Match_failure", a("op.ml", 212, 24));
            }
          }); else p = !0; else p = !0; else p = !0;
          if (p)throw a("Match_failure", a("op.ml", 211, 4));
        })
      })), L = a("discretize", a(2, a(2, 0)), 2, b(function (d) {
        var f = c(g[14], [d[0]]), h = c(e[4], [0, c(g[2], [0, 0, a(-.1), a(.8), c(g[14], [d[1]])])]), p = .1 * (1 - h) * f[0], k = .1 * (1 - h) * f[1];
        return b(function (d) {
          var e, g = !1;
          if (d)if (e = d[1])if (e[1]) g = !0; else return b(function (b) {
            var g, f = c(l[0], [d[0]]);
            switch (f.t) {
              case 2:
                switch (g = c(l[0], [e[0]]), g.t) {
                  case 2:
                    return b = g[0] * h + p, g = g[1] *
                      h + k, T(b * Math.floor(f[0] / b), g * Math.floor(f[1] / g));
                  default:
                    throw a("Match_failure", a("op.ml", 236, 24));
                }
              default:
                throw a("Match_failure", a("op.ml", 235, 24));
            }
          }); else g = !0; else g = !0;
          if (g)throw a("Match_failure", a("op.ml", 234, 4));
        })
      })), f = a("pplus", a(2, a(2, 0)), 2, b(function (d, e) {
        var g, f = !1;
        if (e)if (g = e[1])if (g[1]) f = !0; else return b(function (b) {
          var d = c(l[0], [e[0]]);
          switch (d.t) {
            case 2:
              switch (b = c(l[0], [g[0]]), b.t) {
                case 2:
                  return T(.5 * (d[0] + b[0]), .5 * (d[1] + b[1]));
                default:
                  throw a("Match_failure", a("op.ml", 250, 20));
              }
            default:
              throw a("Match_failure", a("op.ml", 249, 20));
          }
        }); else f = !0; else f = !0;
        if (f)throw a("Match_failure", a("op.ml", 248, 20));
      })), w = a("fplus", a(1, a(1, 0)), 1, b(function (d, e) {
        var g, f = !1;
        if (e)if (g = e[1])if (g[1]) f = !0; else return b(function (b) {
          var d = c(l[0], [e[0]]);
          switch (d.t) {
            case 1:
              switch (b = c(l[0], [g[0]]), b.t) {
                case 1:
                  return M(.5 * (d[0] + b[0]));
                default:
                  throw a("Match_failure", a("op.ml", 260, 20));
              }
            default:
              throw a("Match_failure", a("op.ml", 259, 20));
          }
        }); else f = !0; else f = !0;
        if (f)throw a("Match_failure", a("op.ml",
          258, 20));
      })), R = a("ftimes", a(1, a(1, 0)), 1, b(function (d) {
        var e = c(g[14], [d[0]]);
        return b(function (d) {
          var g, f = !1;
          if (d)if (g = d[1])if (g[1]) f = !0; else return b(function (b) {
            var f = c(l[0], [d[0]]);
            switch (f.t) {
              case 1:
                switch (b = c(l[0], [g[0]]), b.t) {
                  case 1:
                    return M((f[0] + e[0]) * (b[0] + e[1]));
                  default:
                    throw a("Match_failure", a("op.ml", 272, 24));
                }
              default:
                throw a("Match_failure", a("op.ml", 271, 24));
            }
          }); else f = !0; else f = !0;
          if (f)throw a("Match_failure", a("op.ml", 270, 18));
        })
      })), G = a("fmix", a(1, a(1, a(1, 0))), 1, b(function (d, e) {
        var f,
          h, k = !1;
        if (e)if (f = e[1])if (h = f[1])if (h[1]) k = !0; else return b(function (b) {
          var d, k;
          k = c(l[0], [e[0]]);
          switch (k.t) {
            case 1:
              switch (b = c(l[0], [f[0]]), b.t) {
                case 1:
                  switch (d = c(l[0], [h[0]]), d.t) {
                    case 1:
                      return k = Math.abs(c(g[3], [a(0), a(1), k[0]])), M(k * b[0] + (1 - k) * d[0]);
                    default:
                      throw a("Match_failure", a("op.ml", 283, 20));
                  }
                default:
                  throw a("Match_failure", a("op.ml", 282, 20));
              }
            default:
              throw a("Match_failure", a("op.ml", 281, 20));
          }
        }); else k = !0; else k = !0; else k = !0;
        if (k)throw a("Match_failure", a("op.ml", 280, 20));
      })), E = a("pmix",
        a(2, a(2, a(1, 0))), 2, b(function (d, e) {
          var f, h, k = !1;
          if (e)if (f = e[1])if (h = f[1])if (h[1]) k = !0; else return b(function (b) {
            var d, k = c(l[0], [e[0]]);
            switch (k.t) {
              case 2:
                switch (b = c(l[0], [f[0]]), b.t) {
                  case 2:
                    switch (d = c(l[0], [h[0]]), d.t) {
                      case 1:
                        return d = Math.abs(c(g[2], [0, 0, 0, 0, d[0]])), T(d * k[0] + (1 - d) * b[0], d * k[1] + (1 - d) * b[1]);
                      default:
                        throw a("Match_failure", a("op.ml", 295, 20));
                    }
                  default:
                    throw a("Match_failure", a("op.ml", 294, 20));
                }
              default:
                throw a("Match_failure", a("op.ml", 293, 20));
            }
          }); else k = !0; else k = !0; else k = !0;
          if (k)throw a("Match_failure",
            a("op.ml", 292, 20));
        })), I = a("fatan", a(1, 0), 1, b(function (d) {
        var e, f, h = !1;
        if (d = c(g[15], [2, d[1]]))if (e = d[1])if (e[1]) h = !0; else return f = c(g[2], [0, 0, a(.1), a(10), d[0]]), b(function (d) {
          var h = !1;
          if (d)if (d[1]) h = !0; else return b(function (b) {
            b = c(l[0], [d[0]]);
            switch (b.t) {
              case 1:
                return M(2 * Math.atan((b[0] - e[0]) / f) / g[0]);
              default:
                throw a("Match_failure", a("op.ml", 308, 24));
            }
          }); else h = !0;
          if (h)throw a("Match_failure", a("op.ml", 307, 18));
        }); else h = !0; else h = !0;
        if (h)throw a("Match_failure", a("op.ml", 305, 6));
      })), V = a("fsin",
        a(1, 0), 1, b(function (d) {
          var e = 10 * g[0] * c(g[14], [d[1]]);
          return b(function (d) {
            var g = !1;
            if (d)if (d[1]) g = !0; else return b(function (b) {
              b = c(l[0], [d[0]]);
              switch (b.t) {
                case 1:
                  return M(Math.sin(e * b[0]));
                default:
                  throw a("Match_failure", a("op.ml", 319, 24));
              }
            }); else g = !0;
            if (g)throw a("Match_failure", a("op.ml", 318, 18));
          })
        })), K = a("sqrt", a(1, 0), 1, b(function (d, e) {
        var g = !1;
        if (e)if (e[1]) g = !0; else return b(function (b) {
          b = c(l[0], [e[0]]);
          switch (b.t) {
            case 1:
              return M(2 * Math.sqrt(Math.abs(b[0])) - 1);
            default:
              throw a("Match_failure",
                a("op.ml", 328, 20));
          }
        }); else g = !0;
        if (g)throw a("Match_failure", a("op.ml", 327, 20));
      })), J = a("abs", a(1, 0), 1, b(function (d, e) {
        var g = !1;
        if (e)if (e[1]) g = !0; else return b(function (b) {
          b = c(l[0], [e[0]]);
          switch (b.t) {
            case 1:
              return M(2 * Math.abs(b[0]) - 1);
            default:
              throw a("Match_failure", a("op.ml", 339, 20));
          }
        }); else g = !0;
        if (g)throw a("Match_failure", a("op.ml", 338, 20));
      })), S = a("max", a(1, a(1, 0)), 1, b(function (d, g) {
        var f, h = !1;
        if (g)if (f = g[1])if (f[1]) h = !0; else return b(function (b) {
          var d = c(l[0], [g[0]]);
          switch (d.t) {
            case 1:
              switch (b =
                c(l[0], [f[0]]), b.t) {
                case 1:
                  return M(c(e[4], [d[0], b[0]]));
                default:
                  throw a("Match_failure", a("op.ml", 350, 20));
              }
            default:
              throw a("Match_failure", a("op.ml", 349, 20));
          }
        }); else h = !0; else h = !0;
        if (h)throw a("Match_failure", a("op.ml", 348, 20));
      })), Q = a("cmix", a(1, a(3, a(3, 0))), 3, b(function (d, e) {
        var f, h, k = !1;
        if (e)if (f = e[1])if (h = f[1])if (h[1]) k = !0; else return b(function (b) {
          var d, k = c(l[0], [e[0]]);
          switch (k.t) {
            case 1:
              switch (b = c(l[0], [f[0]]), b.t) {
                case 3:
                  switch (d = c(l[0], [h[0]]), d.t) {
                    case 3:
                      return W(c(g[28], [k[0], b[0],
                        d[0]]));
                    default:
                      throw a("Match_failure", a("op.ml", 361, 20));
                  }
                default:
                  throw a("Match_failure", a("op.ml", 360, 20));
              }
            default:
              throw a("Match_failure", a("op.ml", 359, 20));
          }
        }); else k = !0; else k = !0; else k = !0;
        if (k)throw a("Match_failure", a("op.ml", 358, 20));
      })), X = a("negative", a(1, 0), 0, b(function (d) {
        var f, h, k;
        f = !1;
        if (d = c(g[15], [2, d[1]]))if (f = d[1])if (f[1]) f = !0; else return f = f[0], h = c(e[3], [d[0], f]), k = c(e[4], [h, f]), b(function (d) {
          var e = !1;
          if (d)if (d[1]) e = !0; else return b(function (b) {
            b = c(l[0], [d[0]]);
            switch (b.t) {
              case 1:
                return b =
                  b[0], a(h < b && b < k);
              default:
                throw a("Match_failure", a("op.ml", 374, 24));
            }
          }); else e = !0;
          if (e)throw a("Match_failure", a("op.ml", 373, 18));
        }); else f = !0; else f = !0;
        if (f)throw a("Match_failure", a("op.ml", 370, 6));
      })), da = a("negative", a(1, 0), 0, b(function (d, e) {
        var g = !1;
        if (e)if (e[1]) g = !0; else return b(function (b) {
          b = c(l[0], [e[0]]);
          switch (b.t) {
            case 1:
              return a(0 > b[0]);
            default:
              throw a("Match_failure", a("op.ml", 383, 20));
          }
        }); else g = !0;
        if (g)throw a("Match_failure", a("op.ml", 382, 20));
      })), x = a("fless", a(1, a(1, 0)), 0, b(function (d,
                                                        e) {
        var g, f = !1;
        if (e)if (g = e[1])if (g[1]) f = !0; else return b(function (b) {
          var d = c(l[0], [e[0]]);
          switch (d.t) {
            case 1:
              switch (b = c(l[0], [g[0]]), b.t) {
                case 1:
                  return a(d[0] < b[0]);
                default:
                  throw a("Match_failure", a("op.ml", 394, 20));
              }
            default:
              throw a("Match_failure", a("op.ml", 393, 20));
          }
        }); else f = !0; else f = !0;
        if (f)throw a("Match_failure", a("op.ml", 392, 20));
      })), P = a("even", a(1, a(1, 0)), 0, b(function (d) {
        d = d[1];
        var f = c(e[4], [0, c(g[2], [0, 0, a(-.5), a(2), c(g[14], [d])])]), h = c(g[2], [0, 0, a(2), a(20), c(g[14], [d])]);
        return b(function (d) {
          var e,
            g = !1;
          if (d)if (e = d[1])if (e[1]) g = !0; else return b(function (b) {
            var g;
            b = c(l[0], [d[0]]);
            switch (b.t) {
              case 1:
                switch (g = c(l[0], [e[0]]), g.t) {
                  case 1:
                    return g = g[0], a(0 === (f * g * g * g + h * b[0] >> 0) % 2);
                  default:
                    throw a("Match_failure", a("op.ml", 407, 24));
                }
              default:
                throw a("Match_failure", a("op.ml", 406, 24));
            }
          }); else g = !0; else g = !0;
          if (g)throw a("Match_failure", a("op.ml", 405, 18));
        })
      })), m = a("close", a(2, a(2, 0)), 0, b(function (d) {
        d = c(g[14], [d[1]]);
        var e = d * d;
        return b(function (d) {
          var g, f = !1;
          if (d)if (g = d[1])if (g[1]) f = !0; else return b(function (b) {
            var f,
              h = c(l[0], [d[0]]);
            switch (h.t) {
              case 2:
                switch (f = c(l[0], [g[0]]), f.t) {
                  case 2:
                    return b = h[0] - f[0], f = h[1] - f[1], a(b * b + f * f < e);
                  default:
                    throw a("Match_failure", a("op.ml", 420, 24));
                }
              default:
                throw a("Match_failure", a("op.ml", 419, 24));
            }
          }); else f = !0; else f = !0;
          if (f)throw a("Match_failure", a("op.ml", 418, 4));
        })
      })), u = a("pfoci", a(2, a(2, a(2, 0))), 2, b(function (d) {
        var f = d[1], h = d[0];
        d = c(e[3], [c(n[0], [h]), c(n[0], [f])]);
        var k = c(g[5], [2, d]), m = c(e[4], [0, c(g[2], [0, 0, a(-.05), a(.5), c(g[14], [f])])]), q = function () {
          var a = c(g[15], [k, h]),
            d = c(g[15], [k, f]);
          return c(n[36], [a, c(n[10], [b(function (a) {
            return .1 * a * a
          }), d])])
        }();
        return b(function (d) {
          var e, g, f = !1;
          if (d)if (e = d[1])if (g = e[1])if (g[1]) f = !0; else return b(function (f) {
            var h, k, p, C, B;
            f = c(l[0], [d[0]]);
            switch (f.t) {
              case 2:
                switch (h = f[1], k = f[0], f = c(l[0], [e[0]]), p = c(l[0], [g[0]]), p.t) {
                  case 2:
                    try {
                      return C = c(n[25], [b(function (a) {
                        var b = a[0], c = k - b[0] - m * p[0], b = h - b[1] - m * p[1];
                        return c * c + b * b < a[1]
                      }), q]), B = C[0], T(k - B[0], h - B[1])
                    } catch (Ka) {
                      if ("Not_found" === Ka[0])return f;
                      throw Ka;
                    }
                  default:
                    throw a("Match_failure",
                      a("op.ml", 441, 24));
                }
              default:
                throw a("Match_failure", a("op.ml", 439, 24));
            }
          }); else f = !0; else f = !0; else f = !0;
          if (f)throw a("Match_failure", a("op.ml", 438, 4));
        })
      })), ea = a("pclosestmax", a(2, a(1, 0)), 2, b(function (f) {
        f = f[0];
        var h = c(n[0], [f]), k = c(g[15], [c(g[5], [h / 2 >> 0, h]), f]);
        return b(function (f) {
          var h, p = !1;
          if (f)if (h = f[1])if (h[1]) p = !0; else return b(function (p) {
            var m, n = c(l[0], [f[0]]);
            switch (n.t) {
              case 2:
                switch (p = c(l[0], [h[0]]), p.t) {
                  case 1:
                    return m = p[0], p = c(g[31], [b(function (a) {
                      return d(e[4], [m * a[0] - n[0], m * a[1] -
                      n[1]])
                    }), k]), T(p[0], p[1]);
                  default:
                    throw a("Match_failure", a("op.ml", 465, 24));
                }
              default:
                throw a("Match_failure", a("op.ml", 464, 24));
            }
          }); else p = !0; else p = !0;
          if (p)throw a("Match_failure", a("op.ml", 463, 4));
        })
      })), fa = a("fclosest", a(1, a(1, 0)), 1, b(function (d) {
        d = d[1];
        var e = c(n[0], [d]), f = c(g[15], [c(g[5], [e / 2 >> 0, e]), d]);
        return b(function (d) {
          var e, h = !1;
          if (d)if (e = d[1])if (e[1]) h = !0; else return b(function (h) {
            var k, p = c(l[0], [d[0]]);
            switch (p.t) {
              case 1:
                switch (k = c(l[0], [e[0]]), k.t) {
                  case 1:
                    return M(c(g[31], [b(function (a) {
                      return Math.abs(a *
                        k[0] - p[0])
                    }), f]));
                  default:
                    throw a("Match_failure", a("op.ml", 480, 24));
                }
              default:
                throw a("Match_failure", a("op.ml", 479, 24));
            }
          }); else h = !0; else h = !0;
          if (h)throw a("Match_failure", a("op.ml", 478, 18));
        })
      })), ia = a("torus", a(2, a(1, a(1, 0))), 2, b(function (d, f) {
        var h, k, m = !1;
        if (f)if (h = f[1])if (k = h[1])if (k[1]) m = !0; else return b(function (b) {
          var d, p, m;
          b = c(l[0], [f[0]]);
          switch (b.t) {
            case 2:
              switch (d = c(l[0], [h[0]]), d.t) {
                case 1:
                  switch (d = d[0], p = c(l[0], [k[0]]), p.t) {
                    case 1:
                      return m = p[0], p = c(e[3], [d, m]) - .1, d = c(e[4], [d, m]) + .1,
                        T(c(g[2], [a(p), a(d), a(-1), a(1), b[0]]), c(g[2], [a(p), a(d), a(-1), a(1), b[1]]));
                    default:
                      throw a("Match_failure", a("op.ml", 492, 20));
                  }
                default:
                  throw a("Match_failure", a("op.ml", 491, 20));
              }
            default:
              throw a("Match_failure", a("op.ml", 490, 20));
          }
        }); else m = !0; else m = !0; else m = !0;
        if (m)throw a("Match_failure", a("op.ml", 489, 20));
      })), ja = a("or", a(0, a(0, 0)), 0, b(function (d, e) {
        var g, f = !1;
        if (e)if (g = e[1])if (g[1]) f = !0; else return b(function (b) {
          var d = c(l[0], [e[0]]);
          switch (d.t) {
            case 0:
              switch (b = c(l[0], [g[0]]), b.t) {
                case 0:
                  return a(d[0] ||
                    b[0]);
                default:
                  throw a("Match_failure", a("op.ml", 505, 20));
              }
            default:
              throw a("Match_failure", a("op.ml", 504, 20));
          }
        }); else f = !0; else f = !0;
        if (f)throw a("Match_failure", a("op.ml", 503, 20));
      })), Na = a("and", a(0, a(0, 0)), 0, b(function (d, e) {
        var g, f = !1;
        if (e)if (g = e[1])if (g[1]) f = !0; else return b(function (b) {
          var d = c(l[0], [e[0]]);
          switch (d.t) {
            case 0:
              switch (b = c(l[0], [g[0]]), b.t) {
                case 0:
                  return a(d[0] && b[0]);
                default:
                  throw a("Match_failure", a("op.ml", 515, 20));
              }
            default:
              throw a("Match_failure", a("op.ml", 514, 20));
          }
        }); else f = !0; else f = !0;
        if (f)throw a("Match_failure", a("op.ml", 513, 20));
      })), la = a("fif", a(0, a(1, a(1, 0))), 1, b(function (d, e) {
        var g, f, h = !1;
        if (e)if (g = e[1])if (f = g[1])if (f[1]) h = !0; else return b(function (b) {
          var d, h = c(l[0], [e[0]]);
          switch (h.t) {
            case 0:
              return b = c(l[0], [g[0]]), d = c(l[0], [f[0]]), h[0] ? b : d;
            default:
              throw a("Match_failure", a("op.ml", 524, 20));
          }
        }); else h = !0; else h = !0; else h = !0;
        if (h)throw a("Match_failure", a("op.ml", 523, 20));
      })), ma = a("cif", a(0, a(3, a(3, 0))), 3, b(function (d, e) {
        var g, f, h = !1;
        if (e)if (g = e[1])if (f = g[1])if (f[1]) h = !0; else return b(function (b) {
          var d, h = c(l[0], [e[0]]);
          switch (h.t) {
            case 0:
              return b = c(l[0], [g[0]]), d = c(l[0], [f[0]]), h[0] ? b : d;
            default:
              throw a("Match_failure", a("op.ml", 535, 20));
          }
        }); else h = !0; else h = !0; else h = !0;
        if (h)throw a("Match_failure", a("op.ml", 534, 20));
      })), na = a("pif", a(0, a(2, a(2, 0))), 2, b(function (d, e) {
        var g, f, h = !1;
        if (e)if (g = e[1])if (f = g[1])if (f[1]) h = !0; else return b(function (b) {
          var d, h = c(l[0], [e[0]]);
          switch (h.t) {
            case 0:
              return b = c(l[0], [g[0]]), d = c(l[0], [f[0]]), h[0] ? b : d;
            default:
              throw a("Match_failure",
                a("op.ml", 546, 20));
          }
        }); else h = !0; else h = !0; else h = !0;
        if (h)throw a("Match_failure", a("op.ml", 545, 20));
      })), oa = a("hsl", a(2, a(1, 0)), 3, b(function (d, e) {
        var f, h = !1;
        if (e)if (f = e[1])if (f[1]) h = !0; else return b(function (b) {
          var d, h;
          h = c(l[0], [e[0]]);
          switch (h.t) {
            case 2:
              switch (d = c(l[0], [f[0]]), d.t) {
                case 1:
                  return b = c(g[2], [0, 0, a(0), a(1), h[0] / 2]), d = c(g[2], [0, 0, a(0), a(1), d[0]]), h = c(g[2], [0, 0, a(0), a(1), h[1]]), b = c(g[22], [b, d, h]), W(c(g[20], [2 * b[0] - 1, 2 * b[1] - 1, 2 * b[2] - 1]));
                default:
                  throw a("Match_failure", a("op.ml", 558, 20));
              }
            default:
              throw a("Match_failure", a("op.ml", 557, 20));
          }
        }); else h = !0; else h = !0;
        if (h)throw a("Match_failure", a("op.ml", 556, 20));
      })), pa = a("bw", a(1, 0), 3, b(function (d, e) {
        var f = !1;
        if (e)if (e[1]) f = !0; else return b(function (b) {
          b = c(l[0], [e[0]]);
          switch (b.t) {
            case 1:
              return b = b[0], W(c(g[20], [b, b, b]));
            default:
              throw a("Match_failure", a("op.ml", 575, 20));
          }
        }); else f = !0;
        if (f)throw a("Match_failure", a("op.ml", 574, 20));
      })), ra = a("rgb", a(1, a(1, a(1, 0))), 3, b(function (d, e) {
        var f, h, k = !1;
        if (e)if (f = e[1])if (h = f[1])if (h[1]) k = !0; else return b(function (b) {
          var d,
            k = c(l[0], [e[0]]);
          switch (k.t) {
            case 1:
              switch (b = c(l[0], [f[0]]), b.t) {
                case 1:
                  switch (d = c(l[0], [h[0]]), d.t) {
                    case 1:
                      return W(c(g[20], [k[0], b[0], d[0]]));
                    default:
                      throw a("Match_failure", a("op.ml", 586, 20));
                  }
                default:
                  throw a("Match_failure", a("op.ml", 585, 20));
              }
            default:
              throw a("Match_failure", a("op.ml", 584, 20));
          }
        }); else k = !0; else k = !0; else k = !0;
        if (k)throw a("Match_failure", a("op.ml", 583, 20));
      })), sa = a("rgbv", a(2, a(2, 0)), 3, b(function (d, e) {
        var f, h = !1;
        if (e)if (f = e[1])if (f[1]) h = !0; else return b(function (b) {
          var d, h = c(l[0],
            [e[0]]);
          switch (h.t) {
            case 2:
              switch (b = c(l[0], [f[0]]), b.t) {
                case 2:
                  return d = b[1], W(c(g[20], [h[0] * d, h[1] * d, b[0] * d]));
                default:
                  throw a("Match_failure", a("op.ml", 596, 20));
              }
            default:
              throw a("Match_failure", a("op.ml", 595, 20));
          }
        }); else h = !0; else h = !0;
        if (h)throw a("Match_failure", a("op.ml", 594, 20));
      }));
      return a(h, q, t, y, Y, r, D, v, z, ca, k, L, f, w, R, G, E, I, V, K, J, S, Q, X, da, x, P, m, u, ea, fa, ia, ja, Na, la, ma, na, oa, pa, ra, sa)
    }(), z = a(t[4], a(t[2], a(t[3], a(t[5], a(t[6], a(t[7], a(t[9], a(t[10], a(t[8], a(t[12], a(t[13], a(t[14], a(t[15], a(t[16],
      a(t[17], a(t[21], a(t[22], a(t[25], a(t[24], a(t[11], a(t[23], a(t[28], a(t[29], a(t[30], a(t[31], a(t[32], a(t[33], a(t[34], a(t[35], a(t[36], a(t[40], a(t[37], a(t[38], 0))))))))))))))))))))))))))))))))), E = b(function (a) {
      return d(n[26], [b(function (b) {
        return ja(b[2], a)
      }), z])
    }), I = b(function (a) {
      return a[0]
    }), r = b(function (a) {
      return d(n[25], [a, z])
    }), G = b(function (a) {
      return a[1]
    }), y = b(function (a) {
      return a[2]
    }), h = b(function (a) {
      return a[0]
    }), L = b(function (a) {
      return a[3]
    }), D = b(function (a) {
      var b = c(n[0], [a]);
      return d(g[15], [c(g[5],
        [1 + (b / 5 >> 0), b]), a])
    });
    return a(v, q, t, z, E, I, r, G, y, h, L, D)
  }(), ea = function () {
    var l = b(function (a) {
      return a[0]
    }), q = b(function (a) {
      return a[1]
    }), t = b(function (b) {
      return a(c(z[0], ["x", b]), 0)
    }), v = b(function (b) {
      return a(c(z[0], ["y", b]), 0)
    }), E = b(function (b) {
      return a(c(z[0], ["t", b]), 0)
    }), I = b(function (b, d) {
      return a(c(z[1], [b, d]), 0)
    }), r = b(function (a, e) {
      return d(n[26], [b(function (b) {
        return ja(c(z[8], [b[0]]), a)
      }), e])
    }), G = b(function (a, e) {
      return d(n[19], [b(function (a) {
        return d(n[20], [b(function (b) {
          return ja(a, c(z[8],
            [b[0]]))
        }), e])
      }), c(z[7], [a])])
    }), y = b(function (e) {
      return d(g[11], [b(function (b) {
        b = c(g[6], [-1, 1]);
        var d = c(g[6], [-1, 1]);
        return a(b, d)
      }), 1, e])
    }), h = b(function (a) {
      return d(g[11], [b(function (a) {
        return d(g[6], [-1, 1])
      }), 1, a])
    }), L = b(function (e) {
      e = c(g[11], [b(function (a) {
        return d(g[23], [0])
      }), 1, e]);
      var h = c(g[5], [-15, 15]);
      return d(g[9], [b(function (e) {
        return d(n[10], [b(function (b) {
          var d = c(g[25], [b, e]);
          return a(b[0] + .1 * d[0], b[1] + .1 * d[1], b[2] + .1 * d[2])
        }), e])
      }), e, h])
    }), D = b(function (e, h) {
      return a(e, c(n[10], [b(function (a) {
        return d(g[12],
          [.2, c(r, [a, h])])
      }), c(z[7], [e])]))
    }), A = b(function (h, l, q, t) {
      var y = b(function (l, k, r) {
        var f, w;
        if (1 >= l) {
          f = c(n[26], [b(function (a) {
            return d(G, [a, r])
          }), h]);
          if (w = c(n[26], [b(function (a) {
              return d(n[23], [c(z[8], [a]), q])
            }), f]))return a(c(D, [c(g[14], [w]), r]), k);
          if (l < -t - 5)return d(e[21], [c(A, [z[3], r, q, l]), k]);
          f = c(D, [c(g[14], [f]), r]);
          return d(y, [l - 1, a(f, k), a(f, r)])
        }
        f = c(g[14], [h]);
        if (c(G, [f, r]))return f = c(D, [f, r]), d(y, [l - 1, a(f, k), a(f, r)]);
        l = c(n[13], [b(function (b, d) {
          var f = c(A, [h, r, a(b[0], 0), b[1]]);
          if (f)return a(d[0] -
            c(n[0], [f]), a(f[0], d[1]), c(e[21], [f, d[2]]), c(e[21], [f, d[3]]));
          throw a("Match_failure", a("gene.ml", 101, 7));
        }), c(n[36], [c(z[7], [f]), c(g[10], [c(g[5], [1, l - 1]), c(n[0], [c(z[7], [f])])])]), a(l, 0, k, r)]);
        k = a(f, l[1]);
        return d(y, [l[0], a(k, l[2]), a(k, l[3])])
      });
      return d(y, [t, 0, l])
    }), F = b(function (h, l, q, t, r) {
      var y, k, D, f, w = b(function (b, e) {
        var f, h, k;
        return e ? (f = e[1], h = e[0], k = c(z[8], [h[0]]), (1 !== k && 2 !== k || c(n[23], [k, b])) && .5 > c(g[4], [0]) ? d(w, [b, f]) : a(h, c(w, [a(k, b), f]))) : 0
      });
      if (1 >= r)return d(A, [h, l, q, t]);
      if (y = c(A, [h, l,
          a(0, a(1, a(2, a(3, 0)))), t])) {
        k = y[0];
        if (D = c(A, [h, l, a(0, a(1, a(2, a(3, 0)))), t]))return f = D[0], l = a(k, a(f, c(w, [a(c(z[8], [k[0]]), a(c(z[8], [f[0]]), 0)), l]))), d(e[21], [c(F, [h, l, q, t, r - 2]), c(e[21], [y, D])]);
        throw a("Match_failure", a("gene.ml", 128, 10));
      }
      throw a("Match_failure", a("gene.ml", 127, 10));
    }), O = b(function (a) {
      var e = b(function (a, b) {
        var g, l;
        return b ? (g = b[1], l = b[0], c(n[24], [l, a]) ? d(e, [a, g]) : d(e, [c(h, [a, l]), g])) : a
      }), h = b(function (a, b) {
        return d(e, [c(g[18], [b, a]), c(q, [b])])
      }), l = c(h, [0, c(n[1], [a])]);
      return d(n[26],
        [b(function (a) {
          return d(n[24], [a, l])
        }), a])
    }), J = b(function (a) {
      var h = c(g[17], [a]);
      return d(ia[5], ["\n", c(n[10], [b(function (a) {
        var g = a[0];
        return d(e[15], [c(e[19], [a[1]]), c(e[15], [":", c(e[15], ["[", c(e[15], [c(z[5], [g[0]]), c(e[15], [", (", c(e[15], [c(ia[5], [",", c(n[10], [b(function (a) {
          return d(e[19], [c(n[30], [a, h])])
        }), g[1]])]), ")]"])])])])])])
      }), h])])
    });
    return a(l, q, t, v, E, I, r, G, y, h, L, D, A, F, O, J)
  }(), La = function () {
    var v = c(g[20], [0, 0, 0]), q = b(function (b) {
        switch (b) {
          case 0:
            return a(!1);
          case 1:
            return M(.7);
          case 2:
            return T(.2,
              .3);
          case 3:
            return W(v);
          default:
            return null
        }
      }), t = b(function (b, d, e) {
        return a(a(c(q, [c(z[8], [d])])), c(z[10], [d, e, b]))
      }), J = b(function (e, g) {
        var h = b(function (e) {
          var l, q, r;
          return e ? (l = e[0], e = c(h, [e[1]]), q = e[1], r = c(t, [c(n[10], [b(function (a) {
              return d(n[30], [a, q])
            }), c(ea[1], [l])]), c(ea[0], [l]), g]), a(a(r, e[0]), a(a(l, r), q))) : a(0, 0)
        });
        return c(h, [e])[0]
      }), K = b(function (d) {
        var h, l, n, q;
        n = c(g[8], [d]);
        var r = a(0), t = a(0), y = a(-1);
        c(g[36], [n[0]]);
        d = c(ea[9], [10]);
        h = c(ea[8], [c(g[5], [5, 20])]);
        l = a(c(g[20], [-1, -1, -1]), a(c(g[20],
          [1, 0, 1]), c(ea[10], [c(g[5], [2, 10])])));
        d = a(h, d, l);
        c(g[36], [n[1]]);
        n = c(g[5], [120, 200]);
        h = c(z[11], [z[3]]);
        l = a(c(ea[5], [r, t]), a(c(ea[4], [y]), 0));
        n = c(ea[14], [c(e[21], [c(ea[12], [h, l, a(3, 0), n]), l])]);
        q = c(J, [n, d]);
        return b(function (a, b, c) {
          r[0] = b;
          t[0] = c;
          y[0] = a;
          return q
        })
      }), I = b(function (a) {
        var b;
        return a ? (b = a[0], c(I, [a[1]]), b[0][0] = c(b[1], [0])) : 0
      }), r = b(function (a, b, q, r) {
        a = c(a, [b, q, r]);
        a = (c(I, [a]), c(l[0], [c(n[1], [a])]));
        switch (a.t) {
          case 3:
            return d(g[21], [a[0]]);
          default:
            return d(e[1], ["The result is not a color"])
        }
      }),
      G = b(function (a, b, d, g, q) {
        var h, r = 2 / b;
        for (h = 0; h <= b - 1; h++) {
          var t = h, v = c(a, [d, r * (.5 + t) - 1, r * (.5 + g) - 1]), v = (c(I, [v]), c(l[0], [c(n[1], [v])]));
          switch (v.t) {
            case 3:
              E(q, t, v[0]);
              break;
            default:
              c(e[1], ["The result is not a color"])
          }
        }
      });
    return a(v, q, t, J, K, I, r, G)
  }(), fb = (module.exports.new_picture = c(b(function (a, b) {
    return c(a, [b])
  }), [La[4]]), module.exports.compute_pixel = c(b(function (a, b, d, e) {
    return c(a, [b, d, e])
  }), [b(function (a, b, g) {
    a = c(La[6], [a, 0, b, g]);
    return d(e[15], ["rgb(", c(e[15], [c(e[19], [a[0]]), c(e[15], [",", c(e[15],
      [c(e[19], [a[1]]), c(e[15], [",", c(e[15], [c(e[19], [a[2]]), ")"])])])])])])
  })]), a());
  c(e[80], [0]);
  a();
  console.log(fb);
  return function (a) {
    return Ja[a]
  }
}();



//////////////////
// WEBPACK FOOTER
// ./app/+lobby/genjs.js
// module id = 611
// module chunks = 2