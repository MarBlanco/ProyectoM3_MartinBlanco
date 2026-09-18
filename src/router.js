export function getRoute(path) {
    switch (path) {
        case "/chat":
            return "chat";

        case "/about":
            return "about";

        case "/home":
        case "/":
        default:
            return "home";
    }
}