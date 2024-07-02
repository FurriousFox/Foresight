if (localStorage.getItem("api-key") == null || localStorage.getItem("user-id") == null) {
    document.body.innerHTML = "<form id=\"token\">please input your <a href=\"https://habitica.com/user/settings/siteData\" target=\"_blank\">api key</a>: <input type=\"password\" id=\"apikey\"> and <a href=\"https://habitica.com/user/settings/siteData\" target=\"_blank\">user id</a>: <input id=\"userid\" type=\"text\"><input type=\"submit\" value=\"Login\" /></form>";
    document.getElementById("token").addEventListener("submit", function (e) {
        e.preventDefault();
        localStorage.setItem("api-key", document.getElementById("apikey").value);
        localStorage.setItem("user-id", document.getElementById("userid").value);
        location.reload();
    });
} else {
    // date picker and dailies list
}