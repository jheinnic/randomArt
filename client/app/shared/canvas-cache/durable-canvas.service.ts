/**
 * Created by jheinnic on 1/5/17.
 */
import {
  Inject, Injector, ApplicationRef, ComponentFactoryResolver, ViewContainerRef
} from "@angular/core";
import {ComponentPortal, DomPortalHost} from "@angular/material";
import {DurableCanvasComponent} from "./durable-canvas.component";
import {DurableCanvasRef} from "./durable-canvas-ref.datamodel";
import {Chance} from "chance";
import * as Immutable from "immutable";


export class DurableCanvasService
{

  private portalHostElement: Element;
  private domPortalHost: DomPortalHost;
  private openRefMap: Immutable.Map<string,DurableCanvasRef> =
    Immutable.Map<string,DurableCanvasRef>();

  constructor(
    @Inject(ComponentFactoryResolver) private readonly _componentFactoryResolver: ComponentFactoryResolver,
    @Inject(ApplicationRef) private readonly _appRef: ApplicationRef,
    @Inject(Injector) private readonly _injector: Injector,
    @Inject(Chance) private readonly _chance
  ) { }

  /**
   * Bootstrap method designed only for use in the pre-appllcation lifecycle stages.
   *
   * @param portalHost
   * @private
   */
  _bootstrapPortalHost(portalHost: Element) {
    this.portalHostElement = portalHost;
    this.domPortalHost = new DomPortalHost(
      portalHost, this._componentFactoryResolver, this._appRef, this._injector);
  }

  /**
   * Creates and dispatches a canvas with the standard controller for registering its
   * partication hosting portals for the application.
   *
   * @param component Component to be instantiated.
   * @param config Extra configuration for the new canvas (Optional).
   * @param viewContainerRef View container to inject the canvas into (Optional).
   */
  // public allocateNew(config, viewContainerRef:ViewContainerRef) {
  public allocateNew(id?: string) {
    // TODO: Collapse Overlay/Container to a single object for our use case here.
    // -- Cached instances are kept invisible, so no need for overlay positioning.
    // -- Cache is for Canvas elements specifically, not arbitrary components/templates.

    // var cachedCanvasRef = this._attachCanvasContent(this.domPortalHost, config,
    // viewContainerRef);
    var refId: string = id || this._chance.guid();
    var cachedCanvasRef: DurableCanvasRef =
      this._attachCanvasContent(this.domPortalHost, refId);
    this.openRefMap = this.openRefMap.set(refId, cachedCanvasRef);

    // Only when canvas is explicitly dismissed, clear the reference to it.
    // Immutable lists implement copy-on-modification, so we must capture the
    // return value to make the delete stick.
    cachedCanvasRef.afterReleased()
      .subscribe(() => {
        this.openRefMap = this.openRefMap.delete(refId);
      });

    return cachedCanvasRef;
  };

  public findById(id: string): DurableCanvasRef {
    return this.openRefMap.get(id);
  }

  public getOrCreate(id: string): DurableCanvasRef {
    let retVal = this.findById(id);
    if (typeof retVal !== 'object') {
      retVal = this.allocateNew(id);
    }
    return retVal;
  }

  /**
   * Places a new component as the content of the snack bar container.
   */
  // _attachCanvasContent(domPortalHost, config, viewContainerRef:ViewContainerRef) {
  _attachCanvasContent(domPortalHost, refId) {
    // var portal = new ComponentPortal(DurableCanvasComponent, viewContainerRef,
    // this._injector);
    var portal = new ComponentPortal(DurableCanvasComponent, undefined, this._injector);
    var contentRef = domPortalHost.attachComponentPortal(portal);
    return new DurableCanvasRef(refId, contentRef, domPortalHost);
  };
}

