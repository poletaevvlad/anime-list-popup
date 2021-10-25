export default class SeriesInfo {
    readonly id: number
    readonly name: string
    readonly englishName: string
    readonly score: number | null
    readonly coverUrl: string | null
    readonly totalEpisodes: number
    readonly season?: string

    constructor(props: {
        id: number,
        name: string,
        englishName: string,
        score: number | null,
        coverUrl: string | null,
        totalEpisodes: number,
        season?: string,
    }) {
        this.id = props.id;
        this.name = props.name;
        this.englishName = props.englishName;
        this.score = props.score;
        this.coverUrl = props.coverUrl;
        this.totalEpisodes = props.totalEpisodes;
        this.season = props.season
    }

    get pageUrl(): string {
        return "https://myanimelist.net/anime/" + this.id.toString();
    }
}
