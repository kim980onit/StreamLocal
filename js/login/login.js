var is_login = !1
  , movie = ($.get("/ajax/login-state", function(e) {
    is_login = e.is_login,
    $("#user-slot, #header_login").html(e.html),
    is_login && $("#header").addClass("header-logged")
}),
$.get("/ajax/verify?domain=" + window.location.hostname, function(e) {
    e.status || (window.location.href = e.redirectTo)
}),
{
    id: $(".detail_page-watch").attr("data-id"),
    type: $(".detail_page-watch").attr("data-type")
})
  , is_process = !1;
function check_login() {
    return !!is_login || ($("#modallogin").modal("show"),
    !1)
}
function redirect(e) {
    e.redirect && (location.href = e.redirect)
}
function vote_info() {
    $.get("/ajax/vote_info/" + movie.id, function(e) {
        $("#block-rating").html(e)
    })
}
function vote_submit(t, s) {
    $("#vote-loading").show(),
    "undefined" != typeof recaptcha_site_key ? grecaptcha.execute(recaptcha_site_key, {
        action: "vote_movie"
    }).then(function(e) {
        $.post("/ajax/vote/" + t, {
            state: s,
            token: e
        }, function(e) {
            $("#block-rating").html(e)
        })
    }) : $.post("/ajax/vote/" + t, {
        state: s
    }, function(e) {
        $("#block-rating").html(e)
    })
}
function like(e) {
    check_login() && vote_submit(e, 1)
}
function dislike(e) {
    check_login() && vote_submit(e, 0)
}
function get_episodes() {
    2 == movie.type ? $.get("/ajax/tv/seasons/" + movie.id, function(e) {
        $("#content-episodes").html(e)
    }) : $.get("/ajax/movie/episodes/" + movie.id, function(e) {
        $("#content-episodes").html(e)
    })
}
function check_favorite() {
    $.get("/ajax/check_favorite/" + movie.id, function(e) {
        $("#favorite-state").html(e)
    })
}
function submit_add_favorite(e) {
    is_process = !0,
    $.post("/ajax/favorite", {
        movie_id: movie.id,
        token: e
    }, function(e) {
        redirect(e),
        is_process = !1,
        $("#favorite-state").html(e.html),
        $("#fav-message").html(e.message),
        $("#alert-fav").show(),
        setTimeout(function() {
            $("#alert-fav").hide()
        }, 3e3)
    })
}
function add_favorite() {
    is_process || check_login() && ("undefined" != typeof recaptcha_site_key ? grecaptcha.execute(recaptcha_site_key, {
        action: "add_favorite"
    }).then(function(e) {
        submit_add_favorite(e)
    }) : submit_add_favorite(""))
}
function remove_favorite(e) {
    is_process || check_login() && confirm("Are you sure remove this movie from favorite?") && (is_process = !0,
    $.post("/ajax/remove_favorite", {
        id: e
    }, function(e) {
        is_process = !1,
        redirect(e),
        location.reload()
    }))
}
function watch(e, t) {
    $(".detail_page").hasClass("watch_page") && (t.preventDefault(),
    t = $(e).attr("href"),
    e = $(e).attr("data-linkid"),
    $(".link-item").removeClass("active"),
    history.pushState({}, "", t),
    get_source(e))
}
function watch2(e) {
    var t;
    if ($(".detail_page").hasClass("watch_page"))
        return t = $(e).attr("href"),
        e = $(e).attr("data-linkid"),
        $(".link-item").removeClass("active"),
        history.pushState({}, "", t),
        get_source(e),
        !1
}
function showModalRegister() {
    $("#modallogin").modal("show"),
    $(".auth-tab").removeClass("active show"),
    $("#modal-tab-register").addClass("active show")
}
function showModalLogin() {
    $("#modallogin").modal("show"),
    $(".auth-tab").removeClass("active show"),
    $("#modal-tab-login").addClass("active show")
}
$(document).ready(function() {
    $("#text-home-expand").click(function(e) {
        $(".text-home").toggleClass("thm-expand")
    }),
    $(".detail-extend-toggle").click(function(e) {
        $(".detail-extend").toggleClass("active")
    }),
    $(".header_menu-list> .nav-item").bind("mouseover", function() {
        $(this).find(".header_menu-sub").css("display", "block")
    }),
    $(".header_menu-list> .nav-item").bind("mouseout", function() {
        $(this).find(".header_menu-sub").css("display", "none")
    }),
    $("#turn-off-light").click(function(e) {
        $("#mask-overlay, #turn-off-light, .watching_player-area").toggleClass("active")
    }),
    $("#mask-overlay").click(function(e) {
        $("#mask-overlay, #turn-off-light, .watching_player-area").removeClass("active")
    });
    var e = !0
      , t = ($(".search-suggest").mouseover(function() {
        e = !1
    }),
    $(".search-suggest").mouseout(function() {
        e = !0
    }),
    null);
    $("input[name=keyword]").keyup(function() {
        null != t && clearTimeout(t),
        t = setTimeout(function() {
            t = null;
            var e = $("input[name=keyword]").val().trim();
            1 < e.length ? $.post("/ajax/search", {
                keyword: e
            }, function(e) {
                $(".search-suggest").html(e),
                $(".search-suggest").css({
                    display: "flex"
                })
            }) : $(".search-suggest").hide()
        }, 600)
    }),
    $("input[name=keyword]").blur(function() {
        e && $(".search-suggest").hide()
    }),
    $("input[name=keyword]").focus(function() {
        "" !== $(".search-suggest").html() && $(".search-suggest").css({
            display: "flex"
        })
    }),
    $(".goto-seasons").click(function() {
        $("html, body").animate({
            scrollTop: $("#content-episodes").offset().top - 30
        }, 1e3)
    }),
    $(".goto-comments").click(function() {
        $("html, body").animate({
            scrollTop: $("#film_comments").offset().top - 30
        }, 1e3)
    }),
    $(".btn-filter").click(function() {
        var e = []
          , t = []
          , s = ($(".genre-ids:checked").each(function() {
            e.push($(this).val())
        }),
        $(".country-ids:checked").each(function() {
            t.push($(this).val())
        }),
        e = 0 < e.length ? e.join("-") : "all",
        t = 0 < t.length ? t.join("-") : "all",
        $("input[name=release_year]:checked").val() || $("select[name=release_year]").val())
          , i = $("input[name=quality]:checked").val() || $("select[name=quality]").val()
          , a = $("input[name=type]:checked").val() || $("select[name=type]").val();
        window.location.href = "/filter?type=" + a + "&quality=" + i + "&release_year=" + s + "&genre=" + e + "&country=" + t
    }),
    0 < $("#site-notice").length && void 0 === Cookies.get("_s_notice") && $.get("/ajax/notice", function(e) {
        e.status && ($("#site-notice").html(e.html),
        "every_12h" === e.frequency && Cookies.set("_s_notice", 1, {
            expires: new Date((new Date).getTime() + 432e5)
        }),
        "every_24h" === e.frequency) && Cookies.set("_s_notice", 1, {
            expires: new Date((new Date).getTime() + 864e5)
        })
    }),
    $.get("/ajax/banners?page=" + currPage, function(e) {
        e.status && Object.entries(e.banners).forEach(function(e) {
            0 < $("#hgiks-" + e[0]).length && "" !== e[1] && "null" !== e[1] && null !== e[1] && (postscribe("#hgiks-" + e[0], e[1]),
            $("#hgiks-" + e[0]).show())
        })
    }),
    $.get("/ajax/banner/vpn", function(e) {
        e.status && ($("#vpn-top").html(e.html),
        $("#vpn-top").show())
    }),
    $("#modaltrailer").on("shown.bs.modal", function() {
        $("#iframe-trailer").attr("src", $("#iframe-trailer").attr("src"))
    }),
    $("#modaltrailer").on("hide.bs.modal", function() {
        $("#iframe-trailer").attr("src", "")
    })
});
var app = new Vue({
    el: "#app",
    data: {
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        new_password: "",
        remember: !1,
        error_login: !1,
        error_register: !1,
        error_forgot: !1,
        error_profile: !1,
        error_message: "",
        keyword: "",
        is_process: !1
    },
    methods: {
        show_login: function() {
            this.error_login = !1,
            $(".auth-tab").removeClass("active show"),
            $("#modal-tab-login").addClass("active show")
        },
        show_register: function() {
            this.error_register = !1,
            $(".auth-tab").removeClass("active show"),
            $("#modal-tab-register").addClass("active show")
        },
        show_forgot: function() {
            this.error_forgot = !1,
            $(".mlt-item").removeClass("active"),
            $(".auth-tab").removeClass("active show"),
            $("#modal-tab-forgot").addClass("active show")
        },
        login: function(e) {
            var t = this;
            t.email && t.password && (this.is_process || ($("#login-loading").show(),
            this.is_process = !0,
            $.post("/ajax/login", {
                email: this.email,
                password: this.password,
                remember: this.remember
            }, function(e) {
                e.status ? (is_login = e.is_login,
                $("#user-slot, #header_login").html(e.html),
                $("#modallogin").modal("hide")) : (t.error_login = !0,
                t.error_message = e.message),
                t.is_process = !1,
                $("#login-loading").hide()
            }))),
            e.preventDefault()
        },
        forgot_password: function(e) {
            e.preventDefault()
        },
        register: function(e) {
            var t = this;
            this.password !== this.confirm_password ? (this.error_register = !0,
            this.error_message = "Confirm password is invalid") : this.is_process || ($("#register-loading").show(),
            this.is_process = !0,
            "undefined" != typeof recaptcha_site_key ? grecaptcha.execute(recaptcha_site_key, {
                action: "register"
            }).then(function(e) {
                t.submit_register(e)
            }) : t.submit_register("")),
            e.preventDefault()
        },
        submit_register: function(e) {
            var t = this;
            $.post("/ajax/register", {
                email: this.email,
                password: this.password,
                name: this.name,
                token: e
            }, function(e) {
                e.status ? (is_login = e.is_login,
                $("#user-slot").html(e.html),
                $("#modallogin").modal("hide")) : (t.error_register = !0,
                t.error_message = e.message),
                t.is_process = !1,
                $("#register-loading").hide()
            })
        },
        update_profile: function(e) {
            var t = this;
            this.is_process || ($("#update-profile-loading").show(),
            this.is_process = !0,
            $.post("/ajax/update_profile", {
                name: $("#pro5-name").val(),
                password: this.password,
                new_password: this.new_password
            }, function(e) {
                e.status ? location.reload() : (t.error_profile = !0,
                t.error_message = e.message),
                t.is_process = !1
            })),
            e.preventDefault()
        },
        search: function(e) {
            var t;
            "" !== this.keyword && (t = this.keyword.replace(/\W-/g, "").replace(/['"]+/g, "").split(" ").join("-").toLowerCase(),
            location.href = "/search/" + t),
            e.preventDefault()
        }
    }
})
  , _0x173302 = ($(document).ready(function() {
    $("#mobile_menu, #header_browser .header-btn").click(function(e) {
        $("#sidebar_menu, #mobile_menu").toggleClass("active"),
        $("#sidebar_menu_bg").addClass("active"),
        $("#search-toggle, #search, #header").removeClass("active"),
        $("body").toggleClass("body-hidden")
    }),
    $(".toggle-sidebar, #sidebar_menu_bg, #btn-filter").click(function(e) {
        $("#sidebar_menu, #mobile_menu, #sidebar_menu_bg, #search-toggle, #search, #header").removeClass("active"),
        $("body").removeClass("body-hidden")
    }),
    $("#mobile_search").click(function(e) {
        $("#search, #mobile_search").toggleClass("active")
    }),
    $("#search-toggle").click(function(e) {
        $("#search, #search-toggle, #sidebar_menu_bg, #header").toggleClass("active"),
        $("body").toggleClass("body-hidden")
    }),
    $(".detail-extend-toggle").click(function(e) {
        $(".detail-extend").toggleClass("active")
    }),
    $(".header_menu-list> .nav-item").bind("mouseover", function() {
        $(this).find(".header_menu-sub").css("display", "block")
    }),
    $(".header_menu-list> .nav-item").bind("mouseout", function() {
        $(this).find(".header_menu-sub").css("display", "none")
    }),
    0 < $("#slider").length && new Swiper("#slider",{
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        loop: !0,
        autoplay: 4e3
    });
    var s, i, a, n, r, l, o = document.getElementById("header");
    o && (s = document.documentElement,
    i = window,
    a = i.scrollY || s.scrollTop,
    l = r = 0,
    window.addEventListener("scroll", function() {
        if (n = i.scrollY || s.scrollTop,
        a < n ? r = 2 : n < a && (r = 1),
        r !== l) {
            var e = r
              , t = n;
            if (e === 2 && t > 52) {
                o.classList.add("hide");
                l = e
            } else if (e === 1) {
                o.classList.remove("hide");
                l = e
            }
        }
        a = n
    })),
    $(".register-tab-link").click(function(e) {
        $("#modal-tab-register").addClass("active show"),
        $("#modal-tab-login, #modal-tab-forgot").removeClass("active show")
    }),
    $(".forgot-tab-link").click(function(e) {
        $(".mlt-item").removeClass("active"),
        $("#modal-tab-forgot").addClass("active show"),
        $("#modal-tab-login").removeClass("active show")
    }),
    $(".login-tab-link").click(function(e) {
        $("#modal-tab-login").addClass("active show"),
        $("#modal-tab-register, #modal-tab-forgot").removeClass("active show")
    }),
    $(".mlt-item").click(function(e) {
        $(".mlt-item").removeClass("active"),
        $(this).addClass("active")
    })
}),
!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self).Swiper = t()
}(this, function() {
    "use strict";
    function O(e) {
        return null !== e && "object" == typeof e && "constructor"in e && e.constructor === Object
    }
    function i(t, s) {
        void 0 === t && (t = {}),
        void 0 === s && (s = {}),
        Object.keys(s).forEach(function(e) {
            void 0 === t[e] ? t[e] = s[e] : O(s[e]) && O(t[e]) && 0 < Object.keys(s[e]).length && i(t[e], s[e])
        })
    }
    function o(e) {
        for (var t = 0; t < e.length; t += 1)
            this[t] = e[t];
        return this.length = e.length,
        this
    }
    var p = "undefined" != typeof document ? document : {}
      , e = {
        body: {},
        addEventListener: function() {},
        removeEventListener: function() {},
        activeElement: {
            blur: function() {},
            nodeName: ""
        },
        querySelector: function() {
            return null
        },
        querySelectorAll: function() {
            return []
        },
        getElementById: function() {
            return null
        },
        createEvent: function() {
            return {
                initEvent: function() {}
            }
        },
        createElement: function() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute: function() {},
                getElementsByTagName: function() {
                    return []
                }
            }
        },
        createElementNS: function() {
            return {}
        },
        importNode: function() {
            return null
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    }
      , q = (i(p, e),
    "undefined" != typeof window ? window : {});
    i(q, {
        document: e,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState: function() {},
            pushState: function() {},
            go: function() {},
            back: function() {}
        },
        CustomEvent: function() {
            return this
        },
        addEventListener: function() {},
        removeEventListener: function() {},
        getComputedStyle: function() {
            return {
                getPropertyValue: function() {
                    return ""
                }
            }
        },
        Image: function() {},
        Date: function() {},
        screen: {},
        setTimeout: function() {},
        clearTimeout: function() {},
        matchMedia: function() {
            return {}
        }
    });
    function E(e, t) {
        var s = []
          , i = 0;
        if (e && !t && e instanceof o)
            return e;
        if (e)
            if ("string" == typeof e) {
                var a, n, r = e.trim();
                if (0 <= r.indexOf("<") && 0 <= r.indexOf(">")) {
                    var l = "div";
                    for (0 === r.indexOf("<li") && (l = "ul"),
                    0 === r.indexOf("<tr") && (l = "tbody"),
                    0 !== r.indexOf("<td") && 0 !== r.indexOf("<th") || (l = "tr"),
                    0 === r.indexOf("<tbody") && (l = "table"),
                    0 === r.indexOf("<option") && (l = "select"),
                    (n = p.createElement(l)).innerHTML = r,
                    i = 0; i < n.childNodes.length; i += 1)
                        s.push(n.childNodes[i])
                } else
                    for (a = t || "#" !== e[0] || e.match(/[ .<>:~]/) ? (t || p).querySelectorAll(e.trim()) : [p.getElementById(e.trim().split("#")[1])],
                    i = 0; i < a.length; i += 1)
                        a[i] && s.push(a[i])
            } else if (e.nodeType || e === q || e === p)
                s.push(e);
            else if (0 < e.length && e[0].nodeType)
                for (i = 0; i < e.length; i += 1)
                    s.push(e[i]);
        return new o(s)
    }
    function n(e) {
        for (var t = [], s = 0; s < e.length; s += 1)
            -1 === t.indexOf(e[s]) && t.push(e[s]);
        return t
    }
    E.fn = o.prototype,
    E.Class = o,
    E.Dom7 = o;
    function t(e) {
        var t = this;
        t.params = e = void 0 === e ? {} : e,
        t.eventsListeners = {},
        t.params && t.params.on && Object.keys(t.params.on).forEach(function(e) {
            t.on(e, t.params.on[e])
        })
    }
    var s, a, _, r, A = {
        addClass: function(e) {
            if (void 0 !== e)
                for (var t = e.split(" "), s = 0; s < t.length; s += 1)
                    for (var i = 0; i < this.length; i += 1)
                        void 0 !== this[i] && void 0 !== this[i].classList && this[i].classList.add(t[s]);
            return this
        },
        removeClass: function(e) {
            for (var t = e.split(" "), s = 0; s < t.length; s += 1)
                for (var i = 0; i < this.length; i += 1)
                    void 0 !== this[i] && void 0 !== this[i].classList && this[i].classList.remove(t[s]);
            return this
        },
        hasClass: function(e) {
            return !!this[0] && this[0].classList.contains(e)
        },
        toggleClass: function(e) {
            for (var t = e.split(" "), s = 0; s < t.length; s += 1)
                for (var i = 0; i < this.length; i += 1)
                    void 0 !== this[i] && void 0 !== this[i].classList && this[i].classList.toggle(t[s]);
            return this
        },
        attr: function(e, t) {
            var s = arguments;
            if (1 === arguments.length && "string" == typeof e)
                return this[0] ? this[0].getAttribute(e) : void 0;
            for (var i = 0; i < this.length; i += 1)
                if (2 === s.length)
                    this[i].setAttribute(e, t);
                else
                    for (var a in e)
                        this[i][a] = e[a],
                        this[i].setAttribute(a, e[a]);
            return this
        },
        removeAttr: function(e) {
            for (var t = 0; t < this.length; t += 1)
                this[t].removeAttribute(e);
            return this
        },
        data: function(e, t) {
            var s;
            if (void 0 !== t) {
                for (var i = 0; i < this.length; i += 1)
                    (s = this[i]).dom7ElementDataStorage || (s.dom7ElementDataStorage = {}),
                    s.dom7ElementDataStorage[e] = t;
                return this
            }
            if (s = this[0])
                return s.dom7ElementDataStorage && e in s.dom7ElementDataStorage ? s.dom7ElementDataStorage[e] : s.getAttribute("data-" + e) || void 0
        },
        transform: function(e) {
            for (var t = 0; t < this.length; t += 1) {
                var s = this[t].style;
                s.webkitTransform = e,
                s.transform = e
            }
            return this
        },
        transition: function(e) {
            "string" != typeof e && (e += "ms");
            for (var t = 0; t < this.length; t += 1) {
                var s = this[t].style;
                s.webkitTransitionDuration = e,
                s.transitionDuration = e
            }
            return this
        },
        on: function() {
            for (var e = [], t = arguments.length; t--; )
                e[t] = arguments[t];
            var s = e[0]
              , n = e[1]
              , r = e[2]
              , i = e[3];
            function a(e) {
                var t = e.target;
                if (t) {
                    var s = e.target.dom7EventData || [];
                    if (s.indexOf(e) < 0 && s.unshift(e),
                    E(t).is(n))
                        r.apply(t, s);
                    else
                        for (var i = E(t).parents(), a = 0; a < i.length; a += 1)
                            E(i[a]).is(n) && r.apply(i[a], s)
                }
            }
            function l(e) {
                var t = e && e.target && e.target.dom7EventData || [];
                t.indexOf(e) < 0 && t.unshift(e),
                r.apply(this, t)
            }
            "function" == typeof e[1] && (s = e[0],
            r = e[1],
            i = e[2],
            n = void 0);
            for (var o, i = i || !1, h = s.split(" "), d = 0; d < this.length; d += 1) {
                var p = this[d];
                if (n)
                    for (o = 0; o < h.length; o += 1) {
                        var c = h[o];
                        p.dom7LiveListeners || (p.dom7LiveListeners = {}),
                        p.dom7LiveListeners[c] || (p.dom7LiveListeners[c] = []),
                        p.dom7LiveListeners[c].push({
                            listener: r,
                            proxyListener: a
                        }),
                        p.addEventListener(c, a, i)
                    }
                else
                    for (o = 0; o < h.length; o += 1) {
                        var u = h[o];
                        p.dom7Listeners || (p.dom7Listeners = {}),
                        p.dom7Listeners[u] || (p.dom7Listeners[u] = []),
                        p.dom7Listeners[u].push({
                            listener: r,
                            proxyListener: l
                        }),
                        p.addEventListener(u, l, i)
                    }
            }
            return this
        },
        off: function() {
            for (var e = [], t = arguments.length; t--; )
                e[t] = arguments[t];
            var s = e[0]
              , i = e[1]
              , a = e[2]
              , n = e[3];
            "function" == typeof e[1] && (s = e[0],
            a = e[1],
            n = e[2],
            i = void 0);
            for (var n = n || !1, r = s.split(" "), l = 0; l < r.length; l += 1)
                for (var o = r[l], h = 0; h < this.length; h += 1) {
                    var d = this[h]
                      , p = void 0;
                    if (!i && d.dom7Listeners ? p = d.dom7Listeners[o] : i && d.dom7LiveListeners && (p = d.dom7LiveListeners[o]),
                    p && p.length)
                        for (var c = p.length - 1; 0 <= c; --c) {
                            var u = p[c];
                            (a && u.listener === a || a && u.listener && u.listener.dom7proxy && u.listener.dom7proxy === a || !a) && (d.removeEventListener(o, u.proxyListener, n),
                            p.splice(c, 1))
                        }
                }
            return this
        },
        trigger: function() {
            for (var e = [], t = arguments.length; t--; )
                e[t] = arguments[t];
            for (var s = e[0].split(" "), i = e[1], a = 0; a < s.length; a += 1)
                for (var n = s[a], r = 0; r < this.length; r += 1) {
                    var l = this[r]
                      , o = void 0;
                    try {
                        o = new q.CustomEvent(n,{
                            detail: i,
                            bubbles: !0,
                            cancelable: !0
                        })
                    } catch (e) {
                        (o = p.createEvent("Event")).initEvent(n, !0, !0),
                        o.detail = i
                    }
                    l.dom7EventData = e.filter(function(e, t) {
                        return 0 < t
                    }),
                    l.dispatchEvent(o),
                    l.dom7EventData = [],
                    delete l.dom7EventData
                }
            return this
        },
        transitionEnd: function(t) {
            var s, i = ["webkitTransitionEnd", "transitionend"], a = this;
            function n(e) {
                if (e.target === this)
                    for (t.call(this, e),
                    s = 0; s < i.length; s += 1)
                        a.off(i[s], n)
            }
            if (t)
                for (s = 0; s < i.length; s += 1)
                    a.on(i[s], n);
            return this
        },
        outerWidth: function(e) {
            return 0 < this.length ? e ? (e = this.styles(),
            this[0].offsetWidth + parseFloat(e.getPropertyValue("margin-right")) + parseFloat(e.getPropertyValue("margin-left"))) : this[0].offsetWidth : null
        },
        outerHeight: function(e) {
            return 0 < this.length ? e ? (e = this.styles(),
            this[0].offsetHeight + parseFloat(e.getPropertyValue("margin-top")) + parseFloat(e.getPropertyValue("margin-bottom"))) : this[0].offsetHeight : null
        },
        offset: function() {
            var e, t, s, i, a;
            return 0 < this.length ? (e = (a = this[0]).getBoundingClientRect(),
            s = p.body,
            t = a.clientTop || s.clientTop || 0,
            s = a.clientLeft || s.clientLeft || 0,
            i = a === q ? q.scrollY : a.scrollTop,
            a = a === q ? q.scrollX : a.scrollLeft,
            {
                top: e.top + i - t,
                left: e.left + a - s
            }) : null
        },
        css: function(e, t) {
            var s;
            if (1 === arguments.length) {
                if ("string" != typeof e) {
                    for (s = 0; s < this.length; s += 1)
                        for (var i in e)
                            this[s].style[i] = e[i];
                    return this
                }
                if (this[0])
                    return q.getComputedStyle(this[0], null).getPropertyValue(e)
            }
            if (2 === arguments.length && "string" == typeof e)
                for (s = 0; s < this.length; s += 1)
                    this[s].style[e] = t;
            return this
        },
        each: function(e) {
            if (e)
                for (var t = 0; t < this.length; t += 1)
                    if (!1 === e.call(this[t], t, this[t]))
                        return this;
            return this
        },
        html: function(e) {
            if (void 0 === e)
                return this[0] ? this[0].innerHTML : void 0;
            for (var t = 0; t < this.length; t += 1)
                this[t].innerHTML = e;
            return this
        },
        text: function(e) {
            if (void 0 === e)
                return this[0] ? this[0].textContent.trim() : null;
            for (var t = 0; t < this.length; t += 1)
                this[t].textContent = e;
            return this
        },
        is: function(e) {
            var t, s, i = this[0];
            if (i && void 0 !== e)
                if ("string" == typeof e) {
                    if (i.matches)
                        return i.matches(e);
                    if (i.webkitMatchesSelector)
                        return i.webkitMatchesSelector(e);
                    if (i.msMatchesSelector)
                        return i.msMatchesSelector(e);
                    for (t = E(e),
                    s = 0; s < t.length; s += 1)
                        if (t[s] === i)
                            return !0
                } else {
                    if (e === p)
                        return i === p;
                    if (e === q)
                        return i === q;
                    if (e.nodeType || e instanceof o)
                        for (t = e.nodeType ? [e] : e,
                        s = 0; s < t.length; s += 1)
                            if (t[s] === i)
                                return !0
                }
            return !1
        },
        index: function() {
            var e, t = this[0];
            if (t) {
                for (e = 0; null !== (t = t.previousSibling); )
                    1 === t.nodeType && (e += 1);
                return e
            }
        },
        eq: function(e) {
            var t;
            return void 0 === e ? this : (t = this.length,
            new o(t - 1 < e ? [] : e < 0 ? (t = t + e) < 0 ? [] : [this[t]] : [this[e]]))
        },
        append: function() {
            for (var e = [], t = arguments.length; t--; )
                e[t] = arguments[t];
            for (var s = 0; s < e.length; s += 1)
                for (var i = e[s], a = 0; a < this.length; a += 1)
                    if ("string" == typeof i) {
                        var n = p.createElement("div");
                        for (n.innerHTML = i; n.firstChild; )
                            this[a].appendChild(n.firstChild)
                    } else if (i instanceof o)
                        for (var r = 0; r < i.length; r += 1)
                            this[a].appendChild(i[r]);
                    else
                        this[a].appendChild(i);
            return this
        },
        prepend: function(e) {
            for (var t, s = 0; s < this.length; s += 1)
                if ("string" == typeof e) {
                    var i = p.createElement("div");
                    for (i.innerHTML = e,
                    t = i.childNodes.length - 1; 0 <= t; --t)
                        this[s].insertBefore(i.childNodes[t], this[s].childNodes[0])
                } else if (e instanceof o)
                    for (t = 0; t < e.length; t += 1)
                        this[s].insertBefore(e[t], this[s].childNodes[0]);
                else
                    this[s].insertBefore(e, this[s].childNodes[0]);
            return this
        },
        next: function(e) {
            return 0 < this.length ? e ? this[0].nextElementSibling && E(this[0].nextElementSibling).is(e) ? new o([this[0].nextElementSibling]) : new o([]) : this[0].nextElementSibling ? new o([this[0].nextElementSibling]) : new o([]) : new o([])
        },
        nextAll: function(e) {
            var t = []
              , s = this[0];
            if (!s)
                return new o([]);
            for (; s.nextElementSibling; ) {
                var i = s.nextElementSibling;
                e && !E(i).is(e) || t.push(i),
                s = i
            }
            return new o(t)
        },
        prev: function(e) {
            var t;
            return 0 < this.length ? (t = this[0],
            e ? t.previousElementSibling && E(t.previousElementSibling).is(e) ? new o([t.previousElementSibling]) : new o([]) : t.previousElementSibling ? new o([t.previousElementSibling]) : new o([])) : new o([])
        },
        prevAll: function(e) {
            var t = []
              , s = this[0];
            if (!s)
                return new o([]);
            for (; s.previousElementSibling; ) {
                var i = s.previousElementSibling;
                e && !E(i).is(e) || t.push(i),
                s = i
            }
            return new o(t)
        },
        parent: function(e) {
            for (var t = [], s = 0; s < this.length; s += 1)
                null === this[s].parentNode || e && !E(this[s].parentNode).is(e) || t.push(this[s].parentNode);
            return E(n(t))
        },
        parents: function(e) {
            for (var t = [], s = 0; s < this.length; s += 1)
                for (var i = this[s].parentNode; i; )
                    e && !E(i).is(e) || t.push(i),
                    i = i.parentNode;
            return E(n(t))
        },
        closest: function(e) {
            var t = this;
            return void 0 === e ? new o([]) : t = t.is(e) ? t : t.parents(e).eq(0)
        },
        find: function(e) {
            for (var t = [], s = 0; s < this.length; s += 1)
                for (var i = this[s].querySelectorAll(e), a = 0; a < i.length; a += 1)
                    t.push(i[a]);
            return new o(t)
        },
        children: function(e) {
            for (var t = [], s = 0; s < this.length; s += 1)
                for (var i = this[s].childNodes, a = 0; a < i.length; a += 1)
                    e ? 1 === i[a].nodeType && E(i[a]).is(e) && t.push(i[a]) : 1 === i[a].nodeType && t.push(i[a]);
            return new o(n(t))
        },
        filter: function(e) {
            for (var t = [], s = 0; s < this.length; s += 1)
                e.call(this[s], s, this[s]) && t.push(this[s]);
            return new o(t)
        },
        remove: function() {
            for (var e = 0; e < this.length; e += 1)
                this[e].parentNode && this[e].parentNode.removeChild(this[e]);
            return this
        },
        add: function() {
            for (var e = [], t = arguments.length; t--; )
                e[t] = arguments[t];
            for (var s = 0; s < e.length; s += 1)
                for (var i = E(e[s]), a = 0; a < i.length; a += 1)
                    this[this.length] = i[a],
                    this.length += 1;
            return this
        },
        styles: function() {
            return this[0] ? q.getComputedStyle(this[0], null) : {}
        }
    }, U = (Object.keys(A).forEach(function(e) {
        E.fn[e] = E.fn[e] || A[e]
    }),
    {
        deleteProps: function(e) {
            var t = e;
            Object.keys(t).forEach(function(e) {
                try {
                    t[e] = null
                } catch (e) {}
                try {
                    delete t[e]
                } catch (e) {}
            })
        },
        nextTick: function(e, t) {
            return void 0 === t && (t = 0),
            setTimeout(e, t)
        },
        now: function() {
            return Date.now()
        },
        getTranslate: function(e, t) {
            void 0 === t && (t = "x");
            var s, i, a, e = q.getComputedStyle(e, null);
            return q.WebKitCSSMatrix ? (6 < (i = e.transform || e.webkitTransform).split(",").length && (i = i.split(", ").map(function(e) {
                return e.replace(",", ".")
            }).join(", ")),
            a = new q.WebKitCSSMatrix("none" === i ? "" : i)) : s = (a = e.MozTransform || e.OTransform || e.MsTransform || e.msTransform || e.transform || e.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,")).toString().split(","),
            "x" === t && (i = q.WebKitCSSMatrix ? a.m41 : 16 === s.length ? parseFloat(s[12]) : parseFloat(s[4])),
            (i = "y" === t ? q.WebKitCSSMatrix ? a.m42 : 16 === s.length ? parseFloat(s[13]) : parseFloat(s[5]) : i) || 0
        },
        parseUrlQuery: function(e) {
            var t, s, i, a, n = {}, e = e || q.location.href;
            if ("string" == typeof e && e.length)
                for (a = (s = (e = -1 < e.indexOf("?") ? e.replace(/\S*\?/, "") : "").split("&").filter(function(e) {
                    return "" !== e
                })).length,
                t = 0; t < a; t += 1)
                    i = s[t].replace(/#\S+/g, "").split("="),
                    n[decodeURIComponent(i[0])] = void 0 === i[1] ? void 0 : decodeURIComponent(i[1]) || "";
            return n
        },
        isObject: function(e) {
            return "object" == typeof e && null !== e && e.constructor && e.constructor === Object
        },
        extend: function() {
            for (var e = [], t = arguments.length; t--; )
                e[t] = arguments[t];
            for (var s = Object(e[0]), i = 1; i < e.length; i += 1) {
                var a = e[i];
                if (null != a)
                    for (var n = Object.keys(Object(a)), r = 0, l = n.length; r < l; r += 1) {
                        var o = n[r]
                          , h = Object.getOwnPropertyDescriptor(a, o);
                        void 0 !== h && h.enumerable && (U.isObject(s[o]) && U.isObject(a[o]) ? U.extend(s[o], a[o]) : !U.isObject(s[o]) && U.isObject(a[o]) ? (s[o] = {},
                        U.extend(s[o], a[o])) : s[o] = a[o])
                    }
            }
            return s
        }
    }), w = {
        touch: !!("ontouchstart"in q || q.DocumentTouch && p instanceof q.DocumentTouch),
        pointerEvents: !!q.PointerEvent && "maxTouchPoints"in q.navigator && 0 <= q.navigator.maxTouchPoints,
        observer: "MutationObserver"in q || "WebkitMutationObserver"in q,
        passiveListener: function() {
            var e = !1;
            try {
                var t = Object.defineProperty({}, "passive", {
                    get: function() {
                        e = !0
                    }
                });
                q.addEventListener("testPassiveListener", null, t)
            } catch (e) {}
            return e
        }(),
        gestures: "ongesturestart"in q
    }, e = {
        components: {
            configurable: !0
        }
    }, e = (t.prototype.on = function(e, t, s) {
        var i, a = this;
        return "function" == typeof t && (i = s ? "unshift" : "push",
        e.split(" ").forEach(function(e) {
            a.eventsListeners[e] || (a.eventsListeners[e] = []),
            a.eventsListeners[e][i](t)
        })),
        a
    }
    ,
    t.prototype.once = function(s, i, e) {
        var a = this;
        return "function" != typeof i ? a : (n.f7proxy = i,
        a.on(s, n, e));
        function n() {
            for (var e = [], t = arguments.length; t--; )
                e[t] = arguments[t];
            a.off(s, n),
            n.f7proxy && delete n.f7proxy,
            i.apply(a, e)
        }
    }
    ,
    t.prototype.off = function(e, i) {
        var a = this;
        return a.eventsListeners && e.split(" ").forEach(function(s) {
            void 0 === i ? a.eventsListeners[s] = [] : a.eventsListeners[s] && a.eventsListeners[s].length && a.eventsListeners[s].forEach(function(e, t) {
                (e === i || e.f7proxy && e.f7proxy === i) && a.eventsListeners[s].splice(t, 1)
            })
        }),
        a
    }
    ,
    t.prototype.emit = function() {
        for (var e = [], t = arguments.length; t--; )
            e[t] = arguments[t];
        var s, i, a, n = this;
        return n.eventsListeners && (a = "string" == typeof e[0] || Array.isArray(e[0]) ? (s = e[0],
        i = e.slice(1, e.length),
        n) : (s = e[0].events,
        i = e[0].data,
        e[0].context || n),
        (Array.isArray(s) ? s : s.split(" ")).forEach(function(e) {
            var t;
            n.eventsListeners && n.eventsListeners[e] && (t = [],
            n.eventsListeners[e].forEach(function(e) {
                t.push(e)
            }),
            t.forEach(function(e) {
                e.apply(a, i)
            }))
        })),
        n
    }
    ,
    t.prototype.useModulesParams = function(t) {
        var s = this;
        s.modules && Object.keys(s.modules).forEach(function(e) {
            e = s.modules[e];
            e.params && U.extend(t, e.params)
        })
    }
    ,
    t.prototype.useModules = function(t) {
        void 0 === t && (t = {});
        var i = this;
        i.modules && Object.keys(i.modules).forEach(function(e) {
            var s = i.modules[e]
              , e = t[e] || {};
            s.instance && Object.keys(s.instance).forEach(function(e) {
                var t = s.instance[e];
                i[e] = "function" == typeof t ? t.bind(i) : t
            }),
            s.on && i.on && Object.keys(s.on).forEach(function(e) {
                i.on(e, s.on[e])
            }),
            s.create && s.create.bind(i)(e)
        })
    }
    ,
    e.components.set = function(e) {
        this.use && this.use(e)
    }
    ,
    t.installModule = function(t) {
        for (var e = [], s = arguments.length - 1; 0 < s--; )
            e[s] = arguments[s + 1];
        var i = this
          , a = (i.prototype.modules || (i.prototype.modules = {}),
        t.name || Object.keys(i.prototype.modules).length + "_" + U.now());
        return (i.prototype.modules[a] = t).proto && Object.keys(t.proto).forEach(function(e) {
            i.prototype[e] = t.proto[e]
        }),
        t.static && Object.keys(t.static).forEach(function(e) {
            i[e] = t.static[e]
        }),
        t.install && t.install.apply(i, e),
        i
    }
    ,
    t.use = function(e) {
        for (var t = [], s = arguments.length - 1; 0 < s--; )
            t[s] = arguments[s + 1];
        var i = this;
        return Array.isArray(e) ? (e.forEach(function(e) {
            return i.installModule(e)
        }),
        i) : i.installModule.apply(i, [e].concat(t))
    }
    ,
    Object.defineProperties(t, e),
    {
        updateSize: function() {
            var e = this.$el
              , t = void 0 !== this.params.width ? this.params.width : e[0].clientWidth
              , s = void 0 !== this.params.height ? this.params.height : e[0].clientHeight;
            0 === t && this.isHorizontal() || 0 === s && this.isVertical() || (t = t - parseInt(e.css("padding-left"), 10) - parseInt(e.css("padding-right"), 10),
            s = s - parseInt(e.css("padding-top"), 10) - parseInt(e.css("padding-bottom"), 10),
            U.extend(this, {
                width: t,
                height: s,
                size: this.isHorizontal() ? t : s
            }))
        },
        updateSlides: function() {
            var t = this.params
              , e = this.$wrapperEl
              , s = this.size
              , i = this.rtlTranslate
              , A = this.wrongRTL
              , a = this.virtual && t.virtual.enabled
              , G = (a ? this.virtual : this).slides.length
              , n = e.children("." + this.params.slideClass)
              , r = (a ? this.virtual.slides : n).length
              , l = []
              , o = []
              , h = [];
            function d(e) {
                return !t.cssMode || e !== n.length - 1
            }
            var p, c = t.slidesOffsetBefore, u = ("function" == typeof c && (c = t.slidesOffsetBefore.call(this)),
            t.slidesOffsetAfter), a = ("function" == typeof u && (u = t.slidesOffsetAfter.call(this)),
            this.snapGrid.length), B = this.snapGrid.length, m = t.spaceBetween, f = -c, v = 0, g = 0;
            if (void 0 !== s) {
                "string" == typeof m && 0 <= m.indexOf("%") && (m = parseFloat(m.replace("%", "")) / 100 * s),
                this.virtualSize = -m,
                i ? n.css({
                    marginLeft: "",
                    marginTop: ""
                }) : n.css({
                    marginRight: "",
                    marginBottom: ""
                }),
                1 < t.slidesPerColumn && (p = Math.floor(r / t.slidesPerColumn) === r / this.params.slidesPerColumn ? r : Math.ceil(r / t.slidesPerColumn) * t.slidesPerColumn,
                "auto" !== t.slidesPerView) && "row" === t.slidesPerColumnFill && (p = Math.max(p, t.slidesPerView * t.slidesPerColumn));
                for (var x, H, b, N, w = t.slidesPerColumn, V = p / w, X = Math.floor(r / t.slidesPerColumn), y = 0; y < r; y += 1) {
                    k = 0;
                    var E, T, C, S, M, $, k, z, P, L, Y, F, j, I = n.eq(y);
                    1 < t.slidesPerColumn && ($ = M = S = void 0,
                    "row" === t.slidesPerColumnFill && 1 < t.slidesPerGroup ? (C = Math.floor(y / (t.slidesPerGroup * t.slidesPerColumn)),
                    E = y - t.slidesPerColumn * t.slidesPerGroup * C,
                    T = 0 === C ? t.slidesPerGroup : Math.min(Math.ceil((r - C * w * t.slidesPerGroup) / w), t.slidesPerGroup),
                    S = (M = E - ($ = Math.floor(E / T)) * T + C * t.slidesPerGroup) + $ * p / w,
                    I.css({
                        "-webkit-box-ordinal-group": S,
                        "-moz-box-ordinal-group": S,
                        "-ms-flex-order": S,
                        "-webkit-order": S,
                        order: S
                    })) : "column" === t.slidesPerColumnFill ? ($ = y - (M = Math.floor(y / w)) * w,
                    (X < M || M === X && $ === w - 1) && ($ += 1) >= w && ($ = 0,
                    M += 1)) : M = y - ($ = Math.floor(y / V)) * V,
                    I.css("margin-" + (this.isHorizontal() ? "top" : "left"), 0 !== $ && t.spaceBetween && t.spaceBetween + "px")),
                    "none" !== I.css("display") && ("auto" === t.slidesPerView ? (E = q.getComputedStyle(I[0], null),
                    T = I[0].style.transform,
                    C = I[0].style.webkitTransform,
                    T && (I[0].style.transform = "none"),
                    C && (I[0].style.webkitTransform = "none"),
                    k = t.roundLengths ? this.isHorizontal() ? I.outerWidth(!0) : I.outerHeight(!0) : this.isHorizontal() ? (S = parseFloat(E.getPropertyValue("width")),
                    M = parseFloat(E.getPropertyValue("padding-left")),
                    $ = parseFloat(E.getPropertyValue("padding-right")),
                    P = parseFloat(E.getPropertyValue("margin-left")),
                    L = parseFloat(E.getPropertyValue("margin-right")),
                    (z = E.getPropertyValue("box-sizing")) && "border-box" === z ? S + P + L : S + M + $ + P + L) : (z = parseFloat(E.getPropertyValue("height")),
                    P = parseFloat(E.getPropertyValue("padding-top")),
                    L = parseFloat(E.getPropertyValue("padding-bottom")),
                    Y = parseFloat(E.getPropertyValue("margin-top")),
                    F = parseFloat(E.getPropertyValue("margin-bottom")),
                    (j = E.getPropertyValue("box-sizing")) && "border-box" === j ? z + Y + F : z + P + L + Y + F),
                    T && (I[0].style.transform = T),
                    C && (I[0].style.webkitTransform = C),
                    t.roundLengths && (k = Math.floor(k))) : (k = (s - (t.slidesPerView - 1) * m) / t.slidesPerView,
                    t.roundLengths && (k = Math.floor(k)),
                    n[y] && (this.isHorizontal() ? n[y].style.width = k + "px" : n[y].style.height = k + "px")),
                    n[y] && (n[y].swiperSlideSize = k),
                    h.push(k),
                    t.centeredSlides ? (f = f + k / 2 + v / 2 + m,
                    0 === v && 0 !== y && (f = f - s / 2 - m),
                    0 === y && (f = f - s / 2 - m),
                    Math.abs(f) < .001 && (f = 0),
                    t.roundLengths && (f = Math.floor(f)),
                    g % t.slidesPerGroup == 0 && l.push(f),
                    o.push(f)) : (t.roundLengths && (f = Math.floor(f)),
                    (g - Math.min(this.params.slidesPerGroupSkip, g)) % this.params.slidesPerGroup == 0 && l.push(f),
                    o.push(f),
                    f = f + k + m),
                    this.virtualSize += k + m,
                    v = k,
                    g += 1)
                }
                if (this.virtualSize = Math.max(this.virtualSize, s) + u,
                i && A && ("slide" === t.effect || "coverflow" === t.effect) && e.css({
                    width: this.virtualSize + t.spaceBetween + "px"
                }),
                t.setWrapperSize && (this.isHorizontal() ? e.css({
                    width: this.virtualSize + t.spaceBetween + "px"
                }) : e.css({
                    height: this.virtualSize + t.spaceBetween + "px"
                })),
                1 < t.slidesPerColumn && (this.virtualSize = (k + t.spaceBetween) * p,
                this.virtualSize = Math.ceil(this.virtualSize / t.slidesPerColumn) - t.spaceBetween,
                this.isHorizontal() ? e.css({
                    width: this.virtualSize + t.spaceBetween + "px"
                }) : e.css({
                    height: this.virtualSize + t.spaceBetween + "px"
                }),
                t.centeredSlides)) {
                    for (var D = [], O = 0; O < l.length; O += 1) {
                        var R = l[O];
                        t.roundLengths && (R = Math.floor(R)),
                        l[O] < this.virtualSize + l[0] && D.push(R)
                    }
                    l = D
                }
                if (!t.centeredSlides) {
                    D = [];
                    for (var _ = 0; _ < l.length; _ += 1) {
                        var W = l[_];
                        t.roundLengths && (W = Math.floor(W)),
                        l[_] <= this.virtualSize - s && D.push(W)
                    }
                    l = D,
                    1 < Math.floor(this.virtualSize - s) - Math.floor(l[l.length - 1]) && l.push(this.virtualSize - s)
                }
                0 === l.length && (l = [0]),
                0 !== t.spaceBetween && (this.isHorizontal() ? i ? n.filter(d).css({
                    marginLeft: m + "px"
                }) : n.filter(d).css({
                    marginRight: m + "px"
                }) : n.filter(d).css({
                    marginBottom: m + "px"
                })),
                t.centeredSlides && t.centeredSlidesBounds && (x = 0,
                h.forEach(function(e) {
                    x += e + (t.spaceBetween || 0)
                }),
                H = (x -= t.spaceBetween) - s,
                l = l.map(function(e) {
                    return e < 0 ? -c : H < e ? H + u : e
                })),
                t.centerInsufficientSlides && (b = 0,
                h.forEach(function(e) {
                    b += e + (t.spaceBetween || 0)
                }),
                (b -= t.spaceBetween) < s) && (N = (s - b) / 2,
                l.forEach(function(e, t) {
                    l[t] = e - N
                }),
                o.forEach(function(e, t) {
                    o[t] = e + N
                })),
                U.extend(this, {
                    slides: n,
                    snapGrid: l,
                    slidesGrid: o,
                    slidesSizesGrid: h
                }),
                r !== G && this.emit("slidesLengthChange"),
                l.length !== a && (this.params.watchOverflow && this.checkOverflow(),
                this.emit("snapGridLengthChange")),
                o.length !== B && this.emit("slidesGridLengthChange"),
                (t.watchSlidesProgress || t.watchSlidesVisibility) && this.updateSlidesOffset()
            }
        },
        updateAutoHeight: function(e) {
            var t, s, i = [], a = 0;
            if ("number" == typeof e ? this.setTransition(e) : !0 === e && this.setTransition(this.params.speed),
            "auto" !== this.params.slidesPerView && 1 < this.params.slidesPerView)
                if (this.params.centeredSlides)
                    this.visibleSlides.each(function(e, t) {
                        i.push(t)
                    });
                else
                    for (t = 0; t < Math.ceil(this.params.slidesPerView); t += 1) {
                        var n = this.activeIndex + t;
                        if (n > this.slides.length)
                            break;
                        i.push(this.slides.eq(n)[0])
                    }
            else
                i.push(this.slides.eq(this.activeIndex)[0]);
            for (t = 0; t < i.length; t += 1)
                void 0 !== i[t] && (a = a < (s = i[t].offsetHeight) ? s : a);
            a && this.$wrapperEl.css("height", a + "px")
        },
        updateSlidesOffset: function() {
            for (var e = this.slides, t = 0; t < e.length; t += 1)
                e[t].swiperSlideOffset = this.isHorizontal() ? e[t].offsetLeft : e[t].offsetTop
        },
        updateSlidesProgress: function(e) {
            void 0 === e && (e = this && this.translate || 0);
            var t = this.params
              , s = this.slides
              , i = this.rtlTranslate;
            if (0 !== s.length) {
                void 0 === s[0].swiperSlideOffset && this.updateSlidesOffset();
                var a = i ? e : -e;
                s.removeClass(t.slideVisibleClass),
                this.visibleSlidesIndexes = [],
                this.visibleSlides = [];
                for (var n = 0; n < s.length; n += 1) {
                    var r, l, o = s[n], h = (a + (t.centeredSlides ? this.minTranslate() : 0) - o.swiperSlideOffset) / (o.swiperSlideSize + t.spaceBetween);
                    (t.watchSlidesVisibility || t.centeredSlides && t.autoHeight) && (l = (r = -(a - o.swiperSlideOffset)) + this.slidesSizesGrid[n],
                    0 <= r && r < this.size - 1 || 1 < l && l <= this.size || r <= 0 && l >= this.size) && (this.visibleSlides.push(o),
                    this.visibleSlidesIndexes.push(n),
                    s.eq(n).addClass(t.slideVisibleClass)),
                    o.progress = i ? -h : h
                }
                this.visibleSlides = E(this.visibleSlides)
            }
        },
        updateProgress: function(e) {
            void 0 === e && (t = this.rtlTranslate ? -1 : 1,
            e = this && this.translate && this.translate * t || 0);
            var t = this.params
              , s = this.maxTranslate() - this.minTranslate()
              , i = this.progress
              , a = this.isBeginning
              , n = a
              , r = l = this.isEnd
              , l = 0 == s ? a = !(i = 0) : (a = (i = (e - this.minTranslate()) / s) <= 0,
            1 <= i);
            U.extend(this, {
                progress: i,
                isBeginning: a,
                isEnd: l
            }),
            (t.watchSlidesProgress || t.watchSlidesVisibility || t.centeredSlides && t.autoHeight) && this.updateSlidesProgress(e),
            a && !n && this.emit("reachBeginning toEdge"),
            l && !r && this.emit("reachEnd toEdge"),
            (n && !a || r && !l) && this.emit("fromEdge"),
            this.emit("progress", i)
        },
        updateSlidesClasses: function() {
            var e = this.slides
              , t = this.params
              , s = this.$wrapperEl
              , i = this.activeIndex
              , a = this.realIndex
              , n = this.virtual && t.virtual.enabled
              , i = (e.removeClass(t.slideActiveClass + " " + t.slideNextClass + " " + t.slidePrevClass + " " + t.slideDuplicateActiveClass + " " + t.slideDuplicateNextClass + " " + t.slideDuplicatePrevClass),
            (n = n ? this.$wrapperEl.find("." + t.slideClass + '[data-swiper-slide-index="' + i + '"]') : e.eq(i)).addClass(t.slideActiveClass),
            t.loop && (n.hasClass(t.slideDuplicateClass) ? s.children("." + t.slideClass + ":not(." + t.slideDuplicateClass + ')[data-swiper-slide-index="' + a + '"]') : s.children("." + t.slideClass + "." + t.slideDuplicateClass + '[data-swiper-slide-index="' + a + '"]')).addClass(t.slideDuplicateActiveClass),
            n.nextAll("." + t.slideClass).eq(0).addClass(t.slideNextClass))
              , a = (t.loop && 0 === i.length && (i = e.eq(0)).addClass(t.slideNextClass),
            n.prevAll("." + t.slideClass).eq(0).addClass(t.slidePrevClass));
            t.loop && 0 === a.length && (a = e.eq(-1)).addClass(t.slidePrevClass),
            t.loop && ((i.hasClass(t.slideDuplicateClass) ? s.children("." + t.slideClass + ":not(." + t.slideDuplicateClass + ')[data-swiper-slide-index="' + i.attr("data-swiper-slide-index") + '"]') : s.children("." + t.slideClass + "." + t.slideDuplicateClass + '[data-swiper-slide-index="' + i.attr("data-swiper-slide-index") + '"]')).addClass(t.slideDuplicateNextClass),
            (a.hasClass(t.slideDuplicateClass) ? s.children("." + t.slideClass + ":not(." + t.slideDuplicateClass + ')[data-swiper-slide-index="' + a.attr("data-swiper-slide-index") + '"]') : s.children("." + t.slideClass + "." + t.slideDuplicateClass + '[data-swiper-slide-index="' + a.attr("data-swiper-slide-index") + '"]')).addClass(t.slideDuplicatePrevClass))
        },
        updateActiveIndex: function(e) {
            var t = this.rtlTranslate ? this.translate : -this.translate
              , s = this.slidesGrid
              , i = this.snapGrid
              , a = this.params
              , n = this.activeIndex
              , r = this.realIndex
              , l = this.snapIndex
              , o = e;
            if (void 0 === o) {
                for (var h = 0; h < s.length; h += 1)
                    void 0 !== s[h + 1] ? t >= s[h] && t < s[h + 1] - (s[h + 1] - s[h]) / 2 ? o = h : t >= s[h] && t < s[h + 1] && (o = h + 1) : t >= s[h] && (o = h);
                a.normalizeSlideIndex && (o < 0 || void 0 === o) && (o = 0)
            }
            (e = 0 <= i.indexOf(t) ? i.indexOf(t) : (e = Math.min(a.slidesPerGroupSkip, o)) + Math.floor((o - e) / a.slidesPerGroup)) >= i.length && (e = i.length - 1),
            o !== n ? (a = parseInt(this.slides.eq(o).attr("data-swiper-slide-index") || o, 10),
            U.extend(this, {
                snapIndex: e,
                realIndex: a,
                previousIndex: n,
                activeIndex: o
            }),
            this.emit("activeIndexChange"),
            this.emit("snapIndexChange"),
            r !== a && this.emit("realIndexChange"),
            (this.initialized || this.params.runCallbacksOnInit) && this.emit("slideChange")) : e !== l && (this.snapIndex = e,
            this.emit("snapIndexChange"))
        },
        updateClickedSlide: function(e) {
            var t = this.params
              , s = E(e.target).closest("." + t.slideClass)[0]
              , i = !1;
            if (s)
                for (var a = 0; a < this.slides.length; a += 1)
                    this.slides[a] === s && (i = !0);
            s && i ? (this.clickedSlide = s,
            this.virtual && this.params.virtual.enabled ? this.clickedIndex = parseInt(E(s).attr("data-swiper-slide-index"), 10) : this.clickedIndex = E(s).index(),
            t.slideToClickedSlide && void 0 !== this.clickedIndex && this.clickedIndex !== this.activeIndex && this.slideToClickedSlide()) : (this.clickedSlide = void 0,
            this.clickedIndex = void 0)
        }
    }), G = {
        getTranslate: function(e) {
            void 0 === e && (e = this.isHorizontal() ? "x" : "y");
            var t = this.params
              , s = this.rtlTranslate
              , i = this.translate
              , a = this.$wrapperEl;
            return t.virtualTranslate ? s ? -i : i : t.cssMode ? i : (t = U.getTranslate(a[0], e),
            (t = s ? -t : t) || 0)
        },
        setTranslate: function(e, t) {
            var s = this.rtlTranslate
              , i = this.params
              , a = this.$wrapperEl
              , n = this.wrapperEl
              , r = this.progress
              , l = 0
              , o = 0
              , s = (this.isHorizontal() ? l = s ? -e : e : o = e,
            i.roundLengths && (l = Math.floor(l),
            o = Math.floor(o)),
            i.cssMode ? n[this.isHorizontal() ? "scrollLeft" : "scrollTop"] = this.isHorizontal() ? -l : -o : i.virtualTranslate || a.transform("translate3d(" + l + "px, " + o + "px, 0px)"),
            this.previousTranslate = this.translate,
            this.translate = this.isHorizontal() ? l : o,
            this.maxTranslate() - this.minTranslate());
            (0 == s ? 0 : (e - this.minTranslate()) / s) !== r && this.updateProgress(e),
            this.emit("setTranslate", this.translate, t)
        },
        minTranslate: function() {
            return -this.snapGrid[0]
        },
        maxTranslate: function() {
            return -this.snapGrid[this.snapGrid.length - 1]
        },
        translateTo: function(e, t, s, i, a) {
            void 0 === e && (e = 0),
            void 0 === t && (t = this.params.speed),
            void 0 === s && (s = !0),
            void 0 === i && (i = !0);
            var n, r, l = this, o = l.params, h = l.wrapperEl;
            return !(l.animating && o.preventInteractionOnTransition || (r = l.minTranslate(),
            n = l.maxTranslate(),
            l.updateProgress(r = i && r < e ? r : i && e < n ? n : e),
            o.cssMode ? (i = l.isHorizontal(),
            0 !== t && h.scrollTo ? h.scrollTo(((n = {})[i ? "left" : "top"] = -r,
            n.behavior = "smooth",
            n)) : h[i ? "scrollLeft" : "scrollTop"] = -r) : 0 === t ? (l.setTransition(0),
            l.setTranslate(r),
            s && (l.emit("beforeTransitionStart", t, a),
            l.emit("transitionEnd"))) : (l.setTransition(t),
            l.setTranslate(r),
            s && (l.emit("beforeTransitionStart", t, a),
            l.emit("transitionStart")),
            l.animating || (l.animating = !0,
            l.onTranslateToWrapperTransitionEnd || (l.onTranslateToWrapperTransitionEnd = function(e) {
                l && !l.destroyed && e.target === this && (l.$wrapperEl[0].removeEventListener("transitionend", l.onTranslateToWrapperTransitionEnd),
                l.$wrapperEl[0].removeEventListener("webkitTransitionEnd", l.onTranslateToWrapperTransitionEnd),
                l.onTranslateToWrapperTransitionEnd = null,
                delete l.onTranslateToWrapperTransitionEnd,
                s) && l.emit("transitionEnd")
            }
            ),
            l.$wrapperEl[0].addEventListener("transitionend", l.onTranslateToWrapperTransitionEnd),
            l.$wrapperEl[0].addEventListener("webkitTransitionEnd", l.onTranslateToWrapperTransitionEnd))),
            0))
        }
    }, B = {
        slideTo: function(e, t, s, i) {
            void 0 === t && (t = this.params.speed),
            void 0 === s && (s = !0);
            var a = this
              , n = e = void 0 === e ? 0 : e
              , e = (n < 0 && (n = 0),
            a.params)
              , r = a.snapGrid
              , l = a.slidesGrid
              , o = a.previousIndex
              , h = a.activeIndex
              , d = a.rtlTranslate
              , p = a.wrapperEl;
            if (a.animating && e.preventInteractionOnTransition)
                return !1;
            var c = Math.min(a.params.slidesPerGroupSkip, n)
              , c = c + Math.floor((n - c) / a.params.slidesPerGroup);
            c >= r.length && (c = r.length - 1),
            (h || e.initialSlide || 0) === (o || 0) && s && a.emit("beforeSlideChangeStart");
            var u, m = -r[c];
            if (a.updateProgress(m),
            e.normalizeSlideIndex)
                for (var f = 0; f < l.length; f += 1)
                    -Math.floor(100 * m) >= Math.floor(100 * l[f]) && (n = f);
            if (a.initialized && n !== h) {
                if (!a.allowSlideNext && m < a.translate && m < a.minTranslate())
                    return !1;
                if (!a.allowSlidePrev && m > a.translate && m > a.maxTranslate() && (h || 0) !== n)
                    return !1
            }
            return u = h < n ? "next" : n < h ? "prev" : "reset",
            d && -m === a.translate || !d && m === a.translate ? (a.updateActiveIndex(n),
            e.autoHeight && a.updateAutoHeight(),
            a.updateSlidesClasses(),
            "slide" !== e.effect && a.setTranslate(m),
            "reset" != u && (a.transitionStart(s, u),
            a.transitionEnd(s, u)),
            !1) : (e.cssMode ? (o = a.isHorizontal(),
            r = -m,
            d && (r = p.scrollWidth - p.offsetWidth - r),
            0 !== t && p.scrollTo ? p.scrollTo(((c = {})[o ? "left" : "top"] = r,
            c.behavior = "smooth",
            c)) : p[o ? "scrollLeft" : "scrollTop"] = r) : 0 === t ? (a.setTransition(0),
            a.setTranslate(m),
            a.updateActiveIndex(n),
            a.updateSlidesClasses(),
            a.emit("beforeTransitionStart", t, i),
            a.transitionStart(s, u),
            a.transitionEnd(s, u)) : (a.setTransition(t),
            a.setTranslate(m),
            a.updateActiveIndex(n),
            a.updateSlidesClasses(),
            a.emit("beforeTransitionStart", t, i),
            a.transitionStart(s, u),
            a.animating || (a.animating = !0,
            a.onSlideToWrapperTransitionEnd || (a.onSlideToWrapperTransitionEnd = function(e) {
                a && !a.destroyed && e.target === this && (a.$wrapperEl[0].removeEventListener("transitionend", a.onSlideToWrapperTransitionEnd),
                a.$wrapperEl[0].removeEventListener("webkitTransitionEnd", a.onSlideToWrapperTransitionEnd),
                a.onSlideToWrapperTransitionEnd = null,
                delete a.onSlideToWrapperTransitionEnd,
                a.transitionEnd(s, u))
            }
            ),
            a.$wrapperEl[0].addEventListener("transitionend", a.onSlideToWrapperTransitionEnd),
            a.$wrapperEl[0].addEventListener("webkitTransitionEnd", a.onSlideToWrapperTransitionEnd))),
            !0)
        },
        slideToLoop: function(e, t, s, i) {
            void 0 === t && (t = this.params.speed);
            e = void 0 === e ? 0 : e;
            return this.params.loop && (e += this.loopedSlides),
            this.slideTo(e, t, s = void 0 === s ? !0 : s, i)
        },
        slideNext: function(e, t, s) {
            void 0 === e && (e = this.params.speed),
            void 0 === t && (t = !0);
            var i = this.params
              , a = this.animating
              , n = this.activeIndex < i.slidesPerGroupSkip ? 1 : i.slidesPerGroup;
            if (i.loop) {
                if (a)
                    return !1;
                this.loopFix(),
                this._clientLeft = this.$wrapperEl[0].clientLeft
            }
            return this.slideTo(this.activeIndex + n, e, t, s)
        },
        slidePrev: function(e, t, s) {
            void 0 === e && (e = this.params.speed),
            void 0 === t && (t = !0);
            var i = this.params
              , a = this.animating
              , n = this.snapGrid
              , r = this.slidesGrid
              , l = this.rtlTranslate;
            if (i.loop) {
                if (a)
                    return !1;
                this.loopFix(),
                this._clientLeft = this.$wrapperEl[0].clientLeft
            }
            function o(e) {
                return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e)
            }
            var h, d = o(l ? this.translate : -this.translate), a = n.map(o), p = (r.map(o),
            n[a.indexOf(d)],
            n[a.indexOf(d) - 1]);
            return void 0 === p && i.cssMode && n.forEach(function(e) {
                !p && e <= d && (p = e)
            }),
            void 0 !== p && (h = r.indexOf(p)) < 0 && (h = this.activeIndex - 1),
            this.slideTo(h, e, t, s)
        },
        slideReset: function(e, t, s) {
            return void 0 === e && (e = this.params.speed),
            this.slideTo(this.activeIndex, e, t = void 0 === t ? !0 : t, s)
        },
        slideToClosest: function(e, t, s, i) {
            void 0 === e && (e = this.params.speed),
            void 0 === t && (t = !0),
            void 0 === i && (i = .5);
            var a, n = this.activeIndex, r = Math.min(this.params.slidesPerGroupSkip, n), r = r + Math.floor((n - r) / this.params.slidesPerGroup), l = this.rtlTranslate ? this.translate : -this.translate;
            return l >= this.snapGrid[r] ? l - (a = this.snapGrid[r]) > (this.snapGrid[r + 1] - a) * i && (n += this.params.slidesPerGroup) : l - (a = this.snapGrid[r - 1]) <= (this.snapGrid[r] - a) * i && (n -= this.params.slidesPerGroup),
            n = Math.max(n, 0),
            n = Math.min(n, this.slidesGrid.length - 1),
            this.slideTo(n, e, t, s)
        },
        slideToClickedSlide: function() {
            var e, t = this, s = t.params, i = t.$wrapperEl, a = "auto" === s.slidesPerView ? t.slidesPerViewDynamic() : s.slidesPerView, n = t.clickedIndex;
            s.loop ? t.animating || (e = parseInt(E(t.clickedSlide).attr("data-swiper-slide-index"), 10),
            s.centeredSlides ? n < t.loopedSlides - a / 2 || n > t.slides.length - t.loopedSlides + a / 2 ? (t.loopFix(),
            n = i.children("." + s.slideClass + '[data-swiper-slide-index="' + e + '"]:not(.' + s.slideDuplicateClass + ")").eq(0).index(),
            U.nextTick(function() {
                t.slideTo(n)
            })) : t.slideTo(n) : n > t.slides.length - a ? (t.loopFix(),
            n = i.children("." + s.slideClass + '[data-swiper-slide-index="' + e + '"]:not(.' + s.slideDuplicateClass + ")").eq(0).index(),
            U.nextTick(function() {
                t.slideTo(n)
            })) : t.slideTo(n)) : t.slideTo(n)
        }
    }, H = {
        loopCreate: function() {
            var i = this
              , e = i.params
              , t = i.$wrapperEl
              , a = (t.children("." + e.slideClass + "." + e.slideDuplicateClass).remove(),
            t.children("." + e.slideClass));
            if (e.loopFillGroupWithBlank) {
                var s = e.slidesPerGroup - a.length % e.slidesPerGroup;
                if (s !== e.slidesPerGroup) {
                    for (var n = 0; n < s; n += 1) {
                        var r = E(p.createElement("div")).addClass(e.slideClass + " " + e.slideBlankClass);
                        t.append(r)
                    }
                    a = t.children("." + e.slideClass)
                }
            }
            "auto" !== e.slidesPerView || e.loopedSlides || (e.loopedSlides = a.length),
            i.loopedSlides = Math.ceil(parseFloat(e.loopedSlides || e.slidesPerView, 10)),
            i.loopedSlides += e.loopAdditionalSlides,
            i.loopedSlides > a.length && (i.loopedSlides = a.length);
            var l = []
              , o = [];
            a.each(function(e, t) {
                var s = E(t);
                e < i.loopedSlides && o.push(t),
                e < a.length && e >= a.length - i.loopedSlides && l.push(t),
                s.attr("data-swiper-slide-index", e)
            });
            for (var h = 0; h < o.length; h += 1)
                t.append(E(o[h].cloneNode(!0)).addClass(e.slideDuplicateClass));
            for (var d = l.length - 1; 0 <= d; --d)
                t.prepend(E(l[d].cloneNode(!0)).addClass(e.slideDuplicateClass))
        },
        loopFix: function() {
            this.emit("beforeLoopFix");
            var e, t = this.activeIndex, s = this.slides, i = this.loopedSlides, a = this.allowSlidePrev, n = this.allowSlideNext, r = this.snapGrid, l = this.rtlTranslate, r = (this.allowSlidePrev = !0,
            this.allowSlideNext = !0,
            -r[t] - this.getTranslate());
            t < i ? (e = s.length - 3 * i + t,
            this.slideTo(e += i, 0, !1, !0) && 0 != r && this.setTranslate((l ? -this.translate : this.translate) - r)) : t >= s.length - i && (e = -s.length + t + i,
            this.slideTo(e += i, 0, !1, !0)) && 0 != r && this.setTranslate((l ? -this.translate : this.translate) - r),
            this.allowSlidePrev = a,
            this.allowSlideNext = n,
            this.emit("loopFix")
        },
        loopDestroy: function() {
            var e = this.$wrapperEl
              , t = this.params
              , s = this.slides;
            e.children("." + t.slideClass + "." + t.slideDuplicateClass + ",." + t.slideClass + "." + t.slideBlankClass).remove(),
            s.removeAttr("data-swiper-slide-index")
        }
    }, N = {
        setGrabCursor: function(e) {
            var t;
            w.touch || !this.params.simulateTouch || this.params.watchOverflow && this.isLocked || this.params.cssMode || ((t = this.el).style.cursor = "move",
            t.style.cursor = e ? "-webkit-grabbing" : "-webkit-grab",
            t.style.cursor = e ? "-moz-grabbin" : "-moz-grab",
            t.style.cursor = e ? "grabbing" : "grab")
        },
        unsetGrabCursor: function() {
            w.touch || this.params.watchOverflow && this.isLocked || this.params.cssMode || (this.el.style.cursor = "")
        }
    }, V = {
        appendSlide: function(e) {
            var t = this.$wrapperEl
              , s = this.params;
            if (s.loop && this.loopDestroy(),
            "object" == typeof e && "length"in e)
                for (var i = 0; i < e.length; i += 1)
                    e[i] && t.append(e[i]);
            else
                t.append(e);
            s.loop && this.loopCreate(),
            s.observer && w.observer || this.update()
        },
        prependSlide: function(e) {
            var t = this.params
              , s = this.$wrapperEl
              , i = this.activeIndex
              , a = (t.loop && this.loopDestroy(),
            i + 1);
            if ("object" == typeof e && "length"in e) {
                for (var n = 0; n < e.length; n += 1)
                    e[n] && s.prepend(e[n]);
                a = i + e.length
            } else
                s.prepend(e);
            t.loop && this.loopCreate(),
            t.observer && w.observer || this.update(),
            this.slideTo(a, 0, !1)
        },
        addSlide: function(e, t) {
            var s = this.$wrapperEl
              , i = this.params
              , a = this.activeIndex
              , n = (i.loop && (a -= this.loopedSlides,
            this.loopDestroy(),
            this.slides = s.children("." + i.slideClass)),
            this.slides.length);
            if (e <= 0)
                this.prependSlide(t);
            else if (n <= e)
                this.appendSlide(t);
            else {
                for (var r = e < a ? a + 1 : a, l = [], o = n - 1; e <= o; --o) {
                    var h = this.slides.eq(o);
                    h.remove(),
                    l.unshift(h)
                }
                if ("object" == typeof t && "length"in t) {
                    for (var d = 0; d < t.length; d += 1)
                        t[d] && s.append(t[d]);
                    r = e < a ? a + t.length : a
                } else
                    s.append(t);
                for (var p = 0; p < l.length; p += 1)
                    s.append(l[p]);
                i.loop && this.loopCreate(),
                i.observer && w.observer || this.update(),
                i.loop ? this.slideTo(r + this.loopedSlides, 0, !1) : this.slideTo(r, 0, !1)
            }
        },
        removeSlide: function(e) {
            var t = this.params
              , s = this.$wrapperEl
              , i = this.activeIndex;
            t.loop && (i -= this.loopedSlides,
            this.loopDestroy(),
            this.slides = s.children("." + t.slideClass));
            var a, n = i;
            if ("object" == typeof e && "length"in e)
                for (var r = 0; r < e.length; r += 1)
                    a = e[r],
                    this.slides[a] && this.slides.eq(a).remove(),
                    a < n && --n;
            else
                this.slides[a = e] && this.slides.eq(a).remove(),
                a < n && --n;
            n = Math.max(n, 0),
            t.loop && this.loopCreate(),
            t.observer && w.observer || this.update(),
            t.loop ? this.slideTo(n + this.loopedSlides, 0, !1) : this.slideTo(n, 0, !1)
        },
        removeAllSlides: function() {
            for (var e = [], t = 0; t < this.slides.length; t += 1)
                e.push(t);
            this.removeSlide(e)
        }
    }, l = (r = q.navigator.platform,
    D = q.navigator.userAgent,
    s = {
        ios: !1,
        android: !1,
        androidChrome: !1,
        desktop: !1,
        iphone: !1,
        ipod: !1,
        ipad: !1,
        edge: !1,
        ie: !1,
        firefox: !1,
        macos: !1,
        windows: !1,
        cordova: !(!q.cordova && !q.phonegap),
        phonegap: !(!q.cordova && !q.phonegap),
        electron: !1
    },
    c = q.screen.width,
    m = q.screen.height,
    f = D.match(/(Android);?[\s\/]+([\d.]+)?/),
    b = D.match(/(iPad).*OS\s([\d_]+)/),
    y = D.match(/(iPod)(.*OS\s([\d_]+))?/),
    g = !b && D.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
    K = 0 <= D.indexOf("MSIE ") || 0 <= D.indexOf("Trident/"),
    h = 0 <= D.indexOf("Edge/"),
    Z = 0 <= D.indexOf("Gecko/") && 0 <= D.indexOf("Firefox/"),
    a = "Win32" === r,
    _ = 0 <= D.toLowerCase().indexOf("electron"),
    r = "MacIntel" === r,
    !b && r && w.touch && (1024 === c && 1366 === m || 834 === c && 1194 === m || 834 === c && 1112 === m || 768 === c && 1024 === m) && (b = D.match(/(Version)\/([\d.]+)/),
    r = !1),
    s.ie = K,
    s.edge = h,
    s.firefox = Z,
    f && !a && (s.os = "android",
    s.osVersion = f[2],
    s.android = !0,
    s.androidChrome = 0 <= D.toLowerCase().indexOf("chrome")),
    (b || g || y) && (s.os = "ios",
    s.ios = !0),
    g && !y && (s.osVersion = g[2].replace(/_/g, "."),
    s.iphone = !0),
    b && (s.osVersion = b[2].replace(/_/g, "."),
    s.ipad = !0),
    y && (s.osVersion = y[3] ? y[3].replace(/_/g, ".") : null,
    s.ipod = !0),
    s.ios && s.osVersion && 0 <= D.indexOf("Version/") && "10" === s.osVersion.split(".")[0] && (s.osVersion = D.toLowerCase().split("version/")[1].split(" ")[0]),
    s.webView = !(!(g || b || y) || !D.match(/.*AppleWebKit(?!.*Safari)/i) && !q.navigator.standalone) || q.matchMedia && q.matchMedia("(display-mode: standalone)").matches,
    s.webview = s.webView,
    s.standalone = s.webView,
    s.desktop = !(s.ios || s.android) || _,
    s.desktop && (s.electron = _,
    s.macos = r,
    s.windows = a,
    s.macos && (s.os = "macos"),
    s.windows) && (s.os = "windows"),
    s.pixelRatio = q.devicePixelRatio || 1,
    s);
    function X() {
        var e, t, s = this.params, i = this.el;
        i && 0 === i.offsetWidth || (s.breakpoints && this.setBreakpoint(),
        i = this.allowSlideNext,
        e = this.allowSlidePrev,
        t = this.snapGrid,
        this.allowSlideNext = !0,
        this.allowSlidePrev = !0,
        this.updateSize(),
        this.updateSlides(),
        this.updateSlidesClasses(),
        ("auto" === s.slidesPerView || 1 < s.slidesPerView) && this.isEnd && !this.params.centeredSlides ? this.slideTo(this.slides.length - 1, 0, !1, !0) : this.slideTo(this.activeIndex, 0, !1, !0),
        this.autoplay && this.autoplay.running && this.autoplay.paused && this.autoplay.run(),
        this.allowSlidePrev = e,
        this.allowSlideNext = i,
        this.params.watchOverflow && t !== this.snapGrid && this.checkOverflow())
    }
    var Y = !1;
    function F() {}
    var h, d, c, j = {
        init: !0,
        direction: "horizontal",
        touchEventsTarget: "container",
        initialSlide: 0,
        speed: 300,
        cssMode: !1,
        updateOnWindowResize: !0,
        preventInteractionOnTransition: !1,
        edgeSwipeDetection: !1,
        edgeSwipeThreshold: 20,
        freeMode: !1,
        freeModeMomentum: !0,
        freeModeMomentumRatio: 1,
        freeModeMomentumBounce: !0,
        freeModeMomentumBounceRatio: 1,
        freeModeMomentumVelocityRatio: 1,
        freeModeSticky: !1,
        freeModeMinimumVelocity: .02,
        autoHeight: !1,
        setWrapperSize: !1,
        virtualTranslate: !1,
        effect: "slide",
        breakpoints: void 0,
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerColumnFill: "column",
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        centeredSlides: !1,
        centeredSlidesBounds: !1,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: !0,
        centerInsufficientSlides: !1,
        watchOverflow: !1,
        roundLengths: !1,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: !0,
        shortSwipes: !0,
        longSwipes: !0,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: !0,
        allowTouchMove: !0,
        threshold: 0,
        touchMoveStopPropagation: !1,
        touchStartPreventDefault: !0,
        touchStartForcePreventDefault: !1,
        touchReleaseOnEdges: !1,
        uniqueNavElements: !0,
        resistance: !0,
        resistanceRatio: .85,
        watchSlidesProgress: !1,
        watchSlidesVisibility: !1,
        grabCursor: !1,
        preventClicks: !0,
        preventClicksPropagation: !0,
        slideToClickedSlide: !1,
        preloadImages: !0,
        updateOnImagesReady: !0,
        loop: !1,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        loopFillGroupWithBlank: !1,
        allowSlidePrev: !0,
        allowSlideNext: !0,
        swipeHandler: null,
        noSwiping: !0,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: !0,
        containerModifierClass: "swiper-container-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-invisible-blank",
        slideActiveClass: "swiper-slide-active",
        slideDuplicateActiveClass: "swiper-slide-duplicate-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        slideNextClass: "swiper-slide-next",
        slideDuplicateNextClass: "swiper-slide-duplicate-next",
        slidePrevClass: "swiper-slide-prev",
        slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
        wrapperClass: "swiper-wrapper",
        runCallbacksOnInit: !0
    }, R = {
        update: e,
        translate: G,
        transition: {
            setTransition: function(e, t) {
                this.params.cssMode || this.$wrapperEl.transition(e),
                this.emit("setTransition", e, t)
            },
            transitionStart: function(e, t) {
                void 0 === e && (e = !0);
                var s = this.activeIndex
                  , i = this.params
                  , a = this.previousIndex;
                i.cssMode || (i.autoHeight && this.updateAutoHeight(),
                i = (i = t) || (a < s ? "next" : s < a ? "prev" : "reset"),
                this.emit("transitionStart"),
                e && s !== a && ("reset" === i ? this.emit("slideResetTransitionStart") : (this.emit("slideChangeTransitionStart"),
                "next" === i ? this.emit("slideNextTransitionStart") : this.emit("slidePrevTransitionStart"))))
            },
            transitionEnd: function(e, t) {
                void 0 === e && (e = !0);
                var s = this.activeIndex
                  , i = this.previousIndex
                  , a = this.params;
                this.animating = !1,
                a.cssMode || (this.setTransition(0),
                a = (a = t) || (i < s ? "next" : s < i ? "prev" : "reset"),
                this.emit("transitionEnd"),
                e && s !== i && ("reset" === a ? this.emit("slideResetTransitionEnd") : (this.emit("slideChangeTransitionEnd"),
                "next" === a ? this.emit("slideNextTransitionEnd") : this.emit("slidePrevTransitionEnd"))))
            }
        },
        slide: B,
        loop: H,
        grabCursor: N,
        manipulation: V,
        events: {
            attachEvents: function() {
                var e, t = this.params, s = this.touchEvents, i = this.el, a = this.wrapperEl, n = (this.onTouchStart = function(e) {
                    var t, s, i, a, n, r = this.touchEventsData, l = this.params, o = this.touches;
                    this.animating && l.preventInteractionOnTransition || (t = E((e = (e = e).originalEvent ? e.originalEvent : e).target),
                    "wrapper" === l.touchEventsTarget && !t.closest(this.wrapperEl).length) || (r.isTouchEvent = "touchstart" === e.type,
                    !r.isTouchEvent && "which"in e && 3 === e.which) || (!r.isTouchEvent && "button"in e && 0 < e.button || r.isTouched && r.isMoved) || (l.noSwiping && t.closest(l.noSwipingSelector || "." + l.noSwipingClass)[0] ? this.allowClick = !0 : l.swipeHandler && !t.closest(l.swipeHandler)[0] || (o.currentX = ("touchstart" === e.type ? e.targetTouches[0] : e).pageX,
                    o.currentY = ("touchstart" === e.type ? e.targetTouches[0] : e).pageY,
                    s = o.currentX,
                    i = o.currentY,
                    a = l.edgeSwipeDetection || l.iOSEdgeSwipeDetection,
                    n = l.edgeSwipeThreshold || l.iOSEdgeSwipeThreshold,
                    a && (s <= n || s >= q.screen.width - n)) || (U.extend(r, {
                        isTouched: !0,
                        isMoved: !1,
                        allowTouchCallbacks: !0,
                        isScrolling: void 0,
                        startMoving: void 0
                    }),
                    o.startX = s,
                    o.startY = i,
                    r.touchStartTime = U.now(),
                    this.allowClick = !0,
                    this.updateSize(),
                    this.swipeDirection = void 0,
                    0 < l.threshold && (r.allowThresholdMove = !1),
                    "touchstart" !== e.type && (a = !0,
                    t.is(r.formElements) && (a = !1),
                    p.activeElement && E(p.activeElement).is(r.formElements) && p.activeElement !== t[0] && p.activeElement.blur(),
                    n = a && this.allowTouchMove && l.touchStartPreventDefault,
                    l.touchStartForcePreventDefault || n) && e.preventDefault(),
                    this.emit("touchStart", e)))
                }
                .bind(this),
                this.onTouchMove = function(e) {
                    var t = this.touchEventsData
                      , s = this.params
                      , i = this.touches
                      , a = this.rtlTranslate;
                    if (e.originalEvent && (e = e.originalEvent),
                    t.isTouched) {
                        if (!t.isTouchEvent || "touchmove" === e.type) {
                            var n = "touchmove" === e.type && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0])
                              , r = ("touchmove" === e.type ? n : e).pageX
                              , n = ("touchmove" === e.type ? n : e).pageY;
                            if (e.preventedByNestedSwiper)
                                i.startX = r,
                                i.startY = n;
                            else if (this.allowTouchMove) {
                                if (t.isTouchEvent && s.touchReleaseOnEdges && !s.loop)
                                    if (this.isVertical()) {
                                        if (n < i.startY && this.translate <= this.maxTranslate() || n > i.startY && this.translate >= this.minTranslate())
                                            return t.isTouched = !1,
                                            void (t.isMoved = !1)
                                    } else if (r < i.startX && this.translate <= this.maxTranslate() || r > i.startX && this.translate >= this.minTranslate())
                                        return;
                                if (t.isTouchEvent && p.activeElement && e.target === p.activeElement && E(e.target).is(t.formElements))
                                    t.isMoved = !0,
                                    this.allowClick = !1;
                                else if (t.allowTouchCallbacks && this.emit("touchMove", e),
                                !(e.targetTouches && 1 < e.targetTouches.length)) {
                                    i.currentX = r,
                                    i.currentY = n;
                                    var l = i.currentX - i.startX
                                      , o = i.currentY - i.startY;
                                    if (!(this.params.threshold && Math.sqrt(Math.pow(l, 2) + Math.pow(o, 2)) < this.params.threshold))
                                        if (void 0 === t.isScrolling && (this.isHorizontal() && i.currentY === i.startY || this.isVertical() && i.currentX === i.startX ? t.isScrolling = !1 : 25 <= l * l + o * o && (h = 180 * Math.atan2(Math.abs(o), Math.abs(l)) / Math.PI,
                                        t.isScrolling = this.isHorizontal() ? h > s.touchAngle : 90 - h > s.touchAngle)),
                                        t.isScrolling && this.emit("touchMoveOpposite", e),
                                        void 0 !== t.startMoving || i.currentX === i.startX && i.currentY === i.startY || (t.startMoving = !0),
                                        t.isScrolling)
                                            t.isTouched = !1;
                                        else if (t.startMoving) {
                                            this.allowClick = !1,
                                            !s.cssMode && e.cancelable && e.preventDefault(),
                                            s.touchMoveStopPropagation && !s.nested && e.stopPropagation(),
                                            t.isMoved || (s.loop && this.loopFix(),
                                            t.startTranslate = this.getTranslate(),
                                            this.setTransition(0),
                                            this.animating && this.$wrapperEl.trigger("webkitTransitionEnd transitionend"),
                                            t.allowMomentumBounce = !1,
                                            !s.grabCursor || !0 !== this.allowSlideNext && !0 !== this.allowSlidePrev || this.setGrabCursor(!0),
                                            this.emit("sliderFirstMove", e)),
                                            this.emit("sliderMove", e),
                                            t.isMoved = !0;
                                            var h = this.isHorizontal() ? l : o
                                              , l = (i.diff = h,
                                            h *= s.touchRatio,
                                            this.swipeDirection = 0 < (h = a ? -h : h) ? "prev" : "next",
                                            t.currentTranslate = h + t.startTranslate,
                                            !0)
                                              , o = s.resistanceRatio;
                                            if (s.touchReleaseOnEdges && (o = 0),
                                            0 < h && t.currentTranslate > this.minTranslate() ? (l = !1,
                                            s.resistance && (t.currentTranslate = this.minTranslate() - 1 + Math.pow(-this.minTranslate() + t.startTranslate + h, o))) : h < 0 && t.currentTranslate < this.maxTranslate() && (l = !1,
                                            s.resistance) && (t.currentTranslate = this.maxTranslate() + 1 - Math.pow(this.maxTranslate() - t.startTranslate - h, o)),
                                            l && (e.preventedByNestedSwiper = !0),
                                            !this.allowSlideNext && "next" === this.swipeDirection && t.currentTranslate < t.startTranslate && (t.currentTranslate = t.startTranslate),
                                            !this.allowSlidePrev && "prev" === this.swipeDirection && t.currentTranslate > t.startTranslate && (t.currentTranslate = t.startTranslate),
                                            0 < s.threshold) {
                                                if (!(Math.abs(h) > s.threshold || t.allowThresholdMove))
                                                    return void (t.currentTranslate = t.startTranslate);
                                                if (!t.allowThresholdMove)
                                                    return t.allowThresholdMove = !0,
                                                    i.startX = i.currentX,
                                                    i.startY = i.currentY,
                                                    t.currentTranslate = t.startTranslate,
                                                    void (i.diff = this.isHorizontal() ? i.currentX - i.startX : i.currentY - i.startY)
                                            }
                                            s.followFinger && !s.cssMode && ((s.freeMode || s.watchSlidesProgress || s.watchSlidesVisibility) && (this.updateActiveIndex(),
                                            this.updateSlidesClasses()),
                                            s.freeMode && (0 === t.velocities.length && t.velocities.push({
                                                position: i[this.isHorizontal() ? "startX" : "startY"],
                                                time: t.touchStartTime
                                            }),
                                            t.velocities.push({
                                                position: i[this.isHorizontal() ? "currentX" : "currentY"],
                                                time: U.now()
                                            })),
                                            this.updateProgress(t.currentTranslate),
                                            this.setTranslate(t.currentTranslate))
                                        }
                                }
                            } else
                                this.allowClick = !1,
                                t.isTouched && (U.extend(i, {
                                    startX: r,
                                    startY: n,
                                    currentX: r,
                                    currentY: n
                                }),
                                t.touchStartTime = U.now())
                        }
                    } else
                        t.startMoving && t.isScrolling && this.emit("touchMoveOpposite", e)
                }
                .bind(this),
                this.onTouchEnd = function(e) {
                    var t = this
                      , s = t.touchEventsData
                      , i = t.params
                      , a = t.touches
                      , n = t.rtlTranslate
                      , r = t.$wrapperEl
                      , l = t.slidesGrid
                      , o = t.snapGrid;
                    if (e.originalEvent && (e = e.originalEvent),
                    s.allowTouchCallbacks && t.emit("touchEnd", e),
                    s.allowTouchCallbacks = !1,
                    s.isTouched) {
                        i.grabCursor && s.isMoved && s.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1);
                        var h, d = U.now(), p = d - s.touchStartTime;
                        if (t.allowClick && (t.updateClickedSlide(e),
                        t.emit("tap click", e),
                        p < 300) && d - s.lastClickTime < 300 && t.emit("doubleTap doubleClick", e),
                        s.lastClickTime = U.now(),
                        U.nextTick(function() {
                            t.destroyed || (t.allowClick = !0)
                        }),
                        s.isTouched && s.isMoved && t.swipeDirection && 0 !== a.diff && s.currentTranslate !== s.startTranslate) {
                            if (s.isTouched = !1,
                            s.isMoved = !1,
                            s.startMoving = !1,
                            h = i.followFinger ? n ? t.translate : -t.translate : -s.currentTranslate,
                            !i.cssMode)
                                if (i.freeMode)
                                    if (h < -t.minTranslate())
                                        t.slideTo(t.activeIndex);
                                    else if (h > -t.maxTranslate())
                                        t.slides.length < o.length ? t.slideTo(o.length - 1) : t.slideTo(t.slides.length - 1);
                                    else {
                                        if (i.freeModeMomentum) {
                                            (!(1 < s.velocities.length) || (d = s.velocities.pop(),
                                            a = s.velocities.pop(),
                                            c = d.position - a.position,
                                            a = d.time - a.time,
                                            t.velocity = c / a,
                                            t.velocity /= 2,
                                            Math.abs(t.velocity) < i.freeModeMinimumVelocity && (t.velocity = 0),
                                            150 < a) || 300 < U.now() - d.time) && (t.velocity = 0),
                                            t.velocity *= i.freeModeMomentumVelocityRatio,
                                            s.velocities.length = 0;
                                            var c = 1e3 * i.freeModeMomentumRatio
                                              , a = t.velocity * c
                                              , u = t.translate + a;
                                            n && (u = -u);
                                            var m, f, d = !1, a = 20 * Math.abs(t.velocity) * i.freeModeMomentumBounceRatio;
                                            if (u < t.maxTranslate())
                                                i.freeModeMomentumBounce ? (u + t.maxTranslate() < -a && (u = t.maxTranslate() - a),
                                                m = t.maxTranslate(),
                                                s.allowMomentumBounce = d = !0) : u = t.maxTranslate(),
                                                i.loop && i.centeredSlides && (f = !0);
                                            else if (u > t.minTranslate())
                                                i.freeModeMomentumBounce ? (u - t.minTranslate() > a && (u = t.minTranslate() + a),
                                                m = t.minTranslate(),
                                                s.allowMomentumBounce = d = !0) : u = t.minTranslate(),
                                                i.loop && i.centeredSlides && (f = !0);
                                            else if (i.freeModeSticky) {
                                                for (var v, g = 0; g < o.length; g += 1)
                                                    if (o[g] > -u) {
                                                        v = g;
                                                        break
                                                    }
                                                u = -(Math.abs(o[v] - u) < Math.abs(o[v - 1] - u) || "next" === t.swipeDirection ? o[v] : o[v - 1])
                                            }
                                            if (f && t.once("transitionEnd", function() {
                                                t.loopFix()
                                            }),
                                            0 !== t.velocity)
                                                c = n ? Math.abs((-u - t.translate) / t.velocity) : Math.abs((u - t.translate) / t.velocity),
                                                i.freeModeSticky && (c = (a = Math.abs((n ? -u : u) - t.translate)) < (f = t.slidesSizesGrid[t.activeIndex]) ? i.speed : a < 2 * f ? 1.5 * i.speed : 2.5 * i.speed);
                                            else if (i.freeModeSticky)
                                                return void t.slideToClosest();
                                            i.freeModeMomentumBounce && d ? (t.updateProgress(m),
                                            t.setTransition(c),
                                            t.setTranslate(u),
                                            t.transitionStart(!0, t.swipeDirection),
                                            t.animating = !0,
                                            r.transitionEnd(function() {
                                                t && !t.destroyed && s.allowMomentumBounce && (t.emit("momentumBounce"),
                                                t.setTransition(i.speed),
                                                setTimeout(function() {
                                                    t.setTranslate(m),
                                                    r.transitionEnd(function() {
                                                        t && !t.destroyed && t.transitionEnd()
                                                    })
                                                }, 0))
                                            })) : t.velocity ? (t.updateProgress(u),
                                            t.setTransition(c),
                                            t.setTranslate(u),
                                            t.transitionStart(!0, t.swipeDirection),
                                            t.animating || (t.animating = !0,
                                            r.transitionEnd(function() {
                                                t && !t.destroyed && t.transitionEnd()
                                            }))) : t.updateProgress(u),
                                            t.updateActiveIndex(),
                                            t.updateSlidesClasses()
                                        } else if (i.freeModeSticky)
                                            return void t.slideToClosest();
                                        (!i.freeModeMomentum || p >= i.longSwipesMs) && (t.updateProgress(),
                                        t.updateActiveIndex(),
                                        t.updateSlidesClasses())
                                    }
                                else {
                                    for (var x = 0, b = t.slidesSizesGrid[0], w = 0; w < l.length; w += w < i.slidesPerGroupSkip ? 1 : i.slidesPerGroup) {
                                        var y = w < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
                                        void 0 !== l[w + y] ? h >= l[w] && h < l[w + y] && (b = l[(x = w) + y] - l[w]) : h >= l[w] && (x = w,
                                        b = l[l.length - 1] - l[l.length - 2])
                                    }
                                    n = (h - l[x]) / b,
                                    a = x < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
                                    p > i.longSwipesMs ? i.longSwipes ? ("next" === t.swipeDirection && (n >= i.longSwipesRatio ? t.slideTo(x + a) : t.slideTo(x)),
                                    "prev" === t.swipeDirection && (n > 1 - i.longSwipesRatio ? t.slideTo(x + a) : t.slideTo(x))) : t.slideTo(t.activeIndex) : i.shortSwipes ? !t.navigation || e.target !== t.navigation.nextEl && e.target !== t.navigation.prevEl ? ("next" === t.swipeDirection && t.slideTo(x + a),
                                    "prev" === t.swipeDirection && t.slideTo(x)) : e.target === t.navigation.nextEl ? t.slideTo(x + a) : t.slideTo(x) : t.slideTo(t.activeIndex)
                                }
                        } else
                            s.isTouched = !1,
                            s.isMoved = !1,
                            s.startMoving = !1
                    } else
                        s.isMoved && i.grabCursor && t.setGrabCursor(!1),
                        s.isMoved = !1,
                        s.startMoving = !1
                }
                .bind(this),
                t.cssMode && (this.onScroll = function() {
                    var e = this.wrapperEl
                      , t = this.rtlTranslate;
                    this.previousTranslate = this.translate,
                    this.isHorizontal() ? this.translate = t ? e.scrollWidth - e.offsetWidth - e.scrollLeft : -e.scrollLeft : this.translate = -e.scrollTop,
                    -0 === this.translate && (this.translate = 0),
                    this.updateActiveIndex(),
                    this.updateSlidesClasses(),
                    (0 == (e = this.maxTranslate() - this.minTranslate()) ? 0 : (this.translate - this.minTranslate()) / e) !== this.progress && this.updateProgress(t ? -this.translate : this.translate),
                    this.emit("setTranslate", this.translate, !1)
                }
                .bind(this)),
                this.onClick = function(e) {
                    this.allowClick || (this.params.preventClicks && e.preventDefault(),
                    this.params.preventClicksPropagation && this.animating && (e.stopPropagation(),
                    e.stopImmediatePropagation()))
                }
                .bind(this),
                !!t.nested);
                !w.touch && w.pointerEvents ? (i.addEventListener(s.start, this.onTouchStart, !1),
                p.addEventListener(s.move, this.onTouchMove, n),
                p.addEventListener(s.end, this.onTouchEnd, !1)) : (w.touch && (e = !("touchstart" !== s.start || !w.passiveListener || !t.passiveListeners) && {
                    passive: !0,
                    capture: !1
                },
                i.addEventListener(s.start, this.onTouchStart, e),
                i.addEventListener(s.move, this.onTouchMove, w.passiveListener ? {
                    passive: !1,
                    capture: n
                } : n),
                i.addEventListener(s.end, this.onTouchEnd, e),
                s.cancel && i.addEventListener(s.cancel, this.onTouchEnd, e),
                Y || (p.addEventListener("touchstart", F),
                Y = !0)),
                (t.simulateTouch && !l.ios && !l.android || t.simulateTouch && !w.touch && l.ios) && (i.addEventListener("mousedown", this.onTouchStart, !1),
                p.addEventListener("mousemove", this.onTouchMove, n),
                p.addEventListener("mouseup", this.onTouchEnd, !1))),
                (t.preventClicks || t.preventClicksPropagation) && i.addEventListener("click", this.onClick, !0),
                t.cssMode && a.addEventListener("scroll", this.onScroll),
                t.updateOnWindowResize ? this.on(l.ios || l.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", X, !0) : this.on("observerUpdate", X, !0)
            },
            detachEvents: function() {
                var e, t = this.params, s = this.touchEvents, i = this.el, a = this.wrapperEl, n = !!t.nested;
                !w.touch && w.pointerEvents ? (i.removeEventListener(s.start, this.onTouchStart, !1),
                p.removeEventListener(s.move, this.onTouchMove, n),
                p.removeEventListener(s.end, this.onTouchEnd, !1)) : (w.touch && (e = !("onTouchStart" !== s.start || !w.passiveListener || !t.passiveListeners) && {
                    passive: !0,
                    capture: !1
                },
                i.removeEventListener(s.start, this.onTouchStart, e),
                i.removeEventListener(s.move, this.onTouchMove, n),
                i.removeEventListener(s.end, this.onTouchEnd, e),
                s.cancel) && i.removeEventListener(s.cancel, this.onTouchEnd, e),
                (t.simulateTouch && !l.ios && !l.android || t.simulateTouch && !w.touch && l.ios) && (i.removeEventListener("mousedown", this.onTouchStart, !1),
                p.removeEventListener("mousemove", this.onTouchMove, n),
                p.removeEventListener("mouseup", this.onTouchEnd, !1))),
                (t.preventClicks || t.preventClicksPropagation) && i.removeEventListener("click", this.onClick, !0),
                t.cssMode && a.removeEventListener("scroll", this.onScroll),
                this.off(l.ios || l.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", X)
            }
        },
        breakpoints: {
            setBreakpoint: function() {
                var e, s, t, i, a = this.activeIndex, n = this.initialized, r = this.loopedSlides, l = (void 0 === r && (r = 0),
                this.params), o = this.$el, h = l.breakpoints;
                h && 0 !== Object.keys(h).length && (e = this.getBreakpoint(h)) && this.currentBreakpoint !== e && ((s = e in h ? h[e] : void 0) && ["slidesPerView", "spaceBetween", "slidesPerGroup", "slidesPerGroupSkip", "slidesPerColumn"].forEach(function(e) {
                    var t = s[e];
                    void 0 !== t && (s[e] = "slidesPerView" !== e || "AUTO" !== t && "auto" !== t ? "slidesPerView" === e ? parseFloat(t) : parseInt(t, 10) : "auto")
                }),
                h = s || this.originalParams,
                t = 1 < l.slidesPerColumn,
                i = 1 < h.slidesPerColumn,
                t && !i ? o.removeClass(l.containerModifierClass + "multirow " + l.containerModifierClass + "multirow-column") : !t && i && (o.addClass(l.containerModifierClass + "multirow"),
                "column" === h.slidesPerColumnFill) && o.addClass(l.containerModifierClass + "multirow-column"),
                t = h.direction && h.direction !== l.direction,
                i = l.loop && (h.slidesPerView !== l.slidesPerView || t),
                t && n && this.changeDirection(),
                U.extend(this.params, h),
                U.extend(this, {
                    allowTouchMove: this.params.allowTouchMove,
                    allowSlideNext: this.params.allowSlideNext,
                    allowSlidePrev: this.params.allowSlidePrev
                }),
                this.currentBreakpoint = e,
                i && n && (this.loopDestroy(),
                this.loopCreate(),
                this.updateSlides(),
                this.slideTo(a - r + this.loopedSlides, 0, !1)),
                this.emit("breakpoint", h))
            },
            getBreakpoint: function(e) {
                if (e) {
                    var t = !1
                      , s = Object.keys(e).map(function(e) {
                        var t;
                        return "string" == typeof e && 0 === e.indexOf("@") ? (t = parseFloat(e.substr(1)),
                        {
                            value: q.innerHeight * t,
                            point: e
                        }) : {
                            value: e,
                            point: e
                        }
                    });
                    s.sort(function(e, t) {
                        return parseInt(e.value, 10) - parseInt(t.value, 10)
                    });
                    for (var i = 0; i < s.length; i += 1) {
                        var a = s[i]
                          , n = a.point;
                        a.value <= q.innerWidth && (t = n)
                    }
                    return t || "max"
                }
            }
        },
        checkOverflow: {
            checkOverflow: function() {
                var e = this.params
                  , t = this.isLocked
                  , s = 0 < this.slides.length && e.slidesOffsetBefore + e.spaceBetween * (this.slides.length - 1) + this.slides[0].offsetWidth * this.slides.length;
                e.slidesOffsetBefore && e.slidesOffsetAfter && s ? this.isLocked = s <= this.size : this.isLocked = 1 === this.snapGrid.length,
                this.allowSlideNext = !this.isLocked,
                this.allowSlidePrev = !this.isLocked,
                t !== this.isLocked && this.emit(this.isLocked ? "lock" : "unlock"),
                t && t !== this.isLocked && (this.isEnd = !1,
                this.navigation.update())
            }
        },
        classes: {
            addClasses: function() {
                var t = this.classNames
                  , s = this.params
                  , e = this.rtl
                  , i = this.$el
                  , a = [];
                a.push("initialized"),
                a.push(s.direction),
                s.freeMode && a.push("free-mode"),
                s.autoHeight && a.push("autoheight"),
                e && a.push("rtl"),
                1 < s.slidesPerColumn && (a.push("multirow"),
                "column" === s.slidesPerColumnFill) && a.push("multirow-column"),
                l.android && a.push("android"),
                l.ios && a.push("ios"),
                s.cssMode && a.push("css-mode"),
                a.forEach(function(e) {
                    t.push(s.containerModifierClass + e)
                }),
                i.addClass(t.join(" "))
            },
            removeClasses: function() {
                var e = this.$el
                  , t = this.classNames;
                e.removeClass(t.join(" "))
            }
        },
        images: {
            loadImage: function(e, t, s, i, a, n) {
                function r() {
                    n && n()
                }
                !(E(e).parent("picture")[0] || e.complete && a) && t ? ((e = new q.Image).onload = r,
                e.onerror = r,
                i && (e.sizes = i),
                s && (e.srcset = s),
                t && (e.src = t)) : r()
            },
            preloadImages: function() {
                var e = this;
                function t() {
                    null != e && e && !e.destroyed && (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1),
                    e.imagesLoaded === e.imagesToLoad.length) && (e.params.updateOnImagesReady && e.update(),
                    e.emit("imagesReady"))
                }
                e.imagesToLoad = e.$el.find("img");
                for (var s = 0; s < e.imagesToLoad.length; s += 1) {
                    var i = e.imagesToLoad[s];
                    e.loadImage(i, i.currentSrc || i.getAttribute("src"), i.srcset || i.getAttribute("srcset"), i.sizes || i.getAttribute("sizes"), !0, t)
                }
            }
        }
    }, W = {}, u = ((d = t) && (C.__proto__ = d),
    c = {
        extendedDefaults: {
            configurable: !0
        },
        defaults: {
            configurable: !0
        },
        Class: {
            configurable: !0
        },
        $: {
            configurable: !0
        }
    },
    ((C.prototype = Object.create(d && d.prototype)).constructor = C).prototype.slidesPerViewDynamic = function() {
        var e = this.params
          , t = this.slides
          , s = this.slidesGrid
          , i = this.size
          , a = this.activeIndex
          , n = 1;
        if (e.centeredSlides) {
            for (var r, l = t[a].swiperSlideSize, o = a + 1; o < t.length; o += 1)
                t[o] && !r && (n += 1,
                (l += t[o].swiperSlideSize) > i) && (r = !0);
            for (var h = a - 1; 0 <= h; --h)
                t[h] && !r && (n += 1,
                (l += t[h].swiperSlideSize) > i) && (r = !0)
        } else
            for (var d = a + 1; d < t.length; d += 1)
                s[d] - s[a] < i && (n += 1);
        return n
    }
    ,
    C.prototype.update = function() {
        var e, t, s = this;
        function i() {
            var e = s.rtlTranslate ? -1 * s.translate : s.translate
              , e = Math.min(Math.max(e, s.maxTranslate()), s.minTranslate());
            s.setTranslate(e),
            s.updateActiveIndex(),
            s.updateSlidesClasses()
        }
        s && !s.destroyed && (e = s.snapGrid,
        (t = s.params).breakpoints && s.setBreakpoint(),
        s.updateSize(),
        s.updateSlides(),
        s.updateProgress(),
        s.updateSlidesClasses(),
        s.params.freeMode ? (i(),
        s.params.autoHeight && s.updateAutoHeight()) : (("auto" === s.params.slidesPerView || 1 < s.params.slidesPerView) && s.isEnd && !s.params.centeredSlides ? s.slideTo(s.slides.length - 1, 0, !1, !0) : s.slideTo(s.activeIndex, 0, !1, !0)) || i(),
        t.watchOverflow && e !== s.snapGrid && s.checkOverflow(),
        s.emit("update"))
    }
    ,
    C.prototype.changeDirection = function(s, e) {
        void 0 === e && (e = !0);
        var t = this.params.direction;
        return (s = s || ("horizontal" === t ? "vertical" : "horizontal")) === t || "horizontal" !== s && "vertical" !== s || (this.$el.removeClass("" + this.params.containerModifierClass + t).addClass("" + this.params.containerModifierClass + s),
        this.params.direction = s,
        this.slides.each(function(e, t) {
            "vertical" === s ? t.style.width = "" : t.style.height = ""
        }),
        this.emit("changeDirection"),
        e && this.update()),
        this
    }
    ,
    C.prototype.init = function() {
        this.initialized || (this.emit("beforeInit"),
        this.params.breakpoints && this.setBreakpoint(),
        this.addClasses(),
        this.params.loop && this.loopCreate(),
        this.updateSize(),
        this.updateSlides(),
        this.params.watchOverflow && this.checkOverflow(),
        this.params.grabCursor && this.setGrabCursor(),
        this.params.preloadImages && this.preloadImages(),
        this.params.loop ? this.slideTo(this.params.initialSlide + this.loopedSlides, 0, this.params.runCallbacksOnInit) : this.slideTo(this.params.initialSlide, 0, this.params.runCallbacksOnInit),
        this.attachEvents(),
        this.initialized = !0,
        this.emit("init"))
    }
    ,
    C.prototype.destroy = function(e, t) {
        void 0 === e && (e = !0),
        void 0 === t && (t = !0);
        var s = this
          , i = s.params
          , a = s.$el
          , n = s.$wrapperEl
          , r = s.slides;
        return void 0 === s.params || s.destroyed || (s.emit("beforeDestroy"),
        s.initialized = !1,
        s.detachEvents(),
        i.loop && s.loopDestroy(),
        t && (s.removeClasses(),
        a.removeAttr("style"),
        n.removeAttr("style"),
        r) && r.length && r.removeClass([i.slideVisibleClass, i.slideActiveClass, i.slideNextClass, i.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index"),
        s.emit("destroy"),
        Object.keys(s.eventsListeners).forEach(function(e) {
            s.off(e)
        }),
        !1 !== e && (s.$el[0].swiper = null,
        s.$el.data("swiper", null),
        U.deleteProps(s)),
        s.destroyed = !0),
        null
    }
    ,
    C.extendDefaults = function(e) {
        U.extend(W, e)
    }
    ,
    c.extendedDefaults.get = function() {
        return W
    }
    ,
    c.defaults.get = function() {
        return j
    }
    ,
    c.Class.get = function() {
        return d
    }
    ,
    c.$.get = function() {
        return E
    }
    ,
    Object.defineProperties(C, c),
    C), m = {
        name: "device",
        proto: {
            device: l
        },
        static: {
            device: l
        }
    }, K = {
        name: "support",
        proto: {
            support: w
        },
        static: {
            support: w
        }
    }, T = {
        isEdge: !!q.navigator.userAgent.match(/Edge/g),
        isSafari: 0 <= (h = q.navigator.userAgent.toLowerCase()).indexOf("safari") && h.indexOf("chrome") < 0 && h.indexOf("android") < 0,
        isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(q.navigator.userAgent)
    }, Z = {
        name: "browser",
        proto: {
            browser: T
        },
        static: {
            browser: T
        }
    }, f = {
        name: "resize",
        create: function() {
            var e = this;
            U.extend(e, {
                resize: {
                    resizeHandler: function() {
                        e && !e.destroyed && e.initialized && (e.emit("beforeResize"),
                        e.emit("resize"))
                    },
                    orientationChangeHandler: function() {
                        e && !e.destroyed && e.initialized && e.emit("orientationchange")
                    }
                }
            })
        },
        on: {
            init: function() {
                q.addEventListener("resize", this.resize.resizeHandler),
                q.addEventListener("orientationchange", this.resize.orientationChangeHandler)
            },
            destroy: function() {
                q.removeEventListener("resize", this.resize.resizeHandler),
                q.removeEventListener("orientationchange", this.resize.orientationChangeHandler)
            }
        }
    }, v = {
        func: q.MutationObserver || q.WebkitMutationObserver,
        attach: function(e, t) {
            void 0 === t && (t = {});
            var s = this
              , i = new v.func(function(e) {
                var t;
                1 !== e.length ? (t = function() {
                    s.emit("observerUpdate", e[0])
                }
                ,
                q.requestAnimationFrame ? q.requestAnimationFrame(t) : q.setTimeout(t, 0)) : s.emit("observerUpdate", e[0])
            }
            );
            i.observe(e, {
                attributes: void 0 === t.attributes || t.attributes,
                childList: void 0 === t.childList || t.childList,
                characterData: void 0 === t.characterData || t.characterData
            }),
            s.observer.observers.push(i)
        },
        init: function() {
            if (w.observer && this.params.observer) {
                if (this.params.observeParents)
                    for (var e = this.$el.parents(), t = 0; t < e.length; t += 1)
                        this.observer.attach(e[t]);
                this.observer.attach(this.$el[0], {
                    childList: this.params.observeSlideChildren
                }),
                this.observer.attach(this.$wrapperEl[0], {
                    attributes: !1
                })
            }
        },
        destroy: function() {
            this.observer.observers.forEach(function(e) {
                e.disconnect()
            }),
            this.observer.observers = []
        }
    }, g = {
        name: "observer",
        params: {
            observer: !1,
            observeParents: !1,
            observeSlideChildren: !1
        },
        create: function() {
            U.extend(this, {
                observer: {
                    init: v.init.bind(this),
                    attach: v.attach.bind(this),
                    destroy: v.destroy.bind(this),
                    observers: []
                }
            })
        },
        on: {
            init: function() {
                this.observer.init()
            },
            destroy: function() {
                this.observer.destroy()
            }
        }
    }, x = {
        update: function(e) {
            var t = this
              , s = t.params
              , i = s.slidesPerView
              , a = s.slidesPerGroup
              , s = s.centeredSlides
              , n = t.params.virtual
              , r = n.addSlidesBefore
              , n = n.addSlidesAfter
              , l = t.virtual
              , o = l.from
              , h = l.to
              , d = l.slides
              , p = l.slidesGrid
              , c = l.renderSlide
              , l = l.offset;
            t.updateActiveIndex();
            var u, m = t.activeIndex || 0, f = t.rtlTranslate ? "right" : t.isHorizontal() ? "left" : "top", s = s ? (u = Math.floor(i / 2) + a + r,
            Math.floor(i / 2) + a + n) : (u = i + (a - 1) + r,
            a + n), v = Math.max((m || 0) - s, 0), g = Math.min((m || 0) + u, d.length - 1), i = (t.slidesGrid[v] || 0) - (t.slidesGrid[0] || 0);
            function x() {
                t.updateSlides(),
                t.updateProgress(),
                t.updateSlidesClasses(),
                t.lazy && t.params.lazy.enabled && t.lazy.load()
            }
            if (U.extend(t.virtual, {
                from: v,
                to: g,
                offset: i,
                slidesGrid: t.slidesGrid
            }),
            o !== v || h !== g || e) {
                if (t.params.virtual.renderExternal)
                    t.params.virtual.renderExternal.call(t, {
                        offset: i,
                        from: v,
                        to: g,
                        slides: function() {
                            for (var e = [], t = v; t <= g; t += 1)
                                e.push(d[t]);
                            return e
                        }()
                    });
                else {
                    var b = []
                      , w = [];
                    if (e)
                        t.$wrapperEl.find("." + t.params.slideClass).remove();
                    else
                        for (var y = o; y <= h; y += 1)
                            (y < v || g < y) && t.$wrapperEl.find("." + t.params.slideClass + '[data-swiper-slide-index="' + y + '"]').remove();
                    for (var E = 0; E < d.length; E += 1)
                        v <= E && E <= g && (void 0 === h || e ? w.push(E) : (h < E && w.push(E),
                        E < o && b.push(E)));
                    w.forEach(function(e) {
                        t.$wrapperEl.append(c(d[e], e))
                    }),
                    b.sort(function(e, t) {
                        return t - e
                    }).forEach(function(e) {
                        t.$wrapperEl.prepend(c(d[e], e))
                    }),
                    t.$wrapperEl.children(".swiper-slide").css(f, i + "px")
                }
                x()
            } else
                t.slidesGrid !== p && i !== l && t.slides.css(f, i + "px"),
                t.updateProgress()
        },
        renderSlide: function(e, t) {
            var s = this.params.virtual;
            return s.cache && this.virtual.cache[t] ? this.virtual.cache[t] : ((e = s.renderSlide ? E(s.renderSlide.call(this, e, t)) : E('<div class="' + this.params.slideClass + '" data-swiper-slide-index="' + t + '">' + e + "</div>")).attr("data-swiper-slide-index") || e.attr("data-swiper-slide-index", t),
            s.cache && (this.virtual.cache[t] = e),
            e)
        },
        appendSlide: function(e) {
            if ("object" == typeof e && "length"in e)
                for (var t = 0; t < e.length; t += 1)
                    e[t] && this.virtual.slides.push(e[t]);
            else
                this.virtual.slides.push(e);
            this.virtual.update(!0)
        },
        prependSlide: function(e) {
            var i, a, t = this.activeIndex, s = t + 1, n = 1;
            if (Array.isArray(e)) {
                for (var r = 0; r < e.length; r += 1)
                    e[r] && this.virtual.slides.unshift(e[r]);
                s = t + e.length,
                n = e.length
            } else
                this.virtual.slides.unshift(e);
            this.params.virtual.cache && (i = this.virtual.cache,
            a = {},
            Object.keys(i).forEach(function(e) {
                var t = i[e]
                  , s = t.attr("data-swiper-slide-index");
                s && t.attr("data-swiper-slide-index", parseInt(s, 10) + 1),
                a[parseInt(e, 10) + n] = t
            }),
            this.virtual.cache = a),
            this.virtual.update(!0),
            this.slideTo(s, 0)
        },
        removeSlide: function(e) {
            if (null != e) {
                var t = this.activeIndex;
                if (Array.isArray(e))
                    for (var s = e.length - 1; 0 <= s; --s)
                        this.virtual.slides.splice(e[s], 1),
                        this.params.virtual.cache && delete this.virtual.cache[e[s]],
                        e[s] < t && --t,
                        t = Math.max(t, 0);
                else
                    this.virtual.slides.splice(e, 1),
                    this.params.virtual.cache && delete this.virtual.cache[e],
                    e < t && --t,
                    t = Math.max(t, 0);
                this.virtual.update(!0),
                this.slideTo(t, 0)
            }
        },
        removeAllSlides: function() {
            this.virtual.slides = [],
            this.params.virtual.cache && (this.virtual.cache = {}),
            this.virtual.update(!0),
            this.slideTo(0, 0)
        }
    }, b = {
        name: "virtual",
        params: {
            virtual: {
                enabled: !1,
                slides: [],
                cache: !0,
                renderSlide: null,
                renderExternal: null,
                addSlidesBefore: 0,
                addSlidesAfter: 0
            }
        },
        create: function() {
            U.extend(this, {
                virtual: {
                    update: x.update.bind(this),
                    appendSlide: x.appendSlide.bind(this),
                    prependSlide: x.prependSlide.bind(this),
                    removeSlide: x.removeSlide.bind(this),
                    removeAllSlides: x.removeAllSlides.bind(this),
                    renderSlide: x.renderSlide.bind(this),
                    slides: this.params.virtual.slides,
                    cache: {}
                }
            })
        },
        on: {
            beforeInit: function() {
                var e;
                this.params.virtual.enabled && (this.classNames.push(this.params.containerModifierClass + "virtual"),
                U.extend(this.params, e = {
                    watchSlidesProgress: !0
                }),
                U.extend(this.originalParams, e),
                this.params.initialSlide || this.virtual.update())
            },
            setTranslate: function() {
                this.params.virtual.enabled && this.virtual.update()
            }
        }
    }, Q = {
        handle: function(e) {
            var t = this.rtlTranslate
              , s = (e = e.originalEvent ? e.originalEvent : e).keyCode || e.charCode;
            if (!this.allowSlideNext && (this.isHorizontal() && 39 === s || this.isVertical() && 40 === s || 34 === s))
                return !1;
            if (!this.allowSlidePrev && (this.isHorizontal() && 37 === s || this.isVertical() && 38 === s || 33 === s))
                return !1;
            if (!(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || p.activeElement && p.activeElement.nodeName && ("input" === p.activeElement.nodeName.toLowerCase() || "textarea" === p.activeElement.nodeName.toLowerCase()))) {
                if (this.params.keyboard.onlyInViewport && (33 === s || 34 === s || 37 === s || 39 === s || 38 === s || 40 === s)) {
                    var i = !1;
                    if (0 < this.$el.parents("." + this.params.slideClass).length && 0 === this.$el.parents("." + this.params.slideActiveClass).length)
                        return;
                    var a = q.innerWidth
                      , n = q.innerHeight
                      , r = this.$el.offset();
                    t && (r.left -= this.$el[0].scrollLeft);
                    for (var l = [[r.left, r.top], [r.left + this.width, r.top], [r.left, r.top + this.height], [r.left + this.width, r.top + this.height]], o = 0; o < l.length; o += 1) {
                        var h = l[o];
                        0 <= h[0] && h[0] <= a && 0 <= h[1] && h[1] <= n && (i = !0)
                    }
                    if (!i)
                        return
                }
                this.isHorizontal() ? (33 !== s && 34 !== s && 37 !== s && 39 !== s || (e.preventDefault ? e.preventDefault() : e.returnValue = !1),
                (34 !== s && 39 !== s || t) && (33 !== s && 37 !== s || !t) || this.slideNext(),
                (33 !== s && 37 !== s || t) && (34 !== s && 39 !== s || !t) || this.slidePrev()) : (33 !== s && 34 !== s && 38 !== s && 40 !== s || (e.preventDefault ? e.preventDefault() : e.returnValue = !1),
                34 !== s && 40 !== s || this.slideNext(),
                33 !== s && 38 !== s || this.slidePrev()),
                this.emit("keyPress", s)
            }
        },
        enable: function() {
            this.keyboard.enabled || (E(p).on("keydown", this.keyboard.handle),
            this.keyboard.enabled = !0)
        },
        disable: function() {
            this.keyboard.enabled && (E(p).off("keydown", this.keyboard.handle),
            this.keyboard.enabled = !1)
        }
    }, y = {
        name: "keyboard",
        params: {
            keyboard: {
                enabled: !1,
                onlyInViewport: !0
            }
        },
        create: function() {
            U.extend(this, {
                keyboard: {
                    enabled: !1,
                    enable: Q.enable.bind(this),
                    disable: Q.disable.bind(this),
                    handle: Q.handle.bind(this)
                }
            })
        },
        on: {
            init: function() {
                this.params.keyboard.enabled && this.keyboard.enable()
            },
            destroy: function() {
                this.keyboard.enabled && this.keyboard.disable()
            }
        }
    };
    function C() {
        for (var s, e = [], t = arguments.length; t--; )
            e[t] = arguments[t];
        s = (s = 1 === e.length && e[0].constructor && e[0].constructor === Object ? e[0] : (n = e[0],
        e[1])) || {},
        s = U.extend({}, s),
        n && !s.el && (s.el = n),
        d.call(this, s),
        Object.keys(R).forEach(function(t) {
            Object.keys(R[t]).forEach(function(e) {
                C.prototype[e] || (C.prototype[e] = R[t][e])
            })
        });
        var i, a, n, r = this, l = (void 0 === r.modules && (r.modules = {}),
        Object.keys(r.modules).forEach(function(e) {
            var t, e = r.modules[e];
            e.params && (t = Object.keys(e.params)[0],
            "object" == typeof (e = e.params[t])) && null !== e && t in s && "enabled"in e && (!0 === s[t] && (s[t] = {
                enabled: !0
            }),
            "object" != typeof s[t] || "enabled"in s[t] || (s[t].enabled = !0),
            s[t] || (s[t] = {
                enabled: !1
            }))
        }),
        U.extend({}, j)), o = (r.useModulesParams(l),
        r.params = U.extend({}, l, W, s),
        r.originalParams = U.extend({}, r.params),
        r.passedParams = U.extend({}, s),
        (r.$ = E)(r.params.el));
        if (n = o[0])
            return 1 < o.length ? (i = [],
            o.each(function(e, t) {
                t = U.extend({}, s, {
                    el: t
                });
                i.push(new C(t))
            }),
            i) : (n.swiper = r,
            o.data("swiper", r),
            n && n.shadowRoot && n.shadowRoot.querySelector ? (a = E(n.shadowRoot.querySelector("." + r.params.wrapperClass))).children = function(e) {
                return o.children(e)
            }
            : a = o.children("." + r.params.wrapperClass),
            U.extend(r, {
                $el: o,
                el: n,
                $wrapperEl: a,
                wrapperEl: a[0],
                classNames: [],
                slides: E(),
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal: function() {
                    return "horizontal" === r.params.direction
                },
                isVertical: function() {
                    return "vertical" === r.params.direction
                },
                rtl: "rtl" === n.dir.toLowerCase() || "rtl" === o.css("direction"),
                rtlTranslate: "horizontal" === r.params.direction && ("rtl" === n.dir.toLowerCase() || "rtl" === o.css("direction")),
                wrongRTL: "-webkit-box" === a.css("display"),
                activeIndex: 0,
                realIndex: 0,
                isBeginning: !0,
                isEnd: !1,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: !1,
                allowSlideNext: r.params.allowSlideNext,
                allowSlidePrev: r.params.allowSlidePrev,
                touchEvents: (l = w.pointerEvents ? ["pointerdown", "pointermove", "pointerup"] : ["mousedown", "mousemove", "mouseup"],
                r.touchEventsTouch = {
                    start: (n = ["touchstart", "touchmove", "touchend", "touchcancel"])[0],
                    move: n[1],
                    end: n[2],
                    cancel: n[3]
                },
                r.touchEventsDesktop = {
                    start: l[0],
                    move: l[1],
                    end: l[2]
                },
                w.touch || !r.params.simulateTouch ? r.touchEventsTouch : r.touchEventsDesktop),
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    formElements: "input, select, option, textarea, button, video, label",
                    lastClickTime: U.now(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    isTouchEvent: void 0,
                    startMoving: void 0
                },
                allowClick: !0,
                allowTouchMove: r.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            }),
            r.useModules(),
            r.params.init && r.init(),
            r)
    }
    var S = {
        lastScrollTime: U.now(),
        lastEventBeforeSnap: void 0,
        recentWheelEvents: [],
        event: function() {
            return -1 < q.navigator.userAgent.indexOf("firefox") ? "DOMMouseScroll" : ((t = "onwheel"in p) || ((e = p.createElement("div")).setAttribute("onwheel", "return;"),
            t = "function" == typeof e.onwheel),
            (t = !t && p.implementation && p.implementation.hasFeature && !0 !== p.implementation.hasFeature("", "") ? p.implementation.hasFeature("Events.wheel", "3.0") : t) ? "wheel" : "mousewheel");
            var e, t
        },
        normalize: function(e) {
            var t = 0
              , s = 0
              , i = 0
              , a = 0;
            return "detail"in e && (s = e.detail),
            "wheelDelta"in e && (s = -e.wheelDelta / 120),
            "wheelDeltaY"in e && (s = -e.wheelDeltaY / 120),
            "wheelDeltaX"in e && (t = -e.wheelDeltaX / 120),
            "axis"in e && e.axis === e.HORIZONTAL_AXIS && (t = s,
            s = 0),
            i = 10 * t,
            a = 10 * s,
            "deltaY"in e && (a = e.deltaY),
            "deltaX"in e && (i = e.deltaX),
            e.shiftKey && !i && (i = a,
            a = 0),
            (i || a) && e.deltaMode && (1 === e.deltaMode ? (i *= 40,
            a *= 40) : (i *= 800,
            a *= 800)),
            {
                spinX: t = i && !t ? i < 1 ? -1 : 1 : t,
                spinY: s = a && !s ? a < 1 ? -1 : 1 : s,
                pixelX: i,
                pixelY: a
            }
        },
        handleMouseEnter: function() {
            this.mouseEntered = !0
        },
        handleMouseLeave: function() {
            this.mouseEntered = !1
        },
        handle: function(e) {
            var t = e
              , s = this
              , i = s.params.mousewheel
              , a = (s.params.cssMode && t.preventDefault(),
            s.$el);
            if ("container" !== s.params.mousewheel.eventsTarged && (a = E(s.params.mousewheel.eventsTarged)),
            !s.mouseEntered && !a[0].contains(t.target) && !i.releaseOnEdges)
                return !0;
            t.originalEvent && (t = t.originalEvent);
            var a = 0
              , n = s.rtlTranslate ? -1 : 1
              , r = S.normalize(t);
            if (i.forceToAxis)
                if (s.isHorizontal()) {
                    if (!(Math.abs(r.pixelX) > Math.abs(r.pixelY)))
                        return !0;
                    a = r.pixelX * n
                } else {
                    if (!(Math.abs(r.pixelY) > Math.abs(r.pixelX)))
                        return !0;
                    a = r.pixelY
                }
            else
                a = Math.abs(r.pixelX) > Math.abs(r.pixelY) ? -r.pixelX * n : -r.pixelY;
            if (0 === a)
                return !0;
            if (i.invert && (a = -a),
            s.params.freeMode) {
                var l = {
                    time: U.now(),
                    delta: Math.abs(a),
                    direction: Math.sign(a)
                }
                  , n = s.mousewheel.lastEventBeforeSnap
                  , r = n && l.time < n.time + 500 && l.delta <= n.delta && l.direction === n.direction;
                if (!r) {
                    s.mousewheel.lastEventBeforeSnap = void 0,
                    s.params.loop && s.loopFix();
                    var o, h, n = s.getTranslate() + a * i.sensitivity, i = s.isBeginning, d = s.isEnd;
                    if ((n = n >= s.minTranslate() ? s.minTranslate() : n) <= s.maxTranslate() && (n = s.maxTranslate()),
                    s.setTransition(0),
                    s.setTranslate(n),
                    s.updateProgress(),
                    s.updateActiveIndex(),
                    s.updateSlidesClasses(),
                    (!i && s.isBeginning || !d && s.isEnd) && s.updateSlidesClasses(),
                    s.params.freeModeSticky && (clearTimeout(s.mousewheel.timeout),
                    s.mousewheel.timeout = void 0,
                    15 <= (o = s.mousewheel.recentWheelEvents).length && o.shift(),
                    i = o.length ? o[o.length - 1] : void 0,
                    d = o[0],
                    o.push(l),
                    i && (l.delta > i.delta || l.direction !== i.direction) ? o.splice(0) : 15 <= o.length && l.time - d.time < 500 && 1 <= d.delta - l.delta && l.delta <= 6 && (h = 0 < a ? .8 : .2,
                    s.mousewheel.lastEventBeforeSnap = l,
                    o.splice(0),
                    s.mousewheel.timeout = U.nextTick(function() {
                        s.slideToClosest(s.params.speed, !0, void 0, h)
                    }, 0)),
                    s.mousewheel.timeout || (s.mousewheel.timeout = U.nextTick(function() {
                        s.mousewheel.lastEventBeforeSnap = l,
                        o.splice(0),
                        s.slideToClosest(s.params.speed, !0, void 0, .5)
                    }, 500))),
                    r || s.emit("scroll", t),
                    s.params.autoplay && s.params.autoplayDisableOnInteraction && s.autoplay.stop(),
                    n === s.minTranslate() || n === s.maxTranslate())
                        return !0
                }
            } else {
                i = {
                    time: U.now(),
                    delta: Math.abs(a),
                    direction: Math.sign(a),
                    raw: e
                },
                d = s.mousewheel.recentWheelEvents,
                r = (2 <= d.length && d.shift(),
                d.length ? d[d.length - 1] : void 0);
                if (d.push(i),
                (!r || i.direction !== r.direction || i.delta > r.delta || i.time > r.time + 150) && s.mousewheel.animateSlider(i),
                s.mousewheel.releaseScroll(i))
                    return !0
            }
            return t.preventDefault ? t.preventDefault() : t.returnValue = !1,
            !1
        },
        animateSlider: function(e) {
            return 6 <= e.delta && U.now() - this.mousewheel.lastScrollTime < 60 || (e.direction < 0 ? this.isEnd && !this.params.loop || this.animating || (this.slideNext(),
            this.emit("scroll", e.raw)) : this.isBeginning && !this.params.loop || this.animating || (this.slidePrev(),
            this.emit("scroll", e.raw)),
            this.mousewheel.lastScrollTime = (new q.Date).getTime(),
            !1)
        },
        releaseScroll: function(e) {
            var t = this.params.mousewheel;
            if (e.direction < 0) {
                if (this.isEnd && !this.params.loop && t.releaseOnEdges)
                    return !0
            } else if (this.isBeginning && !this.params.loop && t.releaseOnEdges)
                return !0;
            return !1
        },
        enable: function() {
            var e, t = S.event();
            return this.params.cssMode ? (this.wrapperEl.removeEventListener(t, this.mousewheel.handle),
            !0) : !!t && !this.mousewheel.enabled && (e = this.$el,
            (e = "container" !== this.params.mousewheel.eventsTarged ? E(this.params.mousewheel.eventsTarged) : e).on("mouseenter", this.mousewheel.handleMouseEnter),
            e.on("mouseleave", this.mousewheel.handleMouseLeave),
            e.on(t, this.mousewheel.handle),
            this.mousewheel.enabled = !0)
        },
        disable: function() {
            var e, t = S.event();
            return this.params.cssMode ? (this.wrapperEl.addEventListener(t, this.mousewheel.handle),
            !0) : !!t && !(!this.mousewheel.enabled || (e = this.$el,
            (e = "container" !== this.params.mousewheel.eventsTarged ? E(this.params.mousewheel.eventsTarged) : e).off(t, this.mousewheel.handle),
            this.mousewheel.enabled = !1))
        }
    }
      , M = {
        update: function() {
            var e, t, s = this.params.navigation;
            this.params.loop || (e = (t = this.navigation).$nextEl,
            (t = t.$prevEl) && 0 < t.length && (this.isBeginning ? t.addClass(s.disabledClass) : t.removeClass(s.disabledClass),
            t[this.params.watchOverflow && this.isLocked ? "addClass" : "removeClass"](s.lockClass)),
            e && 0 < e.length && (this.isEnd ? e.addClass(s.disabledClass) : e.removeClass(s.disabledClass),
            e[this.params.watchOverflow && this.isLocked ? "addClass" : "removeClass"](s.lockClass)))
        },
        onPrevClick: function(e) {
            e.preventDefault(),
            this.isBeginning && !this.params.loop || this.slidePrev()
        },
        onNextClick: function(e) {
            e.preventDefault(),
            this.isEnd && !this.params.loop || this.slideNext()
        },
        init: function() {
            var e, t, s = this.params.navigation;
            (s.nextEl || s.prevEl) && (s.nextEl && (e = E(s.nextEl),
            this.params.uniqueNavElements) && "string" == typeof s.nextEl && 1 < e.length && 1 === this.$el.find(s.nextEl).length && (e = this.$el.find(s.nextEl)),
            s.prevEl && (t = E(s.prevEl),
            this.params.uniqueNavElements) && "string" == typeof s.prevEl && 1 < t.length && 1 === this.$el.find(s.prevEl).length && (t = this.$el.find(s.prevEl)),
            e && 0 < e.length && e.on("click", this.navigation.onNextClick),
            t && 0 < t.length && t.on("click", this.navigation.onPrevClick),
            U.extend(this.navigation, {
                $nextEl: e,
                nextEl: e && e[0],
                $prevEl: t,
                prevEl: t && t[0]
            }))
        },
        destroy: function() {
            var e = this.navigation
              , t = e.$nextEl
              , e = e.$prevEl;
            t && t.length && (t.off("click", this.navigation.onNextClick),
            t.removeClass(this.params.navigation.disabledClass)),
            e && e.length && (e.off("click", this.navigation.onPrevClick),
            e.removeClass(this.params.navigation.disabledClass))
        }
    }
      , $ = {
        update: function() {
            var e = this.rtl
              , i = this.params.pagination;
            if (i.el && this.pagination.el && this.pagination.$el && 0 !== this.pagination.$el.length) {
                var a, t = (this.virtual && this.params.virtual.enabled ? this.virtual : this).slides.length, s = this.pagination.$el, n = this.params.loop ? Math.ceil((t - 2 * this.loopedSlides) / this.params.slidesPerGroup) : this.snapGrid.length;
                if (this.params.loop ? ((a = Math.ceil((this.activeIndex - this.loopedSlides) / this.params.slidesPerGroup)) > t - 1 - 2 * this.loopedSlides && (a -= t - 2 * this.loopedSlides),
                n - 1 < a && (a -= n),
                a < 0 && "bullets" !== this.params.paginationType && (a = n + a)) : a = void 0 !== this.snapIndex ? this.snapIndex : this.activeIndex || 0,
                "bullets" === i.type && this.pagination.bullets && 0 < this.pagination.bullets.length) {
                    var r, l, o, h = this.pagination.bullets;
                    if (i.dynamicBullets && (this.pagination.bulletSize = h.eq(0)[this.isHorizontal() ? "outerWidth" : "outerHeight"](!0),
                    s.css(this.isHorizontal() ? "width" : "height", this.pagination.bulletSize * (i.dynamicMainBullets + 4) + "px"),
                    1 < i.dynamicMainBullets && void 0 !== this.previousIndex && (this.pagination.dynamicBulletIndex += a - this.previousIndex,
                    this.pagination.dynamicBulletIndex > i.dynamicMainBullets - 1 ? this.pagination.dynamicBulletIndex = i.dynamicMainBullets - 1 : this.pagination.dynamicBulletIndex < 0 && (this.pagination.dynamicBulletIndex = 0)),
                    r = a - this.pagination.dynamicBulletIndex,
                    o = ((l = r + (Math.min(h.length, i.dynamicMainBullets) - 1)) + r) / 2),
                    h.removeClass(i.bulletActiveClass + " " + i.bulletActiveClass + "-next " + i.bulletActiveClass + "-next-next " + i.bulletActiveClass + "-prev " + i.bulletActiveClass + "-prev-prev " + i.bulletActiveClass + "-main"),
                    1 < s.length)
                        h.each(function(e, t) {
                            var t = E(t)
                              , s = t.index();
                            s === a && t.addClass(i.bulletActiveClass),
                            i.dynamicBullets && (r <= s && s <= l && t.addClass(i.bulletActiveClass + "-main"),
                            s === r && t.prev().addClass(i.bulletActiveClass + "-prev").prev().addClass(i.bulletActiveClass + "-prev-prev"),
                            s === l) && t.next().addClass(i.bulletActiveClass + "-next").next().addClass(i.bulletActiveClass + "-next-next")
                        });
                    else {
                        var t = h.eq(a)
                          , d = t.index();
                        if (t.addClass(i.bulletActiveClass),
                        i.dynamicBullets) {
                            for (var t = h.eq(r), p = h.eq(l), c = r; c <= l; c += 1)
                                h.eq(c).addClass(i.bulletActiveClass + "-main");
                            if (this.params.loop)
                                if (d >= h.length - i.dynamicMainBullets) {
                                    for (var u = i.dynamicMainBullets; 0 <= u; --u)
                                        h.eq(h.length - u).addClass(i.bulletActiveClass + "-main");
                                    h.eq(h.length - i.dynamicMainBullets - 1).addClass(i.bulletActiveClass + "-prev")
                                } else
                                    t.prev().addClass(i.bulletActiveClass + "-prev").prev().addClass(i.bulletActiveClass + "-prev-prev"),
                                    p.next().addClass(i.bulletActiveClass + "-next").next().addClass(i.bulletActiveClass + "-next-next");
                            else
                                t.prev().addClass(i.bulletActiveClass + "-prev").prev().addClass(i.bulletActiveClass + "-prev-prev"),
                                p.next().addClass(i.bulletActiveClass + "-next").next().addClass(i.bulletActiveClass + "-next-next")
                        }
                    }
                    i.dynamicBullets && (d = Math.min(h.length, i.dynamicMainBullets + 4),
                    t = (this.pagination.bulletSize * d - this.pagination.bulletSize) / 2 - o * this.pagination.bulletSize,
                    p = e ? "right" : "left",
                    h.css(this.isHorizontal() ? p : "top", t + "px"))
                }
                "fraction" === i.type && (s.find("." + i.currentClass).text(i.formatFractionCurrent(a + 1)),
                s.find("." + i.totalClass).text(i.formatFractionTotal(n))),
                "progressbar" === i.type && (d = i.progressbarOpposite ? this.isHorizontal() ? "vertical" : "horizontal" : this.isHorizontal() ? "horizontal" : "vertical",
                o = (a + 1) / n,
                p = e = 1,
                "horizontal" == d ? e = o : p = o,
                s.find("." + i.progressbarFillClass).transform("translate3d(0,0,0) scaleX(" + e + ") scaleY(" + p + ")").transition(this.params.speed)),
                "custom" === i.type && i.renderCustom ? (s.html(i.renderCustom(this, a + 1, n)),
                this.emit("paginationRender", this, s[0])) : this.emit("paginationUpdate", this, s[0]),
                s[this.params.watchOverflow && this.isLocked ? "addClass" : "removeClass"](i.lockClass)
            }
        },
        render: function() {
            var e = this.params.pagination;
            if (e.el && this.pagination.el && this.pagination.$el && 0 !== this.pagination.$el.length) {
                var t = (this.virtual && this.params.virtual.enabled ? this.virtual : this).slides.length
                  , s = this.pagination.$el
                  , i = "";
                if ("bullets" === e.type) {
                    for (var a = this.params.loop ? Math.ceil((t - 2 * this.loopedSlides) / this.params.slidesPerGroup) : this.snapGrid.length, n = 0; n < a; n += 1)
                        e.renderBullet ? i += e.renderBullet.call(this, n, e.bulletClass) : i += "<" + e.bulletElement + ' class="' + e.bulletClass + '"></' + e.bulletElement + ">";
                    s.html(i),
                    this.pagination.bullets = s.find("." + e.bulletClass)
                }
                "fraction" === e.type && (i = e.renderFraction ? e.renderFraction.call(this, e.currentClass, e.totalClass) : '<span class="' + e.currentClass + '"></span> / <span class="' + e.totalClass + '"></span>',
                s.html(i)),
                "progressbar" === e.type && (i = e.renderProgressbar ? e.renderProgressbar.call(this, e.progressbarFillClass) : '<span class="' + e.progressbarFillClass + '"></span>',
                s.html(i)),
                "custom" !== e.type && this.emit("paginationRender", this.pagination.$el[0])
            }
        },
        init: function() {
            var e, t = this, s = t.params.pagination;
            s.el && 0 !== (e = E(s.el)).length && (t.params.uniqueNavElements && "string" == typeof s.el && 1 < e.length && 1 === t.$el.find(s.el).length && (e = t.$el.find(s.el)),
            "bullets" === s.type && s.clickable && e.addClass(s.clickableClass),
            e.addClass(s.modifierClass + s.type),
            "bullets" === s.type && s.dynamicBullets && (e.addClass("" + s.modifierClass + s.type + "-dynamic"),
            t.pagination.dynamicBulletIndex = 0,
            s.dynamicMainBullets < 1) && (s.dynamicMainBullets = 1),
            "progressbar" === s.type && s.progressbarOpposite && e.addClass(s.progressbarOppositeClass),
            s.clickable && e.on("click", "." + s.bulletClass, function(e) {
                e.preventDefault();
                e = E(this).index() * t.params.slidesPerGroup;
                t.params.loop && (e += t.loopedSlides),
                t.slideTo(e)
            }),
            U.extend(t.pagination, {
                $el: e,
                el: e[0]
            }))
        },
        destroy: function() {
            var e, t = this.params.pagination;
            t.el && this.pagination.el && this.pagination.$el && 0 !== this.pagination.$el.length && ((e = this.pagination.$el).removeClass(t.hiddenClass),
            e.removeClass(t.modifierClass + t.type),
            this.pagination.bullets && this.pagination.bullets.removeClass(t.bulletActiveClass),
            t.clickable) && e.off("click", "." + t.bulletClass)
        }
    }
      , k = {
        setTranslate: function() {
            var e, t, s, i, a, n, r, l;
            this.params.scrollbar.el && this.scrollbar.el && (n = this.scrollbar,
            e = this.rtlTranslate,
            l = this.progress,
            t = n.dragSize,
            s = n.trackSize,
            i = n.$dragEl,
            a = n.$el,
            n = this.params.scrollbar,
            l = (s - (r = t)) * l,
            e ? 0 < (l = -l) ? (r = t - l,
            l = 0) : s < -l + t && (r = s + l) : l < 0 ? (r = t + l,
            l = 0) : s < l + t && (r = s - l),
            this.isHorizontal() ? (i.transform("translate3d(" + l + "px, 0, 0)"),
            i[0].style.width = r + "px") : (i.transform("translate3d(0px, " + l + "px, 0)"),
            i[0].style.height = r + "px"),
            n.hide) && (clearTimeout(this.scrollbar.timeout),
            a[0].style.opacity = 1,
            this.scrollbar.timeout = setTimeout(function() {
                a[0].style.opacity = 0,
                a.transition(400)
            }, 1e3))
        },
        setTransition: function(e) {
            this.params.scrollbar.el && this.scrollbar.el && this.scrollbar.$dragEl.transition(e)
        },
        updateSize: function() {
            var e, t, s, i, a, n, r;
            this.params.scrollbar.el && this.scrollbar.el && (t = (e = this.scrollbar).$dragEl,
            s = e.$el,
            t[0].style.width = "",
            t[0].style.height = "",
            i = this.isHorizontal() ? s[0].offsetWidth : s[0].offsetHeight,
            n = (a = this.size / this.virtualSize) * (i / this.size),
            r = "auto" === this.params.scrollbar.dragSize ? i * a : parseInt(this.params.scrollbar.dragSize, 10),
            this.isHorizontal() ? t[0].style.width = r + "px" : t[0].style.height = r + "px",
            s[0].style.display = 1 <= a ? "none" : "",
            this.params.scrollbar.hide && (s[0].style.opacity = 0),
            U.extend(e, {
                trackSize: i,
                divider: a,
                moveDivider: n,
                dragSize: r
            }),
            e.$el[this.params.watchOverflow && this.isLocked ? "addClass" : "removeClass"](this.params.scrollbar.lockClass))
        },
        getPointerPosition: function(e) {
            return this.isHorizontal() ? ("touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0] : e).clientX : ("touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0] : e).clientY
        },
        setDragPosition: function(e) {
            var t = this.scrollbar
              , s = this.rtlTranslate
              , i = t.$el
              , a = t.dragSize
              , n = t.trackSize
              , r = t.dragStartPos
              , t = (t.getPointerPosition(e) - i.offset()[this.isHorizontal() ? "left" : "top"] - (null !== r ? r : a / 2)) / (n - a)
              , e = (t = Math.max(Math.min(t, 1), 0),
            s && (t = 1 - t),
            this.minTranslate() + (this.maxTranslate() - this.minTranslate()) * t);
            this.updateProgress(e),
            this.setTranslate(e),
            this.updateActiveIndex(),
            this.updateSlidesClasses()
        },
        onDragStart: function(e) {
            var t = this.params.scrollbar
              , s = this.scrollbar
              , i = this.$wrapperEl
              , a = s.$el
              , n = s.$dragEl;
            this.scrollbar.isTouched = !0,
            this.scrollbar.dragStartPos = e.target === n[0] || e.target === n ? s.getPointerPosition(e) - e.target.getBoundingClientRect()[this.isHorizontal() ? "left" : "top"] : null,
            e.preventDefault(),
            e.stopPropagation(),
            i.transition(100),
            n.transition(100),
            s.setDragPosition(e),
            clearTimeout(this.scrollbar.dragTimeout),
            a.transition(0),
            t.hide && a.css("opacity", 1),
            this.params.cssMode && this.$wrapperEl.css("scroll-snap-type", "none"),
            this.emit("scrollbarDragStart", e)
        },
        onDragMove: function(e) {
            var t = this.scrollbar
              , s = this.$wrapperEl
              , i = t.$el
              , a = t.$dragEl;
            this.scrollbar.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1,
            t.setDragPosition(e),
            s.transition(0),
            i.transition(0),
            a.transition(0),
            this.emit("scrollbarDragMove", e))
        },
        onDragEnd: function(e) {
            var t = this.params.scrollbar
              , s = this.scrollbar
              , i = this.$wrapperEl
              , a = s.$el;
            this.scrollbar.isTouched && (this.scrollbar.isTouched = !1,
            this.params.cssMode && (this.$wrapperEl.css("scroll-snap-type", ""),
            i.transition("")),
            t.hide && (clearTimeout(this.scrollbar.dragTimeout),
            this.scrollbar.dragTimeout = U.nextTick(function() {
                a.css("opacity", 0),
                a.transition(400)
            }, 1e3)),
            this.emit("scrollbarDragEnd", e),
            t.snapOnRelease) && this.slideToClosest()
        },
        enableDraggable: function() {
            var e, t, s, i, a;
            this.params.scrollbar.el && (s = this.scrollbar,
            e = this.touchEventsTouch,
            t = this.touchEventsDesktop,
            a = this.params,
            s = s.$el[0],
            i = !(!w.passiveListener || !a.passiveListeners) && {
                passive: !1,
                capture: !1
            },
            a = !(!w.passiveListener || !a.passiveListeners) && {
                passive: !0,
                capture: !1
            },
            w.touch ? (s.addEventListener(e.start, this.scrollbar.onDragStart, i),
            s.addEventListener(e.move, this.scrollbar.onDragMove, i),
            s.addEventListener(e.end, this.scrollbar.onDragEnd, a)) : (s.addEventListener(t.start, this.scrollbar.onDragStart, i),
            p.addEventListener(t.move, this.scrollbar.onDragMove, i),
            p.addEventListener(t.end, this.scrollbar.onDragEnd, a)))
        },
        disableDraggable: function() {
            var e, t, s, i, a;
            this.params.scrollbar.el && (s = this.scrollbar,
            e = this.touchEventsTouch,
            t = this.touchEventsDesktop,
            a = this.params,
            s = s.$el[0],
            i = !(!w.passiveListener || !a.passiveListeners) && {
                passive: !1,
                capture: !1
            },
            a = !(!w.passiveListener || !a.passiveListeners) && {
                passive: !0,
                capture: !1
            },
            w.touch ? (s.removeEventListener(e.start, this.scrollbar.onDragStart, i),
            s.removeEventListener(e.move, this.scrollbar.onDragMove, i),
            s.removeEventListener(e.end, this.scrollbar.onDragEnd, a)) : (s.removeEventListener(t.start, this.scrollbar.onDragStart, i),
            p.removeEventListener(t.move, this.scrollbar.onDragMove, i),
            p.removeEventListener(t.end, this.scrollbar.onDragEnd, a)))
        },
        init: function() {
            var e, t, s, i;
            this.params.scrollbar.el && (e = this.scrollbar,
            i = this.$el,
            s = E((t = this.params.scrollbar).el),
            0 === (i = (s = this.params.uniqueNavElements && "string" == typeof t.el && 1 < s.length && 1 === i.find(t.el).length ? i.find(t.el) : s).find("." + this.params.scrollbar.dragClass)).length && (i = E('<div class="' + this.params.scrollbar.dragClass + '"></div>'),
            s.append(i)),
            U.extend(e, {
                $el: s,
                el: s[0],
                $dragEl: i,
                dragEl: i[0]
            }),
            t.draggable) && e.enableDraggable()
        },
        destroy: function() {
            this.scrollbar.disableDraggable()
        }
    }
      , J = {
        setTransform: function(e, t) {
            var s = this.rtl
              , e = E(e)
              , s = s ? -1 : 1
              , i = e.attr("data-swiper-parallax") || "0"
              , a = e.attr("data-swiper-parallax-x")
              , n = e.attr("data-swiper-parallax-y")
              , r = e.attr("data-swiper-parallax-scale")
              , l = e.attr("data-swiper-parallax-opacity");
            a || n ? (a = a || "0",
            n = n || "0") : this.isHorizontal() ? (a = i,
            n = "0") : (n = i,
            a = "0"),
            a = 0 <= a.indexOf("%") ? parseInt(a, 10) * t * s + "%" : a * t * s + "px",
            n = 0 <= n.indexOf("%") ? parseInt(n, 10) * t + "%" : n * t + "px",
            null != l && (i = l - (l - 1) * (1 - Math.abs(t)),
            e[0].style.opacity = i),
            null == r ? e.transform("translate3d(" + a + ", " + n + ", 0px)") : (s = r - (r - 1) * (1 - Math.abs(t)),
            e.transform("translate3d(" + a + ", " + n + ", 0px) scale(" + s + ")"))
        },
        setTranslate: function() {
            var i = this
              , e = i.$el
              , t = i.slides
              , a = i.progress
              , n = i.snapGrid;
            e.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each(function(e, t) {
                i.parallax.setTransform(t, a)
            }),
            t.each(function(e, t) {
                var s = t.progress;
                1 < i.params.slidesPerGroup && "auto" !== i.params.slidesPerView && (s += Math.ceil(e / 2) - a * (n.length - 1)),
                s = Math.min(Math.max(s, -1), 1),
                E(t).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each(function(e, t) {
                    i.parallax.setTransform(t, s)
                })
            })
        },
        setTransition: function(i) {
            void 0 === i && (i = this.params.speed),
            this.$el.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each(function(e, t) {
                var t = E(t)
                  , s = parseInt(t.attr("data-swiper-parallax-duration"), 10) || i;
                0 === i && (s = 0),
                t.transition(s)
            })
        }
    }
      , ee = {
        getDistanceBetweenTouches: function(e) {
            var t, s, i;
            return e.targetTouches.length < 2 ? 1 : (t = e.targetTouches[0].pageX,
            s = e.targetTouches[0].pageY,
            i = e.targetTouches[1].pageX,
            e = e.targetTouches[1].pageY,
            Math.sqrt(Math.pow(i - t, 2) + Math.pow(e - s, 2)))
        },
        onGestureStart: function(e) {
            var t = this.params.zoom
              , s = this.zoom
              , i = s.gesture;
            if (s.fakeGestureTouched = !1,
            s.fakeGestureMoved = !1,
            !w.gestures) {
                if ("touchstart" !== e.type || "touchstart" === e.type && e.targetTouches.length < 2)
                    return;
                s.fakeGestureTouched = !0,
                i.scaleStart = ee.getDistanceBetweenTouches(e)
            }
            i.$slideEl && i.$slideEl.length || (i.$slideEl = E(e.target).closest("." + this.params.slideClass),
            0 === i.$slideEl.length && (i.$slideEl = this.slides.eq(this.activeIndex)),
            i.$imageEl = i.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"),
            i.$imageWrapEl = i.$imageEl.parent("." + t.containerClass),
            i.maxRatio = i.$imageWrapEl.attr("data-swiper-zoom") || t.maxRatio,
            0 !== i.$imageWrapEl.length) ? (i.$imageEl && i.$imageEl.transition(0),
            this.zoom.isScaling = !0) : i.$imageEl = void 0
        },
        onGestureChange: function(e) {
            var t = this.params.zoom
              , s = this.zoom
              , i = s.gesture;
            if (!w.gestures) {
                if ("touchmove" !== e.type || "touchmove" === e.type && e.targetTouches.length < 2)
                    return;
                s.fakeGestureMoved = !0,
                i.scaleMove = ee.getDistanceBetweenTouches(e)
            }
            i.$imageEl && 0 !== i.$imageEl.length && (s.scale = w.gestures ? e.scale * s.currentScale : i.scaleMove / i.scaleStart * s.currentScale,
            s.scale > i.maxRatio && (s.scale = i.maxRatio - 1 + Math.pow(s.scale - i.maxRatio + 1, .5)),
            s.scale < t.minRatio && (s.scale = t.minRatio + 1 - Math.pow(t.minRatio - s.scale + 1, .5)),
            i.$imageEl.transform("translate3d(0,0,0) scale(" + s.scale + ")"))
        },
        onGestureEnd: function(e) {
            var t = this.params.zoom
              , s = this.zoom
              , i = s.gesture;
            if (!w.gestures) {
                if (!s.fakeGestureTouched || !s.fakeGestureMoved)
                    return;
                if ("touchend" !== e.type || "touchend" === e.type && e.changedTouches.length < 2 && !l.android)
                    return;
                s.fakeGestureTouched = !1,
                s.fakeGestureMoved = !1
            }
            i.$imageEl && 0 !== i.$imageEl.length && (s.scale = Math.max(Math.min(s.scale, i.maxRatio), t.minRatio),
            i.$imageEl.transition(this.params.speed).transform("translate3d(0,0,0) scale(" + s.scale + ")"),
            s.currentScale = s.scale,
            s.isScaling = !1,
            1 === s.scale) && (i.$slideEl = void 0)
        },
        onTouchStart: function(e) {
            var t = this.zoom
              , s = t.gesture
              , t = t.image;
            s.$imageEl && 0 !== s.$imageEl.length && !t.isTouched && (l.android && e.cancelable && e.preventDefault(),
            t.isTouched = !0,
            t.touchesStart.x = ("touchstart" === e.type ? e.targetTouches[0] : e).pageX,
            t.touchesStart.y = ("touchstart" === e.type ? e.targetTouches[0] : e).pageY)
        },
        onTouchMove: function(e) {
            var t = this.zoom
              , s = t.gesture
              , i = t.image
              , a = t.velocity;
            if (s.$imageEl && 0 !== s.$imageEl.length && (this.allowClick = !1,
            i.isTouched) && s.$slideEl) {
                i.isMoved || (i.width = s.$imageEl[0].offsetWidth,
                i.height = s.$imageEl[0].offsetHeight,
                i.startX = U.getTranslate(s.$imageWrapEl[0], "x") || 0,
                i.startY = U.getTranslate(s.$imageWrapEl[0], "y") || 0,
                s.slideWidth = s.$slideEl[0].offsetWidth,
                s.slideHeight = s.$slideEl[0].offsetHeight,
                s.$imageWrapEl.transition(0),
                this.rtl && (i.startX = -i.startX,
                i.startY = -i.startY));
                var n = i.width * t.scale
                  , r = i.height * t.scale;
                if (!(n < s.slideWidth && r < s.slideHeight)) {
                    if (i.minX = Math.min(s.slideWidth / 2 - n / 2, 0),
                    i.maxX = -i.minX,
                    i.minY = Math.min(s.slideHeight / 2 - r / 2, 0),
                    i.maxY = -i.minY,
                    i.touchesCurrent.x = ("touchmove" === e.type ? e.targetTouches[0] : e).pageX,
                    i.touchesCurrent.y = ("touchmove" === e.type ? e.targetTouches[0] : e).pageY,
                    !i.isMoved && !t.isScaling) {
                        if (this.isHorizontal() && (Math.floor(i.minX) === Math.floor(i.startX) && i.touchesCurrent.x < i.touchesStart.x || Math.floor(i.maxX) === Math.floor(i.startX) && i.touchesCurrent.x > i.touchesStart.x))
                            return void (i.isTouched = !1);
                        if (!this.isHorizontal() && (Math.floor(i.minY) === Math.floor(i.startY) && i.touchesCurrent.y < i.touchesStart.y || Math.floor(i.maxY) === Math.floor(i.startY) && i.touchesCurrent.y > i.touchesStart.y))
                            return void (i.isTouched = !1)
                    }
                    e.cancelable && e.preventDefault(),
                    e.stopPropagation(),
                    i.isMoved = !0,
                    i.currentX = i.touchesCurrent.x - i.touchesStart.x + i.startX,
                    i.currentY = i.touchesCurrent.y - i.touchesStart.y + i.startY,
                    i.currentX < i.minX && (i.currentX = i.minX + 1 - Math.pow(i.minX - i.currentX + 1, .8)),
                    i.currentX > i.maxX && (i.currentX = i.maxX - 1 + Math.pow(i.currentX - i.maxX + 1, .8)),
                    i.currentY < i.minY && (i.currentY = i.minY + 1 - Math.pow(i.minY - i.currentY + 1, .8)),
                    i.currentY > i.maxY && (i.currentY = i.maxY - 1 + Math.pow(i.currentY - i.maxY + 1, .8)),
                    a.prevPositionX || (a.prevPositionX = i.touchesCurrent.x),
                    a.prevPositionY || (a.prevPositionY = i.touchesCurrent.y),
                    a.prevTime || (a.prevTime = Date.now()),
                    a.x = (i.touchesCurrent.x - a.prevPositionX) / (Date.now() - a.prevTime) / 2,
                    a.y = (i.touchesCurrent.y - a.prevPositionY) / (Date.now() - a.prevTime) / 2,
                    Math.abs(i.touchesCurrent.x - a.prevPositionX) < 2 && (a.x = 0),
                    Math.abs(i.touchesCurrent.y - a.prevPositionY) < 2 && (a.y = 0),
                    a.prevPositionX = i.touchesCurrent.x,
                    a.prevPositionY = i.touchesCurrent.y,
                    a.prevTime = Date.now(),
                    s.$imageWrapEl.transform("translate3d(" + i.currentX + "px, " + i.currentY + "px,0)")
                }
            }
        },
        onTouchEnd: function() {
            var e, t, s, i, a = this.zoom, n = a.gesture, r = a.image, l = a.velocity;
            n.$imageEl && 0 !== n.$imageEl.length && (r.isTouched && r.isMoved ? (r.isTouched = !1,
            r.isMoved = !1,
            e = l.x * (s = 300),
            e = r.currentX + e,
            t = l.y * (i = 300),
            t = r.currentY + t,
            0 !== l.x && (s = Math.abs((e - r.currentX) / l.x)),
            0 !== l.y && (i = Math.abs((t - r.currentY) / l.y)),
            l = Math.max(s, i),
            r.currentX = e,
            r.currentY = t,
            s = r.width * a.scale,
            i = r.height * a.scale,
            r.minX = Math.min(n.slideWidth / 2 - s / 2, 0),
            r.maxX = -r.minX,
            r.minY = Math.min(n.slideHeight / 2 - i / 2, 0),
            r.maxY = -r.minY,
            r.currentX = Math.max(Math.min(r.currentX, r.maxX), r.minX),
            r.currentY = Math.max(Math.min(r.currentY, r.maxY), r.minY),
            n.$imageWrapEl.transition(l).transform("translate3d(" + r.currentX + "px, " + r.currentY + "px,0)")) : (r.isTouched = !1,
            r.isMoved = !1))
        },
        onTransitionEnd: function() {
            var e = this.zoom
              , t = e.gesture;
            t.$slideEl && this.previousIndex !== this.activeIndex && (t.$imageEl && t.$imageEl.transform("translate3d(0,0,0) scale(1)"),
            t.$imageWrapEl && t.$imageWrapEl.transform("translate3d(0,0,0)"),
            e.scale = 1,
            e.currentScale = 1,
            t.$slideEl = void 0,
            t.$imageEl = void 0,
            t.$imageWrapEl = void 0)
        },
        toggle: function(e) {
            var t = this.zoom;
            t.scale && 1 !== t.scale ? t.out() : t.in(e)
        },
        in: function(e) {
            var t, s, i, a, n = this.zoom, r = this.params.zoom, l = n.gesture, o = n.image;
            l.$slideEl || (this.params.virtual && this.params.virtual.enabled && this.virtual ? l.$slideEl = this.$wrapperEl.children("." + this.params.slideActiveClass) : l.$slideEl = this.slides.eq(this.activeIndex),
            l.$imageEl = l.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"),
            l.$imageWrapEl = l.$imageEl.parent("." + r.containerClass)),
            l.$imageEl && 0 !== l.$imageEl.length && (l.$slideEl.addClass("" + r.zoomedSlideClass),
            o = void 0 === o.touchesStart.x && e ? (t = ("touchend" === e.type ? e.changedTouches[0] : e).pageX,
            ("touchend" === e.type ? e.changedTouches[0] : e).pageY) : (t = o.touchesStart.x,
            o.touchesStart.y),
            n.scale = l.$imageWrapEl.attr("data-swiper-zoom") || r.maxRatio,
            n.currentScale = l.$imageWrapEl.attr("data-swiper-zoom") || r.maxRatio,
            e ? (r = l.$slideEl[0].offsetWidth,
            e = l.$slideEl[0].offsetHeight,
            t = l.$slideEl.offset().left + r / 2 - t,
            o = l.$slideEl.offset().top + e / 2 - o,
            i = l.$imageEl[0].offsetWidth,
            a = l.$imageEl[0].offsetHeight,
            i = i * n.scale,
            a = a * n.scale,
            i = -(r = Math.min(r / 2 - i / 2, 0)),
            a = -(e = Math.min(e / 2 - a / 2, 0)),
            i < (s = (s = t * n.scale) < r ? r : s) && (s = i),
            a < (i = (i = o * n.scale) < e ? e : i) && (i = a)) : i = s = 0,
            l.$imageWrapEl.transition(300).transform("translate3d(" + s + "px, " + i + "px,0)"),
            l.$imageEl.transition(300).transform("translate3d(0,0,0) scale(" + n.scale + ")"))
        },
        out: function() {
            var e = this.zoom
              , t = this.params.zoom
              , s = e.gesture;
            s.$slideEl || (this.params.virtual && this.params.virtual.enabled && this.virtual ? s.$slideEl = this.$wrapperEl.children("." + this.params.slideActiveClass) : s.$slideEl = this.slides.eq(this.activeIndex),
            s.$imageEl = s.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"),
            s.$imageWrapEl = s.$imageEl.parent("." + t.containerClass)),
            s.$imageEl && 0 !== s.$imageEl.length && (e.scale = 1,
            e.currentScale = 1,
            s.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"),
            s.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"),
            s.$slideEl.removeClass("" + t.zoomedSlideClass),
            s.$slideEl = void 0)
        },
        enable: function() {
            var e, t, s, i = this.zoom;
            i.enabled || (i.enabled = !0,
            e = !("touchstart" !== this.touchEvents.start || !w.passiveListener || !this.params.passiveListeners) && {
                passive: !0,
                capture: !1
            },
            t = !w.passiveListener || {
                passive: !1,
                capture: !0
            },
            s = "." + this.params.slideClass,
            w.gestures ? (this.$wrapperEl.on("gesturestart", s, i.onGestureStart, e),
            this.$wrapperEl.on("gesturechange", s, i.onGestureChange, e),
            this.$wrapperEl.on("gestureend", s, i.onGestureEnd, e)) : "touchstart" === this.touchEvents.start && (this.$wrapperEl.on(this.touchEvents.start, s, i.onGestureStart, e),
            this.$wrapperEl.on(this.touchEvents.move, s, i.onGestureChange, t),
            this.$wrapperEl.on(this.touchEvents.end, s, i.onGestureEnd, e),
            this.touchEvents.cancel) && this.$wrapperEl.on(this.touchEvents.cancel, s, i.onGestureEnd, e),
            this.$wrapperEl.on(this.touchEvents.move, "." + this.params.zoom.containerClass, i.onTouchMove, t))
        },
        disable: function() {
            var e, t, s, i = this.zoom;
            i.enabled && (this.zoom.enabled = !1,
            e = !("touchstart" !== this.touchEvents.start || !w.passiveListener || !this.params.passiveListeners) && {
                passive: !0,
                capture: !1
            },
            t = !w.passiveListener || {
                passive: !1,
                capture: !0
            },
            s = "." + this.params.slideClass,
            w.gestures ? (this.$wrapperEl.off("gesturestart", s, i.onGestureStart, e),
            this.$wrapperEl.off("gesturechange", s, i.onGestureChange, e),
            this.$wrapperEl.off("gestureend", s, i.onGestureEnd, e)) : "touchstart" === this.touchEvents.start && (this.$wrapperEl.off(this.touchEvents.start, s, i.onGestureStart, e),
            this.$wrapperEl.off(this.touchEvents.move, s, i.onGestureChange, t),
            this.$wrapperEl.off(this.touchEvents.end, s, i.onGestureEnd, e),
            this.touchEvents.cancel) && this.$wrapperEl.off(this.touchEvents.cancel, s, i.onGestureEnd, e),
            this.$wrapperEl.off(this.touchEvents.move, "." + this.params.zoom.containerClass, i.onTouchMove, t))
        }
    }
      , te = {
        loadInSlide: function(e, o) {
            void 0 === o && (o = !0);
            var h, d = this, p = d.params.lazy;
            void 0 !== e && 0 !== d.slides.length && (e = (h = d.virtual && d.params.virtual.enabled ? d.$wrapperEl.children("." + d.params.slideClass + '[data-swiper-slide-index="' + e + '"]') : d.slides.eq(e)).find("." + p.elementClass + ":not(." + p.loadedClass + "):not(." + p.loadingClass + ")"),
            0 !== (e = !h.hasClass(p.elementClass) || h.hasClass(p.loadedClass) || h.hasClass(p.loadingClass) ? e : e.add(h[0])).length) && e.each(function(e, t) {
                var s = E(t)
                  , i = (s.addClass(p.loadingClass),
                s.attr("data-background"))
                  , a = s.attr("src")
                  , n = s.attr("srcset")
                  , r = s.attr("data-sizes")
                  , l = s.parent("picture");
                d.loadImage(s[0], a || i, n, r, !1, function() {
                    var e, t;
                    null == d || !d || d && !d.params || d.destroyed || (i ? (s.css("background-image", 'url("' + i + '")'),
                    s.removeAttr("data-background")) : (n && (s.attr("srcset", n),
                    s.removeAttr("srcset")),
                    r && (s.attr("sizes", r),
                    s.removeAttr("data-sizes")),
                    l.length && l.children("source").each(function(e, t) {
                        t = E(t);
                        t.attr("srcset") && (t.attr("srcset", t.attr("srcset")),
                        t.removeAttr("srcset"))
                    }),
                    a && (s.attr("src", a),
                    s.removeAttr("src"))),
                    s.addClass(p.loadedClass).removeClass(p.loadingClass),
                    h.find("." + p.preloaderClass).remove(),
                    d.params.loop && o && (e = h.attr("data-swiper-slide-index"),
                    h.hasClass(d.params.slideDuplicateClass) ? (t = d.$wrapperEl.children('[data-swiper-slide-index="' + e + '"]:not(.' + d.params.slideDuplicateClass + ")"),
                    d.lazy.loadInSlide(t.index(), !1)) : (t = d.$wrapperEl.children("." + d.params.slideDuplicateClass + '[data-swiper-slide-index="' + e + '"]'),
                    d.lazy.loadInSlide(t.index(), !1))),
                    d.emit("lazyImageReady", h[0], s[0]),
                    d.params.autoHeight && d.updateAutoHeight())
                }),
                d.emit("lazyImageLoad", h[0], s[0])
            })
        },
        load: function() {
            var s = this
              , t = s.$wrapperEl
              , i = s.params
              , a = s.slides
              , e = s.activeIndex
              , n = s.virtual && i.virtual.enabled
              , r = i.lazy
              , l = i.slidesPerView;
            function o(e) {
                if (n) {
                    if (t.children("." + i.slideClass + '[data-swiper-slide-index="' + e + '"]').length)
                        return 1
                } else if (a[e])
                    return 1
            }
            function h(e) {
                return n ? E(e).attr("data-swiper-slide-index") : E(e).index()
            }
            if ("auto" === l && (l = 0),
            s.lazy.initialImageLoaded || (s.lazy.initialImageLoaded = !0),
            s.params.watchSlidesVisibility)
                t.children("." + i.slideVisibleClass).each(function(e, t) {
                    t = n ? E(t).attr("data-swiper-slide-index") : E(t).index();
                    s.lazy.loadInSlide(t)
                });
            else if (1 < l)
                for (var d = e; d < e + l; d += 1)
                    o(d) && s.lazy.loadInSlide(d);
            else
                s.lazy.loadInSlide(e);
            if (r.loadPrevNext)
                if (1 < l || r.loadPrevNextAmount && 1 < r.loadPrevNextAmount) {
                    for (var r = r.loadPrevNextAmount, p = l, c = Math.min(e + p + Math.max(r, p), a.length), p = Math.max(e - Math.max(p, r), 0), u = e + l; u < c; u += 1)
                        o(u) && s.lazy.loadInSlide(u);
                    for (var m = p; m < e; m += 1)
                        o(m) && s.lazy.loadInSlide(m)
                } else {
                    r = t.children("." + i.slideNextClass),
                    p = (0 < r.length && s.lazy.loadInSlide(h(r)),
                    t.children("." + i.slidePrevClass));
                    0 < p.length && s.lazy.loadInSlide(h(p))
                }
        }
    }
      , z = {
        LinearSpline: function(e, t) {
            var s, i, a, n, r;
            return this.x = e,
            this.y = t,
            this.lastIndex = e.length - 1,
            this.interpolate = function(e) {
                return e ? (r = function(e, t) {
                    for (i = -1,
                    s = e.length; 1 < s - i; )
                        e[a = s + i >> 1] <= t ? i = a : s = a;
                    return s
                }(this.x, e),
                n = r - 1,
                (e - this.x[n]) * (this.y[r] - this.y[n]) / (this.x[r] - this.x[n]) + this.y[n]) : 0
            }
            ,
            this
        },
        getInterpolateFunction: function(e) {
            this.controller.spline || (this.controller.spline = this.params.loop ? new z.LinearSpline(this.slidesGrid,e.slidesGrid) : new z.LinearSpline(this.snapGrid,e.snapGrid))
        },
        setTranslate: function(e, t) {
            var s, i, a = this, n = a.controller.control;
            function r(e) {
                var t = a.rtlTranslate ? -a.translate : a.translate;
                "slide" === a.params.controller.by && (a.controller.getInterpolateFunction(e),
                i = -a.controller.spline.interpolate(-t)),
                i && "container" !== a.params.controller.by || (s = (e.maxTranslate() - e.minTranslate()) / (a.maxTranslate() - a.minTranslate()),
                i = (t - a.minTranslate()) * s + e.minTranslate()),
                a.params.controller.inverse && (i = e.maxTranslate() - i),
                e.updateProgress(i),
                e.setTranslate(i, a),
                e.updateActiveIndex(),
                e.updateSlidesClasses()
            }
            if (Array.isArray(n))
                for (var l = 0; l < n.length; l += 1)
                    n[l] !== t && n[l]instanceof u && r(n[l]);
            else
                n instanceof u && t !== n && r(n)
        },
        setTransition: function(t, e) {
            var s, i = this, a = i.controller.control;
            function n(e) {
                e.setTransition(t, i),
                0 !== t && (e.transitionStart(),
                e.params.autoHeight && U.nextTick(function() {
                    e.updateAutoHeight()
                }),
                e.$wrapperEl.transitionEnd(function() {
                    a && (e.params.loop && "slide" === i.params.controller.by && e.loopFix(),
                    e.transitionEnd())
                }))
            }
            if (Array.isArray(a))
                for (s = 0; s < a.length; s += 1)
                    a[s] !== e && a[s]instanceof u && n(a[s]);
            else
                a instanceof u && e !== a && n(a)
        }
    }
      , se = {
        makeElFocusable: function(e) {
            return e.attr("tabIndex", "0"),
            e
        },
        makeElNotFocusable: function(e) {
            return e.attr("tabIndex", "-1"),
            e
        },
        addElRole: function(e, t) {
            return e.attr("role", t),
            e
        },
        addElLabel: function(e, t) {
            return e.attr("aria-label", t),
            e
        },
        disableEl: function(e) {
            return e.attr("aria-disabled", !0),
            e
        },
        enableEl: function(e) {
            return e.attr("aria-disabled", !1),
            e
        },
        onEnterKey: function(e) {
            var t = this.params.a11y;
            13 === e.keyCode && (e = E(e.target),
            this.navigation && this.navigation.$nextEl && e.is(this.navigation.$nextEl) && (this.isEnd && !this.params.loop || this.slideNext(),
            this.isEnd ? this.a11y.notify(t.lastSlideMessage) : this.a11y.notify(t.nextSlideMessage)),
            this.navigation && this.navigation.$prevEl && e.is(this.navigation.$prevEl) && (this.isBeginning && !this.params.loop || this.slidePrev(),
            this.isBeginning ? this.a11y.notify(t.firstSlideMessage) : this.a11y.notify(t.prevSlideMessage)),
            this.pagination) && e.is("." + this.params.pagination.bulletClass) && e[0].click()
        },
        notify: function(e) {
            var t = this.a11y.liveRegion;
            0 !== t.length && (t.html(""),
            t.html(e))
        },
        updateNavigation: function() {
            var e, t;
            !this.params.loop && this.navigation && (e = (t = this.navigation).$nextEl,
            (t = t.$prevEl) && 0 < t.length && (this.isBeginning ? (this.a11y.disableEl(t),
            this.a11y.makeElNotFocusable(t)) : (this.a11y.enableEl(t),
            this.a11y.makeElFocusable(t))),
            e) && 0 < e.length && (this.isEnd ? (this.a11y.disableEl(e),
            this.a11y.makeElNotFocusable(e)) : (this.a11y.enableEl(e),
            this.a11y.makeElFocusable(e)))
        },
        updatePagination: function() {
            var s = this
              , i = s.params.a11y;
            s.pagination && s.params.pagination.clickable && s.pagination.bullets && s.pagination.bullets.length && s.pagination.bullets.each(function(e, t) {
                t = E(t);
                s.a11y.makeElFocusable(t),
                s.a11y.addElRole(t, "button"),
                s.a11y.addElLabel(t, i.paginationBulletMessage.replace(/\{\{index\}\}/, t.index() + 1))
            })
        },
        init: function() {
            this.$el.append(this.a11y.liveRegion);
            var e, t, s = this.params.a11y;
            this.navigation && this.navigation.$nextEl && (e = this.navigation.$nextEl),
            this.navigation && this.navigation.$prevEl && (t = this.navigation.$prevEl),
            e && (this.a11y.makeElFocusable(e),
            this.a11y.addElRole(e, "button"),
            this.a11y.addElLabel(e, s.nextSlideMessage),
            e.on("keydown", this.a11y.onEnterKey)),
            t && (this.a11y.makeElFocusable(t),
            this.a11y.addElRole(t, "button"),
            this.a11y.addElLabel(t, s.prevSlideMessage),
            t.on("keydown", this.a11y.onEnterKey)),
            this.pagination && this.params.pagination.clickable && this.pagination.bullets && this.pagination.bullets.length && this.pagination.$el.on("keydown", "." + this.params.pagination.bulletClass, this.a11y.onEnterKey)
        },
        destroy: function() {
            var e, t;
            this.a11y.liveRegion && 0 < this.a11y.liveRegion.length && this.a11y.liveRegion.remove(),
            this.navigation && this.navigation.$nextEl && (e = this.navigation.$nextEl),
            this.navigation && this.navigation.$prevEl && (t = this.navigation.$prevEl),
            e && e.off("keydown", this.a11y.onEnterKey),
            t && t.off("keydown", this.a11y.onEnterKey),
            this.pagination && this.params.pagination.clickable && this.pagination.bullets && this.pagination.bullets.length && this.pagination.$el.off("keydown", "." + this.params.pagination.bulletClass, this.a11y.onEnterKey)
        }
    }
      , P = {
        init: function() {
            var e;
            this.params.history && (q.history && q.history.pushState ? ((e = this.history).initialized = !0,
            e.paths = P.getPathValues(),
            (e.paths.key || e.paths.value) && (e.scrollToSlide(0, e.paths.value, this.params.runCallbacksOnInit),
            this.params.history.replaceState || q.addEventListener("popstate", this.history.setHistoryPopState))) : (this.params.history.enabled = !1,
            this.params.hashNavigation.enabled = !0))
        },
        destroy: function() {
            this.params.history.replaceState || q.removeEventListener("popstate", this.history.setHistoryPopState)
        },
        setHistoryPopState: function() {
            this.history.paths = P.getPathValues(),
            this.history.scrollToSlide(this.params.speed, this.history.paths.value, !1)
        },
        getPathValues: function() {
            var e = q.location.pathname.slice(1).split("/").filter(function(e) {
                return "" !== e
            })
              , t = e.length;
            return {
                key: e[t - 2],
                value: e[t - 1]
            }
        },
        setHistory: function(e, t) {
            this.history.initialized && this.params.history.enabled && (t = this.slides.eq(t),
            t = P.slugify(t.attr("data-history")),
            q.location.pathname.includes(e) || (t = e + "/" + t),
            (e = q.history.state) && e.value === t || (this.params.history.replaceState ? q.history.replaceState({
                value: t
            }, null, t) : q.history.pushState({
                value: t
            }, null, t)))
        },
        slugify: function(e) {
            return e.toString().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "")
        },
        scrollToSlide: function(e, t, s) {
            if (t)
                for (var i = 0, a = this.slides.length; i < a; i += 1) {
                    var n = this.slides.eq(i);
                    P.slugify(n.attr("data-history")) !== t || n.hasClass(this.params.slideDuplicateClass) || (n = n.index(),
                    this.slideTo(n, e, s))
                }
            else
                this.slideTo(0, e, s)
        }
    }
      , L = {
        onHashCange: function() {
            this.emit("hashChange");
            var e = p.location.hash.replace("#", "");
            e !== this.slides.eq(this.activeIndex).attr("data-hash") && void 0 !== (e = this.$wrapperEl.children("." + this.params.slideClass + '[data-hash="' + e + '"]').index()) && this.slideTo(e)
        },
        setHash: function() {
            var e;
            this.hashNavigation.initialized && this.params.hashNavigation.enabled && (this.params.hashNavigation.replaceState && q.history && q.history.replaceState ? q.history.replaceState(null, null, "#" + this.slides.eq(this.activeIndex).attr("data-hash") || "") : (e = (e = this.slides.eq(this.activeIndex)).attr("data-hash") || e.attr("data-history"),
            p.location.hash = e || ""),
            this.emit("hashSet"))
        },
        init: function() {
            if (!(!this.params.hashNavigation.enabled || this.params.history && this.params.history.enabled)) {
                this.hashNavigation.initialized = !0;
                var e = p.location.hash.replace("#", "");
                if (e)
                    for (var t = 0, s = this.slides.length; t < s; t += 1) {
                        var i = this.slides.eq(t);
                        (i.attr("data-hash") || i.attr("data-history")) !== e || i.hasClass(this.params.slideDuplicateClass) || (i = i.index(),
                        this.slideTo(i, 0, this.params.runCallbacksOnInit, !0))
                    }
                this.params.hashNavigation.watchState && E(q).on("hashchange", this.hashNavigation.onHashCange)
            }
        },
        destroy: function() {
            this.params.hashNavigation.watchState && E(q).off("hashchange", this.hashNavigation.onHashCange)
        }
    }
      , I = {
        run: function() {
            var e = this
              , t = e.slides.eq(e.activeIndex)
              , s = e.params.autoplay.delay;
            t.attr("data-swiper-autoplay") && (s = t.attr("data-swiper-autoplay") || e.params.autoplay.delay),
            clearTimeout(e.autoplay.timeout),
            e.autoplay.timeout = U.nextTick(function() {
                e.params.autoplay.reverseDirection ? e.params.loop ? (e.loopFix(),
                e.slidePrev(e.params.speed, !0, !0),
                e.emit("autoplay")) : e.isBeginning ? e.params.autoplay.stopOnLastSlide ? e.autoplay.stop() : (e.slideTo(e.slides.length - 1, e.params.speed, !0, !0),
                e.emit("autoplay")) : (e.slidePrev(e.params.speed, !0, !0),
                e.emit("autoplay")) : e.params.loop ? (e.loopFix(),
                e.slideNext(e.params.speed, !0, !0),
                e.emit("autoplay")) : e.isEnd ? e.params.autoplay.stopOnLastSlide ? e.autoplay.stop() : (e.slideTo(0, e.params.speed, !0, !0),
                e.emit("autoplay")) : (e.slideNext(e.params.speed, !0, !0),
                e.emit("autoplay")),
                e.params.cssMode && e.autoplay.running && e.autoplay.run()
            }, s)
        },
        start: function() {
            return void 0 === this.autoplay.timeout && !this.autoplay.running && (this.autoplay.running = !0,
            this.emit("autoplayStart"),
            this.autoplay.run(),
            !0)
        },
        stop: function() {
            return !!this.autoplay.running && void 0 !== this.autoplay.timeout && (this.autoplay.timeout && (clearTimeout(this.autoplay.timeout),
            this.autoplay.timeout = void 0),
            this.autoplay.running = !1,
            this.emit("autoplayStop"),
            !0)
        },
        pause: function(e) {
            !this.autoplay.running || this.autoplay.paused || (this.autoplay.timeout && clearTimeout(this.autoplay.timeout),
            this.autoplay.paused = !0,
            0 !== e && this.params.autoplay.waitForTransition ? (this.$wrapperEl[0].addEventListener("transitionend", this.autoplay.onTransitionEnd),
            this.$wrapperEl[0].addEventListener("webkitTransitionEnd", this.autoplay.onTransitionEnd)) : (this.autoplay.paused = !1,
            this.autoplay.run()))
        }
    }
      , ie = {
        setTranslate: function() {
            for (var e = this.slides, t = 0; t < e.length; t += 1) {
                var s = this.slides.eq(t)
                  , i = -s[0].swiperSlideOffset
                  , a = (this.params.virtualTranslate || (i -= this.translate),
                0)
                  , n = (this.isHorizontal() || (a = i,
                i = 0),
                this.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(s[0].progress), 0) : 1 + Math.min(Math.max(s[0].progress, -1), 0));
                s.css({
                    opacity: n
                }).transform("translate3d(" + i + "px, " + a + "px, 0px)")
            }
        },
        setTransition: function(e) {
            var s, i = this, t = i.slides, a = i.$wrapperEl;
            t.transition(e),
            i.params.virtualTranslate && 0 !== e && (s = !1,
            t.transitionEnd(function() {
                if (!s && i && !i.destroyed) {
                    s = !0,
                    i.animating = !1;
                    for (var e = ["webkitTransitionEnd", "transitionend"], t = 0; t < e.length; t += 1)
                        a.trigger(e[t])
                }
            }))
        }
    }
      , ae = {
        setTranslate: function() {
            var e, t = this.$el, s = this.$wrapperEl, i = this.slides, a = this.width, n = this.height, r = this.rtlTranslate, l = this.size, o = this.params.cubeEffect, h = this.isHorizontal(), d = this.virtual && this.params.virtual.enabled, p = 0;
            o.shadow && (h ? (0 === (e = s.find(".swiper-cube-shadow")).length && (e = E('<div class="swiper-cube-shadow"></div>'),
            s.append(e)),
            e.css({
                height: a + "px"
            })) : 0 === (e = t.find(".swiper-cube-shadow")).length && (e = E('<div class="swiper-cube-shadow"></div>'),
            t.append(e)));
            for (var c, u = 0; u < i.length; u += 1) {
                var m = i.eq(u)
                  , f = u
                  , v = 90 * (f = d ? parseInt(m.attr("data-swiper-slide-index"), 10) : f)
                  , g = Math.floor(v / 360)
                  , x = (r && (v = -v,
                g = Math.floor(-v / 360)),
                Math.max(Math.min(m[0].progress, 1), -1))
                  , b = 0
                  , w = 0
                  , y = 0
                  , g = (f % 4 == 0 ? (b = 4 * -g * l,
                y = 0) : (f - 1) % 4 == 0 ? (b = 0,
                y = 4 * -g * l) : (f - 2) % 4 == 0 ? (b = l + 4 * g * l,
                y = l) : (f - 3) % 4 == 0 && (b = -l,
                y = 3 * l + 4 * l * g),
                r && (b = -b),
                h || (w = b,
                b = 0),
                "rotateX(" + (h ? 0 : -v) + "deg) rotateY(" + (h ? v : 0) + "deg) translate3d(" + b + "px, " + w + "px, " + y + "px)");
                x <= 1 && -1 < x && (p = 90 * f + 90 * x,
                r) && (p = 90 * -f - 90 * x),
                m.transform(g),
                o.slideShadows && (v = h ? m.find(".swiper-slide-shadow-left") : m.find(".swiper-slide-shadow-top"),
                b = h ? m.find(".swiper-slide-shadow-right") : m.find(".swiper-slide-shadow-bottom"),
                0 === v.length && (v = E('<div class="swiper-slide-shadow-' + (h ? "left" : "top") + '"></div>'),
                m.append(v)),
                0 === b.length && (b = E('<div class="swiper-slide-shadow-' + (h ? "right" : "bottom") + '"></div>'),
                m.append(b)),
                v.length && (v[0].style.opacity = Math.max(-x, 0)),
                b.length) && (b[0].style.opacity = Math.max(x, 0))
            }
            s.css({
                "-webkit-transform-origin": "50% 50% -" + l / 2 + "px",
                "-moz-transform-origin": "50% 50% -" + l / 2 + "px",
                "-ms-transform-origin": "50% 50% -" + l / 2 + "px",
                "transform-origin": "50% 50% -" + l / 2 + "px"
            }),
            o.shadow && (h ? e.transform("translate3d(0px, " + (a / 2 + o.shadowOffset) + "px, " + -a / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + o.shadowScale + ")") : (t = Math.abs(p) - 90 * Math.floor(Math.abs(p) / 90),
            a = 1.5 - (Math.sin(2 * t * Math.PI / 360) / 2 + Math.cos(2 * t * Math.PI / 360) / 2),
            t = o.shadowScale,
            a = o.shadowScale / a,
            c = o.shadowOffset,
            e.transform("scale3d(" + t + ", 1, " + a + ") translate3d(0px, " + (n / 2 + c) + "px, " + -n / 2 / a + "px) rotateX(-90deg)"))),
            s.transform("translate3d(0px,0," + (T.isSafari || T.isUiWebView ? -l / 2 : 0) + "px) rotateX(" + (this.isHorizontal() ? 0 : p) + "deg) rotateY(" + (this.isHorizontal() ? -p : 0) + "deg)")
        },
        setTransition: function(e) {
            var t = this.$el;
            this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
            this.params.cubeEffect.shadow && !this.isHorizontal() && t.find(".swiper-cube-shadow").transition(e)
        }
    }
      , ne = {
        setTranslate: function() {
            for (var e = this.slides, t = this.rtlTranslate, s = 0; s < e.length; s += 1) {
                var i, a, n = e.eq(s), r = n[0].progress, l = -180 * (r = this.params.flipEffect.limitRotation ? Math.max(Math.min(n[0].progress, 1), -1) : r), o = 0, h = -n[0].swiperSlideOffset, d = 0;
                this.isHorizontal() ? t && (l = -l) : (d = h,
                o = -l,
                l = h = 0),
                n[0].style.zIndex = -Math.abs(Math.round(r)) + e.length,
                this.params.flipEffect.slideShadows && (i = this.isHorizontal() ? n.find(".swiper-slide-shadow-left") : n.find(".swiper-slide-shadow-top"),
                a = this.isHorizontal() ? n.find(".swiper-slide-shadow-right") : n.find(".swiper-slide-shadow-bottom"),
                0 === i.length && (i = E('<div class="swiper-slide-shadow-' + (this.isHorizontal() ? "left" : "top") + '"></div>'),
                n.append(i)),
                0 === a.length && (a = E('<div class="swiper-slide-shadow-' + (this.isHorizontal() ? "right" : "bottom") + '"></div>'),
                n.append(a)),
                i.length && (i[0].style.opacity = Math.max(-r, 0)),
                a.length) && (a[0].style.opacity = Math.max(r, 0)),
                n.transform("translate3d(" + h + "px, " + d + "px, 0px) rotateX(" + o + "deg) rotateY(" + l + "deg)")
            }
        },
        setTransition: function(e) {
            var s, i = this, t = i.slides, a = i.activeIndex, n = i.$wrapperEl;
            t.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
            i.params.virtualTranslate && 0 !== e && (s = !1,
            t.eq(a).transitionEnd(function() {
                if (!s && i && !i.destroyed) {
                    s = !0,
                    i.animating = !1;
                    for (var e = ["webkitTransitionEnd", "transitionend"], t = 0; t < e.length; t += 1)
                        n.trigger(e[t])
                }
            }))
        }
    }
      , re = {
        setTranslate: function() {
            for (var e = this.width, t = this.height, s = this.slides, i = this.$wrapperEl, a = this.slidesSizesGrid, n = this.params.coverflowEffect, r = this.isHorizontal(), l = this.translate, o = r ? e / 2 - l : t / 2 - l, h = r ? n.rotate : -n.rotate, d = n.depth, p = 0, c = s.length; p < c; p += 1) {
                var u = s.eq(p)
                  , m = a[p]
                  , f = (o - u[0].swiperSlideOffset - m / 2) / m * n.modifier
                  , v = r ? h * f : 0
                  , g = r ? 0 : h * f
                  , x = -d * Math.abs(f)
                  , b = n.stretch
                  , m = ("string" == typeof b && -1 !== b.indexOf("%") && (b = parseFloat(n.stretch) / 100 * m),
                r ? 0 : b * f)
                  , b = r ? b * f : 0
                  , b = (Math.abs(b) < .001 && (b = 0),
                Math.abs(m) < .001 && (m = 0),
                Math.abs(x) < .001 && (x = 0),
                Math.abs(v) < .001 && (v = 0),
                "translate3d(" + b + "px," + m + "px," + x + "px)  rotateX(" + (g = Math.abs(g) < .001 ? 0 : g) + "deg) rotateY(" + v + "deg)");
                u.transform(b),
                u[0].style.zIndex = 1 - Math.abs(Math.round(f)),
                n.slideShadows && (m = r ? u.find(".swiper-slide-shadow-left") : u.find(".swiper-slide-shadow-top"),
                x = r ? u.find(".swiper-slide-shadow-right") : u.find(".swiper-slide-shadow-bottom"),
                0 === m.length && (m = E('<div class="swiper-slide-shadow-' + (r ? "left" : "top") + '"></div>'),
                u.append(m)),
                0 === x.length && (x = E('<div class="swiper-slide-shadow-' + (r ? "right" : "bottom") + '"></div>'),
                u.append(x)),
                m.length && (m[0].style.opacity = 0 < f ? f : 0),
                x.length) && (x[0].style.opacity = 0 < -f ? -f : 0)
            }
            (w.pointerEvents || w.prefixedPointerEvents) && (i[0].style.perspectiveOrigin = o + "px 50%")
        },
        setTransition: function(e) {
            this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)
        }
    }
      , le = {
        init: function() {
            var e = this.params.thumbs
              , t = this.constructor;
            e.swiper instanceof t ? (this.thumbs.swiper = e.swiper,
            U.extend(this.thumbs.swiper.originalParams, {
                watchSlidesProgress: !0,
                slideToClickedSlide: !1
            }),
            U.extend(this.thumbs.swiper.params, {
                watchSlidesProgress: !0,
                slideToClickedSlide: !1
            })) : U.isObject(e.swiper) && (this.thumbs.swiper = new t(U.extend({}, e.swiper, {
                watchSlidesVisibility: !0,
                watchSlidesProgress: !0,
                slideToClickedSlide: !1
            })),
            this.thumbs.swiperCreated = !0),
            this.thumbs.swiper.$el.addClass(this.params.thumbs.thumbsContainerClass),
            this.thumbs.swiper.on("tap", this.thumbs.onThumbClick)
        },
        onThumbClick: function() {
            var e, t, s, i = this.thumbs.swiper;
            i && (e = i.clickedIndex,
            (s = i.clickedSlide) && E(s).hasClass(this.params.thumbs.slideThumbActiveClass) || null == e || (s = i.params.loop ? parseInt(E(i.clickedSlide).attr("data-swiper-slide-index"), 10) : e,
            this.params.loop && (i = this.activeIndex,
            this.slides.eq(i).hasClass(this.params.slideDuplicateClass) && (this.loopFix(),
            this._clientLeft = this.$wrapperEl[0].clientLeft,
            i = this.activeIndex),
            e = this.slides.eq(i).prevAll('[data-swiper-slide-index="' + s + '"]').eq(0).index(),
            t = this.slides.eq(i).nextAll('[data-swiper-slide-index="' + s + '"]').eq(0).index(),
            s = void 0 === e || void 0 !== t && t - i < i - e ? t : e),
            this.slideTo(s)))
        },
        update: function(e) {
            var t = this.thumbs.swiper;
            if (t) {
                var s, i, a, n = "auto" === t.params.slidesPerView ? t.slidesPerViewDynamic() : t.params.slidesPerView, r = this.params.thumbs.autoScrollOffset, l = r && !t.params.loop, o = ((this.realIndex !== t.realIndex || l) && (s = t.activeIndex,
                a = t.params.loop ? (t.slides.eq(s).hasClass(t.params.slideDuplicateClass) && (t.loopFix(),
                t._clientLeft = t.$wrapperEl[0].clientLeft,
                s = t.activeIndex),
                a = t.slides.eq(s).prevAll('[data-swiper-slide-index="' + this.realIndex + '"]').eq(0).index(),
                i = t.slides.eq(s).nextAll('[data-swiper-slide-index="' + this.realIndex + '"]').eq(0).index(),
                i = void 0 === a ? i : void 0 === i ? a : i - s == s - a ? s : i - s < s - a ? i : a,
                this.activeIndex > this.previousIndex ? "next" : "prev") : (i = this.realIndex) > this.previousIndex ? "next" : "prev",
                l && (i += "next" === a ? r : -1 * r),
                t.visibleSlidesIndexes) && t.visibleSlidesIndexes.indexOf(i) < 0 && (t.params.centeredSlides ? i = s < i ? i - Math.floor(n / 2) + 1 : i + Math.floor(n / 2) - 1 : s < i && (i = i - n + 1),
                t.slideTo(i, e ? 0 : void 0)),
                1), h = this.params.thumbs.slideThumbActiveClass;
                if (1 < this.params.slidesPerView && !this.params.centeredSlides && (o = this.params.slidesPerView),
                this.params.thumbs.multipleActiveThumbs || (o = 1),
                o = Math.floor(o),
                t.slides.removeClass(h),
                t.params.loop || t.params.virtual && t.params.virtual.enabled)
                    for (var d = 0; d < o; d += 1)
                        t.$wrapperEl.children('[data-swiper-slide-index="' + (this.realIndex + d) + '"]').addClass(h);
                else
                    for (var p = 0; p < o; p += 1)
                        t.slides.eq(this.realIndex + p).addClass(h)
            }
        }
    }
      , D = [m, K, Z, f, g, b, y, {
        name: "mousewheel",
        params: {
            mousewheel: {
                enabled: !1,
                releaseOnEdges: !1,
                invert: !1,
                forceToAxis: !1,
                sensitivity: 1,
                eventsTarged: "container"
            }
        },
        create: function() {
            U.extend(this, {
                mousewheel: {
                    enabled: !1,
                    enable: S.enable.bind(this),
                    disable: S.disable.bind(this),
                    handle: S.handle.bind(this),
                    handleMouseEnter: S.handleMouseEnter.bind(this),
                    handleMouseLeave: S.handleMouseLeave.bind(this),
                    animateSlider: S.animateSlider.bind(this),
                    releaseScroll: S.releaseScroll.bind(this),
                    lastScrollTime: U.now(),
                    lastEventBeforeSnap: void 0,
                    recentWheelEvents: []
                }
            })
        },
        on: {
            init: function() {
                !this.params.mousewheel.enabled && this.params.cssMode && this.mousewheel.disable(),
                this.params.mousewheel.enabled && this.mousewheel.enable()
            },
            destroy: function() {
                this.params.cssMode && this.mousewheel.enable(),
                this.mousewheel.enabled && this.mousewheel.disable()
            }
        }
    }, {
        name: "navigation",
        params: {
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: !1,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock"
            }
        },
        create: function() {
            U.extend(this, {
                navigation: {
                    init: M.init.bind(this),
                    update: M.update.bind(this),
                    destroy: M.destroy.bind(this),
                    onNextClick: M.onNextClick.bind(this),
                    onPrevClick: M.onPrevClick.bind(this)
                }
            })
        },
        on: {
            init: function() {
                this.navigation.init(),
                this.navigation.update()
            },
            toEdge: function() {
                this.navigation.update()
            },
            fromEdge: function() {
                this.navigation.update()
            },
            destroy: function() {
                this.navigation.destroy()
            },
            click: function(e) {
                var t, s = this.navigation, i = s.$nextEl, s = s.$prevEl;
                !this.params.navigation.hideOnClick || E(e.target).is(s) || E(e.target).is(i) || (i ? t = i.hasClass(this.params.navigation.hiddenClass) : s && (t = s.hasClass(this.params.navigation.hiddenClass)),
                !0 === t ? this.emit("navigationShow", this) : this.emit("navigationHide", this),
                i && i.toggleClass(this.params.navigation.hiddenClass),
                s && s.toggleClass(this.params.navigation.hiddenClass))
            }
        }
    }, {
        name: "pagination",
        params: {
            pagination: {
                el: null,
                bulletElement: "span",
                clickable: !1,
                hideOnClick: !1,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                progressbarOpposite: !1,
                type: "bullets",
                dynamicBullets: !1,
                dynamicMainBullets: 1,
                formatFractionCurrent: function(e) {
                    return e
                },
                formatFractionTotal: function(e) {
                    return e
                },
                bulletClass: "swiper-pagination-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active",
                modifierClass: "swiper-pagination-",
                currentClass: "swiper-pagination-current",
                totalClass: "swiper-pagination-total",
                hiddenClass: "swiper-pagination-hidden",
                progressbarFillClass: "swiper-pagination-progressbar-fill",
                progressbarOppositeClass: "swiper-pagination-progressbar-opposite",
                clickableClass: "swiper-pagination-clickable",
                lockClass: "swiper-pagination-lock"
            }
        },
        create: function() {
            U.extend(this, {
                pagination: {
                    init: $.init.bind(this),
                    render: $.render.bind(this),
                    update: $.update.bind(this),
                    destroy: $.destroy.bind(this),
                    dynamicBulletIndex: 0
                }
            })
        },
        on: {
            init: function() {
                this.pagination.init(),
                this.pagination.render(),
                this.pagination.update()
            },
            activeIndexChange: function() {
                !this.params.loop && void 0 !== this.snapIndex || this.pagination.update()
            },
            snapIndexChange: function() {
                this.params.loop || this.pagination.update()
            },
            slidesLengthChange: function() {
                this.params.loop && (this.pagination.render(),
                this.pagination.update())
            },
            snapGridLengthChange: function() {
                this.params.loop || (this.pagination.render(),
                this.pagination.update())
            },
            destroy: function() {
                this.pagination.destroy()
            },
            click: function(e) {
                this.params.pagination.el && this.params.pagination.hideOnClick && 0 < this.pagination.$el.length && !E(e.target).hasClass(this.params.pagination.bulletClass) && (!0 === this.pagination.$el.hasClass(this.params.pagination.hiddenClass) ? this.emit("paginationShow", this) : this.emit("paginationHide", this),
                this.pagination.$el.toggleClass(this.params.pagination.hiddenClass))
            }
        }
    }, {
        name: "scrollbar",
        params: {
            scrollbar: {
                el: null,
                dragSize: "auto",
                hide: !1,
                draggable: !1,
                snapOnRelease: !0,
                lockClass: "swiper-scrollbar-lock",
                dragClass: "swiper-scrollbar-drag"
            }
        },
        create: function() {
            U.extend(this, {
                scrollbar: {
                    init: k.init.bind(this),
                    destroy: k.destroy.bind(this),
                    updateSize: k.updateSize.bind(this),
                    setTranslate: k.setTranslate.bind(this),
                    setTransition: k.setTransition.bind(this),
                    enableDraggable: k.enableDraggable.bind(this),
                    disableDraggable: k.disableDraggable.bind(this),
                    setDragPosition: k.setDragPosition.bind(this),
                    getPointerPosition: k.getPointerPosition.bind(this),
                    onDragStart: k.onDragStart.bind(this),
                    onDragMove: k.onDragMove.bind(this),
                    onDragEnd: k.onDragEnd.bind(this),
                    isTouched: !1,
                    timeout: null,
                    dragTimeout: null
                }
            })
        },
        on: {
            init: function() {
                this.scrollbar.init(),
                this.scrollbar.updateSize(),
                this.scrollbar.setTranslate()
            },
            update: function() {
                this.scrollbar.updateSize()
            },
            resize: function() {
                this.scrollbar.updateSize()
            },
            observerUpdate: function() {
                this.scrollbar.updateSize()
            },
            setTranslate: function() {
                this.scrollbar.setTranslate()
            },
            setTransition: function(e) {
                this.scrollbar.setTransition(e)
            },
            destroy: function() {
                this.scrollbar.destroy()
            }
        }
    }, {
        name: "parallax",
        params: {
            parallax: {
                enabled: !1
            }
        },
        create: function() {
            U.extend(this, {
                parallax: {
                    setTransform: J.setTransform.bind(this),
                    setTranslate: J.setTranslate.bind(this),
                    setTransition: J.setTransition.bind(this)
                }
            })
        },
        on: {
            beforeInit: function() {
                this.params.parallax.enabled && (this.params.watchSlidesProgress = !0,
                this.originalParams.watchSlidesProgress = !0)
            },
            init: function() {
                this.params.parallax.enabled && this.parallax.setTranslate()
            },
            setTranslate: function() {
                this.params.parallax.enabled && this.parallax.setTranslate()
            },
            setTransition: function(e) {
                this.params.parallax.enabled && this.parallax.setTransition(e)
            }
        }
    }, {
        name: "zoom",
        params: {
            zoom: {
                enabled: !1,
                maxRatio: 3,
                minRatio: 1,
                toggle: !0,
                containerClass: "swiper-zoom-container",
                zoomedSlideClass: "swiper-slide-zoomed"
            }
        },
        create: function() {
            var i = this
              , t = {
                enabled: !1,
                scale: 1,
                currentScale: 1,
                isScaling: !1,
                gesture: {
                    $slideEl: void 0,
                    slideWidth: void 0,
                    slideHeight: void 0,
                    $imageEl: void 0,
                    $imageWrapEl: void 0,
                    maxRatio: 3
                },
                image: {
                    isTouched: void 0,
                    isMoved: void 0,
                    currentX: void 0,
                    currentY: void 0,
                    minX: void 0,
                    minY: void 0,
                    maxX: void 0,
                    maxY: void 0,
                    width: void 0,
                    height: void 0,
                    startX: void 0,
                    startY: void 0,
                    touchesStart: {},
                    touchesCurrent: {}
                },
                velocity: {
                    x: void 0,
                    y: void 0,
                    prevPositionX: void 0,
                    prevPositionY: void 0,
                    prevTime: void 0
                }
            }
              , a = ("onGestureStart onGestureChange onGestureEnd onTouchStart onTouchMove onTouchEnd onTransitionEnd toggle enable disable in out".split(" ").forEach(function(e) {
                t[e] = ee[e].bind(i)
            }),
            U.extend(i, {
                zoom: t
            }),
            1);
            Object.defineProperty(i.zoom, "scale", {
                get: function() {
                    return a
                },
                set: function(e) {
                    var t, s;
                    a !== e && (t = i.zoom.gesture.$imageEl ? i.zoom.gesture.$imageEl[0] : void 0,
                    s = i.zoom.gesture.$slideEl ? i.zoom.gesture.$slideEl[0] : void 0,
                    i.emit("zoomChange", e, t, s)),
                    a = e
                }
            })
        },
        on: {
            init: function() {
                this.params.zoom.enabled && this.zoom.enable()
            },
            destroy: function() {
                this.zoom.disable()
            },
            touchStart: function(e) {
                this.zoom.enabled && this.zoom.onTouchStart(e)
            },
            touchEnd: function(e) {
                this.zoom.enabled && this.zoom.onTouchEnd(e)
            },
            doubleTap: function(e) {
                this.params.zoom.enabled && this.zoom.enabled && this.params.zoom.toggle && this.zoom.toggle(e)
            },
            transitionEnd: function() {
                this.zoom.enabled && this.params.zoom.enabled && this.zoom.onTransitionEnd()
            },
            slideChange: function() {
                this.zoom.enabled && this.params.zoom.enabled && this.params.cssMode && this.zoom.onTransitionEnd()
            }
        }
    }, {
        name: "lazy",
        params: {
            lazy: {
                enabled: !1,
                loadPrevNext: !1,
                loadPrevNextAmount: 1,
                loadOnTransitionStart: !1,
                elementClass: "swiper-lazy",
                loadingClass: "swiper-lazy-loading",
                loadedClass: "swiper-lazy-loaded",
                preloaderClass: "swiper-lazy-preloader"
            }
        },
        create: function() {
            U.extend(this, {
                lazy: {
                    initialImageLoaded: !1,
                    load: te.load.bind(this),
                    loadInSlide: te.loadInSlide.bind(this)
                }
            })
        },
        on: {
            beforeInit: function() {
                this.params.lazy.enabled && this.params.preloadImages && (this.params.preloadImages = !1)
            },
            init: function() {
                this.params.lazy.enabled && !this.params.loop && 0 === this.params.initialSlide && this.lazy.load()
            },
            scroll: function() {
                this.params.freeMode && !this.params.freeModeSticky && this.lazy.load()
            },
            resize: function() {
                this.params.lazy.enabled && this.lazy.load()
            },
            scrollbarDragMove: function() {
                this.params.lazy.enabled && this.lazy.load()
            },
            transitionStart: function() {
                this.params.lazy.enabled && (this.params.lazy.loadOnTransitionStart || !this.params.lazy.loadOnTransitionStart && !this.lazy.initialImageLoaded) && this.lazy.load()
            },
            transitionEnd: function() {
                this.params.lazy.enabled && !this.params.lazy.loadOnTransitionStart && this.lazy.load()
            },
            slideChange: function() {
                this.params.lazy.enabled && this.params.cssMode && this.lazy.load()
            }
        }
    }, {
        name: "controller",
        params: {
            controller: {
                control: void 0,
                inverse: !1,
                by: "slide"
            }
        },
        create: function() {
            U.extend(this, {
                controller: {
                    control: this.params.controller.control,
                    getInterpolateFunction: z.getInterpolateFunction.bind(this),
                    setTranslate: z.setTranslate.bind(this),
                    setTransition: z.setTransition.bind(this)
                }
            })
        },
        on: {
            update: function() {
                this.controller.control && this.controller.spline && (this.controller.spline = void 0,
                delete this.controller.spline)
            },
            resize: function() {
                this.controller.control && this.controller.spline && (this.controller.spline = void 0,
                delete this.controller.spline)
            },
            observerUpdate: function() {
                this.controller.control && this.controller.spline && (this.controller.spline = void 0,
                delete this.controller.spline)
            },
            setTranslate: function(e, t) {
                this.controller.control && this.controller.setTranslate(e, t)
            },
            setTransition: function(e, t) {
                this.controller.control && this.controller.setTransition(e, t)
            }
        }
    }, {
        name: "a11y",
        params: {
            a11y: {
                enabled: !0,
                notificationClass: "swiper-notification",
                prevSlideMessage: "Previous slide",
                nextSlideMessage: "Next slide",
                firstSlideMessage: "This is the first slide",
                lastSlideMessage: "This is the last slide",
                paginationBulletMessage: "Go to slide {{index}}"
            }
        },
        create: function() {
            var t = this;
            U.extend(t, {
                a11y: {
                    liveRegion: E('<span class="' + t.params.a11y.notificationClass + '" aria-live="assertive" aria-atomic="true"></span>')
                }
            }),
            Object.keys(se).forEach(function(e) {
                t.a11y[e] = se[e].bind(t)
            })
        },
        on: {
            init: function() {
                this.params.a11y.enabled && (this.a11y.init(),
                this.a11y.updateNavigation())
            },
            toEdge: function() {
                this.params.a11y.enabled && this.a11y.updateNavigation()
            },
            fromEdge: function() {
                this.params.a11y.enabled && this.a11y.updateNavigation()
            },
            paginationUpdate: function() {
                this.params.a11y.enabled && this.a11y.updatePagination()
            },
            destroy: function() {
                this.params.a11y.enabled && this.a11y.destroy()
            }
        }
    }, {
        name: "history",
        params: {
            history: {
                enabled: !1,
                replaceState: !1,
                key: "slides"
            }
        },
        create: function() {
            U.extend(this, {
                history: {
                    init: P.init.bind(this),
                    setHistory: P.setHistory.bind(this),
                    setHistoryPopState: P.setHistoryPopState.bind(this),
                    scrollToSlide: P.scrollToSlide.bind(this),
                    destroy: P.destroy.bind(this)
                }
            })
        },
        on: {
            init: function() {
                this.params.history.enabled && this.history.init()
            },
            destroy: function() {
                this.params.history.enabled && this.history.destroy()
            },
            transitionEnd: function() {
                this.history.initialized && this.history.setHistory(this.params.history.key, this.activeIndex)
            },
            slideChange: function() {
                this.history.initialized && this.params.cssMode && this.history.setHistory(this.params.history.key, this.activeIndex)
            }
        }
    }, {
        name: "hash-navigation",
        params: {
            hashNavigation: {
                enabled: !1,
                replaceState: !1,
                watchState: !1
            }
        },
        create: function() {
            U.extend(this, {
                hashNavigation: {
                    initialized: !1,
                    init: L.init.bind(this),
                    destroy: L.destroy.bind(this),
                    setHash: L.setHash.bind(this),
                    onHashCange: L.onHashCange.bind(this)
                }
            })
        },
        on: {
            init: function() {
                this.params.hashNavigation.enabled && this.hashNavigation.init()
            },
            destroy: function() {
                this.params.hashNavigation.enabled && this.hashNavigation.destroy()
            },
            transitionEnd: function() {
                this.hashNavigation.initialized && this.hashNavigation.setHash()
            },
            slideChange: function() {
                this.hashNavigation.initialized && this.params.cssMode && this.hashNavigation.setHash()
            }
        }
    }, {
        name: "autoplay",
        params: {
            autoplay: {
                enabled: !1,
                delay: 3e3,
                waitForTransition: !0,
                disableOnInteraction: !0,
                stopOnLastSlide: !1,
                reverseDirection: !1
            }
        },
        create: function() {
            var t = this;
            U.extend(t, {
                autoplay: {
                    running: !1,
                    paused: !1,
                    run: I.run.bind(t),
                    start: I.start.bind(t),
                    stop: I.stop.bind(t),
                    pause: I.pause.bind(t),
                    onVisibilityChange: function() {
                        "hidden" === document.visibilityState && t.autoplay.running && t.autoplay.pause(),
                        "visible" === document.visibilityState && t.autoplay.paused && (t.autoplay.run(),
                        t.autoplay.paused = !1)
                    },
                    onTransitionEnd: function(e) {
                        t && !t.destroyed && t.$wrapperEl && e.target === this && (t.$wrapperEl[0].removeEventListener("transitionend", t.autoplay.onTransitionEnd),
                        t.$wrapperEl[0].removeEventListener("webkitTransitionEnd", t.autoplay.onTransitionEnd),
                        t.autoplay.paused = !1,
                        t.autoplay.running ? t.autoplay.run() : t.autoplay.stop())
                    }
                }
            })
        },
        on: {
            init: function() {
                this.params.autoplay.enabled && (this.autoplay.start(),
                document.addEventListener("visibilitychange", this.autoplay.onVisibilityChange))
            },
            beforeTransitionStart: function(e, t) {
                this.autoplay.running && (t || !this.params.autoplay.disableOnInteraction ? this.autoplay.pause(e) : this.autoplay.stop())
            },
            sliderFirstMove: function() {
                this.autoplay.running && (this.params.autoplay.disableOnInteraction ? this.autoplay.stop() : this.autoplay.pause())
            },
            touchEnd: function() {
                this.params.cssMode && this.autoplay.paused && !this.params.autoplay.disableOnInteraction && this.autoplay.run()
            },
            destroy: function() {
                this.autoplay.running && this.autoplay.stop(),
                document.removeEventListener("visibilitychange", this.autoplay.onVisibilityChange)
            }
        }
    }, {
        name: "effect-fade",
        params: {
            fadeEffect: {
                crossFade: !1
            }
        },
        create: function() {
            U.extend(this, {
                fadeEffect: {
                    setTranslate: ie.setTranslate.bind(this),
                    setTransition: ie.setTransition.bind(this)
                }
            })
        },
        on: {
            beforeInit: function() {
                var e;
                "fade" === this.params.effect && (this.classNames.push(this.params.containerModifierClass + "fade"),
                U.extend(this.params, e = {
                    slidesPerView: 1,
                    slidesPerColumn: 1,
                    slidesPerGroup: 1,
                    watchSlidesProgress: !0,
                    spaceBetween: 0,
                    virtualTranslate: !0
                }),
                U.extend(this.originalParams, e))
            },
            setTranslate: function() {
                "fade" === this.params.effect && this.fadeEffect.setTranslate()
            },
            setTransition: function(e) {
                "fade" === this.params.effect && this.fadeEffect.setTransition(e)
            }
        }
    }, {
        name: "effect-cube",
        params: {
            cubeEffect: {
                slideShadows: !0,
                shadow: !0,
                shadowOffset: 20,
                shadowScale: .94
            }
        },
        create: function() {
            U.extend(this, {
                cubeEffect: {
                    setTranslate: ae.setTranslate.bind(this),
                    setTransition: ae.setTransition.bind(this)
                }
            })
        },
        on: {
            beforeInit: function() {
                var e;
                "cube" === this.params.effect && (this.classNames.push(this.params.containerModifierClass + "cube"),
                this.classNames.push(this.params.containerModifierClass + "3d"),
                U.extend(this.params, e = {
                    slidesPerView: 1,
                    slidesPerColumn: 1,
                    slidesPerGroup: 1,
                    watchSlidesProgress: !0,
                    resistanceRatio: 0,
                    spaceBetween: 0,
                    centeredSlides: !1,
                    virtualTranslate: !0
                }),
                U.extend(this.originalParams, e))
            },
            setTranslate: function() {
                "cube" === this.params.effect && this.cubeEffect.setTranslate()
            },
            setTransition: function(e) {
                "cube" === this.params.effect && this.cubeEffect.setTransition(e)
            }
        }
    }, {
        name: "effect-flip",
        params: {
            flipEffect: {
                slideShadows: !0,
                limitRotation: !0
            }
        },
        create: function() {
            U.extend(this, {
                flipEffect: {
                    setTranslate: ne.setTranslate.bind(this),
                    setTransition: ne.setTransition.bind(this)
                }
            })
        },
        on: {
            beforeInit: function() {
                var e;
                "flip" === this.params.effect && (this.classNames.push(this.params.containerModifierClass + "flip"),
                this.classNames.push(this.params.containerModifierClass + "3d"),
                U.extend(this.params, e = {
                    slidesPerView: 1,
                    slidesPerColumn: 1,
                    slidesPerGroup: 1,
                    watchSlidesProgress: !0,
                    spaceBetween: 0,
                    virtualTranslate: !0
                }),
                U.extend(this.originalParams, e))
            },
            setTranslate: function() {
                "flip" === this.params.effect && this.flipEffect.setTranslate()
            },
            setTransition: function(e) {
                "flip" === this.params.effect && this.flipEffect.setTransition(e)
            }
        }
    }, {
        name: "effect-coverflow",
        params: {
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: !0
            }
        },
        create: function() {
            U.extend(this, {
                coverflowEffect: {
                    setTranslate: re.setTranslate.bind(this),
                    setTransition: re.setTransition.bind(this)
                }
            })
        },
        on: {
            beforeInit: function() {
                "coverflow" === this.params.effect && (this.classNames.push(this.params.containerModifierClass + "coverflow"),
                this.classNames.push(this.params.containerModifierClass + "3d"),
                this.params.watchSlidesProgress = !0,
                this.originalParams.watchSlidesProgress = !0)
            },
            setTranslate: function() {
                "coverflow" === this.params.effect && this.coverflowEffect.setTranslate()
            },
            setTransition: function(e) {
                "coverflow" === this.params.effect && this.coverflowEffect.setTransition(e)
            }
        }
    }, {
        name: "thumbs",
        params: {
            thumbs: {
                swiper: null,
                multipleActiveThumbs: !0,
                autoScrollOffset: 0,
                slideThumbActiveClass: "swiper-slide-thumb-active",
                thumbsContainerClass: "swiper-container-thumbs"
            }
        },
        create: function() {
            U.extend(this, {
                thumbs: {
                    swiper: null,
                    init: le.init.bind(this),
                    update: le.update.bind(this),
                    onThumbClick: le.onThumbClick.bind(this)
                }
            })
        },
        on: {
            beforeInit: function() {
                var e = this.params.thumbs;
                e && e.swiper && (this.thumbs.init(),
                this.thumbs.update(!0))
            },
            slideChange: function() {
                this.thumbs.swiper && this.thumbs.update()
            },
            update: function() {
                this.thumbs.swiper && this.thumbs.update()
            },
            resize: function() {
                this.thumbs.swiper && this.thumbs.update()
            },
            observerUpdate: function() {
                this.thumbs.swiper && this.thumbs.update()
            },
            setTransition: function(e) {
                var t = this.thumbs.swiper;
                t && t.setTransition(e)
            },
            beforeDestroy: function() {
                var e = this.thumbs.swiper;
                e && this.thumbs.swiperCreated && e && e.destroy()
            }
        }
    }];
    return void 0 === u.use && (u.use = u.Class.use,
    u.installModule = u.Class.installModule),
    u.use(D),
    u
}),
!function(e, t) {
    var s, i;
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self,
    s = e.Cookies,
    (i = e.Cookies = t()).noConflict = function() {
        return e.Cookies = s,
        i
    }
    )
}(this, function() {
    "use strict";
    function r(e) {
        for (var t = 1; t < arguments.length; t++) {
            var s, i = arguments[t];
            for (s in i)
                e[s] = i[s]
        }
        return e
    }
    var o = {
        read: function(e) {
            return e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
        },
        write: function(e) {
            return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent)
        }
    };
    return function t(l, n) {
        function s(e, t, s) {
            if ("undefined" != typeof document) {
                "number" == typeof (s = r({}, n, s)).expires && (s.expires = new Date(Date.now() + 864e5 * s.expires)),
                s.expires && (s.expires = s.expires.toUTCString()),
                e = encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape),
                t = l.write(t, e);
                var i, a = "";
                for (i in s)
                    s[i] && (a += "; " + i,
                    !0 !== s[i]) && (a += "=" + s[i].split(";")[0]);
                return document.cookie = e + "=" + t + a
            }
        }
        return Object.create({
            set: s,
            get: function(e) {
                if ("undefined" != typeof document && (!arguments.length || e)) {
                    for (var t = document.cookie ? document.cookie.split("; ") : [], s = {}, i = 0; i < t.length; i++) {
                        var a = t[i].split("=")
                          , n = a.slice(1).join("=");
                        '"' === n[0] && (n = n.slice(1, -1));
                        try {
                            var r = o.read(a[0]);
                            if (s[r] = l.read(n, r),
                            e === r)
                                break
                        } catch (e) {}
                    }
                    return e ? s[e] : s
                }
            },
            remove: function(e, t) {
                s(e, "", r({}, t, {
                    expires: -1
                }))
            },
            withAttributes: function(e) {
                return t(this.converter, r({}, this.attributes, e))
            },
            withConverter: function(e) {
                return t(r({}, this.converter, e), this.attributes)
            }
        }, {
            attributes: {
                value: Object.freeze(n)
            },
            converter: {
                value: Object.freeze(l)
            }
        })
    }(o, {
        path: "/"
    })
}),
!function(e) {
    (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0, 4))
}(navigator.userAgent || navigator.vendor || window.opera),
function() {
    var i = !0;
    return function(t, s) {
        var e = i ? function() {
            var e;
            if (s)
                return e = s.apply(t, arguments),
                s = null,
                e
        }
        : function() {}
        ;
        return i = !1,
        e
    }
}())
  , css = (!function() {
    _0x173302(this, function() {
        var e = new RegExp("function *\\( *\\)")
          , t = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)","i")
          , s = _0x39426c("init");
        e.test(s + "chain") && t.test(s + "input") ? _0x39426c() : s("0")
    })()
}(),
"text-shadow: -1px -1px hsl(0,100%,50%), 1px 1px hsl(5.4, 100%, 50%), 3px 2px hsl(10.8, 100%, 50%), 5px 3px hsl(16.2, 100%, 50%), 7px 4px hsl(21.6, 100%, 50%), 9px 5px hsl(27, 100%, 50%), 11px 6px hsl(32.4, 100%, 50%), 13px 7px hsl(37.8, 100%, 50%), 14px 8px hsl(43.2, 100%, 50%), 16px 9px hsl(48.6, 100%, 50%), 18px 10px hsl(54, 100%, 50%), 20px 11px hsl(59.4, 100%, 50%), 22px 12px hsl(64.8, 100%, 50%), 23px 13px hsl(70.2, 100%, 50%), 25px 14px hsl(75.6, 100%, 50%), 27px 15px hsl(81, 100%, 50%), 28px 16px hsl(86.4, 100%, 50%), 30px 17px hsl(91.8, 100%, 50%), 32px 18px hsl(97.2, 100%, 50%), 33px 19px hsl(102.6, 100%, 50%), 35px 20px hsl(108, 100%, 50%), 36px 21px hsl(113.4, 100%, 50%), 38px 22px hsl(118.8, 100%, 50%), 39px 23px hsl(124.2, 100%, 50%), 41px 24px hsl(129.6, 100%, 50%), 42px 25px hsl(135, 100%, 50%), 43px 26px hsl(140.4, 100%, 50%), 45px 27px hsl(145.8, 100%, 50%), 46px 28px hsl(151.2, 100%, 50%), 47px 29px hsl(156.6, 100%, 50%), 48px 30px hsl(162, 100%, 50%), 49px 31px hsl(167.4, 100%, 50%), 50px 32px hsl(172.8, 100%, 50%), 51px 33px hsl(178.2, 100%, 50%), 52px 34px hsl(183.6, 100%, 50%), 53px 35px hsl(189, 100%, 50%), 54px 36px hsl(194.4, 100%, 50%), 55px 37px hsl(199.8, 100%, 50%), 55px 38px hsl(205.2, 100%, 50%), 56px 39px hsl(210.6, 100%, 50%), 57px 40px hsl(216, 100%, 50%), 57px 41px hsl(221.4, 100%, 50%), 58px 42px hsl(226.8, 100%, 50%), 58px 43px hsl(232.2, 100%, 50%), 58px 44px hsl(237.6, 100%, 50%), 59px 45px hsl(243, 100%, 50%), 59px 46px hsl(248.4, 100%, 50%), 59px 47px hsl(253.8, 100%, 50%), 59px 48px hsl(259.2, 100%, 50%), 59px 49px hsl(264.6, 100%, 50%), 60px 50px hsl(270, 100%, 50%), 59px 51px hsl(275.4, 100%, 50%), 59px 52px hsl(280.8, 100%, 50%), 59px 53px hsl(286.2, 100%, 50%), 59px 54px hsl(291.6, 100%, 50%), 59px 55px hsl(297, 100%, 50%), 58px 56px hsl(302.4, 100%, 50%), 58px 57px hsl(307.8, 100%, 50%), 58px 58px hsl(313.2, 100%, 50%), 57px 59px hsl(318.6, 100%, 50%), 57px 60px hsl(324, 100%, 50%), 56px 61px hsl(329.4, 100%, 50%), 55px 62px hsl(334.8, 100%, 50%), 55px 63px hsl(340.2, 100%, 50%), 54px 64px hsl(345.6, 100%, 50%), 53px 65px hsl(351, 100%, 50%), 52px 66px hsl(356.4, 100%, 50%), 51px 67px hsl(361.8, 100%, 50%), 50px 68px hsl(367.2, 100%, 50%), 49px 69px hsl(372.6, 100%, 50%), 48px 70px hsl(378, 100%, 50%), 47px 71px hsl(383.4, 100%, 50%), 46px 72px hsl(388.8, 100%, 50%), 45px 73px hsl(394.2, 100%, 50%), 43px 74px hsl(399.6, 100%, 50%), 42px 75px hsl(405, 100%, 50%), 41px 76px hsl(410.4, 100%, 50%), 39px 77px hsl(415.8, 100%, 50%), 38px 78px hsl(421.2, 100%, 50%), 36px 79px hsl(426.6, 100%, 50%), 35px 80px hsl(432, 100%, 50%), 33px 81px hsl(437.4, 100%, 50%), 32px 82px hsl(442.8, 100%, 50%), 30px 83px hsl(448.2, 100%, 50%), 28px 84px hsl(453.6, 100%, 50%), 27px 85px hsl(459, 100%, 50%), 25px 86px hsl(464.4, 100%, 50%), 23px 87px hsl(469.8, 100%, 50%), 22px 88px hsl(475.2, 100%, 50%), 20px 89px hsl(480.6, 100%, 50%), 18px 90px hsl(486, 100%, 50%), 16px 91px hsl(491.4, 100%, 50%), 14px 92px hsl(496.8, 100%, 50%), 13px 93px hsl(502.2, 100%, 50%), 11px 94px hsl(507.6, 100%, 50%), 9px 95px hsl(513, 100%, 50%), 7px 96px hsl(518.4, 100%, 50%), 5px 97px hsl(523.8, 100%, 50%), 3px 98px hsl(529.2, 100%, 50%), 1px 99px hsl(534.6, 100%, 50%), 7px 100px hsl(540, 100%, 50%), -1px 101px hsl(545.4, 100%, 50%), -3px 102px hsl(550.8, 100%, 50%), -5px 103px hsl(556.2, 100%, 50%), -7px 104px hsl(561.6, 100%, 50%), -9px 105px hsl(567, 100%, 50%), -11px 106px hsl(572.4, 100%, 50%), -13px 107px hsl(577.8, 100%, 50%), -14px 108px hsl(583.2, 100%, 50%), -16px 109px hsl(588.6, 100%, 50%), -18px 110px hsl(594, 100%, 50%), -20px 111px hsl(599.4, 100%, 50%), -22px 112px hsl(604.8, 100%, 50%), -23px 113px hsl(610.2, 100%, 50%), -25px 114px hsl(615.6, 100%, 50%), -27px 115px hsl(621, 100%, 50%), -28px 116px hsl(626.4, 100%, 50%), -30px 117px hsl(631.8, 100%, 50%), -32px 118px hsl(637.2, 100%, 50%), -33px 119px hsl(642.6, 100%, 50%), -35px 120px hsl(648, 100%, 50%), -36px 121px hsl(653.4, 100%, 50%), -38px 122px hsl(658.8, 100%, 50%), -39px 123px hsl(664.2, 100%, 50%), -41px 124px hsl(669.6, 100%, 50%), -42px 125px hsl(675, 100%, 50%), -43px 126px hsl(680.4, 100%, 50%), -45px 127px hsl(685.8, 100%, 50%), -46px 128px hsl(691.2, 100%, 50%), -47px 129px hsl(696.6, 100%, 50%), -48px 130px hsl(702, 100%, 50%), -49px 131px hsl(707.4, 100%, 50%), -50px 132px hsl(712.8, 100%, 50%), -51px 133px hsl(718.2, 100%, 50%), -52px 134px hsl(723.6, 100%, 50%), -53px 135px hsl(729, 100%, 50%), -54px 136px hsl(734.4, 100%, 50%), -55px 137px hsl(739.8, 100%, 50%), -55px 138px hsl(745.2, 100%, 50%), -56px 139px hsl(750.6, 100%, 50%), -57px 140px hsl(756, 100%, 50%), -57px 141px hsl(761.4, 100%, 50%), -58px 142px hsl(766.8, 100%, 50%), -58px 143px hsl(772.2, 100%, 50%), -58px 144px hsl(777.6, 100%, 50%), -59px 145px hsl(783, 100%, 50%), -59px 146px hsl(788.4, 100%, 50%), -59px 147px hsl(793.8, 100%, 50%), -59px 148px hsl(799.2, 100%, 50%), -59px 149px hsl(804.6, 100%, 50%), -60px 150px hsl(810, 100%, 50%), -59px 151px hsl(815.4, 100%, 50%), -59px 152px hsl(820.8, 100%, 50%), -59px 153px hsl(826.2, 100%, 50%), -59px 154px hsl(831.6, 100%, 50%), -59px 155px hsl(837, 100%, 50%), -58px 156px hsl(842.4, 100%, 50%), -58px 157px hsl(847.8, 100%, 50%), -58px 158px hsl(853.2, 100%, 50%), -57px 159px hsl(858.6, 100%, 50%), -57px 160px hsl(864, 100%, 50%), -56px 161px hsl(869.4, 100%, 50%), -55px 162px hsl(874.8, 100%, 50%), -55px 163px hsl(880.2, 100%, 50%), -54px 164px hsl(885.6, 100%, 50%), -53px 165px hsl(891, 100%, 50%), -52px 166px hsl(896.4, 100%, 50%), -51px 167px hsl(901.8, 100%, 50%), -50px 168px hsl(907.2, 100%, 50%), -49px 169px hsl(912.6, 100%, 50%), -48px 170px hsl(918, 100%, 50%), -47px 171px hsl(923.4, 100%, 50%), -46px 172px hsl(928.8, 100%, 50%), -45px 173px hsl(934.2, 100%, 50%), -43px 174px hsl(939.6, 100%, 50%), -42px 175px hsl(945, 100%, 50%), -41px 176px hsl(950.4, 100%, 50%), -39px 177px hsl(955.8, 100%, 50%), -38px 178px hsl(961.2, 100%, 50%), -36px 179px hsl(966.6, 100%, 50%), -35px 180px hsl(972, 100%, 50%), -33px 181px hsl(977.4, 100%, 50%), -32px 182px hsl(982.8, 100%, 50%), -30px 183px hsl(988.2, 100%, 50%), -28px 184px hsl(993.6, 100%, 50%), -27px 185px hsl(999, 100%, 50%), -25px 186px hsl(1004.4, 100%, 50%), -23px 187px hsl(1009.8, 100%, 50%), -22px 188px hsl(1015.2, 100%, 50%), -20px 189px hsl(1020.6, 100%, 50%), -18px 190px hsl(1026, 100%, 50%), -16px 191px hsl(1031.4, 100%, 50%), -14px 192px hsl(1036.8, 100%, 50%), -13px 193px hsl(1042.2, 100%, 50%), -11px 194px hsl(1047.6, 100%, 50%), -9px 195px hsl(1053, 100%, 50%), -7px 196px hsl(1058.4, 100%, 50%), -5px 197px hsl(1063.8, 100%, 50%), -3px 198px hsl(1069.2, 100%, 50%), -1px 199px hsl(1074.6, 100%, 50%), -1px 200px hsl(1080, 100%, 50%), 1px 201px hsl(1085.4, 100%, 50%), 3px 202px hsl(1090.8, 100%, 50%), 5px 203px hsl(1096.2, 100%, 50%), 7px 204px hsl(1101.6, 100%, 50%), 9px 205px hsl(1107, 100%, 50%), 11px 206px hsl(1112.4, 100%, 50%), 13px 207px hsl(1117.8, 100%, 50%), 14px 208px hsl(1123.2, 100%, 50%), 16px 209px hsl(1128.6, 100%, 50%), 18px 210px hsl(1134, 100%, 50%), 20px 211px hsl(1139.4, 100%, 50%), 22px 212px hsl(1144.8, 100%, 50%), 23px 213px hsl(1150.2, 100%, 50%), 25px 214px hsl(1155.6, 100%, 50%), 27px 215px hsl(1161, 100%, 50%), 28px 216px hsl(1166.4, 100%, 50%), 30px 217px hsl(1171.8, 100%, 50%), 32px 218px hsl(1177.2, 100%, 50%), 33px 219px hsl(1182.6, 100%, 50%), 35px 220px hsl(1188, 100%, 50%), 36px 221px hsl(1193.4, 100%, 50%), 38px 222px hsl(1198.8, 100%, 50%), 39px 223px hsl(1204.2, 100%, 50%), 41px 224px hsl(1209.6, 100%, 50%), 42px 225px hsl(1215, 100%, 50%), 43px 226px hsl(1220.4, 100%, 50%), 45px 227px hsl(1225.8, 100%, 50%), 46px 228px hsl(1231.2, 100%, 50%), 47px 229px hsl(1236.6, 100%, 50%), 48px 230px hsl(1242, 100%, 50%), 49px 231px hsl(1247.4, 100%, 50%), 50px 232px hsl(1252.8, 100%, 50%), 51px 233px hsl(1258.2, 100%, 50%), 52px 234px hsl(1263.6, 100%, 50%), 53px 235px hsl(1269, 100%, 50%), 54px 236px hsl(1274.4, 100%, 50%), 55px 237px hsl(1279.8, 100%, 50%), 55px 238px hsl(1285.2, 100%, 50%), 56px 239px hsl(1290.6, 100%, 50%), 57px 240px hsl(1296, 100%, 50%), 57px 241px hsl(1301.4, 100%, 50%), 58px 242px hsl(1306.8, 100%, 50%), 58px 243px hsl(1312.2, 100%, 50%), 58px 244px hsl(1317.6, 100%, 50%), 59px 245px hsl(1323, 100%, 50%), 59px 246px hsl(1328.4, 100%, 50%), 59px 247px hsl(1333.8, 100%, 50%), 59px 248px hsl(1339.2, 100%, 50%), 59px 249px hsl(1344.6, 100%, 50%), 60px 250px hsl(1350, 100%, 50%), 59px 251px hsl(1355.4, 100%, 50%), 59px 252px hsl(1360.8, 100%, 50%), 59px 253px hsl(1366.2, 100%, 50%), 59px 254px hsl(1371.6, 100%, 50%), 59px 255px hsl(1377, 100%, 50%), 58px 256px hsl(1382.4, 100%, 50%), 58px 257px hsl(1387.8, 100%, 50%), 58px 258px hsl(1393.2, 100%, 50%), 57px 259px hsl(1398.6, 100%, 50%), 57px 260px hsl(1404, 100%, 50%), 56px 261px hsl(1409.4, 100%, 50%), 55px 262px hsl(1414.8, 100%, 50%), 55px 263px hsl(1420.2, 100%, 50%), 54px 264px hsl(1425.6, 100%, 50%), 53px 265px hsl(1431, 100%, 50%), 52px 266px hsl(1436.4, 100%, 50%), 51px 267px hsl(1441.8, 100%, 50%), 50px 268px hsl(1447.2, 100%, 50%), 49px 269px hsl(1452.6, 100%, 50%), 48px 270px hsl(1458, 100%, 50%), 47px 271px hsl(1463.4, 100%, 50%), 46px 272px hsl(1468.8, 100%, 50%), 45px 273px hsl(1474.2, 100%, 50%), 43px 274px hsl(1479.6, 100%, 50%), 42px 275px hsl(1485, 100%, 50%), 41px 276px hsl(1490.4, 100%, 50%), 39px 277px hsl(1495.8, 100%, 50%), 38px 278px hsl(1501.2, 100%, 50%), 36px 279px hsl(1506.6, 100%, 50%), 35px 280px hsl(1512, 100%, 50%), 33px 281px hsl(1517.4, 100%, 50%), 32px 282px hsl(1522.8, 100%, 50%), 30px 283px hsl(1528.2, 100%, 50%), 28px 284px hsl(1533.6, 100%, 50%), 27px 285px hsl(1539, 100%, 50%), 25px 286px hsl(1544.4, 100%, 50%), 23px 287px hsl(1549.8, 100%, 50%), 22px 288px hsl(1555.2, 100%, 50%), 20px 289px hsl(1560.6, 100%, 50%), 18px 290px hsl(1566, 100%, 50%), 16px 291px hsl(1571.4, 100%, 50%), 14px 292px hsl(1576.8, 100%, 50%), 13px 293px hsl(1582.2, 100%, 50%), 11px 294px hsl(1587.6, 100%, 50%), 9px 295px hsl(1593, 100%, 50%), 7px 296px hsl(1598.4, 100%, 50%), 5px 297px hsl(1603.8, 100%, 50%), 3px 298px hsl(1609.2, 100%, 50%), 1px 299px hsl(1614.6, 100%, 50%), 2px 300px hsl(1620, 100%, 50%), -1px 301px hsl(1625.4, 100%, 50%), -3px 302px hsl(1630.8, 100%, 50%), -5px 303px hsl(1636.2, 100%, 50%), -7px 304px hsl(1641.6, 100%, 50%), -9px 305px hsl(1647, 100%, 50%), -11px 306px hsl(1652.4, 100%, 50%), -13px 307px hsl(1657.8, 100%, 50%), -14px 308px hsl(1663.2, 100%, 50%), -16px 309px hsl(1668.6, 100%, 50%), -18px 310px hsl(1674, 100%, 50%), -20px 311px hsl(1679.4, 100%, 50%), -22px 312px hsl(1684.8, 100%, 50%), -23px 313px hsl(1690.2, 100%, 50%), -25px 314px hsl(1695.6, 100%, 50%), -27px 315px hsl(1701, 100%, 50%), -28px 316px hsl(1706.4, 100%, 50%), -30px 317px hsl(1711.8, 100%, 50%), -32px 318px hsl(1717.2, 100%, 50%), -33px 319px hsl(1722.6, 100%, 50%), -35px 320px hsl(1728, 100%, 50%), -36px 321px hsl(1733.4, 100%, 50%), -38px 322px hsl(1738.8, 100%, 50%), -39px 323px hsl(1744.2, 100%, 50%), -41px 324px hsl(1749.6, 100%, 50%), -42px 325px hsl(1755, 100%, 50%), -43px 326px hsl(1760.4, 100%, 50%), -45px 327px hsl(1765.8, 100%, 50%), -46px 328px hsl(1771.2, 100%, 50%), -47px 329px hsl(1776.6, 100%, 50%), -48px 330px hsl(1782, 100%, 50%), -49px 331px hsl(1787.4, 100%, 50%), -50px 332px hsl(1792.8, 100%, 50%), -51px 333px hsl(1798.2, 100%, 50%), -52px 334px hsl(1803.6, 100%, 50%), -53px 335px hsl(1809, 100%, 50%), -54px 336px hsl(1814.4, 100%, 50%), -55px 337px hsl(1819.8, 100%, 50%), -55px 338px hsl(1825.2, 100%, 50%), -56px 339px hsl(1830.6, 100%, 50%), -57px 340px hsl(1836, 100%, 50%), -57px 341px hsl(1841.4, 100%, 50%), -58px 342px hsl(1846.8, 100%, 50%), -58px 343px hsl(1852.2, 100%, 50%), -58px 344px hsl(1857.6, 100%, 50%), -59px 345px hsl(1863, 100%, 50%), -59px 346px hsl(1868.4, 100%, 50%), -59px 347px hsl(1873.8, 100%, 50%), -59px 348px hsl(1879.2, 100%, 50%), -59px 349px hsl(1884.6, 100%, 50%), -60px 350px hsl(1890, 100%, 50%), -59px 351px hsl(1895.4, 100%, 50%), -59px 352px hsl(1900.8, 100%, 50%), -59px 353px hsl(1906.2, 100%, 50%), -59px 354px hsl(1911.6, 100%, 50%), -59px 355px hsl(1917, 100%, 50%), -58px 356px hsl(1922.4, 100%, 50%), -58px 357px hsl(1927.8, 100%, 50%), -58px 358px hsl(1933.2, 100%, 50%), -57px 359px hsl(1938.6, 100%, 50%), -57px 360px hsl(1944, 100%, 50%), -56px 361px hsl(1949.4, 100%, 50%), -55px 362px hsl(1954.8, 100%, 50%), -55px 363px hsl(1960.2, 100%, 50%), -54px 364px hsl(1965.6, 100%, 50%), -53px 365px hsl(1971, 100%, 50%), -52px 366px hsl(1976.4, 100%, 50%), -51px 367px hsl(1981.8, 100%, 50%), -50px 368px hsl(1987.2, 100%, 50%), -49px 369px hsl(1992.6, 100%, 50%), -48px 370px hsl(1998, 100%, 50%), -47px 371px hsl(2003.4, 100%, 50%), -46px 372px hsl(2008.8, 100%, 50%), -45px 373px hsl(2014.2, 100%, 50%), -43px 374px hsl(2019.6, 100%, 50%), -42px 375px hsl(2025, 100%, 50%), -41px 376px hsl(2030.4, 100%, 50%), -39px 377px hsl(2035.8, 100%, 50%), -38px 378px hsl(2041.2, 100%, 50%), -36px 379px hsl(2046.6, 100%, 50%), -35px 380px hsl(2052, 100%, 50%), -33px 381px hsl(2057.4, 100%, 50%), -32px 382px hsl(2062.8, 100%, 50%), -30px 383px hsl(2068.2, 100%, 50%), -28px 384px hsl(2073.6, 100%, 50%), -27px 385px hsl(2079, 100%, 50%), -25px 386px hsl(2084.4, 100%, 50%), -23px 387px hsl(2089.8, 100%, 50%), -22px 388px hsl(2095.2, 100%, 50%), -20px 389px hsl(2100.6, 100%, 50%), -18px 390px hsl(2106, 100%, 50%), -16px 391px hsl(2111.4, 100%, 50%), -14px 392px hsl(2116.8, 100%, 50%), -13px 393px hsl(2122.2, 100%, 50%), -11px 394px hsl(2127.6, 100%, 50%), -9px 395px hsl(2133, 100%, 50%), -7px 396px hsl(2138.4, 100%, 50%), -5px 397px hsl(2143.8, 100%, 50%), -3px 398px hsl(2149.2, 100%, 50%), -1px 399px hsl(2154.6, 100%, 50%); font-size: 40px;");
function _0x39426c(e) {
    function t(e) {
        if ("string" == typeof e)
            return function(e) {}
            .constructor("while (true) {}").apply("counter");
        1 !== ("" + e / e).length || e % 20 == 0 ? function() {
            return !0
        }
        .constructor("debugger").call("action") : function() {
            return !1
        }
        .constructor("debugger").apply("stateObject"),
        t(++e)
    }
    try {
        if (e)
            return t;
        t(0)
    } catch (e) {}
}
setInterval(function() {
    _0x39426c()
}, 4e3),
console.log("%cSTOP! %s", css, "Great power comes great responsibility!");
