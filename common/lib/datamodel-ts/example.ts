/**
 * Created by jheinnic on 1/1/17.
 */
import {DataModel} from "./index";

@DataModel({
  name: 'frank',
  builder: 'apple'
})
export class Example {
  id: number;
  name: string;
}
