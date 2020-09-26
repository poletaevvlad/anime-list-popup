import AccessToken from "./listdata/token";

window.onload = () => {
    AccessToken.load().then((value) => {
        document.body.innerHTML = String(value);
    });
}