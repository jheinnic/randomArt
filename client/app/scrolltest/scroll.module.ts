/**
 * Created by jheinnic on 1/2/17.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ScrollActionComponent} from "./scroll-action.component";
import {ScrollSideComponent} from "./scroll-side.component";
import {ScrollMainComponent} from "./scroll-main.component";
import {MdIconModule, MdButtonModule} from "@angular/material";

@NgModule({
  declarations: [ScrollMainComponent, ScrollSideComponent, ScrollActionComponent],
  imports: [
    CommonModule, FormsModule, NgbModule, MdButtonModule, MdIconModule
  ],
  exports: [ScrollMainComponent, ScrollSideComponent, ScrollActionComponent]
})
export class ScrollModule
{
  constructor() { }
}
