import * as React from "react";
import UserInfo from "../../listdata/userinfo"

interface UserMenuButtonProps {
    userInfo: UserInfo;
}

const UserMenuButton = (props: UserMenuButtonProps) => {
    const [isOpened, setOpened] = React.useState(false)
    const menuRef = React.useRef<HTMLDivElement>()

    let menu: JSX.Element = null;
    if (isOpened) {
        menu = <div className="user-menu" ref={menuRef}>
            <ul className="user-menu-inner">
                <li><a href={props.userInfo.profileUrl} className="with-avatar">
                    <span className="avatar"
                        style={props.userInfo.profileImageUrl == null ? {} : {
                            backgroundImage: `url(${props.userInfo.profileImageUrl})`
                        }} />
                    {props.userInfo.username}
                </a></li>
                <li><a href={props.userInfo.animeListUrl}>Anime list</a></li>
                <li><a href={props.userInfo.mangaListUrl}>Manga list</a></li>
            </ul>
        </div>
    }

    React.useEffect(() => {
        const onClick = (event: MouseEvent) => {
            if (isOpened && menuRef.current &&
                !menuRef.current.contains(event.target as Node)) {
                setOpened(false);
            }
        }

        document.addEventListener("mousedown", onClick);
        return () => {
            document.removeEventListener("mousedown", onClick);
        }
    })

    return <div
        className="header-button user-menu-button"
        tabIndex={0}
        onClick={_event => setOpened(true)}>
        {menu}
    </div>
}

export default UserMenuButton;