module.exports = {};
(function () {
  function ia() {
    var b, c, a, d, y, g, f, z, n, e, k, m, F, v;
    (!arguments || 1 > arguments.length) && alert("sprintf:ERROR: not enough arguments 1");
    b = 0;
    c = "";
    for (a = arguments[b++]; d = /^([^%]*)%(\d+$)?([-#0 +']+)?(\*|\d+)?(\.\*|\.\d+)?([%dioulLnNxXfFgGcs])(.*)$/.exec(a);) {
      a = d[1];
      y = d[2];
      g = d[3];
      f = d[4];
      z = d[5];
      n = d[6];
      d = d[7];
      if ("%" == n) e = "%"; else {
        k = " ";
        m = !0;
        g ? (0 <= g.indexOf("0") && (k = "0"), 0 <= g.indexOf("-") && (k = " ", m = !1)) : g = "";
        F = -1;
        f && ("*" == f ? (v = b++, v >= arguments.length && alert("sprintf:ERROR: not enough arguments 2"), F =
            arguments[v]) : F = parseInt(f, 10));
        f = -1;
        z && (".*" == z ? (v = b++, v >= arguments.length && alert("sprintf:ERROR: not enough arguments 3"), f = arguments[v]) : f = parseInt(z.substring(1), 10));
        v = b++;
        y && (v = parseInt(y.substring(0, y.length - 1), 10));
        v >= arguments.length && alert("sprintf:ERROR: not enough arguments 4");
        y = "";
        switch (n) {
          case "d":
          case "i":
            e = arguments[v];
            "number" != typeof e && (e = 0);
            e = e.toString(10);
            0 <= g.indexOf("#") && 0 <= e && (e = "+" + e);
            0 <= g.indexOf(" ") && 0 <= e && (e = " " + e);
            break;
          case "o":
            e = arguments[v];
            "number" != typeof e &&
            (e = 0);
            e = e.toString(8);
            break;
          case "u":
          case "l":
          case "L":
          case "n":
          case "N":
            e = arguments[v];
            "number" != typeof e && (e = 0);
            e = Math.abs(e);
            e = e.toString(10);
            break;
          case "x":
            e = arguments[v];
            "number" != typeof e && (e = 0);
            e = e.toString(16).toLowerCase();
            0 <= g.indexOf("#") && (y = "0x");
            break;
          case "X":
            e = arguments[v];
            "number" != typeof e && (e = 0);
            e = e.toString(16).toUpperCase();
            0 <= g.indexOf("#") && (y = "0X");
            break;
          case "f":
          case "F":
          case "g":
          case "G":
            e = arguments[v];
            "number" != typeof e && (e = 0);
            e = 0 + e;
            -1 < f && (e.toFixed ? e = e.toFixed(f) : (e = Math.round(e *
                  Math.pow(10, f)) / Math.pow(10, f), e += "0000000000", e = e.substr(0, e.indexOf(".") + f + 1)));
            e = "" + e;
            if (0 <= g.indexOf("'"))for (g = 0, n = e.length - 1 - 3; 0 <= n; n -= 3)e = e.substring(0, n) + (0 == g ? "." : ",") + e.substring(n), g = (g + 1) % 2;
            e = e.replace("Infinity", "inf");
            e = e.replace("NaN", "nan");
            break;
          case "c":
            e = arguments[v];
            "number" != typeof e && (e = 0);
            e = String.fromCharCode(e);
            break;
          case "s":
            e = arguments[v], -1 < f && (e = e.substr(0, f)), "string" != typeof e && (e = "")
        }
        F = F - e.toString().length - y.toString().length;
        0 < F && (F = Array(F + 1), e = m ? F.join(k) + e : e + F.join(k));
        e = y + e
      }
      c = c + a + e;
      a = d
    }
    return c + a
  }

  function ba(b) {
    var c, a = b.length, d = Array(a);
    for (c = 0; c < a; c++)d[c] = b[c];
    d.t = b.t;
    return d
  }

  function Ba() {
    throw"caml_ml_set_binary_mode";
  }

  function Ca() {
    throw"caml_ml_input_char";
  }

  function ma() {
    throw"caml_ml_close_channel";
  }

  function Da() {
    throw"caml_ml_channel_size_64";
  }

  function Ea() {
    throw"caml_ml_channel_size";
  }

  function I(b, c) {
    var a, d = Array(b);
    for (a = 0; a < b; a++)d[a] = c;
    return d
  }

  function ca(b) {
    switch (b) {
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
  }

  function X(b, c) {
    return 0 == da(b, c, 0)
  }

  function ea(b, c) {
    var a = da(b, c, 1);
    return 0 > a ? -1 : 0 < a ? 1 : 0
  }

  function da(c, a, d) {
    var p, l, ja;
    if (c == a && d)return 0;
    p = typeof c;
    l = typeof a;
    if (p == l)switch (p) {
      case "boolean":
        return c < a ? -1 : c > a ? 1 : 0;
      case "number":
        if (c < a)return -1;
        if (c > a)return 1;
        if (c != a) {
          if (!d)return -2;
          if (c == c)return 1;
          if (a == a)return -1
        }
        return 0;
      case "string":
        return c < a ? -1 : c > a ? 1 : 0;
      case "function":
        throw b("Invalid_argument", "equal: functional value");
      case "object":
        if (null == c)return null == a ? 0 : -1;
        if (null == a)return 1;
        if (c instanceof Date)return p = c.getTime(), l = a.getTime(), p < l ? -1 : p > l ? 1 : 0;
        if (c instanceof Array) {
          if (c.t < a.t)return -1;
          if (c.t > a.t)return 1;
          p = c.length;
          l = a.length;
          if (p < l)return -1;
          if (p > l)return 1;
          if (0 == p)return 0;
          for (l = 0; l < p; l++)if (ja = da(c[l], a[l], d), 0 != ja)return ja;
          return 0
        }
        return c instanceof qa ? (c = c.toString(),
            a = a.toString(), c < a ? -1 : c > a ? 1 : 0) : null != c.h && null != a.h ? (c = c[1], a = a[1], c < a ? -1 : c > a ? 1 : 0) : -2;
      default:
        return -2
    }
    return null == c ? null == a ? 0 : -1 : null == a ? 1 : "boolean" == p || "boolean" == l ? c < a ? -1 : c > a ? 1 : 0 : "string" == p || "string" == l ? (c = c.toString(), a = a.toString(), c < a ? -1 : c > a ? 1 : 0) : "number" == p ? -1 : "number" == l ? 1 : -2
  }

  function Y(b, c, a, d, g) {
    var p;
    for (p = 0; p < g; p++)a.b[d + p] = S(b, c + p)
  }

  function La(b, c, d) {
    function p(b, c) {
      var a, d = [];
      for (a = 0; a < b.length; a++)d.push(b[a]);
      for (a = 0; a < c.length; a++)d.push(c[a]);
      return d
    }

    for (var l, g; ;)if (l = d.length,
        g = b.length, l < g)switch (g - l) {
      case 1:
        return a(function (a) {
          return b.apply(c, p(d, arguments))
        });
      case 2:
        return a(function (a, l) {
          return b.apply(c, p(d, arguments))
        });
      case 3:
        return a(function (a, l, n) {
          return b.apply(c, p(d, arguments))
        });
      case 4:
        return a(function (a, l, n, e) {
          return b.apply(c, p(d, arguments))
        });
      case 5:
        return a(function (a, l, n, e, g) {
          return b.apply(c, p(d, arguments))
        });
      case 6:
        return a(function (a, l, n, e, g, ja) {
          return b.apply(c, p(d, arguments))
        });
      case 7:
        return a(function (a, l, n, e, g, ja, k) {
          return b.apply(c, p(d, arguments))
        });
      default:
        throw"unimplemented";
    } else {
      if (l == g)return b.apply(c, d);
      c = b = xa(b, c, d.slice(0, g));
      d = d.slice(g)
    }
  }

  function Fa(b, c, a) {
    var d;
    if (b.$oc)return P ? (a.c = b, a.f = c, a.g = !0, a) : xa(b, c, a);
    d = P;
    P = !1;
    try {
      return b.apply(c, a)
    } finally {
      P = d
    }
  }

  function d(b, c) {
    return Fa(b, b, c)
  }

  function xa(b, c, a) {
    var d, p;
    if (b.$oc) {
      d = P;
      P = !0;
      try {
        for (p = Fa(b, c, a); p && p.g;)p = La(p.c, p.f, p);
        return p
      } finally {
        P = d
      }
    } else {
      d = P;
      P = !1;
      try {
        return b.apply(c, a)
      } finally {
        P = d
      }
    }
  }

  function c(b, c) {
    return xa(b, b, c)
  }

  function a(b) {
    b.$oc = !0;
    return b
  }

  function na(b, c) {
    var a,
      d = c.length, p = Array(d);
    for (a = 0; a < d; a++)p[a] = c[a];
    p.t = b;
    return p
  }

  function b() {
    return na(0, arguments)
  }

  function O() {
    return na(1, arguments)
  }

  function Q() {
    return na(2, arguments)
  }

  function T() {
    return na(3, arguments)
  }

  function w(b, c) {
    return c < b.length ? b[c] : g[0]("index out of bounds")
  }

  function D(b, c, a) {
    return c < b.length ? b[c] = a : g[0]("index out of bounds")
  }

  function qa(b) {
    this.a = b;
    this.length = b.length
  }

  function U(b) {
    return new qa(Array(b))
  }

  function S(b, c) {
    return "string" == typeof b ? b.charCodeAt(c) : b.b[c]
  }

  function fa(b,
              c) {
    return c < b.length ? S(b, c) : g[0]("index out of bounds")
  }

  var Ga = {}, P = !1;
  qa.prototype.toString = function () {
    return String.fromCharCode.apply(null, this.b)
  };
  "undefined" != typeof Number.prototype.toFixed && function () {
    function b(b, c) {
      for (var a = b; a.length < c;)a = "0" + a;
      return a
    }

    Number.prototype.toFixed = function (c) {
      var a = 0 > this ? "-" : "";
      var d = Math.abs(this), p, g;
      g = String(Math.round(d * Number("1e" + c)));
      if (g.search && -1 != g.search(/\D/)) c = "" + d; else with (String(b(g, 1 + c)))c = substring(0, p = length - c) + "." + substring(p);
      return a +
        c
    }
  }();
  var g = function () {
    var p = a(function (c) {
      throw b("Failure", c);
    }), g = a(function (c) {
      throw b("Invalid_argument", c);
    }), l = b("Pervasives.Exit"), k = a(function (b, c) {
      return -1 >= da(b, c, 0) - 1 ? b : c
    }), m = a(function (b, c) {
      return 0 <= da(b, c, 0) ? b : c
    }), x = a(function (b) {
      return 0 <= b ? b : -b
    }), f = a(function (b) {
      return b ^ -1
    }), z = 1 << 62, n = z - 1, e = ca("9218868437227405312"), K = ca("-4503599627370496"), L = ca("9218868437227405313"), F = ca("9218868437227405311"), v = ca("4503599627370496"), R = ca("4372995238176751616"), h = a(function (b, c) {
      return b.toString() +
        c.toString()
    }), q = a(function (b) {
      return 0 > b || 255 < b ? d(g, ["char_of_int"]) : b
    }), M = a(function (b) {
      return b ? "true" : "false"
    }), ga = a(function (b) {
      return b.toString() != "false".toString() ? b.toString() != "true".toString() ? d(g, ["bool_of_string"]) : !0 : !1
    }), Z = a(function (b) {
      return ia("%d", b)
    });
    b();
    var ra = a(function (b) {
        var c = b.length, e = a(function (a) {
          var C;
          if (a >= c)return d(h, [b, "."]);
          C = fa(b, a);
          a:{
            if (!(48 <= C)) {
              if (45 === C) {
                C = !0;
                break a
              }
              return b
            }
            if (58 <= C)return b;
            C = !0
          }
          if (C)return d(e, [a + 1])
        });
        return d(e, [0])
      }), r = a(function (b) {
        return d(ra,
          [ia("%.12g", b)])
      }), sa = a(function (a, d) {
        return a ? b(a[0], c(sa, [a[1], d])) : d
      }), oa = a(function () {
        throw"caml_sys_open";
      }), va = a(function (c) {
        return d(oa, [b(1, b(3, b(4, b(7, 0)))), 438, c])
      }), t = a(function (c) {
        return d(oa, [b(1, b(3, b(4, b(6, 0)))), 438, c])
      }), w = a(function () {
        var b = a(function (c) {
          return c ? d(b, [c[1]]) : 0
        });
        return d(b, [0])
      }), N = a(function (b, c) {
        print_verbatim(c)
      }), wa = a(function (b, c, a, C) {
        0 > a || 0 > C || a > c.length - C ? b = d(g, ["output"]) : (print_verbatim(c), b = void 0);
        return b
      }), Ma = a(function () {
        throw"caml_output_value";
      }),
      ta = a(function () {
        return ma()
      }), ka = a(function () {
        try {
          return ma()
        } catch (ua) {
          return 0
        }
      }), C = a(function () {
        throw"caml_sys_open";
      }), la = a(function (c) {
        return d(C, [b(0, b(7, 0)), 0, c])
      }), Na = a(function (c) {
        return d(C, [b(0, b(6, 0)), 0, c])
      }), Oa = a(function (b, c, a, C) {
        if (0 > a || 0 > C || a > c.length - C) b = d(g, ["input"]); else throw"caml_ml_input";
        return b
      }), Ha = a(function (b, c, a, d) {
        if (0 >= d)return 0;
        throw"caml_ml_input";
      }), Pa = a(function (b, c, a, C) {
        return 0 > a || 0 > C || a > c.length - C ? d(g, ["really_input"]) : d(Ha, [b, c, a, C])
      }), Ia = a(function () {
        return d(a(function () {
          throw"caml_ml_input_scan_line";
        }), [0, 0])
      }), Qa = a(function () {
        try {
          return ma()
        } catch (ua) {
          return 0
        }
      }), Ra = a(function () {
      }), Sa = a(function (b) {
        return d(N, [0, b])
      }), Ta = a(function (b) {
        return d(N, [0, c(Z, [b])])
      }), Ua = a(function (b) {
        return d(N, [0, c(r, [b])])
      }), B = a(function (b) {
        c(N, [0, b])
      }), Va = a(function () {
      }), A = a(function () {
      }), H = a(function (b) {
        return d(N, [0, b])
      }), u = a(function (b) {
        return d(N, [0, c(Z, [b])])
      }), E = a(function (b) {
        return d(N, [0, c(r, [b])])
      }), G = a(function (b) {
        c(N, [0, b])
      }), J = a(function () {
      }), ya = a(function () {
        return d(Ia, [0])
      }), Wa = a(function () {
        var a =
          c(ya, [0]), a = parseInt(a, 10);
        if (isNaN(a))throw b("Failure", "int_of_string");
        return a
      }), Xa = a(function () {
        var a = c(ya, [0]), a = parseFloat(a);
        if (isNaN(a))throw b("Failure", "float_of_string");
        return a
      });
    b();
    var Ya = a(function (b, a) {
      return c(h, [b, a])
    }), Za = a(function (b) {
      var c = b.length, a = U(c);
      Y(b, 0, a, 0, c);
      return a
    }), za = b(w), D = a(function (b) {
      var C = za[0];
      return za[0] = a(function () {
        c(b, [0]);
        return d(C, [0])
      })
    }), Aa = a(function () {
      return d(za[0], [0])
    }), $a = a(function () {
      c(Aa, [0]);
      throw"caml_sys_exit";
    });
    Ga["Pervasives.do_at_exit"] =
      Aa;
    return b(g, p, l, k, m, x, n, z, f, e, K, L, F, v, R, h, q, M, ga, Z, r, sa, 0, 0, 0, Ra, Sa, Ta, Ua, B, Va, A, H, u, E, G, J, ya, Wa, Xa, va, t, oa, a(function () {
      }), w, a(function () {
      }), N, wa, a(function () {
      }), a(function () {
        throw"caml_ml_output_int";
      }), Ma, a(function () {
        throw"caml_ml_seek_out";
      }), a(function () {
        throw"caml_ml_pos_out";
      }), a(function () {
        return Ea()
      }), ta, ka, a(function () {
        return Ba()
      }), la, Na, C, a(function () {
        return Ca()
      }), Ia, Oa, Pa, a(function () {
        return Ca()
      }), a(function () {
        throw"caml_ml_input_int";
      }), a(function () {
        throw"caml_input_value";
      }),
      a(function () {
        throw"caml_ml_seek_in";
      }), a(function () {
        throw"caml_ml_pos_in";
      }), a(function () {
        return Ea()
      }), a(function () {
        return ma()
      }), Qa, a(function () {
        return Ba()
      }), b(a(function () {
        throw"caml_ml_seek_out_64";
      }), a(function () {
        throw"caml_ml_pos_out_64";
      }), a(function () {
        return Da()
      }), a(function () {
        throw"caml_ml_seek_in_64";
      }), a(function () {
        throw"caml_ml_pos_in_64";
      }), a(function () {
        return Da()
      })), Za, Ya, $a, D, ra, Ha, Aa)
  }(), pa = function () {
    return b(a(function (b) {
        return 0 > b || 255 < b ? d(g[0], ["Char.chr"]) : b
      }), a(function (b) {
        var c;
        a:{
          if (39 === b)return "\\'";
          if (92 === b)return "\\\\";
          if (14 <= b) c = !0; else switch (b) {
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
          if (31 < b && 127 > b)return c = U(1), c.b[0] = b, c;
          c = U(4);
          c.b[0] = 92;
          c.b[1] = 48 + (b / 100 >> 0);
          c.b[2] = 48 + (b / 10 >> 0) % 10;
          c.b[3] = 48 + b % 10;
          return c
        }
      }),
      a(function (b) {
        return 65 <= b && 90 >= b || 192 <= b && 214 >= b || 216 <= b && 222 >= b ? b + 32 : b
      }), a(function (b) {
        return 97 <= b && 122 >= b || 224 <= b && 246 >= b || 248 <= b && 254 >= b ? b - 32 : b
      }), a(function (b, c) {
        return b - c
      }))
  }(), t = function () {
    var p = a(function (b, c) {
        return c ? d(p, [b + 1, c[1]]) : b
      }), k = a(function (b) {
        return d(p, [0, b])
      }), l = a(function (c, a) {
        return c ? d(l, [c[1], b(c[0], a)]) : a
      }), m = a(function (b) {
        return d(l, [b, 0])
      }), y = a(function (b) {
        return b ? d(g[21], [b[0], c(y, [b[1]])]) : 0
      }), x = a(function (a, d) {
        var e;
        return d ? (e = c(a, [d[0]]), b(e, c(x, [a, d[1]]))) : 0
      }),
      f = a(function (b, a) {
        return a ? (c(b, [a[0]]), d(f, [b, a[1]])) : 0
      }), z = a(function (b, a, e) {
        return e ? d(z, [b, c(b, [a, e[0]]), e[1]]) : a
      }), n = a(function (b, a, e) {
        return a ? d(b, [a[0], c(n, [b, a[1], e])]) : e
      }), e = a(function (a, h, f) {
        var C;
        a:{
          if (!h) {
            if (f) {
              a = !0;
              break a
            }
            return 0
          }
          if (f)return C = c(a, [h[0], f[0]]), b(C, c(e, [a, h[1], f[1]]));
          a = !0
        }
        if (a)return d(g[0], ["List.map2"])
      }), K = a(function (b, a, e) {
        a:{
          if (!a) {
            if (e) {
              b = !0;
              break a
            }
            return 0
          }
          if (e)return c(b, [a[0], e[0]]), d(K, [b, a[1], e[1]]);
          b = !0
        }
        if (b)return d(g[0], ["List.iter2"])
      }), L = a(function (b,
                          a, e, f) {
        a:{
          if (!e) {
            if (f) {
              b = !0;
              break a
            }
            return a
          }
          if (f)return d(L, [b, c(b, [a, e[0], f[0]]), e[1], f[1]]);
          b = !0
        }
        if (b)return d(g[0], ["List.fold_left2"])
      }), F = a(function (b, a, e, f) {
        a:{
          if (!a) {
            if (e) {
              b = !0;
              break a
            }
            return f
          }
          if (e)return d(b, [a[0], e[0], c(F, [b, a[1], e[1], f])]);
          b = !0
        }
        if (b)return d(g[0], ["List.fold_right2"])
      }), v = a(function (b, a) {
        return a ? c(b, [a[0]]) && c(v, [b, a[1]]) : !0
      }), R = a(function (b, a) {
        return a ? c(b, [a[0]]) || c(R, [b, a[1]]) : !1
      }), h = a(function (b, a, e) {
        a:{
          if (!a) {
            if (e) {
              b = !0;
              break a
            }
            return !0
          }
          if (e)return c(b, [a[0], e[0]]) &&
            c(h, [b, a[1], e[1]]);
          b = !0
        }
        if (b)return d(g[0], ["List.for_all2"])
      }), q = a(function (b, a, e) {
        a:{
          if (!a) {
            if (e) {
              b = !0;
              break a
            }
            return !1
          }
          if (e)return c(b, [a[0], e[0]]) || c(q, [b, a[1], e[1]]);
          b = !0
        }
        if (b)return d(g[0], ["List.exists2"])
      }), M = a(function (b, a) {
        return a ? 0 === ea(a[0], b) || c(M, [b, a[1]]) : !1
      }), ga = a(function (b, a) {
        return a ? a[0] === b || c(ga, [b, a[1]]) : !1
      }), Z = a(function (c, a) {
        var e;
        if (a)return e = a[0], 0 === ea(e[0], c) ? e[1] : d(Z, [c, a[1]]);
        throw b("Not_found");
      }), ra = a(function (c, a) {
        var e;
        if (a)return e = a[0], e[0] === c ? e[1] : d(ra, [c,
            a[1]]);
        throw b("Not_found");
      }), r = a(function (b, a) {
        return a ? 0 === ea(a[0][0], b) || c(r, [b, a[1]]) : !1
      }), sa = a(function (b, a) {
        return a ? a[0][0] === b || c(sa, [b, a[1]]) : !1
      }), oa = a(function (a, d) {
        var e, f;
        return d ? (e = d[1], f = d[0], 0 === ea(f[0], a) ? e : b(f, c(oa, [a, e]))) : 0
      }), va = a(function (a, d) {
        var e, f;
        return d ? (e = d[1], f = d[0], f[0] === a ? e : b(f, c(va, [a, e]))) : 0
      }), t = a(function (a, e) {
        var f;
        if (e)return f = e[0], c(a, [f]) ? f : d(t, [a, e[1]]);
        throw b("Not_found");
      }), w = a(function (e) {
        var f = a(function (a, h) {
          var r, q;
          return h ? (r = h[1], q = h[0], c(e, [q]) ?
              d(f, [b(q, a), r]) : d(f, [a, r])) : d(m, [a])
        });
        return d(f, [0])
      }), N = a(function (a) {
        var d;
        return a ? (d = a[0], a = c(N, [a[1]]), b(b(d[0], a[0]), b(d[1], a[1]))) : b(0, 0)
      }), wa = a(function (a, e) {
        var f;
        a:{
          if (!a) {
            if (e) {
              f = !0;
              break a
            }
            return 0
          }
          if (e)return b(b(a[0], e[0]), c(wa, [a[1], e[1]]));
          f = !0
        }
        if (f)return d(g[0], ["List.combine"])
      }), B = a(function (a, d, e) {
        var f, h;
        return d ? e ? (f = e[0], h = d[0], 0 >= c(a, [h, f]) ? b(h, c(B, [a, d[1], e])) : b(f, c(B, [a, d, e[1]]))) : d : e
      }), ta = a(function (a, c) {
        if (0 === a)return c;
        if (c)return d(ta, [a - 1, c[1]]);
        throw b("Assert_failure",
          b("ocaml/stdlib/list.ml", 213, 11));
      }), ka = a(function (e, f) {
        var h = a(function (a, f, r) {
          var q, g;
          return a ? f ? (q = f[0], g = a[0], 0 >= c(e, [g, q]) ? d(h, [a[1], f, b(g, r)]) : d(h, [a, f[1], b(q, r)])) : d(l, [a, r]) : d(l, [f, r])
        }), r = a(function (a, f, h) {
          var q, g;
          return a ? f ? (q = f[0], g = a[0], 0 < c(e, [g, q]) ? d(r, [a[1], f, b(g, h)]) : d(r, [a, f[1], b(q, h)])) : d(l, [a, h]) : d(l, [f, h])
        }), q = a(function (a, f) {
          var h, q, n;
          a:{
            if (2 === a) {
              if (!f) {
                h = !0;
                break a
              }
              h = f[1];
              if (!h) {
                h = !0;
                break a
              }
              h = h[0];
              q = f[0];
              return 0 >= c(e, [q, h]) ? b(q, b(h, 0)) : b(h, b(q, 0))
            }
            if (3 === a && f && (q = f[1]) && (h =
                q[1]))return h = h[0], q = q[0], n = f[0], 0 >= c(e, [n, q]) ? 0 >= c(e, [q, h]) ? b(n, b(q, b(h, 0))) : 0 >= c(e, [n, h]) ? b(n, b(h, b(q, 0))) : b(h, b(n, b(q, 0))) : 0 >= c(e, [n, h]) ? b(q, b(n, b(h, 0))) : 0 >= c(e, [q, h]) ? b(q, b(h, b(n, 0))) : b(h, b(q, b(n, 0)));
            h = !0
          }
          if (h)return n = a >>> 1, h = a - n, q = c(ta, [n, f]), n = c(g, [n, f]), h = c(g, [h, q]), d(r, [n, h, 0])
        }), g = a(function (a, f) {
          var r, n, g;
          a:{
            if (2 === a) {
              if (!f) {
                r = !0;
                break a
              }
              r = f[1];
              if (!r) {
                r = !0;
                break a
              }
              r = r[0];
              n = f[0];
              return 0 < c(e, [n, r]) ? b(n, b(r, 0)) : b(r, b(n, 0))
            }
            if (3 === a && f && (n = f[1]) && (r = n[1]))return r = r[0], n = n[0], g = f[0], 0 < c(e,
              [g, n]) ? 0 < c(e, [n, r]) ? b(g, b(n, b(r, 0))) : 0 < c(e, [g, r]) ? b(g, b(r, b(n, 0))) : b(r, b(g, b(n, 0))) : 0 < c(e, [g, r]) ? b(n, b(g, b(r, 0))) : 0 < c(e, [n, r]) ? b(n, b(r, b(g, 0))) : b(r, b(n, b(g, 0)));
            r = !0
          }
          if (r)return g = a >>> 1, r = a - g, n = c(ta, [g, f]), g = c(q, [g, f]), r = c(q, [r, n]), d(h, [g, r, 0])
        }), n = c(k, [f]);
        return 2 > n ? f : d(q, [n, f])
      });
    return b(k, a(function (b) {
      return b ? b[0] : d(g[1], ["hd"])
    }), a(function (b) {
      return b ? b[1] : d(g[1], ["tl"])
    }), a(function (b, c) {
      var e;
      if (0 > c)return d(g[0], ["List.nth"]);
      e = a(function (b, a) {
        return b ? 0 === a ? b[0] : d(e, [b[1], a - 1]) : d(g[1],
            ["nth"])
      });
      return d(e, [b, c])
    }), m, g[21], l, y, y, f, x, a(function (e, f) {
      var h = a(function (a, f) {
        return f ? d(h, [b(c(e, [f[0]]), a), f[1]]) : a
      });
      return d(h, [0, f])
    }), z, n, K, e, a(function (e, f, h) {
      var r = a(function (a, f, h) {
        a:{
          if (!f) {
            if (h) {
              a = !0;
              break a
            }
            return a
          }
          if (h)return d(r, [b(c(e, [f[0], h[0]]), a), f[1], h[1]]);
          a = !0
        }
        if (a)return d(g[0], ["List.rev_map2"])
      });
      return d(r, [0, f, h])
    }), L, F, v, R, h, q, M, ga, t, w, w, a(function (e, f) {
      var h = a(function (a, f, r) {
        var q;
        return r ? (q = r[1], r = r[0], c(e, [r]) ? d(h, [b(r, a), f, q]) : d(h, [a, b(r, f), q])) : b(c(m, [a]),
            c(m, [f]))
      });
      return d(h, [0, 0, f])
    }), Z, ra, r, sa, oa, va, N, wa, ka, ka, ka, B)
  }(), W = function () {
    var p = a(function (b) {
      var a = b.length, c = U(a);
      Y(b, 0, c, 0, a);
      return c
    }), k = a(function (b, a) {
      var d, e, f = a.length;
      if (0 === f)return a;
      d = U(f);
      for (e = 0; e <= f - 1; e++) {
        var g = c(b, [S(a, e)]);
        d.b[e] = g
      }
      return d
    }), l = a(function (b, a) {
      var d;
      if (0 === a.length)return a;
      d = c(p, [a]);
      var e = c(b, [S(a, 0)]);
      d.b[0] = e;
      return d
    }), m = a(function (a, c, g, e) {
      if (g >= c)throw b("Not_found");
      return S(a, g) === e ? g : d(m, [a, c, g + 1, e])
    }), y = a(function (a, c, g) {
      if (0 > c)throw b("Not_found");
      return S(a, c) === g ? c : d(y, [a, c - 1, g])
    }), x = a(function (b, a, n) {
      var e = b.length;
      if (0 > a || a > e)return d(g[0], ["String.contains_from"]);
      try {
        return c(m, [b, e, a, n]), !0
      } catch (K) {
        if ("Not_found" === K[0])return !1;
        throw K;
      }
    });
    return b(a(function (b, a) {
      var c = U(b), d;
      for (d = 0; d < b; d++)c.b[0 + d] = a;
      return c
    }), p, a(function (b, a, c) {
      var e;
      if (0 > a || 0 > c || a > b.length - c)return d(g[0], ["String.sub"]);
      e = U(c);
      Y(b, a, e, 0, c);
      return e
    }), a(function (b, a, c, e) {
      if (0 > a || 0 > c || a > b.length - c) b = d(g[0], ["String.fill"]); else {
        var f;
        for (f = 0; f < c; f++)b.b[a + f] =
          e;
        b = void 0
      }
      return b
    }), a(function (b, a, c, e, l) {
      return 0 > l || 0 > a || a > b.length - l || 0 > e || e > c.length - l ? d(g[0], ["String.blit"]) : Y(b, a, c, e, l)
    }), a(function (d, g) {
      var f, e, l, p, k;
      return g ? (f = g[0], e = b(0), l = b(0), c(t[9], [a(function (b) {
          e[0]++;
          return l[0] += b.length
        }), g]), p = U(l[0] + d.length * (e[0] - 1)), Y(f, 0, p, 0, f.length), k = b(f.length), c(t[9], [a(function (b) {
          Y(d, 0, p, k[0], d.length);
          k[0] += d.length;
          Y(b, 0, p, k[0], b.length);
          return k[0] += b.length
        }), g[1]]), p) : ""
    }), a(function (b, a) {
      var d;
      for (d = 0; d <= a.length - 1; d++)c(b, [S(a, d)])
    }), a(function (b) {
      var a,
        c, d = 0;
      for (a = 0; a <= b.length - 1; a++)(function (a) {
        a:{
          var c = S(b, a), e = !1;
          b:{
            c:{
              if (!(14 <= c)) {
                if (!(11 <= c)) {
                  if (!(8 <= c)) {
                    a = !0;
                    break c
                  }
                  e = !0;
                  break b
                }
                if (!(13 <= c)) {
                  a = !0;
                  break c
                }
                e = !0;
                break b
              }
              if (34 === c) {
                e = !0;
                break b
              }
              if (92 === c) {
                e = !0;
                break b
              }
              a = !0
            }
            if (a) {
              a = 31 < c && 127 > c ? 1 : 4;
              break a
            }
          }
          a = e ? 2 : void 0
        }
        d += a
      })(a);
      if (d === b.length)return b;
      c = U(d);
      for (a = d = 0; a <= b.length - 1; a++)(function (a) {
        var e = S(b, a), f = !1;
        a:if (a = -34 + e, 0 > a || 58 < a)if (-20 <= a) f = !0; else switch (34 + a) {
          case 0:
            f = !0;
            break a;
          case 1:
            f = !0;
            break a;
          case 2:
            f = !0;
            break a;
          case 3:
            f = !0;
            break a;
          case 4:
            f = !0;
            break a;
          case 5:
            f = !0;
            break a;
          case 6:
            f = !0;
            break a;
          case 7:
            f = !0;
            break a;
          case 8:
            c.b[d] = 92;
            d = 1 + d;
            c.b[d] = 98;
            break;
          case 9:
            c.b[d] = 92;
            d = 1 + d;
            c.b[d] = 116;
            break;
          case 10:
            c.b[d] = 92;
            d = 1 + d;
            c.b[d] = 110;
            break;
          case 11:
            f = !0;
            break a;
          case 12:
            f = !0;
            break a;
          case 13:
            c.b[d] = 92, d = 1 + d, c.b[d] = 114
        } else 0 > -1 + a || 56 < -1 + a ? (c.b[d] = 92, d = 1 + d, c.b[d] = e) : f = !0;
        f && (31 < e && 127 > e ? c.b[d] = e : (c.b[d] = 92, d = 1 + d, c.b[d] = 48 + (e / 100 >> 0), d = 1 + d, c.b[d] = 48 + (e / 10 >> 0) % 10, d = 1 + d, c.b[d] = 48 + e % 10));
        d = 1 + d
      })(a);
      return c
    }), a(function (b, a) {
      return d(m,
        [b, b.length, 0, a])
    }), a(function (b, a) {
      return d(y, [b, b.length - 1, a])
    }), a(function (b, a, c) {
      var e = b.length;
      return 0 > a || a > e ? d(g[0], ["String.index_from"]) : d(m, [b, e, a, c])
    }), a(function (b, a, c) {
      return -1 > a || a >= b.length ? d(g[0], ["String.rindex_from"]) : d(y, [b, a, c])
    }), a(function (b, a) {
      return d(x, [b, 0, a])
    }), x, a(function (b, a, l) {
      if (0 > a || a >= b.length)return d(g[0], ["String.rcontains_from"]);
      try {
        return c(y, [b, a, l]), !0
      } catch (e) {
        if ("Not_found" === e[0])return !1;
        throw e;
      }
    }), a(function (b) {
      return d(k, [pa[3], b])
    }), a(function (b) {
      return d(k,
        [pa[2], b])
    }), a(function (b) {
      return d(l, [pa[3], b])
    }), a(function (b) {
      return d(l, [pa[2], b])
    }), a(function (b, a) {
      return ea(b, a)
    }))
  }(), ab = function () {
    var k = a(function (a, d) {
      var e, h;
      if (0 === a)return b();
      e = I(a, c(d, [0]));
      for (h = 1; h <= -1 + a; h++)e[h] = c(d, [h]);
      return e
    }), m = a(function (a, c, d) {
      var e, h = I(a, b());
      for (e = 0; e <= -1 + a; e++)h[e] = I(c, d);
      return h
    }), l = a(function (a) {
      var c, d, e = a.length;
      if (0 === e)return b();
      c = I(e, a[0]);
      for (d = 1; d <= -1 + e; d++)c[d] = a[d];
      return c
    }), t = a(function (a, c) {
      var d, e, h = a.length, f = c.length;
      if (0 === h && 0 ===
        f)return b();
      d = I(h + f, (0 < h ? a : c)[0]);
      for (e = 0; e <= h - 1; e++)d[e] = a[e];
      for (e = 0; e <= f - 1; e++)d[e + h] = c[e];
      return d
    }), y = a(function (b, e) {
      var h = a(function (b, a) {
        return a ? d(h, [b + a[0].length, a[1]]) : b
      }), f = I(c(h, [0, e]), b), g = a(function (b, a) {
        var c, e;
        if (a) {
          c = a[0];
          for (e = 0; e <= c.length - 1; e++)f[b + e] = c[e];
          return d(g, [b + c.length, a[1]])
        }
        return 0
      });
      c(g, [0, e]);
      return f
    }), x = a(function (c) {
      var e = a(function (a) {
        var h;
        return a ? (h = a[0], 0 < h.length ? d(y, [h[0], c]) : d(e, [a[1]])) : b()
      });
      return d(e, [c])
    }), f = a(function (a, c, e) {
      var h, f;
      if (0 > c || 0 >
        e || c > a.length - e)return d(g[0], ["Array.sub"]);
      if (0 === e)return b();
      h = I(e, a[c]);
      for (f = 1; f <= e - 1; f++)h[f] = a[c + f];
      return h
    }), z = a(function (b, a, c, e) {
      var h;
      if (0 > a || 0 > c || a > b.length - c)return d(g[0], ["Array.fill"]);
      for (h = a; h <= a + c - 1; h++)b[h] = e
    }), n = a(function (b, a, c, e, h) {
      var f;
      if (0 > h || 0 > a || a > b.length - h || 0 > e || e > c.length - h)return d(g[0], ["Array.blit"]);
      if (a < e)for (f = h - 1; 0 <= f; f--)c[e + f] = b[a + f];
      for (f = 0; f <= h - 1; f++)c[e + f] = b[a + f]
    }), e = a(function (b, a) {
      var d;
      for (d = 0; d <= a.length - 1; d++)c(b, [a[d]])
    }), K = a(function (a, d) {
      var e,
        h, f = d.length;
      if (0 === f)return b();
      e = I(f, c(a, [d[0]]));
      for (h = 1; h <= f - 1; h++)e[h] = c(a, [d[h]]);
      return e
    }), L = a(function (b, a) {
      var d;
      for (d = 0; d <= a.length - 1; d++)c(b, [d, a[d]])
    }), F = a(function (a, d) {
      var e, h, f = d.length;
      if (0 === f)return b();
      e = I(f, c(a, [0, d[0]]));
      for (h = 1; h <= f - 1; h++)e[h] = c(a, [h, d[h]]);
      return e
    }), v = a(function (c) {
      var e = a(function (a, h) {
        return 0 > a ? h : d(e, [a - 1, b(c[a], h)])
      });
      return d(e, [c.length - 1, 0])
    }), R = a(function (b, a) {
      return a ? d(R, [1 + b, a[1]]) : b
    }), h = a(function (e) {
      var h, f;
      return e ? (h = I(c(R, [0, e]), e[0]), f = a(function (b,
                                                             a) {
          return a ? (h[b] = a[0], d(f, [b + 1, a[1]])) : h
        }), d(f, [1, e[1]])) : b()
    }), q = a(function (b, a, d) {
      var e = a;
      for (a = 0; a <= d.length - 1; a++)e = c(b, [e, d[a]]);
      return e
    }), M = a(function (b, a, d) {
      var e = d;
      for (d = a.length - 1; 0 <= d; d--)e = c(b, [a[d], e]);
      return e
    }), ga = b("Array.Bottom"), Z = a(function (b, e) {
      var h, f, g, q = a(function (h, f, g, q, l, k, p) {
        var r = h + f, M = q + l, v = a(function (a, h, f, q, l) {
          if (0 >= c(b, [h, q]))return D(k, l, h), a += 1, a < r ? d(v, [a, w(e, a), f, q, l + 1]) : d(n, [g, f, k, l + 1, M - f]);
          D(k, l, q);
          f += 1;
          return f < M ? d(v, [a, h, f, w(g, f), l + 1]) : d(n, [e, a, k, l + 1, r - a])
        });
        return d(v, [h, w(e, h), q, w(g, q), p])
      }), l = a(function (a, d, h, f) {
        var g;
        for (g = 0; g <= f - 1; g++) {
          for (var q = g, l = w(e, a + q), q = h + q - 1; q >= h && 0 < c(b, [w(d, q), l]);)D(d, q + 1, w(d, q)), q = -1 + q;
          D(d, q + 1, l)
        }
      }), k = a(function (b, a, h, f) {
        var g;
        if (5 >= f)return d(l, [b, a, h, f]);
        g = f / 2 >> 0;
        f -= g;
        c(k, [b + g, a, h + g, f]);
        c(k, [b, e, b + f, g]);
        return d(q, [b + f, g, a, h + g, f, a, h])
      });
      f = e.length;
      if (5 >= f)return d(l, [0, e, 0, f]);
      h = f / 2 >> 0;
      f -= h;
      g = I(f, w(e, 0));
      c(k, [h, g, 0, f]);
      c(k, [0, e, f, h]);
      return d(q, [f, h, g, 0, f, e, 0])
    });
    return b(k, m, m, t, x, f, l, z, n, v, h, e, K, L, F, q, M, a(function (e,
                                                                            h) {
      var f, g, q = a(function (a, d) {
        var f = d + d + d + 1, g = f;
        if (f + 2 < a)return 0 > c(e, [w(h, f), w(h, f + 1)]) && (g = f + 1), 0 > c(e, [w(h, g), w(h, f + 2)]) && (g = f + 2), g;
        if (f + 1 < a && 0 > c(e, [w(h, f), w(h, f + 1)]))return f + 1;
        if (f < a)return f;
        throw b(ga, d);
      }), l = a(function (b, a, f) {
        var g = c(q, [b, a]);
        return 0 < c(e, [w(h, g), f]) ? (D(h, a, w(h, g)), d(l, [b, g, f])) : D(h, a, f)
      }), k = a(function (b, a, d) {
        try {
          return c(l, [b, a, d])
        } catch (la) {
          if (la[0] === ga)return D(h, la[1], d);
          throw la;
        }
      }), p = a(function (b, a) {
        var e = c(q, [b, a]);
        D(h, a, w(h, e));
        return d(p, [b, e])
      }), M = a(function (b, a) {
        try {
          return c(p,
            [b, a])
        } catch (C) {
          if (C[0] === ga)return C[1];
          throw C;
        }
      }), v = a(function (a, f) {
        var g = (a - 1) / 3 >> 0;
        if (a === g)throw b("Assert_failure", b("ocaml/stdlib/array.ml", 208, 4));
        return 0 > c(e, [w(h, g), f]) ? (D(h, a, w(h, g)), 0 < g ? d(v, [g, f]) : D(h, 0, f)) : D(h, a, f)
      });
      g = h.length;
      for (f = ((g + 1) / 3 >> 0) - 1; 0 <= f; f--)c(k, [g, f, w(h, f)]);
      for (f = g - 1; 2 <= f; f--)(function (b) {
        var a = w(h, b);
        D(h, b, w(h, 0));
        c(v, [c(M, [b, 0]), a])
      })(f);
      return 1 < g ? (g = w(h, 1), D(h, 1, w(h, 0)), D(h, 0, g)) : 0
    }), Z, Z)
  }(), bb = function () {
    var c;
    c = b("", b());
    var g;
    g = b("js", 32);
    var l = g[1], k = (1 << l -
      10) - 1, m = (l / 8 >> 0) * k - 1, x = b(!1), f = a(function () {
      throw"caml_install_signal_handler";
    }), z = b("Sys.Break");
    return b(c[1], c[0], x, g[0], l, m, k, f, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, z, a(function (c) {
      return c ? d(f, [-6, b(a(function () {
          throw b(z);
        }))]) : d(f, [-6, 0])
    }), "3.11.1")
  }(), cb = function () {
    return b(0, 1, -1, a(function (b) {
        return b + 1
      }), a(function (b) {
        return b - 1
      }), a(function (b) {
        return 0 <= b ? b : -b
      }), 2147483647, -2147483648, a(function (b) {
        return b ^ -1
      }), a(function (b) {
        return ia("%d", b)
      }),
      a(function (b, a) {
        return (b > a) - (b < a)
      }))
  }(), db = function () {
    return b("0", "1", "-1", a(function (b) {
      return b + "1"
    }), a(function (b) {
      return b - 1
    }), a(function (b) {
      return "0" <= b ? b : -b
    }), "9223372036854775807", "-9223372036854775808", a(function (b) {
      return b ^ -1
    }), a(function (b) {
      return ia("%d", b)
    }), a(function () {
      throw"caml_int64_compare";
    }))
  }(), eb = function () {
    var c = bb[4], d = 1 << c - 1;
    return b(0, 1, -1, a(function (b) {
      return b + 1
    }), a(function (b) {
      return b - 1
    }), a(function (b) {
      return 0 <= b ? b : -b
    }), c, d - 1, d, a(function (b) {
      return b ^ -1
    }), a(function (b) {
      return ia("%d",
        b)
    }), a(function (b, a) {
      return (b > a) - (b < a)
    }))
  }();
  (function () {
    var c = a(function (a) {
      return null === a ? 0 : b(a)
    }), d = a(function (b) {
      return b ? b[0] : null
    }), g = a(function (b) {
      return X(b, null)
    }), k = function () {
      var a = b();
      return b(a, 0)
    }();
    return b(c, d, g, k)
  })();
  var m = function () {
    var k = a(function (b) {
      return b[0][0]
    }), m = b(0, b(1, b(2, b(3, 0))));
    return b(k, m, a(function (b) {
        return d(g[15], ["{r=", c(g[15], [c(g[20], [b[0]]), c(g[15], [";", c(g[15], ["g=", c(g[15], [c(g[20], [b[1]]), c(g[15], [";", c(g[15], ["b=", c(g[15], [c(g[20], [b[2]]), "}"])])])])])])])])
      }),
      a(function (b) {
        switch (b) {
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
      }))
  }(), ha = function () {
    var k = function () {
      var k = a(function () {
        return b(I(55, 0), 0)
      }), m = a(function (b, a) {
        c(ab[8], [a[0], 0, b[0], 0, 55]);
        return b[1] = a[1]
      }), p = a(function (b, a) {
        var e = a.length;
        return e <= b ? d(g[15], [a, c(W[0], [b - e, 97])]) : d(W[2], [a, e - b, b])
      }), x = a(function (b, e) {
        var h, f, k = a(function (b, a) {
          return d(p, [16, c(g[15], [b, c(g[19], [a])])])
        }), l = a(function (b) {
          return fa(b, 0) + (fa(b, 1) << 8) + (fa(b,
              2) << 16) ^ fa(b, 3) << 22
        }), m = e.length;
        for (h = 0; 54 >= h; h++)D(b[0], h, h);
        f = "x";
        for (h = 0; h <= 54 + c(g[4], [55, m]); h++)(function (a) {
          var d = a % 55;
          f = c(k, [f, w(e, a % m)]);
          D(b[0], d, w(b[0], d) ^ c(l, [f]))
        })(h);
        return b[1] = 0
      }), f = a(function (b) {
        var a;
        b[1] = (b[1] + 1) % 55;
        a = w(b[0], (b[1] + 24) % 55) + w(b[0], b[1]) & 1073741823;
        D(b[0], b[1], a);
        return a
      }), z = a(function (b, a) {
        var e = c(f, [b]), g = e % a;
        return e - g > 1073741823 - a + 1 ? d(z, [b, a]) : g
      }), n = a(function (b, a) {
        var e = c(f, [b]), g = (c(f, [b]) & 1) << 30, e = e | g, g = e % a;
        return e - g > cb[6] - a + 1 ? d(n, [b, a]) : g
      }), e = a(function (b,
                          a) {
        return 0 >= a ? d(g[0], ["Random.int32"]) : d(n, [b, a])
      }), t = a(function (b, a) {
        var e = c(f, [b]), g = c(f, [b]) << 30, k = (c(f, [b]) & 7) << 60, e = e | g | k, g = e % a;
        return e - g > db[6] - a + "1" ? d(t, [b, a]) : g
      }), L = a(function (b, a) {
        return "0" >= a ? d(g[0], ["Random.int64"]) : d(t, [b, a])
      }), F = a(function (b) {
        var a = c(f, [b]), d = c(f, [b]);
        b = c(f, [b]);
        return ((a / 1073741824 + d) / 1073741824 + b) / 1073741824
      });
      return b(k, m, p, x, a(function (b) {
        var a = c(k, [0]);
        c(x, [a, b]);
        return a
      }), a(function (b) {
        var a = c(k, [0]);
        c(m, [a, b]);
        return a
      }), f, z, a(function (b, a) {
        return 1073741823 <
        a || 0 >= a ? d(g[0], ["Myrandom.int"]) : d(z, [b, a])
      }), n, e, t, L, 32 === eb[6] ? a(function (b, a) {
          return c(e, [b, a])
        }) : a(function (b, a) {
          return c(L, [b, a])
        }), F, a(function (b, a) {
        return c(F, [b]) * a
      }), a(function (b) {
        return 0 === (c(f, [b]) & 1)
      }))
    }(), m = b(ba(b(509760043, 399328820, 99941072, 112282318, 611886020, 516451399, 626288598, 337482183, 748548471, 808894867, 657927153, 386437385, 42355480, 977713532, 311548488, 13857891, 307938721, 93724463, 1041159001, 444711218, 1040610926, 233671814, 664494626, 1071756703, 188709089, 420289414, 969883075, 513442196,
      275039308, 918830973, 598627151, 134083417, 823987070, 619204222, 81893604, 871834315, 398384680, 475117924, 520153386, 324637501, 38588599, 435158812, 168033706, 585877294, 328347186, 293179100, 671391820, 846150845, 283985689, 502873302, 718642511, 938465128, 962756406, 107944131, 192910970)), 0);
    return b(k, m, a(function () {
      return d(k[6], [m])
    }), a(function (b) {
      return d(k[8], [m, b])
    }), a(function (b) {
      return d(k[10], [m, b])
    }), a(function (b) {
      return d(k[13], [m, b])
    }), a(function (b) {
      return d(k[12], [m, b])
    }), a(function (b) {
      return d(k[15], [m,
        b])
    }), a(function () {
      return d(k[16], [m])
    }), a(function (b) {
      return d(k[3], [m, b])
    }), a(function (a) {
      return d(k[3], [m, b(a)])
    }), a(function () {
      return d(k[5], [m])
    }), a(function (b) {
      return d(k[1], [m, b])
    }))
  }(), k = function () {
    var k = Math.atan2(0, -1), m = a(function (b, a) {
      var c = b / a, d = Math.floor(Math.abs(c));
      return 0 <= c ? b - d * a : b + d * a
    }), l = a(function (b, a, c) {
      b = b ? b[0] : -1;
      return b + ((a ? a[0] : 1) - b) * (.5 + Math.atan(2 * c) / k)
    }), B = a(function () {
      return d(ha[7], [1])
    }), y = a(function (b, a) {
      return b + c(ha[3], [a - b + 1])
    }), x = a(function (b, a) {
      return b + c(ha[7],
          [a - b])
    }), f = a(function (b, a, e) {
      return 0 >= e ? a : d(b, [c(f, [b, a, e - 1])])
    }), z = a(function (a, d, e) {
      var f;
      if (d > e)return 0;
      f = c(a, [d]);
      a = c(z, [a, d + 1, e]);
      return b(f, a)
    }), n = a(function (b, a) {
      return a ? X(b, a[0]) ? 0 : 1 + c(n, [b, a[1]]) : d(g[1], ["index_of: empty list"])
    }), e = a(function (a, d) {
      var f;
      return d ? (f = d[0], a === f ? d : b(f, c(e, [a, d[1]]))) : b(a, 0)
    }), K = a(function (a, c, d) {
      return b(a, c, d)
    }), L = a(function (a, c) {
      var d = a[0] - c[0], e = a[1] - c[1], f = a[2] - c[2], h = 1 / (d * d + e * e + f * f);
      return b(d * h, e * h, f * h)
    }), F = a(function (b) {
      return d(g[15], [c(g[20], [b[0]]),
        c(g[15], [", ", c(g[15], [c(g[20], [b[1]]), c(g[15], [", ", c(g[20], [b[2]])])])])])
    }), v = a(function (a, d, e) {
      var f, h;
      return e ? (f = e[1], e = e[0], h = e[0], X(a, h) ? b(b(h, b(d, e[1])), f) : b(e, c(v, [a, d, f]))) : b(b(a, b(d, 0)), 0)
    }), R = a(function (a) {
      var e;
      return a ? (e = a[1], a = a[0], c(t[23], [a, e]) ? d(R, [e]) : b(a, c(R, [e]))) : 0
    });
    return b(k, m, a(function (b, a, d, e, f) {
        b = b ? b[0] : -1;
        a = a ? a[0] : 1;
        e = e ? e[0] : 1;
        return e - (e - (d ? d[0] : -1)) * Math.abs(c(m, [Math.abs(f - b), 2 * (a - b)]) / (a - b) - 1)
      }), l, B, y, x, a(function (e, f) {
        var h = a(function (b) {
            return w(b, c(ha[3], [b.length]))
          }),
          k = ba(b("pre", "sup", "sub", "anti", "de", "non", "a", "e", "ae", "u", "i")), q = a(function () {
            var a = ba(b("a", "a", "ae", "e", "e", "ea", "ee", "y", "i", "o", "oo", "ou", "u")), e = ba(b("b", "bl", "bv", "c", "ck", "ch", "d", "d", "f", "fl", "g", "gl", "gg", "h", "j", "k", "l", "ll", "m", "n", "nt", "ng", "p", "pr", "pl", "qu", "r", "rr", "s", "sh", "st", "sp", "t", "tr", "t", "v", "x")), e = c(h, [e]), a = c(h, [a]);
            return d(g[15], [e, a])
          }), m = a(function (b) {
            var a;
            if (0 >= b)return "";
            a = c(q, [0]);
            b = c(m, [b - 1]);
            return d(g[15], [a, b])
          }), l = c(a(function () {
            var a = ba(b("", "", "", "re",
              "er", "es", "ub", "imp", "ius", "or", "ors", "ack", "ent", "ies", "ry", "elp", "ay", "ays")), d = ba(b("", "", "", "ish", "er", "est", "al", "ary", "ing", "ight", "ough", "ich", "ed", "ian", "ast", "ool")), a = c(h, [a]), d = c(h, [d]);
            return b(a, d)
          }), [0]), n = c(g[15], [.5 > c(B, [0]) ? "" : c(h, [k]), c(m, [e])]), k = c(g[15], [.5 > c(B, [0]) ? "" : c(h, [k]), c(m, [f])]);
        return d(g[15], [k, c(g[15], [l[1], c(g[15], [" ", c(g[15], [n, l[0]])])])])
      }), a(function (a) {
        var d;
        try {
          return d = c(W[8], [a, 32]), b(c(W[2], [a, 0, d]), c(W[2], [a, d + 1, a.length - d - 1]))
        } catch (M) {
          if ("Not_found" ===
            M[0])return b(c(g[15], [a, " "]), a);
          throw M;
        }
      }), f, a(function (e, k) {
        var h = a(function (a) {
          var e, f = a[0];
          return !f && (e = a[1]) ? b(e[0] + 1, e[1]) : (a = a[1]) ? b(a[0], c(h, [b(f - 1, a[1])])) : d(g[1], ["rnd_partition: an impossible thing happened"])
        });
        return d(f, [a(function (a) {
          var e = c(y, [0, k - 1]);
          return d(h, [b(e, a)])
        }), c(f, [a(function (a) {
          return b(0, a)
        }), 0, k]), e])
      }), z, a(function (b, e) {
        var f = a(function (a, c, e) {
          var h;
          return e ? (h = e[1], e = e[0], !h || c <= a ? e : d(f, [a * (1 - b), c - a, h])) : d(g[1], ["pick_exp: empty list"])
        }), h = c(t[0], [e]), h = c(x, [0,
          1 - Math.pow(1 - b, h)]);
        return d(f, [b, h, e])
      }), a(function (e, f) {
        var h = a(function (a, c, f) {
          return f ? c <= a ? b(f[0]) : d(h, [a * (1 - e), c - a, f[1]]) : 0
        }), g = c(x, [0, 1]);
        return d(h, [e, g, f])
      }), a(function (b) {
        return d(t[3], [b, c(y, [0, c(t[0], [b]) - 1])])
      }), a(function (e, f) {
        var h = a(function (a, d) {
          var e, f;
          if (d) {
            e = d[1];
            f = d[0];
            if (0 === a)return b(f, e);
            e = c(h, [a - 1, e]);
            return b(e[0], b(f, e[1]))
          }
          throw b("Match_failure", b("util.ml", 115, 18));
        }), g = a(function (a, e, f) {
          var k;
          if (0 === a)return f;
          k = c(y, [0, c(t[0], [e]) - 1]);
          e = c(h, [k, e]);
          return d(g, [a - 1, e[1],
            b(e[0], f)])
        });
        return d(g, [e, f, 0])
      }), n, a(function (e) {
        var f = a(function (a, d) {
          return d ? b(b(d[0], a), c(f, [a + 1, d[1]])) : 0
        });
        return d(f, [0, e])
      }), e, a(function (e, f) {
        var h = c(t[10], [a(function (a) {
          return b(a, b(0))
        }), f]);
        c(t[9], [a(function (b) {
          return c(t[29], [b, h])[0]++
        }), e]);
        return d(t[10], [a(function (a) {
          return b(a[0], a[1][0])
        }), h])
      }), K, a(function (a) {
        return b(c(l, [b(0), b(255), a[0]]) >> 0, c(l, [b(0), b(255), a[1]]) >> 0, c(l, [b(0), b(255), a[2]]) >> 0)
      }), a(function (a, c, d) {
        var e, f;
        c = .5 >= d ? d * (1 + c) : d + c - d * c;
        if (0 >= c)return b(0, 0,
          0);
        d = d + d - c;
        e = Math.abs(6 * a);
        a = (e >> 0) % 6;
        f = (c - d) / c * c * (e - Math.floor(e));
        e = d + f;
        f = c - f;
        if (0 > a || 4 < a)return b(c, d, f);
        switch (a) {
          case 0:
            return b(c, e, d);
          case 1:
            return b(f, c, d);
          case 2:
            return b(d, c, e);
          case 3:
            return b(d, f, c);
          case 4:
            return b(e, d, c);
          default:
            return null
        }
      }), a(function () {
        var b = c(x, [-1, 1]), a = c(x, [-1, 1]), e = c(x, [-1, 1]);
        return d(K, [b, a, e])
      }), L, a(function (e, f) {
        return d(t[12], [a(function (a, d) {
          var f, g = a[2], h = a[1], k = a[0];
          if (X(d, e))return b(k, h, g);
          f = c(L, [e, d]);
          return b(k + f[0], h + f[1], g + f[2])
        }), b(0, 0, 0), f])
      }),
      F, a(function (b) {
        return d(W[5], ["\n", c(t[10], [F, b])])
      }), a(function (a, c, d) {
        var e = 1 - a;
        return b(a * c[0] + e * d[0], a * c[1] + e * d[1], a * c[2] + e * d[2])
      }), a(function (a, c, d, e, f) {
        var g = 1 - a - c;
        return b(a * d[0] + c * e[0] + g * f[0], a * d[1] + c * e[1] + g * f[1], a * d[2] + c * e[2] + g * f[2])
      }), a(function (a, c, d, e, f, g, k) {
        var h = 1 - a - c;
        return b(a * e[0] + c * f[0] + d * g[0] + h * k[0], a * e[1] + c * f[1] + d * g[1] + h * k[1], a * e[2] + c * f[2] + d * g[2] + h * k[2])
      }), a(function (b, e) {
        var f, h = a(function (a, e, f) {
          var g, k;
          return f ? (g = f[1], f = f[0], k = c(b, [f]), -1 > da(e, k, 0) - 1 ? d(h, [a, e, g]) : d(h, [f, k,
                g])) : a
        });
        return e ? (f = e[0], d(h, [f, c(b, [f]), e[1]])) : d(g[1], ["minimize: empty list"])
      }), a(function (b, a) {
        return d(t[29], [b, a])
      }), v, R, a(function (b) {
        return d(t[37], [a(function (b, a) {
          return ea(b, a)
        }), c(R, [b])])
      }), a(function (a) {
        var c, e, f;
        if (a.toString() != "".toString()) {
          c = a.length;
          e = I(c, 0);
          for (f = 0; f <= c - 1; f++)D(e, f, f * f + fa(a, f));
          return d(ha[9], [e])
        }
        return d(ha[9], [b(0)])
      }))
  }(), B = function () {
    var p = a(function (c, d) {
      return b(c, 0, 1, a(function () {
        return O(d[0])
      }))
    }), w = a(function (c, d) {
      return b("pt", 0, 2, a(function () {
        return Q(c[0],
          d[0])
      }))
    }), l = function () {
      var l = b("palette_f", b(1, 0), 3, a(function (d) {
        var e, f, g = !1;
        if (e = c(k[15], [2, d[2]]))if (f = e[1])if (f[1]) g = !0; else return a(function (d) {
          var g = !1;
          if (d)if (d[1]) g = !0; else return a(function () {
            var a = c(m[0], [d[0]]);
            switch (a.t) {
              case 1:
                return T(c(k[28], [c(k[2], [0, 0, b(-1), b(2), a[0]]), e[0], f[0]]));
              default:
                throw b("Match_failure", b("op.ml", 34, 24));
            }
          }); else g = !0;
          if (g)throw b("Match_failure", b("op.ml", 33, 4));
        }); else g = !0; else g = !0;
        if (g)throw b("Match_failure", b("op.ml", 32, 6));
      })), p = b("palette_p",
        b(2, 0), 3, a(function (d) {
          var e, f, g = !1;
          if (e = c(k[15], [2, d[2]]))if (f = e[1])if (f[1]) g = !0; else return a(function (d) {
            var g = !1;
            if (d)if (d[1]) g = !0; else return a(function () {
              var a, g;
              g = c(m[0], [d[0]]);
              switch (g.t) {
                case 2:
                  return a = Math.abs(g[0]), g = Math.abs(g[1]), T(c(k[28], [1 / (a + g) * a, e[0], f[0]]));
                default:
                  throw b("Match_failure", b("op.ml", 46, 24));
              }
            }); else g = !0;
            if (g)throw b("Match_failure", b("op.ml", 45, 4));
          }); else g = !0; else g = !0;
          if (g)throw b("Match_failure", b("op.ml", 44, 6));
        })), f = b("palette_pf", b(2, b(1, 0)), 3, a(function (d) {
        var e,
          f, g, h = !1;
        if (e = c(k[15], [3, d[2]]))if (f = e[1])if (g = f[1])if (g[1]) h = !0; else return a(function (d) {
          var h, E = !1;
          if (d)if (h = d[1])if (h[1]) E = !0; else return a(function () {
            var a, E, u;
            u = c(m[0], [d[0]]);
            switch (u.t) {
              case 2:
                switch (a = c(m[0], [h[0]]), a.t) {
                  case 1:
                    return E = Math.abs(u[0]), u = Math.abs(u[1]), a = Math.abs(a[0]), a = 1 / (E + u + a), E = c(k[29], [E * a, u * a, e[0], f[0], g[0]]), T(E);
                  default:
                    throw b("Match_failure", b("op.ml", 62, 24));
                }
              default:
                throw b("Match_failure", b("op.ml", 61, 24));
            }
          }); else E = !0; else E = !0;
          if (E)throw b("Match_failure",
            b("op.ml", 60, 4));
        }); else h = !0; else h = !0; else h = !0;
        if (h)throw b("Match_failure", b("op.ml", 59, 6));
      })), z = b("palette_pp", b(2, b(2, 0)), 3, a(function (d) {
        var e, f, g, h, G = !1;
        if (e = c(k[15], [4, d[2]]))if (f = e[1])if (g = f[1])if (h = g[1])if (h[1]) G = !0; else return a(function (d) {
          var E, u = !1;
          if (d)if (E = d[1])if (E[1]) u = !0; else return a(function () {
            var a, u, A, G;
            A = c(m[0], [d[0]]);
            switch (A.t) {
              case 2:
                switch (a = c(m[0], [E[0]]), a.t) {
                  case 2:
                    return u = Math.abs(A[0]), A = Math.abs(A[1]), G = Math.abs(a[0]), a = Math.abs(a[1]), a = 1 / (u + A + G + a), T(c(k[30],
                      [u * a, A * a, G * a, e[0], f[0], g[0], h[0]]));
                  default:
                    throw b("Match_failure", b("op.ml", 80, 24));
                }
              default:
                throw b("Match_failure", b("op.ml", 79, 24));
            }
          }); else u = !0; else u = !0;
          if (u)throw b("Match_failure", b("op.ml", 78, 4));
        }); else G = !0; else G = !0; else G = !0; else G = !0;
        if (G)throw b("Match_failure", b("op.ml", 77, 6));
      })), n = b("saturate", b(3, b(1, 0)), 3, a(function (d, e) {
        var f, h = !1;
        if (e)if (f = e[1])if (f[1]) h = !0; else return a(function () {
          var a, d, h, u, A, H, l;
          a = c(m[0], [e[0]]);
          switch (a.t) {
            case 3:
              switch (a = a[0], d = a[2], h = a[1], u = a[0], A = c(m[0],
                [f[0]]), A.t) {
                case 1:
                  return A = c(g[4], [1, c(k[2], [0, 0, b(0), b(1.1), A[0]])]), H = c(g[4], [u, c(g[4], [h, d])]) + .01, l = c(g[3], [u, c(g[3], [h, d])]) - .01, H = 1 / (H - l), T(c(k[28], [A, a, c(k[20], [2 * (u - l) * H - 1, 2 * (h - l) * H - 1, 2 * (d - l) * H - 1])]));
                default:
                  throw b("Match_failure", b("op.ml", 96, 20));
              }
            default:
              throw b("Match_failure", b("op.ml", 95, 20));
          }
        }); else h = !0; else h = !0;
        if (h)throw b("Match_failure", b("op.ml", 94, 20));
      })), e = b("scalar", b(2, 0), 1, a(function (d) {
        var e = c(k[14], [d[0]]);
        d = c(k[14], [d[1]]);
        var f = Math.cos(2 * k[0] * d), g = Math.sin(2 *
          k[0] * d);
        return a(function (d) {
          var h = !1;
          if (d)if (d[1]) h = !0; else return a(function () {
            var a = c(m[0], [d[0]]);
            switch (a.t) {
              case 2:
                return O((a[0] - e[0]) * f + (a[1] - e[1]) * g);
              default:
                throw b("Match_failure", b("op.ml", 118, 24));
            }
          }); else h = !0;
          if (h)throw b("Match_failure", b("op.ml", 117, 4));
        })
      })), K = b("pmult", b(2, b(2, 0)), 2, a(function (d) {
        d = c(k[14], [d[0]]);
        var e = d[1], f = d[0];
        return a(function (d) {
          var g, h = !1;
          if (d)if (g = d[1])if (g[1]) h = !0; else return a(function () {
            var a, h, k, u;
            k = c(m[0], [d[0]]);
            switch (k.t) {
              case 2:
                switch (a = c(m[0],
                  [g[0]]), a.t) {
                  case 2:
                    return h = k[0] - f, k = k[1] - e, u = a[0] - f, a = a[1] - e, Q(f + h * u - k * a, e + h * a + k * u);
                  default:
                    throw b("Match_failure", b("op.ml", 130, 24));
                }
              default:
                throw b("Match_failure", b("op.ml", 129, 24));
            }
          }); else h = !0; else h = !0;
          if (h)throw b("Match_failure", b("op.ml", 128, 5));
        })
      })), L = b("protfold", b(2, b(2, 0)), 2, a(function (d) {
        var e = k[0] / Math.ceil(c(k[2], [0, 0, b(1.5), b(12), c(k[14], [d[1]])]));
        return a(function (d) {
          var f, g = !1;
          if (d)if (f = d[1])if (f[1]) g = !0; else return a(function () {
            var a, g, h, u, A;
            A = c(m[0], [d[0]]);
            switch (A.t) {
              case 2:
                switch (a =
                  c(m[0], [f[0]]), a.t) {
                  case 2:
                    return g = a[1], a = a[0], h = A[0] - a, u = A[1] - g, A = c(k[2], [b(-e), b(e), b(-k[0]), b(k[0]), Math.atan2(u, h)]), h = Math.sqrt(h * h + u * u), Q(a + h * Math.cos(A), g + h * Math.sin(A));
                  default:
                    throw b("Match_failure", b("op.ml", 146, 24));
                }
              default:
                throw b("Match_failure", b("op.ml", 145, 24));
            }
          }); else g = !0; else g = !0;
          if (g)throw b("Match_failure", b("op.ml", 144, 4));
        })
      })), F = b("fold", b(2, b(2, b(1, 0))), 2, a(function (d) {
        var e = d[1], f = c(g[4], [0, c(k[2], [0, 0, b(-1.1), b(.3), c(k[14], [e])])]), h = c(g[4], [0, c(k[2], [0, 0, b(-1.1), b(.3),
          c(k[14], [e])])]);
        d = c(k[14], [d[0]]);
        var E = (1 - f) * d[0], l = (1 - f) * d[1], n = 2 * (1 - h) * k[0] * c(k[14], [e]);
        return a(function (d) {
          var e, u, A = !1;
          if (d)if (e = d[1])if (u = e[1])if (u[1]) A = !0; else return a(function () {
            var a, A, H, G, J, p;
            J = c(m[0], [d[0]]);
            switch (J.t) {
              case 2:
                switch (a = c(m[0], [e[0]]), a.t) {
                  case 2:
                    switch (A = a[1], a = a[0], H = c(m[0], [u[0]]), H.t) {
                      case 1:
                        return G = E + f * J[0], J = l + f * J[1], p = n + 2 * h * k[0] * H[0], H = Math.cos(p), p = Math.sin(p), G = 2 * c(g[4], [0, (a - G) * H + (A - J) * p]), Q(a - G * H, A - G * p);
                      default:
                        throw b("Match_failure", b("op.ml", 169, 24));
                    }
                  default:
                    throw b("Match_failure", b("op.ml", 168, 24));
                }
              default:
                throw b("Match_failure", b("op.ml", 167, 24));
            }
          }); else A = !0; else A = !0; else A = !0;
          if (A)throw b("Match_failure", b("op.ml", 166, 4));
        })
      })), v = b("dist", b(2, b(2, 0)), 1, a(function (d) {
        var e = c(g[4], [0, c(k[2], [0, 0, b(-.2), b(.5), c(k[14], [d[1]])])]);
        d = c(k[14], [d[0]]);
        var f = (1 - e) * d[0], h = (1 - e) * d[1];
        return a(function (d) {
          var g, k = !1;
          if (d)if (g = d[1])if (g[1]) k = !0; else return a(function () {
            var a, k, u = c(m[0], [d[0]]);
            switch (u.t) {
              case 2:
                switch (a = c(m[0], [g[0]]), a.t) {
                  case 2:
                    return k =
                      u[0] - f - e * a[0], a = u[1] - h - e * a[1], O(Math.sqrt(2 * (k * k + a * a)) - 1);
                  default:
                    throw b("Match_failure", b("op.ml", 192, 24));
                }
              default:
                throw b("Match_failure", b("op.ml", 191, 24));
            }
          }); else k = !0; else k = !0;
          if (k)throw b("Match_failure", b("op.ml", 190, 4));
        })
      })), w = b("rotate", b(2, b(2, b(1, 0))), 2, a(function (d) {
        var e = d[1], f = c(g[4], [0, c(k[2], [0, 0, b(-.5), b(.3), c(k[14], [e])])]), h = c(g[4], [0, c(k[2], [0, 0, b(-.5), b(.3), c(k[14], [e])])]);
        d = c(k[14], [d[0]]);
        var l = (1 - f) * d[0], G = (1 - f) * d[1], n = 2 * (1 - h) * k[0] * c(k[14], [e]);
        return a(function (d) {
          var e,
            g, u = !1;
          if (d)if (e = d[1])if (g = e[1])if (g[1]) u = !0; else return a(function () {
            var a, u, A, E, H, J;
            E = c(m[0], [d[0]]);
            switch (E.t) {
              case 2:
                switch (a = c(m[0], [e[0]]), a.t) {
                  case 2:
                    switch (u = c(m[0], [g[0]]), u.t) {
                      case 1:
                        return A = l + f * E[0], E = G + f * E[1], H = a[0] - A, a = a[1] - E, J = n + 2 * h * k[0] * u[0], u = Math.cos(J), J = Math.sin(J), Q(A + u * H + J * a, E - J * H + u * a);
                      default:
                        throw b("Match_failure", b("op.ml", 214, 24));
                    }
                  default:
                    throw b("Match_failure", b("op.ml", 213, 24));
                }
              default:
                throw b("Match_failure", b("op.ml", 212, 24));
            }
          }); else u = !0; else u = !0; else u = !0;
          if (u)throw b("Match_failure",
            b("op.ml", 211, 4));
        })
      })), h = b("discretize", b(2, b(2, 0)), 2, a(function (d) {
        var e = c(k[14], [d[0]]), f = c(g[4], [0, c(k[2], [0, 0, b(-.1), b(.8), c(k[14], [d[1]])])]), h = .1 * (1 - f) * e[0], E = .1 * (1 - f) * e[1];
        return a(function (d) {
          var e, g = !1;
          if (d)if (e = d[1])if (e[1]) g = !0; else return a(function () {
            var a, g, k = c(m[0], [d[0]]);
            switch (k.t) {
              case 2:
                switch (a = c(m[0], [e[0]]), a.t) {
                  case 2:
                    return g = a[0] * f + h, a = a[1] * f + E, Q(g * Math.floor(k[0] / g), a * Math.floor(k[1] / a));
                  default:
                    throw b("Match_failure", b("op.ml", 236, 24));
                }
              default:
                throw b("Match_failure",
                  b("op.ml", 235, 24));
            }
          }); else g = !0; else g = !0;
          if (g)throw b("Match_failure", b("op.ml", 234, 4));
        })
      })), q = b("pplus", b(2, b(2, 0)), 2, a(function (d, e) {
        var f, g = !1;
        if (e)if (f = e[1])if (f[1]) g = !0; else return a(function () {
          var a, d = c(m[0], [e[0]]);
          switch (d.t) {
            case 2:
              switch (a = c(m[0], [f[0]]), a.t) {
                case 2:
                  return Q(.5 * (d[0] + a[0]), .5 * (d[1] + a[1]));
                default:
                  throw b("Match_failure", b("op.ml", 250, 20));
              }
            default:
              throw b("Match_failure", b("op.ml", 249, 20));
          }
        }); else g = !0; else g = !0;
        if (g)throw b("Match_failure", b("op.ml", 248, 20));
      })), B =
        b("fplus", b(1, b(1, 0)), 1, a(function (d, e) {
          var f, g = !1;
          if (e)if (f = e[1])if (f[1]) g = !0; else return a(function () {
            var a, d = c(m[0], [e[0]]);
            switch (d.t) {
              case 1:
                switch (a = c(m[0], [f[0]]), a.t) {
                  case 1:
                    return O(.5 * (d[0] + a[0]));
                  default:
                    throw b("Match_failure", b("op.ml", 260, 20));
                }
              default:
                throw b("Match_failure", b("op.ml", 259, 20));
            }
          }); else g = !0; else g = !0;
          if (g)throw b("Match_failure", b("op.ml", 258, 20));
        })), D = b("ftimes", b(1, b(1, 0)), 1, a(function (d) {
        var e = c(k[14], [d[0]]);
        return a(function (d) {
          var f, g = !1;
          if (d)if (f = d[1])if (f[1]) g = !0; else return a(function () {
            var a, g = c(m[0], [d[0]]);
            switch (g.t) {
              case 1:
                switch (a = c(m[0], [f[0]]), a.t) {
                  case 1:
                    return O((g[0] + e[0]) * (a[0] + e[1]));
                  default:
                    throw b("Match_failure", b("op.ml", 272, 24));
                }
              default:
                throw b("Match_failure", b("op.ml", 271, 24));
            }
          }); else g = !0; else g = !0;
          if (g)throw b("Match_failure", b("op.ml", 270, 18));
        })
      })), ja = b("fmix", b(1, b(1, b(1, 0))), 1, a(function (d, e) {
        var f, g, h = !1;
        if (e)if (f = e[1])if (g = f[1])if (g[1]) h = !0; else return a(function () {
          var a, d, h;
          h = c(m[0], [e[0]]);
          switch (h.t) {
            case 1:
              switch (a = c(m[0],
                [f[0]]), a.t) {
                case 1:
                  switch (d = c(m[0], [g[0]]), d.t) {
                    case 1:
                      return h = Math.abs(c(k[3], [b(0), b(1), h[0]])), O(h * a[0] + (1 - h) * d[0]);
                    default:
                      throw b("Match_failure", b("op.ml", 283, 20));
                  }
                default:
                  throw b("Match_failure", b("op.ml", 282, 20));
              }
            default:
              throw b("Match_failure", b("op.ml", 281, 20));
          }
        }); else h = !0; else h = !0; else h = !0;
        if (h)throw b("Match_failure", b("op.ml", 280, 20));
      })), I = b("pmix", b(2, b(2, b(1, 0))), 2, a(function (d, e) {
        var f, g, h = !1;
        if (e)if (f = e[1])if (g = f[1])if (g[1]) h = !0; else return a(function () {
          var a, d, h = c(m[0],
            [e[0]]);
          switch (h.t) {
            case 2:
              switch (a = c(m[0], [f[0]]), a.t) {
                case 2:
                  switch (d = c(m[0], [g[0]]), d.t) {
                    case 1:
                      return d = Math.abs(c(k[2], [0, 0, 0, 0, d[0]])), Q(d * h[0] + (1 - d) * a[0], d * h[1] + (1 - d) * a[1]);
                    default:
                      throw b("Match_failure", b("op.ml", 295, 20));
                  }
                default:
                  throw b("Match_failure", b("op.ml", 294, 20));
              }
            default:
              throw b("Match_failure", b("op.ml", 293, 20));
          }
        }); else h = !0; else h = !0; else h = !0;
        if (h)throw b("Match_failure", b("op.ml", 292, 20));
      })), r = b("fatan", b(1, 0), 1, a(function (d) {
        var e, f, g = !1;
        if (d = c(k[15], [2, d[1]]))if (e = d[1])if (e[1]) g = !0; else return f = c(k[2], [0, 0, b(.1), b(10), d[0]]), a(function (d) {
          var g = !1;
          if (d)if (d[1]) g = !0; else return a(function () {
            var a = c(m[0], [d[0]]);
            switch (a.t) {
              case 1:
                return O(2 * Math.atan((a[0] - e[0]) / f) / k[0]);
              default:
                throw b("Match_failure", b("op.ml", 308, 24));
            }
          }); else g = !0;
          if (g)throw b("Match_failure", b("op.ml", 307, 18));
        }); else g = !0; else g = !0;
        if (g)throw b("Match_failure", b("op.ml", 305, 6));
      })), P = b("fsin", b(1, 0), 1, a(function (d) {
        var e = 10 * k[0] * c(k[14], [d[1]]);
        return a(function (d) {
          var f = !1;
          if (d)if (d[1]) f = !0; else return a(function () {
            var a =
              c(m[0], [d[0]]);
            switch (a.t) {
              case 1:
                return O(Math.sin(e * a[0]));
              default:
                throw b("Match_failure", b("op.ml", 319, 24));
            }
          }); else f = !0;
          if (f)throw b("Match_failure", b("op.ml", 318, 18));
        })
      })), Ka = b("sqrt", b(1, 0), 1, a(function (d, e) {
        var f = !1;
        if (e)if (e[1]) f = !0; else return a(function () {
          var a = c(m[0], [e[0]]);
          switch (a.t) {
            case 1:
              return O(2 * Math.sqrt(Math.abs(a[0])) - 1);
            default:
              throw b("Match_failure", b("op.ml", 328, 20));
          }
        }); else f = !0;
        if (f)throw b("Match_failure", b("op.ml", 327, 20));
      })), S = b("abs", b(1, 0), 1, a(function (d, e) {
        var f =
          !1;
        if (e)if (e[1]) f = !0; else return a(function () {
          var a = c(m[0], [e[0]]);
          switch (a.t) {
            case 1:
              return O(2 * Math.abs(a[0]) - 1);
            default:
              throw b("Match_failure", b("op.ml", 339, 20));
          }
        }); else f = !0;
        if (f)throw b("Match_failure", b("op.ml", 338, 20));
      })), U = b("max", b(1, b(1, 0)), 1, a(function (d, e) {
        var f, h = !1;
        if (e)if (f = e[1])if (f[1]) h = !0; else return a(function () {
          var a, d = c(m[0], [e[0]]);
          switch (d.t) {
            case 1:
              switch (a = c(m[0], [f[0]]), a.t) {
                case 1:
                  return O(c(g[4], [d[0], a[0]]));
                default:
                  throw b("Match_failure", b("op.ml", 350, 20));
              }
            default:
              throw b("Match_failure",
                b("op.ml", 349, 20));
          }
        }); else h = !0; else h = !0;
        if (h)throw b("Match_failure", b("op.ml", 348, 20));
      })), V = b("cmix", b(1, b(3, b(3, 0))), 3, a(function (d, e) {
        var f, g, h = !1;
        if (e)if (f = e[1])if (g = f[1])if (g[1]) h = !0; else return a(function () {
          var a, d, h = c(m[0], [e[0]]);
          switch (h.t) {
            case 1:
              switch (a = c(m[0], [f[0]]), a.t) {
                case 3:
                  switch (d = c(m[0], [g[0]]), d.t) {
                    case 3:
                      return T(c(k[28], [h[0], a[0], d[0]]));
                    default:
                      throw b("Match_failure", b("op.ml", 361, 20));
                  }
                default:
                  throw b("Match_failure", b("op.ml", 360, 20));
              }
            default:
              throw b("Match_failure",
                b("op.ml", 359, 20));
          }
        }); else h = !0; else h = !0; else h = !0;
        if (h)throw b("Match_failure", b("op.ml", 358, 20));
      })), N = b("negative", b(1, 0), 0, a(function (d) {
        var e, f, h;
        e = !1;
        if (d = c(k[15], [2, d[1]]))if (e = d[1])if (e[1]) e = !0; else return e = e[0], f = c(g[3], [d[0], e]), h = c(g[4], [f, e]), a(function (d) {
          var e = !1;
          if (d)if (d[1]) e = !0; else return a(function () {
            var a;
            a = c(m[0], [d[0]]);
            switch (a.t) {
              case 1:
                return a = a[0], b(f < a && a < h);
              default:
                throw b("Match_failure", b("op.ml", 374, 24));
            }
          }); else e = !0;
          if (e)throw b("Match_failure", b("op.ml", 373, 18));
        }); else e = !0; else e = !0;
        if (e)throw b("Match_failure", b("op.ml", 370, 6));
      })), W = b("negative", b(1, 0), 0, a(function (d, e) {
        var f = !1;
        if (e)if (e[1]) f = !0; else return a(function () {
          var a = c(m[0], [e[0]]);
          switch (a.t) {
            case 1:
              return b(0 > a[0]);
            default:
              throw b("Match_failure", b("op.ml", 383, 20));
          }
        }); else f = !0;
        if (f)throw b("Match_failure", b("op.ml", 382, 20));
      })), X = b("fless", b(1, b(1, 0)), 0, a(function (d, e) {
        var f, g = !1;
        if (e)if (f = e[1])if (f[1]) g = !0; else return a(function () {
          var a, d = c(m[0], [e[0]]);
          switch (d.t) {
            case 1:
              switch (a = c(m[0],
                [f[0]]), a.t) {
                case 1:
                  return b(d[0] < a[0]);
                default:
                  throw b("Match_failure", b("op.ml", 394, 20));
              }
            default:
              throw b("Match_failure", b("op.ml", 393, 20));
          }
        }); else g = !0; else g = !0;
        if (g)throw b("Match_failure", b("op.ml", 392, 20));
      })), Y = b("even", b(1, b(1, 0)), 0, a(function (d) {
        d = d[1];
        var e = c(g[4], [0, c(k[2], [0, 0, b(-.5), b(2), c(k[14], [d])])]), f = c(k[2], [0, 0, b(2), b(20), c(k[14], [d])]);
        return a(function (d) {
          var g, h = !1;
          if (d)if (g = d[1])if (g[1]) h = !0; else return a(function () {
            var a, h = c(m[0], [d[0]]);
            switch (h.t) {
              case 1:
                switch (a = c(m[0],
                  [g[0]]), a.t) {
                  case 1:
                    return a = a[0], b(0 === (e * a * a * a + f * h[0] >> 0) % 2);
                  default:
                    throw b("Match_failure", b("op.ml", 407, 24));
                }
              default:
                throw b("Match_failure", b("op.ml", 406, 24));
            }
          }); else h = !0; else h = !0;
          if (h)throw b("Match_failure", b("op.ml", 405, 18));
        })
      })), ka = b("close", b(2, b(2, 0)), 0, a(function (d) {
        d = c(k[14], [d[1]]);
        var e = d * d;
        return a(function (d) {
          var f, g = !1;
          if (d)if (f = d[1])if (f[1]) g = !0; else return a(function () {
            var a, g, h = c(m[0], [d[0]]);
            switch (h.t) {
              case 2:
                switch (a = c(m[0], [f[0]]), a.t) {
                  case 2:
                    return g = h[0] - a[0], a = h[1] -
                      a[1], b(g * g + a * a < e);
                  default:
                    throw b("Match_failure", b("op.ml", 420, 24));
                }
              default:
                throw b("Match_failure", b("op.ml", 419, 24));
            }
          }); else g = !0; else g = !0;
          if (g)throw b("Match_failure", b("op.ml", 418, 4));
        })
      })), C = b("pfoci", b(2, b(2, b(2, 0))), 2, a(function (d) {
        var e = d[1], f = d[0];
        d = c(g[3], [c(t[0], [f]), c(t[0], [e])]);
        var h = c(k[5], [2, d]), l = c(g[4], [0, c(k[2], [0, 0, b(-.05), b(.5), c(k[14], [e])])]), n = function () {
          var b = c(k[15], [h, f]), d = c(k[15], [h, e]);
          return c(t[36], [b, c(t[10], [a(function (a) {
            return .1 * a * a
          }), d])])
        }();
        return a(function (d) {
          var e,
            f, g = !1;
          if (d)if (e = d[1])if (f = e[1])if (f[1]) g = !0; else return a(function () {
            var g, h, k, u, p, q;
            k = c(m[0], [d[0]]);
            switch (k.t) {
              case 2:
                switch (g = k[1], h = k[0], k = c(m[0], [e[0]]), u = c(m[0], [f[0]]), u.t) {
                  case 2:
                    try {
                      return p = c(t[25], [a(function (a) {
                        var b = a[0], c = h - b[0] - l * u[0], b = g - b[1] - l * u[1];
                        return c * c + b * b < a[1]
                      }), n]), q = p[0], Q(h - q[0], g - q[1])
                    } catch (ua) {
                      if ("Not_found" === ua[0])return k;
                      throw ua;
                    }
                  default:
                    throw b("Match_failure", b("op.ml", 441, 24));
                }
              default:
                throw b("Match_failure", b("op.ml", 439, 24));
            }
          }); else g = !0; else g = !0; else g = !0;
          if (g)throw b("Match_failure", b("op.ml", 438, 4));
        })
      })), la = b("pclosestmax", b(2, b(1, 0)), 2, a(function (e) {
        e = e[0];
        var f = c(t[0], [e]), h = c(k[15], [c(k[5], [f / 2 >> 0, f]), e]);
        return a(function (e) {
          var f, l = !1;
          if (e)if (f = e[1])if (f[1]) l = !0; else return a(function () {
            var l, n, u = c(m[0], [e[0]]);
            switch (u.t) {
              case 2:
                switch (l = c(m[0], [f[0]]), l.t) {
                  case 1:
                    return n = l[0], l = c(k[31], [a(function (a) {
                      return d(g[4], [n * a[0] - u[0], n * a[1] - u[1]])
                    }), h]), Q(l[0], l[1]);
                  default:
                    throw b("Match_failure", b("op.ml", 465, 24));
                }
              default:
                throw b("Match_failure",
                  b("op.ml", 464, 24));
            }
          }); else l = !0; else l = !0;
          if (l)throw b("Match_failure", b("op.ml", 463, 4));
        })
      })), ba = b("fclosest", b(1, b(1, 0)), 1, a(function (d) {
        d = d[1];
        var e = c(t[0], [d]), f = c(k[15], [c(k[5], [e / 2 >> 0, e]), d]);
        return a(function (d) {
          var e, g = !1;
          if (d)if (e = d[1])if (e[1]) g = !0; else return a(function () {
            var g, h = c(m[0], [d[0]]);
            switch (h.t) {
              case 1:
                switch (g = c(m[0], [e[0]]), g.t) {
                  case 1:
                    return O(c(k[31], [a(function (a) {
                      return Math.abs(a * g[0] - h[0])
                    }), f]));
                  default:
                    throw b("Match_failure", b("op.ml", 480, 24));
                }
              default:
                throw b("Match_failure",
                  b("op.ml", 479, 24));
            }
          }); else g = !0; else g = !0;
          if (g)throw b("Match_failure", b("op.ml", 478, 18));
        })
      })), ca = b("torus", b(2, b(1, b(1, 0))), 2, a(function (d, e) {
        var f, h, l = !1;
        if (e)if (f = e[1])if (h = f[1])if (h[1]) l = !0; else return a(function () {
          var a, d, l, n = c(m[0], [e[0]]);
          switch (n.t) {
            case 2:
              switch (a = c(m[0], [f[0]]), a.t) {
                case 1:
                  switch (a = a[0], d = c(m[0], [h[0]]), d.t) {
                    case 1:
                      return l = d[0], d = c(g[3], [a, l]) - .1, a = c(g[4], [a, l]) + .1, Q(c(k[2], [b(d), b(a), b(-1), b(1), n[0]]), c(k[2], [b(d), b(a), b(-1), b(1), n[1]]));
                    default:
                      throw b("Match_failure",
                        b("op.ml", 492, 20));
                  }
                default:
                  throw b("Match_failure", b("op.ml", 491, 20));
              }
            default:
              throw b("Match_failure", b("op.ml", 490, 20));
          }
        }); else l = !0; else l = !0; else l = !0;
        if (l)throw b("Match_failure", b("op.ml", 489, 20));
      })), da = b("or", b(0, b(0, 0)), 0, a(function (d, e) {
        var f, g = !1;
        if (e)if (f = e[1])if (f[1]) g = !0; else return a(function () {
          var a, d = c(m[0], [e[0]]);
          switch (d.t) {
            case 0:
              switch (a = c(m[0], [f[0]]), a.t) {
                case 0:
                  return b(d[0] || a[0]);
                default:
                  throw b("Match_failure", b("op.ml", 505, 20));
              }
            default:
              throw b("Match_failure", b("op.ml",
                504, 20));
          }
        }); else g = !0; else g = !0;
        if (g)throw b("Match_failure", b("op.ml", 503, 20));
      })), ea = b("and", b(0, b(0, 0)), 0, a(function (d, e) {
        var f, g = !1;
        if (e)if (f = e[1])if (f[1]) g = !0; else return a(function () {
          var a, d = c(m[0], [e[0]]);
          switch (d.t) {
            case 0:
              switch (a = c(m[0], [f[0]]), a.t) {
                case 0:
                  return b(d[0] && a[0]);
                default:
                  throw b("Match_failure", b("op.ml", 515, 20));
              }
            default:
              throw b("Match_failure", b("op.ml", 514, 20));
          }
        }); else g = !0; else g = !0;
        if (g)throw b("Match_failure", b("op.ml", 513, 20));
      })), fa = b("fif", b(0, b(1, b(1, 0))), 1, a(function (d,
                                                             e) {
        var f, g, h = !1;
        if (e)if (f = e[1])if (g = f[1])if (g[1]) h = !0; else return a(function () {
          var a, d, h = c(m[0], [e[0]]);
          switch (h.t) {
            case 0:
              return a = c(m[0], [f[0]]), d = c(m[0], [g[0]]), h[0] ? a : d;
            default:
              throw b("Match_failure", b("op.ml", 524, 20));
          }
        }); else h = !0; else h = !0; else h = !0;
        if (h)throw b("Match_failure", b("op.ml", 523, 20));
      })), ha = b("cif", b(0, b(3, b(3, 0))), 3, a(function (d, e) {
        var f, g, h = !1;
        if (e)if (f = e[1])if (g = f[1])if (g[1]) h = !0; else return a(function () {
          var a, d, h = c(m[0], [e[0]]);
          switch (h.t) {
            case 0:
              return a = c(m[0], [f[0]]), d =
                c(m[0], [g[0]]), h[0] ? a : d;
            default:
              throw b("Match_failure", b("op.ml", 535, 20));
          }
        }); else h = !0; else h = !0; else h = !0;
        if (h)throw b("Match_failure", b("op.ml", 534, 20));
      })), ia = b("pif", b(0, b(2, b(2, 0))), 2, a(function (d, e) {
        var f, g, h = !1;
        if (e)if (f = e[1])if (g = f[1])if (g[1]) h = !0; else return a(function () {
          var a, d, h = c(m[0], [e[0]]);
          switch (h.t) {
            case 0:
              return a = c(m[0], [f[0]]), d = c(m[0], [g[0]]), h[0] ? a : d;
            default:
              throw b("Match_failure", b("op.ml", 546, 20));
          }
        }); else h = !0; else h = !0; else h = !0;
        if (h)throw b("Match_failure", b("op.ml",
          545, 20));
      })), ma = b("hsl", b(2, b(1, 0)), 3, a(function (d, e) {
        var f, g = !1;
        if (e)if (f = e[1])if (f[1]) g = !0; else return a(function () {
          var a, d, g;
          g = c(m[0], [e[0]]);
          switch (g.t) {
            case 2:
              switch (a = c(m[0], [f[0]]), a.t) {
                case 1:
                  return d = c(k[2], [0, 0, b(0), b(1), g[0] / 2]), a = c(k[2], [0, 0, b(0), b(1), a[0]]), g = c(k[2], [0, 0, b(0), b(1), g[1]]), d = c(k[22], [d, a, g]), T(c(k[20], [2 * d[0] - 1, 2 * d[1] - 1, 2 * d[2] - 1]));
                default:
                  throw b("Match_failure", b("op.ml", 558, 20));
              }
            default:
              throw b("Match_failure", b("op.ml", 557, 20));
          }
        }); else g = !0; else g = !0;
        if (g)throw b("Match_failure",
          b("op.ml", 556, 20));
      })), na = b("bw", b(1, 0), 3, a(function (d, e) {
        var f = !1;
        if (e)if (e[1]) f = !0; else return a(function () {
          var a;
          a = c(m[0], [e[0]]);
          switch (a.t) {
            case 1:
              return a = a[0], T(c(k[20], [a, a, a]));
            default:
              throw b("Match_failure", b("op.ml", 575, 20));
          }
        }); else f = !0;
        if (f)throw b("Match_failure", b("op.ml", 574, 20));
      })), pa = b("rgb", b(1, b(1, b(1, 0))), 3, a(function (d, e) {
        var f, g, h = !1;
        if (e)if (f = e[1])if (g = f[1])if (g[1]) h = !0; else return a(function () {
          var a, d, h = c(m[0], [e[0]]);
          switch (h.t) {
            case 1:
              switch (a = c(m[0], [f[0]]), a.t) {
                case 1:
                  switch (d =
                    c(m[0], [g[0]]), d.t) {
                    case 1:
                      return T(c(k[20], [h[0], a[0], d[0]]));
                    default:
                      throw b("Match_failure", b("op.ml", 586, 20));
                  }
                default:
                  throw b("Match_failure", b("op.ml", 585, 20));
              }
            default:
              throw b("Match_failure", b("op.ml", 584, 20));
          }
        }); else h = !0; else h = !0; else h = !0;
        if (h)throw b("Match_failure", b("op.ml", 583, 20));
      })), qa = b("rgbv", b(2, b(2, 0)), 3, a(function (d, e) {
        var f, g = !1;
        if (e)if (f = e[1])if (f[1]) g = !0; else return a(function () {
          var a, d, g = c(m[0], [e[0]]);
          switch (g.t) {
            case 2:
              switch (a = c(m[0], [f[0]]), a.t) {
                case 2:
                  return d = a[1],
                    T(c(k[20], [g[0] * d, g[1] * d, a[0] * d]));
                default:
                  throw b("Match_failure", b("op.ml", 596, 20));
              }
            default:
              throw b("Match_failure", b("op.ml", 595, 20));
          }
        }); else g = !0; else g = !0;
        if (g)throw b("Match_failure", b("op.ml", 594, 20));
      }));
      return b(l, p, f, z, n, e, K, L, F, v, w, h, q, B, D, ja, I, r, P, Ka, S, U, V, N, W, X, Y, ka, C, la, ba, ca, da, ea, fa, ha, ia, ma, na, pa, qa)
    }(), B = b(l[4], b(l[2], b(l[3], b(l[5], b(l[6], b(l[7], b(l[9], b(l[10], b(l[8], b(l[12], b(l[13], b(l[14], b(l[15], b(l[16], b(l[17], b(l[21], b(l[22], b(l[25], b(l[24], b(l[11], b(l[23], b(l[28], b(l[29],
      b(l[30], b(l[31], b(l[32], b(l[33], b(l[34], b(l[35], b(l[36], b(l[40], b(l[37], b(l[38], 0)))))))))))))))))))))))))))))))));
    return b(p, w, l, B, a(function (b) {
      return d(t[26], [a(function (a) {
        return X(a[2], b)
      }), B])
    }), a(function (a) {
      return a[0]
    }), a(function (a) {
      return d(t[25], [a, B])
    }), a(function (a) {
      return a[1]
    }), a(function (a) {
      return a[2]
    }), a(function (a) {
      return a[0]
    }), a(function (a) {
      return a[3]
    }), a(function (a) {
      var b = c(t[0], [a]);
      return d(k[15], [c(k[5], [1 + (b / 5 >> 0), b]), a])
    }))
  }(), V = function () {
    var m = a(function (a) {
        return a[1]
      }),
      w = a(function (b, g) {
        return d(t[26], [a(function (a) {
          return X(c(B[8], [a[0]]), b)
        }), g])
      }), l = a(function (b, g) {
        return d(t[19], [a(function (b) {
          return d(t[20], [a(function (a) {
            return X(b, c(B[8], [a[0]]))
          }), g])
        }), c(B[7], [b])])
      }), D = a(function (f, g) {
        return b(f, c(t[10], [a(function (a) {
          return d(k[12], [.2, c(w, [a, g])])
        }), c(B[7], [f])]))
      }), y = a(function (f, m, n, e) {
        var p = a(function (m, z, v) {
          var x, h;
          if (1 >= m) {
            x = c(t[26], [a(function (a) {
              return d(l, [a, v])
            }), f]);
            if (h = c(t[26], [a(function (a) {
                return d(t[23], [c(B[8], [a]), n])
              }), x]))return b(c(D,
              [c(k[14], [h]), v]), z);
            if (m < -e - 5)return d(g[21], [c(y, [B[3], v, n, m]), z]);
            x = c(D, [c(k[14], [x]), v]);
            return d(p, [m - 1, b(x, z), b(x, v)])
          }
          x = c(k[14], [f]);
          if (c(l, [x, v]))return x = c(D, [x, v]), d(p, [m - 1, b(x, z), b(x, v)]);
          m = c(t[13], [a(function (a, d) {
            var e = c(y, [f, v, b(a[0], 0), a[1]]);
            if (e)return b(d[0] - c(t[0], [e]), b(e[0], d[1]), c(g[21], [e, d[2]]), c(g[21], [e, d[3]]));
            throw b("Match_failure", b("gene.ml", 101, 7));
          }), c(t[36], [c(B[7], [x]), c(k[10], [c(k[5], [1, m - 1]), c(t[0], [c(B[7], [x])])])]), b(m, 0, z, v)]);
          z = b(x, m[1]);
          return d(p, [m[0], b(z,
            m[2]), b(z, m[3])])
        });
        return d(p, [e, 0, m])
      }), x = a(function (f, l, m, e, p) {
        var n, z, v, w, h = a(function (a, e) {
          var f, g, l;
          return e ? (f = e[1], g = e[0], l = c(B[8], [g[0]]), (1 !== l && 2 !== l || c(t[23], [l, a])) && .5 > c(k[4], [0]) ? d(h, [a, f]) : b(g, c(h, [b(l, a), f]))) : 0
        });
        if (1 >= p)return d(y, [f, l, m, e]);
        if (n = c(y, [f, l, b(0, b(1, b(2, b(3, 0)))), e])) {
          z = n[0];
          if (v = c(y, [f, l, b(0, b(1, b(2, b(3, 0)))), e]))return w = v[0], l = b(z, b(w, c(h, [b(c(B[8], [z[0]]), b(c(B[8], [w[0]]), 0)), l]))), d(g[21], [c(x, [f, l, m, e, p - 2]), c(g[21], [n, v])]);
          throw b("Match_failure", b("gene.ml",
            128, 10));
        }
        throw b("Match_failure", b("gene.ml", 127, 10));
      });
    return b(a(function (a) {
      return a[0]
    }), m, a(function (a) {
      return b(c(B[0], ["x", a]), 0)
    }), a(function (a) {
      return b(c(B[0], ["y", a]), 0)
    }), a(function (a) {
      return b(c(B[0], ["t", a]), 0)
    }), a(function (a, d) {
      return b(c(B[1], [a, d]), 0)
    }), w, l, a(function (f) {
      return d(k[11], [a(function () {
        var a = c(k[6], [-1, 1]), d = c(k[6], [-1, 1]);
        return b(a, d)
      }), 1, f])
    }), a(function (b) {
      return d(k[11], [a(function () {
        return d(k[6], [-1, 1])
      }), 1, b])
    }), a(function (f) {
      f = c(k[11], [a(function () {
        return d(k[23],
          [0])
      }), 1, f]);
      var g = c(k[5], [-15, 15]);
      return d(k[9], [a(function (f) {
        return d(t[10], [a(function (a) {
          var d = c(k[25], [a, f]);
          return b(a[0] + .1 * d[0], a[1] + .1 * d[1], a[2] + .1 * d[2])
        }), f])
      }), f, g])
    }), D, y, x, a(function (b) {
      var f = a(function (a, b) {
        var e, k;
        return b ? (e = b[1], k = b[0], c(t[24], [k, a]) ? d(f, [a, e]) : d(f, [c(g, [a, k]), e])) : a
      }), g = a(function (a, b) {
        return d(f, [c(k[18], [b, a]), c(m, [b])])
      }), e = c(g, [0, c(t[1], [b])]);
      return d(t[26], [a(function (a) {
        return d(t[24], [a, e])
      }), b])
    }), a(function (b) {
      var f = c(k[17], [b]);
      return d(W[5], ["\n", c(t[10],
        [a(function (b) {
          var e = b[0];
          return d(g[15], [c(g[19], [b[1]]), c(g[15], [":", c(g[15], ["[", c(g[15], [c(B[5], [e[0]]), c(g[15], [", (", c(g[15], [c(W[5], [",", c(t[10], [a(function (a) {
            return d(g[19], [c(t[30], [a, f])])
          }), e[1]])]), ")]"])])])])])])
        }), f])])
    }))
  }(), Ja = function () {
    var p = c(k[20], [0, 0, 0]), w = a(function (a) {
      switch (a) {
        case 0:
          return b(!1);
        case 1:
          return O(.7);
        case 2:
          return Q(.2, .3);
        case 3:
          return T(p);
        default:
          return null
      }
    }), l = a(function (a, d, g) {
      return b(b(c(w, [c(B[8], [d])])), c(B[10], [d, g, a]))
    }), I = a(function (g, f) {
      var k =
        a(function (g) {
          var e, m, n;
          return g ? (e = g[0], g = c(k, [g[1]]), m = g[1], n = c(l, [c(t[10], [a(function (a) {
              return d(t[30], [a, m])
            }), c(V[1], [e])]), c(V[0], [e]), f]), b(b(n, g[0]), b(b(e, n), m))) : b(0, 0)
        });
      return c(k, [g])[0]
    }), y = a(function (a) {
      var b;
      return a ? (b = a[0], c(y, [a[1]]), b[0][0] = c(b[1], [0])) : 0
    });
    return b(p, w, l, I, a(function (d) {
      var f, l, m, e;
      m = c(k[8], [d]);
      var p = b(0), t = b(0), x = b(-1);
      c(k[36], [m[0]]);
      d = c(V[9], [10]);
      f = c(V[8], [c(k[5], [5, 20])]);
      l = b(c(k[20], [-1, -1, -1]), b(c(k[20], [1, 0, 1]), c(V[10], [c(k[5], [2, 10])])));
      d = b(f, d, l);
      c(k[36], [m[1]]);
      m = c(k[5], [120, 200]);
      f = c(B[11], [B[3]]);
      l = b(c(V[5], [p, t]), b(c(V[4], [x]), 0));
      m = c(V[14], [c(g[21], [c(V[12], [f, l, b(3, 0), m]), l])]);
      e = c(I, [m, d]);
      return a(function (a, b, c) {
        p[0] = b;
        t[0] = c;
        x[0] = a;
        return e
      })
    }), y, a(function (a, b, l, p) {
      a = c(a, [b, l, p]);
      a = (c(y, [a]), c(m[0], [c(t[1], [a])]));
      switch (a.t) {
        case 3:
          return d(k[21], [a[0]]);
        default:
          return d(g[1], ["The result is not a color"])
      }
    }), a(function (a, b, d, k, e) {
      var f, l = 2 / b;
      for (f = 0; f <= b - 1; f++) {
        var p = f, n = c(a, [d, l * (.5 + p) - 1, l * (.5 + k) - 1]), n = (c(y, [n]), c(m[0], [c(t[1],
          [n])]));
        switch (n.t) {
          case 3:
            D(e, p, n[0]);
            break;
          default:
            c(g[1], ["The result is not a color"])
        }
      }
    }))
  }(), fb = (module.exports.new_picture = c(a(function (a, b) {
    return c(a, [b])
  }), [Ja[4]]), module.exports.compute_pixel = c(a(function (a, b, d, g) {
    return c(a, [b, d, g])
  }), [a(function (a, b, k) {
    a = c(Ja[6], [a, 0, b, k]);
    return d(g[15], ["rgb(", c(g[15], [c(g[19], [a[0]]), c(g[15], [",", c(g[15], [c(g[19], [a[1]]), c(g[15], [",", c(g[15], [c(g[19], [a[2]]), ")"])])])])])])
  })]), b());
  Object.defineProperty(g[80], "length", {value: 3});
  c(g[80], [0]);
  b();
  console.log(fb);
  return function (a) {
    return Ga[a]
  }
})();
