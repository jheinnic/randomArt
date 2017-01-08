import {Component, Directive} from '@angular/core';

@Directive({
  selector: 'span[blank-area]',
  host:{
    '[class.flex-fill]': 'true'
  }
})
export class BlankAreaComponent {
}
