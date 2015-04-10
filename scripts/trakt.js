/**
 * TRAKT API MODULE FOR ANGULAR.JS
 * Full API Guide: http://docs.trakt.apiary.io/
 */

angular.module('trakt', [])
.factory('TraktClient', function($http){
	var TRAKT_CLIENT_ID = '15cb6120f9349dc948f5a02d6e3697f2464d03d530c6cc84cc8653e75f831043';
	var TRAKT_REDIRECT_URI = 'http://media-butler.appspot.com/traktCallback.php';
	
	/** DONT REDIRECT TO APPSPOT WHILE DEBUGGING */
	if(document.location.hostname != "media-butler.appspot.com")
		var TRAKT_REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';
	
	var TRAKT_LOGIN_URL = 'https://trakt.tv/oauth/authorize?response_type=code&client_id=' + TRAKT_CLIENT_ID + '&redirect_uri=' + TRAKT_REDIRECT_URI;
	
	var ACCESS_TOKEN;
	
	var watchingChange = new Event('watchingChange');
	
	function api(method, url, data){
		return $http({
			method: 'POST',
			url: 'trakt.php?url='+url+'&method='+method+'&access_token='+ACCESS_TOKEN,
			data: data
		});
	}
	function TraktClient (scope){
		this.authorised = false;
		this.user = false;
		this.watching = false;
		
		var self = this;
		setInterval(function(){
			if(self.authorised) self.refreshWatching();
		}, 10*1000);
	}
	
	TraktClient.prototype.login = function(){
		window.open(TRAKT_LOGIN_URL, '_blank');
	};
	TraktClient.prototype.logout = function(){
		window.localStorage.removeItem('trakt.access_token');
		this.authorised = false;
		this.user = false;
		this.watching = false;
	}
	
	TraktClient.prototype.authorise = function(access_token){
		if(!access_token) return false;
		ACCESS_TOKEN = access_token
		this.authorised = true;
		this.refreshUser();
	};
	TraktClient.prototype.refreshUser = function(){
		var self = this;
		api('GET', '/users/me').success(function(data){
			self.user = data;
			self.refreshWatching();
		}).error(function(error){
			console.error('[ERROR] Trakt API error: ', error);
		});
	};
	
	var previouslyWatching = false;
	TraktClient.prototype.refreshWatching = function(){
		var self = this;
		api('GET', '/users/me/watching?extended=full,images').success(function(data){
			console.debug("[DEBUG] [Trakt] Watching data returned: ", data);
			if(data == "") self.watching = false;
			else {
				var changed = (
					!self.watching || 
					data.type != self.watching.type || 
					(data.type == "episode" && data.episode.ids.trakt != self.watching.episode.ids.trakt) || 
					(data.type == "movie" && data.movie.ids.trakt != self.watching.movie.ids.trakt)
				);
				self.watching = data;
				self.watching.progress = 
					(new Date().getTime() - new Date(data.started_at).getTime()) 
					/ 
					(new Date(data.expires_at).getTime() - new Date(data.started_at).getTime()) 
					* 100;
				if(changed){
					console.info("[INFO] [Trakt] New item being watched: ", data);
					document.dispatchEvent(watchingChange);
				}
			}
		});
	};
	
	return TraktClient;
}).directive('mbTraktCover', function(){
    return {
        //restrict: 'E',
        templateUrl: '/widgets/trakt-cover.html',
    }
}).directive('mbTraktOverview', function(){
    return {
       // restrict: 'E',
        templateUrl: '/widgets/trakt-overview.html',
    }
}).directive('mbTraktRating', function(){
	return {
		//restrict: 'E',
		templateUrl: '/widgets/trakt-rating.html',
	}
});

