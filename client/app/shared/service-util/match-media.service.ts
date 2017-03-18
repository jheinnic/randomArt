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
  isPhone()
  {
    return window.matchMedia(this.rules.phone).matches;
  };

  isTablet()
  {
    return window.matchMedia(this.rules.tablet).matches;
  };

  isDesktop()
  {
    return window.matchMedia(this.rules.desktop).matches;
  };

  isPortrait()
  {
    return window.matchMedia(this.rules.portrait).matches;
  };

  isLandscape()
  {
    return window.matchMedia(this.rules.landscape).matches;
  };

  isRetina()
  {
    return window.matchMedia(this.rules.retina).matches;
  };


  /**********************************************
   EVENT LISTENERS BY TYPE
   **********************************************/
  onPhone(callBack)
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

  onTablet(callBack)
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

  onDesktop(callBack)
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

  onPortrait(callBack)
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

  onLandscape(callBack)
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

