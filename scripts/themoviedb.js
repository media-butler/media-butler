angular.module("themoviedb", []).directive('mbThemoviedbCast', function () {
	return {
		templateUrl: '/widgets/themoviedb-cast.html',
		controller: function ($scope, $http) {

			var API_ENDPOINT = 'http://api.themoviedb.org/3',
				API_KEY = 'dd6ed86bdb03617ceff53e847e651298';

			document.addEventListener('watchingChange', function () {
				$scope.cast = {loading: true};
				var watching = $scope.trakt.watching;

				// PREPARE URL
				if(watching.type == 'movie') {
					var url = API_ENDPOINT+'/movie/'+ watching.movie.ids.tmdb + '/credits?api_key='+ API_KEY;
				}
				else {
					var url = API_ENDPOINT+'/tv/'+ watching.show.ids.tmdb +  // The show's TMDB id
					'/season/'+ watching.episode.season + 					 // The episode's season id
					'/episode/'+ watching.episode.number +					 // The episode's number
					'/credits?api_key='+ API_KEY;							 // API key for TMDB
				}

				// CALL TMDB FOR ITEM INFO
				$http.get(url).success(function (data) {
					console.debug("[DEBUG] [TheMovieDB] Data returned: ", data);
					
					$scope.cast = {people: data.cast};
					if(data.guest_stars){
						$.merge($scope.cast.people, data.guest_stars);
					}
					
					// GET ACTOR DETAILS FOR EACH ACTOR
					$.each($scope.cast.people, function () {
						var person = this;
						$http.get(API_ENDPOINT+'/person/'+person.id+'?api_key='+API_KEY).success(function (data) {
							person.actor = data;
						});
					});

				}).error(function (data) {
					$scope.cast = {error: data};
				});
			});
		}
	};
});