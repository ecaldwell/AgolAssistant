function portalVersion(portal, callback) {
    $.ajax({
        url: portal + "sharing/rest?f=json",
        dataType: "json",
        success: function (data) {
            callback(data.currentVersion);
        },
        error: function (data, textStatus, xhr) {
            callback(textStatus);
        }
    });
}

function getToken(portal, username, password, form, callback) {
    "use strict";
    // Define token parameters.
    var token,
        tokenParams = {
            username: username,
            password: password,
            referer: $(location).attr("href"), // URL of the app.
            expiration: 60,
            f: "json"
        };

    //Get session token
    $.ajax({
        url: portal + "sharing/rest/generateToken?",
        type: "POST",
        dataType: "json",
        data: tokenParams,
        success: function (data) {
            if (data.token) {
                callback(data.token);
            } else if (data.error.code === 400) {
                var html = $("#loginErrorTemplate").html();
                $(form).before(html);
                callback();
            } else {
                console.log("Unhandled error.");
                console.log(data);
                callback();
            }
        },
        error: function (response) {
            console.log("Error");
            console.log(response);
        }
    });
}

function userProfile(portal, username, token, callback) {
    $.getJSON(portal + "sharing/rest/community/users/" + username + "?" + $.param({
        token: token,
        f: "json"
    }), function (user) {
        callback(user);
    });
}

function userContent(portal, user, token, callback) {
    var content;
    $.getJSON(portal + "sharing/rest/content/users/" + user + "?" + $.param({
        token: token,
        f: "json"
    }), function (content) {
        $.each(data.items, function (item) {
            var contentData = {
                id: data.items[item].id,
                title: data.items[item].title,
                type: data.items[item].type
            };
            var contentHtml = Mustache.to_html(contentTemplate, contentData);
            $("#collapseRoot").append(contentHtml);
        });
        callback(content);
    });
}

function itemDescription(portal, id, token, callback) {
    $.getJSON(portal + "sharing/rest/content/items/" + id + "?" + $.param({
        token: token,
        f: "json"
    }), function (description) {
        callback(description);
    });
}

function itemData(portal, id, token, callback) {
    $.getJSON(portal + "sharing/rest/content/items/" + id + "/data?" + $.param({
        token: token,
        f: "json"
    }), function (data) {
        callback(data);
    });
}

function arrayToString(array) {
    // Convert an array to a comma separated string.
    var arrayString;
    $.each(array, function (index, arrayValue) {
        if (index === 0) {
            arrayString = arrayValue;
        } else if (index > 0) {
            arrayString = arrayString + "," + arrayValue;
        }
    });
    return arrayString;
}