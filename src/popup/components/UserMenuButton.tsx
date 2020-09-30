import * as React from "react";

const UserMenuButton = () => {
    const [isOpened, setOpened] = React.useState(false)
    const menuRef = React.useRef<HTMLDivElement>()

    let menu: JSX.Element = null;
    if (isOpened) {
        menu = <div className="user-menu" ref={menuRef}>
            <div className="user-menu-inner">
                UserMenu
            </div>
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