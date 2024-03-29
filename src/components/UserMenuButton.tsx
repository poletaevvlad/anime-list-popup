import * as React from "react";
import { User, AnimeListType, AnimeStatus } from "../model";
import { COLORS, Config, BRIGHTNESES } from "../model/config";

const BRIGHTNESS_LABELS = { dark: "Dark", auto: "Auto", light: "Light" };

interface ThemeEditorProps {
  config: Config;
  onThemeChanged: (newConfig: Config) => void;
}

interface UserMenuButtonProps extends ThemeEditorProps {
  isOpened: boolean;
  setOpened: (opened: boolean) => void;
  currentList: AnimeListType;
  user: User;
  onLogout: () => void;
}

const ThemeEditor = (props: ThemeEditorProps) => {
  return (
    <li className="menu-settings">
      <div className="settings-selector">
        {BRIGHTNESES.map((brightness) => {
          let className = "item text";
          if (brightness == props.config.brightness) {
            className += " selected";
          }
          return (
            <div
              key={brightness}
              className={className}
              tabIndex={0}
              onClick={() =>
                props.onThemeChanged(
                  props.config.with({ brightness: brightness })
                )
              }
              onKeyPress={(event) =>
                event.key == "Enter" &&
                props.onThemeChanged(
                  props.config.with({ brightness: brightness })
                )
              }
            >
              {BRIGHTNESS_LABELS[brightness]}
            </div>
          );
        })}
      </div>
      <div className="settings-selector">
        {COLORS.map((color) => {
          let className = "item color color-" + color;
          if (color == props.config.color) {
            className += " selected";
          }
          return (
            <div
              key={color}
              className={className}
              tabIndex={0}
              onClick={() =>
                props.onThemeChanged(props.config.with({ color: color }))
              }
              onKeyPress={(event) =>
                event.key == "Enter" &&
                props.onThemeChanged(props.config.with({ color: color }))
              }
            />
          );
        })}
      </div>
    </li>
  );
};

const UserMenuButton = (props: UserMenuButtonProps) => {
  const menuRef = React.useRef<HTMLUListElement>();

  let menu: JSX.Element = null;
  if (props.isOpened) {
    menu = (
      <ul className="user-menu" ref={menuRef}>
        <li>
          <a href={props.user.profileUrl} className="with-avatar">
            <span
              className="avatar"
              style={
                props.user.profileImageUrl
                  ? { backgroundImage: `url(${props.user.profileImageUrl})` }
                  : {}
              }
            />
            {props.user.username}
          </a>
        </li>
        <li>
          <a
            href={props.user.animeListUrl(
              props.currentList == AnimeListType.SearchResults
                ? undefined
                : (props.currentList as string as AnimeStatus)
            )}
          >
            Anime list
          </a>
        </li>
        <li>
          <a href={props.user.mangaListUrl}>Manga list</a>
        </li>
        <li>
          <a href="https://myanimelist.net/">Go to MyAnimeList</a>
        </li>
        <li className="divider"></li>
        <li>
          <a href="#" onClick={props.onLogout}>
            Log out
          </a>
        </li>
        <ThemeEditor
          config={props.config}
          onThemeChanged={props.onThemeChanged}
        />
      </ul>
    );
  }

  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        props.isOpened &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        props.setOpened(false);
        event.preventDefault();
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("mousedown", onClick);
    };
  });

  return (
    <div
      className="header-button user-menu-button icon-user-menu"
      tabIndex={0}
      onClick={() => props.setOpened(true)}
      onKeyPress={(event) => event.key == "Enter" && props.setOpened(true)}
    >
      {menu}
    </div>
  );
};

export default UserMenuButton;
