import {OpaqueToken} from "@angular/core";

export interface DIKeys {
  authHomeRoute: OpaqueToken,
  authFailRoute: OpaqueToken
};

export const DIKeys = {
  apiUriHost: new OpaqueToken("apiUriHost"),
  authHomeRoute: new OpaqueToken("authHomeRoute"),
  authFailRoute: new OpaqueToken("authFailRoute"),
  chance: new OpaqueToken("chance"),
  googleLoginUrl: new OpaqueToken("googleLoginUrl")
}
