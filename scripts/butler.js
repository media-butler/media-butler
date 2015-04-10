/**
 * TRAKT APP DATA
 * Client ID: 15cb6120f9349dc948f5a02d6e3697f2464d03d530c6cc84cc8653e75f831043
 * Client Secret: 7da9bfa2e3f7c826479a9a7f7dbc3c12f827a96ba9a53019416f0b7e4afb4a63
 **/



var butler = angular.module('butler', ['ngMaterial', 'trakt', 'tunefind', 'rottentomatoes', 'themoviedb']);

butler.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('light-blue')
    .primaryPalette('pink')
    .accentPalette('orange');
});

butler.controller('body', ['$scope', 'TraktClient', function($scope, TraktClient) {
    
	$scope.trakt = new TraktClient($scope);
	$scope.trakt.authorise(window.localStorage.getItem('trakt.access_token'));
	window.addEventListener('storage', function(event) {
		if(event.key == 'trakt.access_token'){
			$scope.trakt.authorise(window.localStorage.getItem('trakt.access_token'));
		}
	});
    
	var cols = 6;
	
	var widgets = $("#widgets").gridster({
		widget_selector: ".widget",
		widget_base_dimensions: [$(window).width()/cols-30, 100],
		max_cols: cols,
		min_cols: cols,
		resize: {
			enabled: true
		}
	}).data('gridster');
	
	$(window).on('resize', function(){
		// REMAKE GRIDSTER?
	});
	
}]);

butler.controller('login', function($scope) {

});