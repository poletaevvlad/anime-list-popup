export default class SeriesInfo {
    readonly name: string
    readonly englishName: string
    readonly score: number | null
    readonly coverUrl: string | null
    readonly totalEpisodes: number
    readonly season: string

    constructor(props: {
        name: string,
        englishName: string,
        score: number | null,
        coverUrl: string | null,
        totalEpisodes: number,
        season: string,
    }) {
        this.name = props.name;
        this.englishName = props.englishName;
        this.score = props.score;
        this.coverUrl = props.coverUrl;
        this.totalEpisodes = props.totalEpisodes;
        this.season = props.season
    }
}
