export type ThemeBrightnes = "light" | "dark" | "auto"
export type ThemeColor = "orange" | "green" | "purple" | "red" | "cyan" | "blue"

export const COLORS: ThemeColor[] = ["orange", "green", "purple", "red", "cyan", "blue"]

export class ThemeData {
    readonly brightnes: ThemeBrightnes
    readonly color: ThemeColor

    constructor(brightnes: ThemeBrightnes, color: ThemeColor) {
        this.brightnes = brightnes
        this.color = color
    }

    with({ color, brightnes }: { color?: ThemeColor, brightnes?: ThemeBrightnes }): ThemeData {
        return new ThemeData(
            typeof brightnes == "undefined" ? this.brightnes : brightnes,
            typeof color == "undefined" ? this.color : color,
        )
    }
}