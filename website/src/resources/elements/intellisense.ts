import { bindable, bindingMode, autoinject } from "aurelia-framework";
import { Nest } from "./nest";
import { HttpClient } from "aurelia-fetch-client";

export class Intellisense {
    private inputElement: HTMLInputElement;
    private suggestElement: HTMLDivElement;
    private items: any[];
    private selectedIndex: number;
    private nest: Nest;

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    querytext: string;

    constructor(private element: Element) {
        this.items = [];
        this.items = this.query("");
        this.selectedIndex = -1;
        this.nest = new Nest("http://192.168.10.25:9200", new HttpClient());
        this.nest.query("25").then(data => {console.log("search",data)});
    }

    attached() {
        this.suggestElement.style.width = (this.inputElement.offsetWidth) + "px";
        this.inputElement.addEventListener("focus", e => this.onfocus());
        this.inputElement.addEventListener("blur", e => this.onblur());

        this.inputElement.addEventListener("keydown", (e: KeyboardEvent) => {
            //console.log("keydown intelli, ", e);

            if (e.keyCode == 9) {
                this.moveIndex(this.selectedIndex + 1);
                e.preventDefault();
                return false;
            }

            if (e.keyCode == 40) { //down
                this.moveIndex(this.selectedIndex + 1);
                return false;
            }

            if (e.keyCode == 38) { //up
                this.moveIndex(this.selectedIndex - 1);
                return false;
            }

            if (e.keyCode == 13) {
                this.setIndex(this.selectedIndex);
                return true;
            }

            return true;
        })

        //console.log("Attached fixed: ", this.inputElement, this.suggestElement);
    }

    querytextChanged() {

        //console.log("query changed", this.querytext);
        this.items = this.query(this.querytext);
    }

    clicklink(index: number) {
        this.setIndex(index);
        return true;
    }

    setIndex(index: number) {

        //console.log("setindex ", index, event);
        if (index < this.items.length) {
            this.selectedIndex = index;
            this.inputElement.value = this.items[index].name;
        }

    }

    private toggleDisplay(x: HTMLElement) {
        if (x.style.display === 'none') {
            x.style.display = 'block';
            //x.style.width = (this.suggestElement.offsetWidth) + "px";
        } else {
            x.style.display = 'none';
        }
    }

    onfocus(this: Intellisense) {
        //console.log("focus")
        this.items = this.query(this.querytext);
        this.toggleDisplay(this.suggestElement);
    }

    onblur(this: Intellisense) {
        //console.log("blur: ")
        this.selectedIndex = -1;
        this.toggleDisplay(this.suggestElement);
    }

    query(value: string) {
        //console.log("executing query: " + value);

        var cache = this.simpleQuery(value, cache);
        cache = this.filterQuery(value, cache);
        cache = this.advancedSearch(value, cache);
        return this.highlightSearch(value, cache);;
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

        if (position >= 0) {
            var s = this.items[this.selectedIndex].name
            this.inputElement.value = s;
            this.inputElement.selectionStart = s.length;
            this.inputElement.selectionEnd = s.length;
        }

        //console.log("selectedIndex =" + this.selectedIndex);
    }

    //queryMatch(token: string[], query: string, callback: () => string[]){
    queryMatch(tokens: string[], query: string): boolean {
        if (query == undefined) return;
        if (tokens == undefined || tokens.length == 0) return;
        //console.log("matching...", tokens.filter(s => query.endsWith(s)));
        var match = tokens.filter(s => query.endsWith(s)).length > 0;



        return match;

    }

    advancedSearch(query: string = "", cache: any[] = []): suggestItem[] {
        console.log("advanced: ", query, " cache: ", cache);

        if (query == undefined || query.length == 0) {
            cache.push({ "name": "who" })

            cache.push({ "name": "in" })
            cache.push({ "name": "where" })
        }

        if (this.queryMatch([" i"], query)) {
            cache.push({ "name": query + " alle udbudsgrupper" });
            cache.push({ "name": query + " alle regioner" });
            cache.push({ "name": query + " alle atc koder" });
            cache.push({ "name": query + " alle steder" });
            cache.push({ "name": query + " list emner" });
        }


        if (this.queryMatch([" fra"], query)) {

            for (var year = 2000; year < 2025; year++) {
                cache.push({ "name": query + " " + year });
            }

        }

        return cache;
    }

    simpleQuery(query: string = "", cache: suggestItem[] = []) : suggestItem[] {
        
        console.log("simple query: ", query, " cache: ", cache);

        if (query == undefined || query.length > 0) {
            cache.push({ "name": "Who is Donald Trump" });
            cache.push({ "name": "give medical care to crossword" });
            cache.push({ "name": "who can ask more of a man" });
            cache.push({ "name": "is design thinking the new liberal arts" });
            cache.push({ "name": "who demanded nothing less than a revolution in the government of the country" });
            cache.push({ "name": "be more productive" });
            cache.push({ "name": "who rules the world noam chomsky" });
        }

        return cache;
    }

    filterQuery(query: string = "", cache: suggestItem[]) : suggestItem[]{
        return cache.filter(s => s.name.toLowerCase().indexOf(query.toLowerCase()) >= 0);
    }

    highlightSearch(query: string = "", items: suggestItem[]):any[]{
        

        var item_mod = items.map(mod => {

            var i = mod.name.toLowerCase().indexOf(query.toLowerCase());
            var b = mod.name.substring(0, i);

            return {
                "name": mod.name, 
                "begin": mod.name.substring(0, i),
                "match": query,
                "end": mod.name.substring(b.length + query.length)
            };
                
        });
        
        return item_mod;
    }
}

export interface suggestItem{
    name: string;
}