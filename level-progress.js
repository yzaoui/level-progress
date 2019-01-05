class LevelProgress extends HTMLElement {
    static get observedAttributes() {
        return ["level", "max", "value"];
    }

    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: "open" });

        this._shadowRoot.innerHTML = `
<style>
:host {
    display: inline-block;
    width: 5em;
    height: 1em;
}

:host([hidden]) {
    display: none;
}

#outer {
    height: 100%;
    border: 1px solid black;
    box-sizing: border-box;
}

#inner {
    height: 100%;
    background: var(--bar-background-color, linear-gradient(#6de1ff, #00789c));
    transition: width 0.8s cubic-bezier(.8,0,.2,1);
}
</style>
<div id="outer">
    <div id="inner"></div>
</div>
`;
    }

    connectedCallback() {
        if (!this.hasAttribute("level")) this.setAttribute("level", "1");
        if (!this.hasAttribute("max")) this.setAttribute("max", "1");
        if (!this.hasAttribute("value")) this.setAttribute("value", "0");
        this.updateProgress();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.updateProgress();
    }

    get level() {
        return Number(this.getAttribute("level"));
    }

    set level(value) {
        if (typeof value !== "number") throw TypeError();
        this.setAttribute("level", String(value));
    }

    get max() {
        return Number(this.getAttribute("max"));
    }

    set max(value) {
        if (typeof value !== "number") throw TypeError();
        this.setAttribute("max", String(value));
    }

    get value() {
        return Number(this.getAttribute("value"));
    }

    set value(value) {
        if (typeof value !== "number") throw TypeError();
        this.setAttribute("value", String(value));
    }

    get progress() {
        return this.value / this.max;
    }

    set state({level, max, value}) {
        this.level = level;
        this.max = max;
        this.value = value;

        this.updateProgress();
    }

    updateProgress() {
        this._shadowRoot.getElementById("inner").style.width = `${this.progress * 100}%`;
    }
}

window.customElements.define("level-progress", LevelProgress);
