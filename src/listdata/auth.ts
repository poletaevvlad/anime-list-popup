import { browser } from "webextension-polyfill-ts";

import AccessToken from "./token";

const CLIENT_ID = "d654978c44a0b252febf4edb3d1a65d7";
const CODE_CHALLENGE = "0123456798abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";

function generateCodeChallenge(): string {
    const result: string[] = [];
    const randomVals = new Uint8Array(96);
    crypto.getRandomValues(randomVals);

    for (var i = 0; i < randomVals.length; i += 3) {
        var accumulator = randomVals[i] << 16 | randomVals[i + 1] << 8 | randomVals[i + 2];

        var offset = 18;
        for (var j = 0; j < 4; j++) {
            result.push(CODE_CHALLENGE[(accumulator >> offset) & 63]);
            offset -= 6;
        }
    }

    return result.join("");
}

function constructUrl(baseUrl: string, query: { [key: string]: string }): string {
    const queryParams: string[] = [];
    for (var key in query) {
        queryParams.push(key + "=" + encodeURIComponent(query[key]));
    }
    return baseUrl + "?" + queryParams.join("&");
}

export default class Auth {
    private token: AccessToken;

    constructor(token: AccessToken) {
        this.token = token;
    }

    static async create(): Promise<Auth> {
        const token = await AccessToken.load();
        return new Auth(token);
    }

    static launchAuthentication() {
        const codeChallenge = generateCodeChallenge();
        const baseUrl = "https://myanimelist.net/v1/oauth2/authorize";
        const params = {
            "response_type": "code",
            "client_id": CLIENT_ID,
            "code_challenge": codeChallenge,
            "code_challenge_method": "plain",
            "redirect_uri": browser.identity.getRedirectURL(),
        }

        console.log(constructUrl(baseUrl, params));

        browser.identity.launchWebAuthFlow({
            url: constructUrl(baseUrl, params),
            interactive: true,
        }).then((x) => console.log(x));
    }
}