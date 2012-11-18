if (!String.prototype.trim) {
   String.prototype.trim=function(){return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');};
}

function parseProps(props, scope) {
	var result = {};
	if (props != undefined) {
		var propsArray = props.split(";");
		angular.forEach(propsArray, function (prop, index) {
			var propSplit = prop.split(":");
			if (scope.$parent[propSplit[1].trim()]) {
				result[propSplit[0].trim()] = scope.$parent[propSplit[1].trim()];
			}else{
				result[propSplit[0].trim()] = eval(propSplit[1].trim());			
			}
		});
	}
	return result;
};

angular.module('angular-dojo', []).
directive('dojoWidget', function() {
	return {
		restrict: "A",
		replace: false,
		transclude: false,
		require: '?ngModel',
		scope: {
			'ngModel' : '=',
			'ngChange' : '&',
			'dojoStore' : '&',
			'dojoProps' : '@',
			'ngDisplayValue' : '='
		},
		link: function(scope, element, attrs, model) {
			require(["dojo/ready", "dijit/dijit",
				attrs.dojoWidget, "dojo/on"], function(ready, dijit, DojoWidget, on) {
				var elem = angular.element(element[0]);
				
				ready(function () {
					var properties = {};
					if (attrs.dojoProps) {
						properties = parseProps(scope.dojoProps, scope);
					}
					
					if (attrs.dojoStore) {
						properties.store = scope.dojoStore();
					};
					
					properties.value = scope.ngModel;
				
					scope.widget = new DojoWidget(properties, element[0]);

					on(scope.widget, "blur", function () {
						if (scope.widget.displayedValue) {
						  scope.ngDisplayValue=scope.widget.displayedValue;
						}
					});

					on(scope.widget, "change", function(newValue) {
						scope.ngModel = newValue;
						scope.$digest();
						if (scope.ngChange) {
							scope.ngChange();
						}
						scope.$apply();
					});
					
					scope.ngModel = scope.widget.get('value');
				});
			});
		}
	};
});
