import * as browser from "webextension-polyfill";
import { Mutex } from "async-mutex";

import AccessToken from "./token";

const CLIENT_ID = "d654978c44a0b252febf4edb3d1a65d7";
const CODE_CHALLENGE =
  "0123456798abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";

function generateCodeChallenge(): string {
  const result: string[] = [];
  const randomVals = new Uint8Array(96);
  crypto.getRandomValues(randomVals);

  for (var i = 0; i < randomVals.length; i += 3) {
    var accumulator =
      (randomVals[i] << 16) | (randomVals[i + 1] << 8) | randomVals[i + 2];

    var offset = 18;
    for (var j = 0; j < 4; j++) {
      result.push(CODE_CHALLENGE[(accumulator >> offset) & 63]);
      offset -= 6;
    }
  }

  return result.join("");
}

export function constructUrl(
  baseUrl: string,
  query: { [key: string]: string }
): string {
  const queryParams: string[] = [];
  for (var key in query) {
    queryParams.push(key + "=" + encodeURIComponent(query[key]));
  }
  return baseUrl + "?" + queryParams.join("&");
}

function extractQueryParams(url: string, param: string): string | null {
  const separator = url.indexOf("?");
  if (separator == -1) {
    return null;
  }
  const query = url.substr(separator + 1).split("&");
  for (var i = 0; i < query.length; i++) {
    const paramNameSeparator = query[i].indexOf("=");
    if (paramNameSeparator >= -1) {
      const paramName = query[i].substring(0, paramNameSeparator);
      if (paramName == param) {
        const result = query[i].substring(paramNameSeparator + 1);
        return decodeURIComponent(result);
      }
    }
  }
  return null;
}

export default class Auth {
  private token: AccessToken;
  private mutex: Mutex;

  constructor(token: AccessToken) {
    this.token = token;
    this.mutex = new Mutex();
  }

  async getToken(): Promise<string> {
    const release = await this.mutex.acquire();
    try {
      const currentDate = (new Date().getTime() / 1000) | 0;
      const expiresDate =
        (this.token.issuedDate + this.token.expiresIn * 0.9) | 0;
      if (currentDate > expiresDate) {
        this.token = await Auth.renewToken(this.token);
        await this.token.save();
      }
      return this.token.accessToken;
    } finally {
      release();
    }
  }

  private static async tokenFromResponse(response: Response) {
    const token = await response.json();
    if (typeof token["error"] != "undefined") {
      return Promise.reject("Error: " + token["message"]);
    }

    return new AccessToken({
      accessToken: token["access_token"],
      refreshToken: token["refresh_token"],
      expiresIn: token["expires_in"],
      issuedDate: (new Date().getTime() / 1000) | 0,
    });
  }

  private static async renewToken(token: AccessToken): Promise<AccessToken> {
    const tokenBaseUrl = "https://myanimelist.net/v1/oauth2/token";
    const tokenData = new URLSearchParams();
    tokenData.append("client_id", CLIENT_ID);
    tokenData.append("grant_type", "refresh_token");
    tokenData.append("refresh_token", token.refreshToken);

    const tokenResult = await fetch(new Request(tokenBaseUrl), {
      method: "POST",
      body: tokenData,
    });
    return await Auth.tokenFromResponse(tokenResult);
  }

  static async launchAuthentication(): Promise<AccessToken> {
    const codeChallenge = generateCodeChallenge();
    const baseUrl = "https://myanimelist.net/v1/oauth2/authorize";
    const params = {
      response_type: "code",
      client_id: CLIENT_ID,
      code_challenge: codeChallenge,
      code_challenge_method: "plain",
      redirect_uri: browser.identity.getRedirectURL(),
    };

    const redirectURI = await browser.identity.launchWebAuthFlow({
      url: constructUrl(baseUrl, params),
      interactive: true,
    });

    const code = extractQueryParams(redirectURI, "code");
    if (code == null) {
      var hint = extractQueryParams(redirectURI, "hint").split("+").join(" ");
      return Promise.reject("Error: " + hint);
    }

    const tokenBaseUrl = "https://myanimelist.net/v1/oauth2/token";
    const tokenData = new URLSearchParams();
    tokenData.append("client_id", CLIENT_ID);
    tokenData.append("code", code);
    tokenData.append("code_verifier", codeChallenge);
    tokenData.append("grant_type", "authorization_code");
    tokenData.append("redirect_uri", browser.identity.getRedirectURL());

    const tokenResult = await fetch(new Request(tokenBaseUrl), {
      method: "POST",
      body: tokenData,
    });
    return Auth.tokenFromResponse(tokenResult);
  }
}
