angular.module("themoviedb", []).directive('mbThemoviedbCast', function () {
  return {
    templateUrl: '/widgets/themoviedb-cast.html',
    controller: function ($scope, $http) {

			document.addEventListener('watchingChange', function () {
				// Set loading status to true
				$scope.cast = {loading: true};
				var watching = $scope.trakt.watching;
				var tmdbKey = 'dd6ed86bdb03617ceff53e847e651298';
				
				// Prepare url for XHR
				if(watching.type == 'movie') {
					var url = 'http://api.themoviedb.org/3/movie/'+ watching.movie.ids.tmdb + // The movie's TMDB id
								'/credits?api_key='+ tmdbKey;								  // API key for TMDB
				}
				else {
					var url = 'http://api.themoviedb.org/3/tv/'+ watching.show.ids.tmdb +     // The show's TMDB id
								'/season/'+ watching.episode.season + 						  // The episode's season id
								'/episode/'+ watching.episode.number +						  // The episode's number
								'/credits?api_key='+ tmdbKey;								  // API key for TMDB
				}

				// Call TMDB for item info
				// In case of success the scope is replaced by the returned data
				// In case of an error the scope is replaced by the error data
				var promise = $http({
					url: url
				}).success(function (data) {
					console.log (data);
					$scope.cast.people = [];
					// Get imdb id for each actor
					$.each(data.cast, function (i) {
						// Isolate actor
						var person = this;
						// Request actor's info
						promise = $http({
							url: 'http://api.themoviedb.org/3/person/'+ person.id +
									'?api_key='+ tmdbKey
						});
						// Add retrieved imdb id to actor
						promise.success(function (data) {
							person.imdb = data.imdb_id;
						})
						// Make imdb id empty
						.error(function (data) {
							person.imdb = null;
						})
						// Add actor to the people array
						.finally(function () {
							$scope.cast.people.push(person);
						});
					});
					// do the same for guest stars
					if(watching.type == 'episode' && data.guest_stars) {
						$.each(data.guest_stars, function (i) {
							// Isolate actor
							var person = this;
							// Request actor's info
							promise = $http({
								url: 'http://api.themoviedb.org/3/person/'+ person.id +
										'?api_key='+ tmdbKey
							});
							// Add retrieved imdb id to actor
							promise.success(function (data) {
								person.imdb = data.imdb_id;
							})
							// Make imdb id empty
							.error(function (data) {
								person.imdb = null;
							})
							// Add actor to the people array
							.finally(function () {
								$scope.cast.people.push(person);
							});
						});
					}
					$scope.cast.loading = false;
				}).error(function (data) {
					$scope.cast = {error: data};
				});

				
			});
        }
    };
});