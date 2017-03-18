import {Component, Directive} from '@angular/core';

@Directive({
  selector: '[blank-area]',
  host:{
    '[class.flex-fill]': 'true'
  }
})
export class BlankAreaDirective {
}
