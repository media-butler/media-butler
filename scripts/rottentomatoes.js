angular.module("rottentomatoes", []).directive('mbRottentomatoes', function(){
    return {
        templateUrl: '/widgets/rottentomatoes.html',
        controller: function($scope, $http){
			
			document.addEventListener('watchingChange', function(){
				
				// GET INFO FROM ROTTEN TOMATOES WITH $http AND PUT THEM IN $scope.rottentomatoes
				$scope.rottentomatoes = {loading: true};
				var watching = $scope.trakt.watching;

				// Get the right imdb id
				if(watching.type == 'episode') {
					//The episode's season's imdb id
					//RT doesn't store individual episode ratings
				}
				else {
					// The movies imdb id
					var imdbId = watching.ids.imdb;
				}

				var promise = $http({
						url: 'rottentomatoes.php?type=imdb&id='+ imdbId
					});	
				promise.success(function(data){
					$scope.rottentomatoes = data;
				})
				.error(function(data){
					$scope.rottentomatoes = {error: data};
				});
				
			});
        }
    }
});