import * as React from "react";
import UserInfo from "../listdata/userinfo"
import { AnimeStatus } from "../listdata/api"
import { COLORS, ThemeData } from "../listdata/theme"

interface ThemeEditorProps {
    theme: ThemeData
    onThemeChanged: (newTheme: ThemeData) => void
}

interface UserMenuButtonProps extends ThemeEditorProps {
    isOpened: boolean
    setOpened: (opened: boolean) => void
    currentList: AnimeStatus
    userInfo: UserInfo
    onLogout: () => {}
}

const ThemeEditor = (props: ThemeEditorProps) => {
    return <div className="menu-settings">
        <div className="settings-selector">
            {COLORS.map(color => {
                var className = "item color color-" + color
                if (color == props.theme.color) {
                    className += " selected"
                }
                return <div className={className} onClick={() => props.onThemeChanged(props.theme.with({ color: color }))} />
            })}
        </div>
    </div>
}

const UserMenuButton = (props: UserMenuButtonProps) => {
    const menuRef = React.useRef<HTMLUListElement>()

    let menu: JSX.Element = null;
    if (props.isOpened) {
        menu = <ul className="user-menu" ref={menuRef}>
            <li><a href={props.userInfo.profileUrl} className="with-avatar">
                <span className="avatar"
                    style={props.userInfo.profileImageUrl == null ? {} : {
                        backgroundImage: `url(${props.userInfo.profileImageUrl})`
                    }} />
                {props.userInfo.username}
            </a></li>
            <li><a href={props.userInfo.animeListUrl(props.currentList)}>Anime list</a></li>
            <li><a href={props.userInfo.mangaListUrl}>Manga list</a></li>
            <li className="divider"></li>
            <li><a href="#" onClick={props.onLogout}>Log out</a></li>
            <ThemeEditor theme={props.theme} onThemeChanged={props.onThemeChanged} />
        </ul>
    }

    React.useEffect(() => {
        const onClick = (event: MouseEvent) => {
            if (props.isOpened && menuRef.current &&
                !menuRef.current.contains(event.target as Node)) {
                props.setOpened(false);
                event.preventDefault();
            }
        }

        document.addEventListener("mousedown", onClick);
        return () => {
            document.removeEventListener("mousedown", onClick);
        }
    })

    return <div
        className="header-button user-menu-button icon-user-menu"
        tabIndex={0}
        onClick={_event => props.setOpened(true)}>
        {menu}
    </div>
}

export default UserMenuButton;