import { customAttribute, bindable, bindingMode } from "aurelia-framework";
import * as Mousetrap from "mousetrap";

@customAttribute('mousetrap')
export class keybinder {
    private focusElem: HTMLInputElement;
    private key: string = 'space';
    
    @bindable({ defaultBindingMode: bindingMode.twoWay }) value: any; // value of input

    constructor(private element: Element) {
        this.focusElem = element as HTMLInputElement;
    }

    attached() {
        console.log("attached mousetrap", this.element);

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
}