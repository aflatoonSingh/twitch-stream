const CLIENT_ID = 'uo6dggojyb8d6soh92zknwmi5ej1q2';
const SEARCH_URI = 'https://api.twitch.tv/kraken/search/streams';
const LIMIT = 10;

//Make actual JSONP call.
function queryGame (baseURL) {
  let searchURL = baseURL + "&callback=callbackfn&client_id=" + CLIENT_ID;
  jsonp.fetch(searchURL, renderResult);
}

//Call this method when user click Search.
function searchStream () {
  if (document.getElementById('search-query').value != '') {
    let searchQuery = document.getElementById('search-query').value;
    queryGame (SEARCH_URI + "?q=" + searchQuery);
  }
  else {
    alert('Add valid Search Query, Please!');
  }
  
}

//Call this method when user click Previous or Next button.
function navigate (type) {
  let nextQuery = document.getElementById(type + '-query').value;
  queryGame (nextQuery);
}

//Callback method to render the Result.
function renderResult (data) {

  let resultsHTML = '';
  if (data._total > 0) {
    
    for (let i in data.streams) {
      let stream = data.streams[i];

      /**
      *  doing only for description because I do not see Description available in response. Therefore dispalying the the Status for all missing Descriptions.
      */
      let description = stream.channel.description || stream.channel.status ;
      console.log(stream, 'steam');
      resultsHTML += '<div class="game-container"><span class="preview-image"><img src="' + stream.preview.small + '" /></span>';
      resultsHTML += '<div class="sec-game-container"><span class="stream-name border-bottom padding">' + stream.channel.display_name + '</span>';
      resultsHTML += '<span class="game-name border-bottom padding">' + stream.game + ' - ' + stream.viewers + '</span><br>'
      resultsHTML += '<span class="border-bottom padding" style="float:left;width:100%">' + description + '</span></div></div>'
    }
    let offset = getQueryVariable (data._links.self, "offset");
    let page = 1;
    if (offset > 0) {
      page = (offset / LIMIT) + 1;
    }
    else {
      document.getElementById('total-games').innerHTML = 'Total Results: ' + data._total;
    }

    if (data.streams.length > 0) document.getElementById('current').innerHTML = page;
    else  resultsHTML = '<div> No Results Found </div>';

    //Set previous and next values on a hidden input field.
    if (data._links.next)
      document.getElementById('next-query').value = data._links.next;
    if (data._links.prev)
      document.getElementById('prev-query').value = data._links.prev;
  }
  else {
    resultsHTML = '<div> No Results Found </div>';
  }
  document.getElementById('games').innerHTML = resultsHTML;
}
