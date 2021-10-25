import * as browser from "webextension-polyfill";

export type ThemeBrightness = "light" | "dark" | "auto"
export type ThemeColor = "orange" | "green" | "purple" | "red" | "cyan" | "blue"

export const COLORS: ThemeColor[] = ["orange", "green", "purple", "red", "cyan", "blue"]
export const BRIGHTNESES: ThemeBrightness[] = ["dark", "auto", "light"]

interface ThemeDataStorage {
    brightness: ThemeBrightness
    color: ThemeColor
}

export class ThemeData {
    readonly brightness: ThemeBrightness
    readonly color: ThemeColor

    static readonly DEFAULT_THEME = new ThemeData("auto", "orange");

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

    get rootClassName(): string {
        return `color-${this.color} brightness-${this.brightness}`
    }

    static async load(): Promise<ThemeData> {
        const result = await browser.storage.sync.get("theme")
        if (typeof (result["theme"]) == "undefined") {
            return ThemeData.DEFAULT_THEME
        }
        const saved: ThemeDataStorage = result["theme"]
        return new ThemeData(saved.brightness, saved.color)
    }

    save(): Promise<void> {
        const data: ThemeDataStorage = {
            brightness: this.brightness,
            color: this.color
        }
        return browser.storage.sync.set({ theme: data })
    }
}