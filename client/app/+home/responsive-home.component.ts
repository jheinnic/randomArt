/**
 * Created by jheinnic on 2/11/17.
 */
import { Component, OnInit, NgZone } from '@angular/core';
import { MatchMediaService } from '../shared/service-util/match-media.service';
import { HomeMobileComponent } from './home-mobile.component';
import { HomeDesktopComponent } from './home-desktop.component';

@Component({
  moduleId: module.id,
  selector: 'home.component',
  templateUrl: 'home.component.html',
  providers: [ MatchMediaService ],
  directives: [ HomeMobileComponent, HomeDesktopComponent ]
})
export class ResponsiveHomeComponent implements OnInit
{
  IsMobile: Boolean = false;
  IsDesktop: Boolean = false;

  constructor(
    private matchMediaService: MatchMediaService,
    private zone: NgZone
  )
  {
    //GET INITIAL VALUE BASED ON DEVICE WIDTHS AT TIME THE APP RENDERS
    this.IsMobile = (this.matchMediaService.IsPhone() || this.matchMediaService.IsTablet());
    this.IsDesktop = (this.matchMediaService.IsDesktop());

    var that = this;


    /*---------------------------------------------------
     TAP INTO LISTENERS FOR WHEN DEVICE WIDTH CHANGES
     ---------------------------------------------------*/

    this.matchMediaService.OnPhone(
      function (mediaQueryList: MediaQueryList)
      {
        that.ShowMobile();
      }
    );

    this.matchMediaService.OnTablet(
      function (mediaQueryList: MediaQueryList)
      {
        that.ShowMobile();
      }
    );

    this.matchMediaService.OnDesktop(
      function (mediaQueryList: MediaQueryList)
      {
        that.ShowDesktop();
      }
    );
  }

  ngOnInit()
  {

  }

  ShowMobile()
  {
    this.zone.run(() =>
    { // Change the property within the zone, CD will run after
      this.IsMobile = true;
      this.IsDesktop = false;
    });
  }

  ShowDesktop()
  {
    this.zone.run(() =>
    { // Change the property within the zone, CD will run after
      this.IsMobile = false;
      this.IsDesktop = true;
    });
  }
}
