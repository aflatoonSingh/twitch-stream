//Create a JSONP Request. Creates a Script element.
let jsonp = {
    callbackCounter: 0,

    fetch: function(url, callback) {
        let fn = 'callback_' + this.callbackCounter++;
        window[fn] = this.evalJSONP(callback);
        url = url.replace('=callbackfn', '=' + fn);

        let scriptTag = document.createElement('SCRIPT');
        //When no data available api is returning 404 to handle that i am calling empty data.
        
        scriptTag.addEventListener('error', function () {
          let data = {};
          data._total = 0;
          fn (data);
        });
        scriptTag.src = url;
        try {
          document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
        }
        catch (e) {
          //suppress the error message on the console.
          console.info (e);
        }
    },

    evalJSONP: function(callback) {
        return function(data) {
            let validJSON = false;
        if (typeof data == "string") {
            try {
              validJSON = JSON.parse(data);
            } catch (e) {
                throw (e);
            }
        } else {
            validJSON = JSON.parse(JSON.stringify(data));
            }
            if (validJSON) {
                callback(validJSON);
            } else {
                throw("JSONP call returned invalid or empty JSON");
            }
        }
    }
}
//Parse Query String from URL.
function getQueryVariable(url, variable) {
    let query = url.split('?')[1];
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return 0;
}
