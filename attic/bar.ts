export class Thing {
  constructor(public name: string) { }
}

export class Utils {
  static foo(self: Thing) {
    return self.name;
  }

  static bar(self: Thing, count: number) {
    let retVal = '';
    for( let ii=0; ii<count; ii++ ) {
      retVal += self.name;
    }
    return retVal;
  }
}

let it:Thing = new Thing('it');
console.log(it);
console.log(Utils.foo(it));
console.log(Utils.bar(it, 2));

