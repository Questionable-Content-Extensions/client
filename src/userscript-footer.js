
}

function addScriptToBody(url) {
    const body = document.querySelector("body");

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.crossOrigin = "anonymous";
    script.src = url;

    body.appendChild(script);
}

addScriptToBody("https://unpkg.com/react@17/umd/react.development.js");
addScriptToBody(
    "https://unpkg.com/react-dom@17/umd/react-dom.development.js"
);

function waitForReact() {
    if (unsafeWindow.React && unsafeWindow.ReactDOM) {
        start();
    } else {
        window.setTimeout(waitForReact, 250);
    }
}

waitForReact();