const BLUE_NAME = atob("G1s0NG0bWzM3bSBIUkdMUEhTIBtbMzltG1s0OW0=");
atob("G1s0MW0bWzM3bSBIUkdMUEhTIBtbMzltG1s0OW0=");
function debuglog(msg, ...args) {
    console.log(BLUE_NAME, msg, ...args);
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
    return function(_) {
        console.log("(xrx) %cEVENT DETECTED!!!!! " + rule.id, "color: orange; font-size:2em");
    };
}
let rules = [];
let obs = null;
function recorder() {
    debuglog("(xrx) search for elements to match rules");
    obs && (obs == null ? void 0 : obs.disconnect());
    let tries = 100;
    const connect = () => {
        debuglog("(xrx) connect");
        const remove = [];
        for (const r of rules) {
            debuglog("(xrx) looking for", r.cssPath);
            const el = safeQuery(r.cssPath);
            if (el instanceof HTMLElement) {
                debuglog("(xrx) element found", r, el);
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
    const { hostname } = new URL(location.href);
    const url = `https://hieroglyphs.deno.dev/rules/${hostname}?y=${Date.now()}`;
    debuglog("(xrx) fetching rules", url);
    fetch(url).then((res) => res.json()).then((r) => {
        rules = r;
        debuglog("(xrx) rules loaded after navigation", rules);
        connect();
        obs = new MutationObserver(debounce(connect, 500));
        obs.observe(document.body, { subtree: true, childList: true });
    });
}
window.navigation.addEventListener("navigate", recorder);
document.addEventListener("DOMContentLoaded", recorder);
recorder();
debuglog("started");
