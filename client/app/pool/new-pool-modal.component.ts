import {Component} from "@angular/core";
import {MdDialogRef} from "@angular/material";
import {ModalImageChainSelectionService} from "./modal-image-chain-selection.service";
import {Partial} from "../../../common/lib/datamodel-ts/index";
import {LoopBackConfig} from "../shared/sdk/lb.config";
import {BASE_URL, API_VERSION} from "../shared/base-url.values";
import {PoolApi} from "../shared/sdk/services/custom/Pool";
import {Pool} from "../shared/sdk/models/Pool";
import {ImageChain} from "../shared/sdk/models/ImageChain";
import {Observable} from "rxjs/Observable";

interface Credentials
{
  username: string | null;
  password: string | null;
}

@Component(
  {
    moduleId: 'client/app/pool/new-pool-modal.component',
    selector: 'new-pool-modal',
    templateUrl: '_new-pool-modal.view.html'
    // host: {
    //   '[class.d-flex]': 'true',
    //   '[class.flex-column]': 'true'
    // }
  }
)
export class NewPoolModalComponent
{
  private newPool: Partial<Pool>;
  private error: any;

  constructor(
    private readonly modalRef: MdDialogRef<NewPoolModalComponent>,
    private readonly chainSelectSvc: ModalImageChainSelectionService,
    private readonly poolApi: PoolApi
  ) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.newPool = {
      name: "string"
    }
  };

  isSelectedChain(chainModel: ImageChain) {
    return this.chainSelectSvc.selected !== chainModel;
  }

  selectChain(chainModel: ImageChain) {
    this.chainSelectSvc.selected = chainModel;
  }

  // This close function doesn't need to use jQuery or bootstrap, because
  // the button has the 'data-dismiss' attribute.

  create() {
    return this.poolApi.create(this.newPool)
      .subscribe((poolData) => {
        this.modalRef.close(poolData);
        return poolData;
      }, (error) => {
        console.error("Failed to create pool with " + this.newPool + " model.", error);

        // TODO: Keep the modal open and display the error there
        this.showError(error);
        return Observable.throw(error);
      });
  }

  private showError(error) {
    this.error = error;
  }

  private hideError() {
    this.error = null;
  }
}
