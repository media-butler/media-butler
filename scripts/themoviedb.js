angular.module("themoviedb", []).directive('mbThemoviedbCast', function(){
    return {
        templateUrl: '/widgets/themoviedb-cast.html',
        controller: function($scope, $http){
			
			document.addEventListener('watchingChange', function(){
				
				// GET INFO FROM ROTTEN TOMATOES WITH $http AND PUT THEM IN $scope.rottentomatoes
				$scope.cast = {loading: true};
				console.log($scope);
				var watching = $scope.trakt.watching;
				var tmdbKey = 'dd6ed86bdb03617ceff53e847e651298';
				
				var imdb = watching.type == "episode" ? watching.episode.ids.imdb : watching.movie.ids.imdb;
				
				var promise = $http({
					url: 'http://api.themoviedb.org/3/find/'+ imdb +'?external_source=imdb_id&api_key='+ tmdbKey
				});
				promise.success(function(data){
					console.log(data);
					if(watching.type == 'movie') {
						if(!data.movie_results.length){
							$scope.cast = {error: "Movie not found"};
							console.warn("[WARNING] [Themoviedb] Movie not found");
							return;
						}
						var url = 'http://api.themoviedb.org/3/movie/'+ data.movie_results[0].id +'/credits?api_key='+ tmdbKey;
					}
					else {
						if(!data.episode_results.length){
							$scope.cast = {error: "Episode not found"};
							console.warn("[WARNING] [Themoviedb] Episode not found");
							return;
						}
						var url = 'http://api.themoviedb.org/3/tv/'+ data.epsiode_results[0].show_id +'/season/'+ watching.season +'/episode/'+ watching.number +'/credits?api_key='+ tmdbKey;
					}

					promise = $http({
						url: url
					}).success(function(data){
						$scope.cast = data;
					}).error(function(data){
						$scope.cast = {error: data};
					});
				})
				.error(function(data){
					$scope.cast = {error: data};
				});
				
			});
        }
    }
});