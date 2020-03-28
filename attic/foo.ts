export type Identity<T> = {
  [P in keyof T]: T[P];
}
export type Partial<T> = {
  [P in keyof T]?: T[P]
}
export type Stringify<T> = {
  [P in keyof T]: string
}

export class Foo {
   public fee: number;
   public fi: String;
   public fo: Foo;
   fum() {
     let retVal = '';
     for (let ii=0; ii<this.fee; ii++) {
       retVal += this.fi;
     }
     return retVal;
   }
   boo() {
     return this.moo(this.fee);
   }
   moo(count: number) {
     let retVal = '';
     for (let ii=0; ii<count; ii++) {
       retVal += this.fi;
     }
     return retVal;
   }
}

let foo:Foo = new Foo();
let bar:Identity<Foo> = foo;

foo.fee = 4;
foo.fi = "Hello";

console.log(foo);
console.log(foo.fum);
console.log(foo.fum());
console.log(foo.boo());
console.log(foo.moo(2));

console.log(bar);
console.log(bar.fum);
console.log(bar.fum());
console.log(bar.boo());
console.log(bar.moo(2));

let bee:Partial<Foo> = {
  fee: 3,
  fi: "bart",
  fo: undefined
};
console.log(bee);

let baz:Partial<Foo> = {
  fee: 3,
  fi: "bart",
  fo: undefined,
  fum: () => { return this.fi; },
  boo: () => { return "this"; }
};
console.log(baz);
console.log(baz.fum());
console.log(baz.boo());
console.log(baz.moo? baz.moo(2):undefined);
