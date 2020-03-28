import {Directive} from "@angular/core";

@Directive({
  // moduleId: "app/shared/blank-area/flex-spacer.directive",
  selector: "[flex-spacer]",
  host:{
    "[class.flex-spacer]": "true"
  }
})
export class FlexSpacerDirective {
}
