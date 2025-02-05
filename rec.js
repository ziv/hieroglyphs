atob("G1s0NG0bWzM3bSBIUkdMUEhTIBtbMzltG1s0OW0=");
atob("G1s0MW0bWzM3bSBIUkdMUEhTIBtbMzltG1s0OW0=");
function debuglog(msg, ...args) {
}
function safeQuery(selector) {
    if (!selector || !document) {
        console.warn("empty selector");
        return null;
    }
    try {
        return document.querySelector(selector);
    } catch (e) {
        console.warn("query error", e);
        return null;
    }
}
function debounce(fn, wait) {
    let timeout = null;
    let flush = null;
    const debounced = (...args) => {
        debounced.clear();
        flush = () => {
            debounced.clear();
            fn.call(debounced, ...args);
        };
        timeout = Number(setTimeout(flush, wait));
    };
    debounced.clear = () => {
        if (typeof timeout === "number") {
            clearTimeout(timeout);
            timeout = null;
            flush = null;
        }
    };
    debounced.flush = () => {
        flush == null ? void 0 : flush();
    };
    Object.defineProperty(debounced, "pending", {
        get: () => typeof timeout === "number"
    });
    return debounced;
}
function record(rule) {
    return function(e) {
        console.log("%cEVENT DETECTED!!!!! " + rule.id, "color: red; font-size:5em");
    };
}
let rules = [];
let obs = null;
function recorder() {
    obs && (obs == null ? void 0 : obs.disconnect());
    let tries = 100;
    const connect = () => {
        const remove = [];
        for (const r of rules) {
            debuglog("looking for", r.cssPath);
            const el = safeQuery(r.cssPath);
            if (el instanceof HTMLElement) {
                el.addEventListener("click", record(r));
                remove.push(r);
            }
        }
        if (remove.length) {
            for (const r of remove) {
                rules = rules.filter((rule) => rule !== r);
            }
        }
        if (0 >= rules.length || 0 >= tries) {
            obs == null ? void 0 : obs.disconnect();
        }
        --tries;
    };
    fetch("https://hieroglyphs.deno.dev/rules/dev.zoominfo.com:8080?y=" + Date.now()).then((res) => res.json()).then((r) => {
        rules = r;
        connect();
        obs = new MutationObserver(debounce(connect, 500));
        obs.observe(document.body, { subtree: true, childList: true });
    });
}
window.navigation.addEventListener("navigate", recorder);
document.addEventListener("DOMContentLoaded", recorder);
recorder();
