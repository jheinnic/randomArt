/**
 * Created by jheinnic on 2/11/17.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class MatchMediaService
{
  constructor()
  {

  }

  rules =
    {
      print: "print",
      screen: "screen",
      phone: '(max-width: 767px)',
      tablet: '(min-width: 768px) and (max-width: 1024px)',
      desktop: '(min-width: 1025px)',
      portrait: '(orientation: portrait)',
      landscape: '(orientation: landscape)',
      retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'
    };

  Check = function (mq)
  {
    if (!mq)
    {
      return;
    }

    return window.matchMedia(mq).matches;
  };

  /**********************************************
   METHODS FOR CHECKING TYPE
   **********************************************/
  IsPhone()
  {
    return window.matchMedia(this.rules.phone).matches;
  };

  IsTablet = function ()
  {
    return window.matchMedia(this.rules.tablet).matches;
  };

  IsDesktop = function ()
  {
    return window.matchMedia(this.rules.desktop).matches;
  };

  IsPortrait = function ()
  {
    return window.matchMedia(this.rules.portrait).matches;
  };

  IsLandscape = function ()
  {
    return window.matchMedia(this.rules.landscape).matches;
  };

  IsRetina = function ()
  {
    return window.matchMedia(this.rules.retina).matches;
  };


  /**********************************************
   EVENT LISTENERS BY TYPE
   **********************************************/
  OnPhone(callBack)
  {
    if (typeof callBack === 'function')
    {
      var mql: MediaQueryList = window.matchMedia(this.rules.phone);

      mql.addListener((mql: MediaQueryList) =>
      {
        if (mql.matches)
        {
          callBack(mql);
        }
      });
    }
  };

  OnTablet(callBack)
  {
    if (typeof callBack === 'function')
    {
      var mql: MediaQueryList = window.matchMedia(this.rules.tablet);

      mql.addListener((mql: MediaQueryList) =>
      {
        if (mql.matches)
        {
          callBack(mql);
        }
      });
    }
  };

  OnDesktop(callBack)
  {
    if (typeof callBack === 'function')
    {
      var mql: MediaQueryList = window.matchMedia(this.rules.desktop);

      mql.addListener((mql: MediaQueryList) =>
      {
        if (mql.matches)
        {
          callBack(mql);
        }
      });
    }
  };

  OnPortrait(callBack)
  {
    if (typeof callBack === 'function')
    {
      var mql: MediaQueryList = window.matchMedia(this.rules.portrait);

      mql.addListener((mql: MediaQueryList) =>
      {
        if (mql.matches)
        {
          callBack(mql);
        }
      });
    }
  };

  OnLandscape(callBack)
  {
    if (typeof callBack === 'function')
    {
      var mql: MediaQueryList = window.matchMedia(this.rules.landscape);

      mql.addListener((mql: MediaQueryList) =>
      {
        if (mql.matches)
        {
          callBack(mql);
        }
      });
    }
  };
}

