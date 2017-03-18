/**
 * Created by jheinnic on 2/12/17.
 */
import {Injectable} from "@angular/core";
import {AbstractSelection} from "../shared/component-util/abstract-selection.service";
import {ImageChain} from "../shared/sdk/models/ImageChain";

@Injectable()
export class ModalImageChainSelectionService extends AbstractSelection<ImageChain> {

}
