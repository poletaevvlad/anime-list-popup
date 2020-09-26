import AccessToken from "./token";

export default class Auth {
    private token: AccessToken;

    constructor(token: AccessToken) {
        this.token = token;
    }

    static async create(): Promise<Auth> {
        const token = await AccessToken.load();
        return new Auth(token);
    }
}