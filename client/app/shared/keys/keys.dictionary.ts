import {OpaqueToken} from "@angular/core";

export interface DIKeys {
  apiUriHost: OpaqueToken,
  authHomeRoute: OpaqueToken,
  authFailRoute: OpaqueToken,
  chance: OpaqueToken,
  googleLoginUrl: OpaqueToken
};

export const DIKeys = {
  apiUriHost: new OpaqueToken("apiUriHost"),
  authHomeRoute: new OpaqueToken("authHomeRoute"),
  authFailRoute: new OpaqueToken("authFailRoute"),
  chance: new OpaqueToken("chance"),
  googleLoginUrl: new OpaqueToken("googleLoginUrl")
}
