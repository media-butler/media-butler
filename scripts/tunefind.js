angular.module("tunefind", []).directive('mbTunefind', function(){
    return {
        templateUrl: '/widgets/tunefind.html',
        controller: function($scope, $http){
			
			document.addEventListener('watchingChange', function(){
				
				$scope.tunefind = {loading:true};
				var watching = $scope.trakt.watching;
				
				if(watching.type == "episode"){
					var promise = $http({
						url: 'tunefind.php?type=episode&show='+encodeURIComponent(watching.show.title)+'&year='+watching.show.year+'&season='+watching.episode.season+'&episode='+watching.episode.number
					});
				}
				else{
					var promise = $http({
						url: 'tunefind.php?type=movie&movie='+encodeURIComponent(watching.movie.title)+'&year='+watching.movie.year
					});
				}
				promise.success(function(data){
					console.debug('[DEBUG] [Tunefind] Data returned: ', data);
					if(data === null || typeof data !== 'object') $scope.tunefind = {error: data};
					else{
						$scope.tunefind = data;
						
						$.each($scope.tunefind.songs, function(i){
							var song = this;
							$http({
								url: 'https://api.spotify.com/v1/search',
								params: {
									q: 'artist:"'+this.artist.name+'" title:"'+this.name+'"',
									type: 'track'
								}
							}).success(function(data){
								if(!data.tracks.items.length) return;
								song.spotify = data.tracks.items[0];
							});
						});
					}
				}).error(function(data){
					$scope.tunefind = {error: data}
				});
			});
        }
    }
});