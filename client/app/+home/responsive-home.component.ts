/**
 * Created by jheinnic on 2/11/17.
 */
import {Component, OnInit, NgZone} from "@angular/core";
import {MatchMediaService} from "../shared/service-util/match-media.service";
// import { HomeMobileComponent } from './home-mobile.component';
// import { HomeDesktopComponent } from './home-desktop.component';

@Component({
  // moduleId: module.id,
  selector: 'home.component',
  templateUrl: 'home.component.html',
  providers: [MatchMediaService]
  // directives: [ HomeMobileComponent, HomeDesktopComponent ]
})
export class ResponsiveHomeComponent implements OnInit
{
  isMobile: Boolean = false;
  isDesktop: Boolean = false;

  constructor(
    private matchMediaService: MatchMediaService, private zone: NgZone
  ) {
    //GET INITIAL VALUE BASED ON DEVICE WIDTHS AT TIME THE APP RENDERS
    this.isMobile = (this.matchMediaService.isPhone() || this.matchMediaService.isTablet());
    this.isDesktop = (this.matchMediaService.isDesktop());

    var that = this;


    /*---------------------------------------------------
     TAP INTO LISTENERS FOR WHEN DEVICE WIDTH CHANGES
     ---------------------------------------------------*/

    this.matchMediaService.onPhone(function (mediaQueryList: MediaQueryList) {
      that.ShowMobile();
    });

    this.matchMediaService.onTablet(function (mediaQueryList: MediaQueryList) {
      that.ShowMobile(); // TODO: ShowMobile() or ShowDesktop() !?
    });

    this.matchMediaService.onDesktop(function (mediaQueryList: MediaQueryList) {
      that.ShowDesktop()
    });
  }

  ngOnInit() {

  }

  ShowMobile() {
    this.zone.run(() => { // Change the property within the zone, CD will run after
      this.isMobile = true;
      this.isDesktop = false;
    });
  }

  ShowDesktop() {
    this.zone.run(() => { // Change the property within the zone, CD will run after
      this.isMobile = false;
      this.isDesktop = true;
    });
  }
}
