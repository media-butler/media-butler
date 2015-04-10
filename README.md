# media-butler

## Widget guidelines
Adding widgets is easy. All you need is a angular directive and an html template file.

### Angular file
	/scripts/widget.js

	angular.module("widget", []).directive('mbWidget', function(){
	    return {
	        templateUrl: '/widgets/html-template.html',
	        controller: function($scope, $http){
				//Widget code
				$scope.widget.title = 'Widget Title'
	        }
	    }
	});
### HTML template
	/widgets/html-template.html

	<md-toolbar>
		<h1>{{widget.title}}</h1>
	</md-toolbar>
	<md-card-content>
		<!-- Widget body -->
	</md-card-content>
### Call the widget in the index.html
	/index.html

	<div class="widget" data-row="1" data-col="1" data-sizex="1" data-sizey="2"><md-card mb-widget></md-card></div>

## It's that easy!