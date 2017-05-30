import { bindable, bindingMode } from "aurelia-framework";


export class Intellisense {
    private inputElement: HTMLInputElement;
    private suggestElement: HTMLDivElement;
    private items: any[];
    private selectedIndex: number;

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    querytext: string;

    constructor(private element: Element) {
        this.items = [];
        this.items = this.query("");
        this.selectedIndex = -1;
    }

    attached() {
        this.suggestElement.style.width = (this.inputElement.offsetWidth) + "px";
        this.inputElement.addEventListener("focus", e => this.onfocus());
        this.inputElement.addEventListener("blur", e => this.onblur());

        this.inputElement.addEventListener("keydown", (e: KeyboardEvent) => {
            console.log("keydown intelli, ", e);

            if (e.keyCode == 40) { //down
                this.moveIndex(this.selectedIndex + 1);
                return false;
            }

            if (e.keyCode == 38) { //up
                this.moveIndex(this.selectedIndex - 1);
                return false;
            }

            if (e.keyCode == 13) {                
                this.inputElement.value = this.items[this.selectedIndex].name;
                return true;
            }

            return true;
        })

        console.log("Attached fixed: ", this.inputElement, this.suggestElement);
    }

    querytextChanged() {

        console.log("query changed", this.querytext);
        this.items = this.query(this.querytext);
    }

    private toggleDisplay(x: HTMLElement) {
        if (x.style.display === 'none') {
            x.style.display = 'block';
            x.style.width = (this.suggestElement.offsetWidth) + "px";
        } else {
            x.style.display = 'none';
        }
    }

    onfocus(this: Intellisense) {
        console.log("focus")
        this.items = this.query(this.querytext);
        this.toggleDisplay(this.suggestElement);
    }

    onblur(this: Intellisense) {
        console.log("blur: ")
        this.selectedIndex = -1;
        this.toggleDisplay(this.suggestElement);
    }


    query(value: string) {
        console.log("executing query: " + value);
        var cache = [
            { "name": "John" },
            { "name": "John Doe" },
            { "name": "Jane Doe" },
            { "name": "Stuff" },
            { "name": "Who is" },
            { "name": "Who is Donald" }
        ];

        if (value === undefined || value.length == 0) {
            return cache;
        }

        return cache.filter(s => s.name.startsWith(value));
    }

    moveIndex(position: number) {

        if (position == this.items.length || position < 0) {
            this.selectedIndex = 0;
        }
        else if (position < this.items.length) {
            this.selectedIndex = position;
        }
        else {
            this.selectedIndex = position;
        }

        if (position >= 0){
            var s  = this.items[this.selectedIndex].name
            this.inputElement.value = s;
            this.inputElement.selectionStart = s.length;
            this.inputElement.selectionEnd = s.length;
        }

        console.log("selectedIndex =" + this.selectedIndex);
    }
}