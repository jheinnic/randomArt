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
import {Routes, RouterModule} from "@angular/router";

@NgModule({
  declarations: [ScrollMainComponent, ScrollSideComponent, ScrollActionComponent],
  imports: [
    CommonModule, FormsModule, NgbModule, MdButtonModule, MdIconModule,
    RouterModule.forChild(ScrollModule.routes)
  ],
  exports: [ScrollMainComponent, ScrollSideComponent, ScrollActionComponent]
})
export class ScrollModule
{
  static routes: Routes = [
    {
      path: 'scroll',
      pathMatch: 'full',
      component: ScrollMainComponent
    }, {
      path: 'scroll',
      pathMatch: 'full',
      component: ScrollSideComponent,
      outlet: 'side'
    }, {
      path: 'scroll',
      pathMatch: 'full',
      component: ScrollActionComponent,
      outlet: 'action'
    }
  ];

  constructor() { }
}
