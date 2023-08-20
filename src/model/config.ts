import * as browser from "webextension-polyfill";
import { ListSortOrder } from ".";

export type ThemeBrightness = "light" | "dark" | "auto";
export type ThemeColor =
  | "orange"
  | "green"
  | "purple"
  | "red"
  | "cyan"
  | "blue";

export const COLORS: ThemeColor[] = [
  "orange",
  "green",
  "purple",
  "red",
  "cyan",
  "blue",
];
export const BRIGHTNESES: ThemeBrightness[] = ["dark", "auto", "light"];

interface ThemeDataStorage {
  brightness: ThemeBrightness;
  color: ThemeColor;
}

type ConfigValues = {
  brightness: ThemeBrightness;
  color: ThemeColor;
  listOrder: ListSortOrder;
};

export class Config {
  private readonly data: ConfigValues;

  get brightness(): ThemeBrightness {
    return this.data.brightness;
  }

  get color(): ThemeColor {
    return this.data.color;
  }

  get listOrder(): ListSortOrder {
    return this.data.listOrder;
  }

  constructor(data: ConfigValues) {
    this.data = data;
  }

  static readonly DEFAULT: ConfigValues = {
    brightness: "auto",
    color: "orange",
    listOrder: ListSortOrder.Title,
  };

  with(change: Partial<ConfigValues>): Config {
    return new Config({ ...this.data, ...change });
  }

  get rootClassName(): string {
    return `color-${this.data.color} brightness-${this.data.brightness}`;
  }

  static async load(): Promise<Config> {
    const config = { ...Config.DEFAULT };

    const result = await browser.storage.sync.get(["theme", "order"]);
    if (typeof result["theme"] != "undefined") {
      const saved: ThemeDataStorage = result["theme"];
      config.brightness = saved.brightness;
      config.color = saved.color;
    }

    if (typeof result["order"] != "undefined") {
      config.listOrder = result["order"];
    }

    return new Config(config);
  }

  save(): Promise<void> {
    const themeData: ThemeDataStorage = {
      brightness: this.data.brightness,
      color: this.data.color,
    };
    return browser.storage.sync.set({
      theme: themeData,
      order: this.data.listOrder,
    });
  }
}
