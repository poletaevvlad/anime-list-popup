export type ThemeBrightness = "light" | "dark" | "auto"
export type ThemeColor = "orange" | "green" | "purple" | "red" | "cyan" | "blue"

export const COLORS: ThemeColor[] = ["orange", "green", "purple", "red", "cyan", "blue"]
export const BRIGHTNESES: ThemeBrightness[] = ["dark", "auto", "light"]

export class ThemeData {
    readonly brightness: ThemeBrightness
    readonly color: ThemeColor

    constructor(brightnes: ThemeBrightness, color: ThemeColor) {
        this.brightness = brightnes
        this.color = color
    }

    with({ color, brightness }: { color?: ThemeColor, brightness?: ThemeBrightness }): ThemeData {
        return new ThemeData(
            typeof brightness == "undefined" ? this.brightness : brightness,
            typeof color == "undefined" ? this.color : color,
        )
    }

    get rootClassName(): String {
        return `color-${this.color} brightness-${this.brightness}`
    }
}