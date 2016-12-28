import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';

export const TITLE_VALUE:OpaqueToken = new OpaqueToken("TITLE_VALUE");

@Injectable()
export class Title {
  data: Object = {
    value: 'Angular 2'
  };

  // constructor(value:string = 'Portfolio Home') {
  constructor(@Optional() @Inject(TITLE_VALUE) value:string = 'Portfolio Home') {
    this.data = { value: value };
  }

  getData() {
    console.log('Title#getData(): Get Data');
    // return this.http.get('/assets/data.json')
    // .map(res => res.json());
    return this.data;
  }
}
