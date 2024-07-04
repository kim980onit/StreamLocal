/*! js-cookie v3.0.0-beta.4 | MIT */
!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self,
    function() {
        var r = e.Cookies
          , n = e.Cookies = t();
        n.noConflict = function() {
            return e.Cookies = r,
            n
        }
    }())
}(this, function() {
    "use strict";
    function e(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)
                e[n] = r[n]
        }
        return e
    }
    var t = {
        read: function(e) {
            return e.replace(/%3B/g, ";")
        },
        write: function(e) {
            return e.replace(/;/g, "%3B")
        }
    };
    return function r(n, i) {
        function o(r, o, u) {
            if ("undefined" != typeof document) {
                "number" == typeof (u = e({}, i, u)).expires && (u.expires = new Date(Date.now() + 864e5 * u.expires)),
                u.expires && (u.expires = u.expires.toUTCString()),
                r = t.write(r).replace(/=/g, "%3D"),
                o = n.write(String(o), r);
                var c = "";
                for (var f in u)
                    u[f] && (c += "; " + f,
                    !0 !== u[f] && (c += "=" + u[f].split(";")[0]));
                return document.cookie = r + "=" + o + c
            }
        }
        return Object.create({
            set: o,
            get: function(e) {
                if ("undefined" != typeof document && (!arguments.length || e)) {
                    for (var r = document.cookie ? document.cookie.split("; ") : [], i = {}, o = 0; o < r.length; o++) {
                        var u = r[o].split("=")
                          , c = u.slice(1).join("=")
                          , f = t.read(u[0]).replace(/%3D/g, "=");
                        if (i[f] = n.read(c, f),
                        e === f)
                            break
                    }
                    return e ? i[e] : i
                }
            },
            remove: function(t, r) {
                o(t, "", e({}, r, {
                    expires: -1
                }))
            },
            withAttributes: function(t) {
                return r(this.converter, e({}, this.attributes, t))
            },
            withConverter: function(t) {
                return r(e({}, this.converter, t), this.attributes)
            }
        }, {
            attributes: {
                value: Object.freeze(i)
            },
            converter: {
                value: Object.freeze(n)
            }
        })
    }(t, {
        path: "/"
    })
});
