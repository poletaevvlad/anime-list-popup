import Auth from "./auth";
import UserInfo from "./userinfo";

export default class API {
    private auth: Auth;

    constructor(auth: Auth) {
        this.auth = auth;
    }

    private makeApiCall(
        url: string,
        options: { method?: string, body?: any }
    ): Promise<any> {
        return fetch(url, {
            method: options.method || "GET",
            body: options.body,
            headers: {
                "Authorization": "Bearer " + this.auth.token.accessToken
            }
        }).then(response => response.json());
    }

    async getUserInfo(): Promise<UserInfo> {
        const data = await this.makeApiCall(
            "https://api.myanimelist.net/v2/users/@me", {}
        );
        return new UserInfo(data["name"] as string, data["picture"] as string);
    }
}