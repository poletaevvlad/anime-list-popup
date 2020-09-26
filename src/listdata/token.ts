import { browser } from "webextension-polyfill-ts";

type AccessTokenProperties = {
    accessToken: String,
    refreshToken: String,
    issuedDate: number,
    expiresIn: number
};

export default class AccessToken {
    readonly issuedDate: number;
    readonly refreshToken: String;
    readonly accessToken: String;
    readonly expiresIn: number;

    constructor(properties: AccessTokenProperties) {
        this.accessToken = properties.accessToken;
        this.refreshToken = properties.refreshToken;
        this.issuedDate = properties.issuedDate;
        this.expiresIn = properties.expiresIn;
    }

    isExpired: boolean
    get() {
        return new Date().getTime() > this.issuedDate + this.expiresIn;
    }

    static load(): Promise<AccessToken> {
        return browser.storage.local.get("access_token").then(
            (results) => {
                if (typeof (results["access_token"]) == "undefined") {
                    return null;
                }
                const properties = results["access_token"] as AccessTokenProperties
                return new AccessToken(properties);
            },
            () => null,
        );
    }

    save(): Promise<void> {
        const properties: AccessTokenProperties = {
            issuedDate: this.issuedDate,
            refreshToken: this.refreshToken,
            accessToken: this.accessToken,
            expiresIn: this.expiresIn,

        };
        return browser.storage.local.set({ access_token: properties });
    }
}