import { customAttribute, bindable, bindingMode } from "aurelia-framework";
import * as Mousetrap from "mousetrap";

@customAttribute('mousetrap')
export class keybinder {
    private focusElem: HTMLInputElement;
    private key: string = 'space';
    

    @bindable({ defaultBindingMode: bindingMode.twoWay }) value: any; // value of input

    constructor(private element: Element) {
    }

    public valueChanged() {
        console.log("changed: ", this.value);
    }

    attached() {
        console.log("attached mousetrap", this.value);
        this.focusElem = this.element as HTMLInputElement;
        

        this.element.addEventListener("focus", () => {
            console.log("focus");
            var e = document.getElementsByClassName("autocomplete-suggestion")[0] as HTMLElement;
            this.toggleDisplay(e);
        });

        this.element.addEventListener("blur", () => {
            console.log("blur");
            var e = document.getElementsByClassName("autocomplete-suggestion")[0] as HTMLElement;
            this.toggleDisplay(e);
        });

        this.element.addEventListener("keydown", (e: KeyboardEvent) => {
            console.log("key", e);

            if (e.keyCode == 13) {
                this.focusElem.blur();
                return false;
            }
        });

        Mousetrap.bind(this.key, () => this.onTrigger());
    }

    onTrigger(this: keybinder) {

        if (this.focusElem) {
            console.log('hit ' + this.key, this);
            this.onFocus();
        }

        return false;
    }

    detached() {
        console.log("detach " + this.key);
        Mousetrap.unbind(this.key);
    }

    onFocus(this: keybinder) {
        this.focusElem.focus();
        var s = this.focusElem.value;

        if (s !== undefined && s.length > 0) {
            this.focusElem.selectionStart = 0;
            this.focusElem.selectionEnd = s.length;
            console.log("selected " + s)
        }
    }

    private toggleDisplay(x: HTMLElement) {
        if (x.style.display === 'none') {
            x.style.display = 'block';
            x.style.width = (this.focusElem.offsetWidth) + "px";
        } else {
            x.style.display = 'none';
        }
    }
}