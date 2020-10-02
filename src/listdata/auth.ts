import AccessToken from "./token";

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