import {Component} from "@angular/core";
import * as path from "path";

@Component({
  moduleId   : path.relative(__dirname, __filename),
  selector   : 'floating-actions',
  template: require('./_floating-actions.view.html'),
})
export class FloatingActionsComponent
{

}
