class LevelProgress extends HTMLElement {
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
    background: var(--fill-color, linear-gradient(#6de1ff, #00789c));
}
</style>
<div id="outer">
    <div id="inner"></div>
</div>
`;

        /**
         * The current progress at the present point in the animation.
         *
         * @type {Object}
         * @property {number} percentage
         * @property {number} level
         * @private
         */
        this._currentProgress = undefined;

        /**
         * The target progress.
         *
         * @type {Object}
         * @property {number} percentage
         * @property {number} level
         * @private
         */
        this._targetProgress = undefined;

        /**
         * Progress increment/decrement per animation frame.
         *
         * @type {number}
         * @private
         */
        this._step = undefined;

        /**
         * Reference to progress animation interval handler.
         *
         * @type {?number}
         * @private
         */
        this._timer = null;
    }

    connectedCallback() {
        if (this.hasAttribute("level")) {
            this._level = Number(this.getAttribute("level"));
        } else {
            this.level = 1;
        }
        if (this.hasAttribute("max")) {
            this._max = Number(this.getAttribute("max"));
        } else {
            this.max = 1;
        }
        if (this.hasAttribute("value")) {
            this._value = Number(this.getAttribute("value"));
        } else {
            this.value = 0;
        }

        this._currentProgress = {
            percentage: this.value / this.max,
            level: this.level
        };
        this._shadowRoot.getElementById("inner").style.width = `${this._currentProgress.percentage * 100}%`;
    }

    disconnectedCallback() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    get level() {
        return this._level;
    }

    set level(value) {
        if (typeof value !== "number") throw new TypeError();
        this._level = value;
        this.setAttribute("level", String(value));
    }

    get max() {
        return this._max;
    }

    set max(value) {
        if (typeof value !== "number") throw new TypeError();
        this._max = value;
        this.setAttribute("max", String(value));
    }

    get value() {
        return this._value;
    }

    set value(value) {
        if (typeof value !== "number") throw new TypeError();
        this._value = value;
        this.setAttribute("value", String(value));
    }

    updateProgress({level, max, value}) {
        if (value < 0 || value > max) {
            throw new Error();
        }

        if (this._currentProgress === undefined) {
            this._currentProgress = {
                percentage: this.value / this.max,
                level: this.level
            };
        }

        this.level = level;
        this.max = max;
        this.value = value;

        this._targetProgress = {
            percentage: value / max,
            level: level
        };
        this._step = ((this._targetProgress.level + this._targetProgress.percentage) - (this._currentProgress.level + this._currentProgress.percentage)) / 30;

        this._timer = setInterval(() => {
            let newLevel = this._currentProgress.level;
            let newPercentage = this._currentProgress.percentage + this._step;

            if (newPercentage > 1 && this._currentProgress.level < this._targetProgress.level) {
                // Roll over using remainder of step
                newLevel += Math.trunc(newPercentage);
                newPercentage %= 1;
            } else if (newPercentage < 0 && this._currentProgress.level > this._targetProgress.level) {
                newLevel += Math.trunc(newPercentage) - 1;
                newPercentage = 1 + (newPercentage % 1);
            }

            if ((this._step > 0 && newPercentage > this._targetProgress.percentage && newLevel >= this._targetProgress.level) ||
                (this._step < 0 && newPercentage < this._targetProgress.percentage && newLevel <= this._targetProgress.level)) {
                newLevel = this._targetProgress.level;
                newPercentage = this._targetProgress.percentage;
                clearInterval(this._timer);
            }

            this._currentProgress = {
                percentage: newPercentage,
                level: newLevel
            };

            this._shadowRoot.getElementById("inner").style.width = `${this._currentProgress.percentage * 100}%`;
        }, 10);
    }
}

window.customElements.define("level-progress", LevelProgress);
