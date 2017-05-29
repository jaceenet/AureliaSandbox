import * as Mousetrap from "mousetrap";

export class App {
  message: string;

  constructor() {
    this.message = 'Hello World!';

    Mousetrap.bind('ctrl+k', function () { console.log('command shift k'); return false; });
  }

}
