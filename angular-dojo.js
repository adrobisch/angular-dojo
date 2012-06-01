angular.module('angular-dojo', []).
directive('dojoWidget', function() {
	return {
		restrict: "A",
		replace: false,
		transclude: false,
		require: '?ngModel',
		scope: {
			'ngModel': 'accessor',
			'onChange' : 'expression',
			'disable' : 'attribute'
		},
		link: function(scope, element, attrs, model) {
			require(["dojo/ready", "dijit/dijit",
				attrs.dojoWidget, "dojo/date", "dojo/on"], function(ready, dijit, DojoWidget, date, on) {
				var elem = angular.element(element[0]);
				console.log("disable:"+scope.disable);
				
				var disabled = false; // must be boolean value!
				if (scope.disable != undefined && scope.disable == 'true') {
					disabled = true;
				}
				
				console.log("disabled:"+disabled);
				
				scope.widget = new DojoWidget({
					value: scope.ngModel(),
					disabled : disabled
				}, element[0]);
				on(scope.widget, "change", function(newValue) {
					scope.ngModel(newValue);
					
					if (scope.onChange) {
						scope.onChange();
					}
				});
				scope.ngModel(scope.widget.get('value'));
			});
		}
	};
}).
directive('dojoFilteringSelect', function() {
	return {
		restrict: "A",
		replace: false,
		transclude: false,
		require: '?ngModel',
		scope: {
			'ngModel': 'accessor',
			'onChange' : 'expression',
			'options' : 'accessor'
		},
		link: function(scope, element, attrs, model) {
			require([
			    "dojo/ready", "dojo/store/Memory", "dijit/form/FilteringSelect", "dojo/on"
			], function(ready, Memory, FilteringSelect, on){
			    
			    var store = new Memory({
			        data: scope.options()
			    });
			
			    ready(function(){
			        var filteringSelect = new FilteringSelect({
			            id: element[0].id,
			            name: element[0].id,
			            value: scope.ngModel(),
			            store: store,
			            searchAttr: "name"
			        }, element[0]);
			        
	   			    on(filteringSelect, "change", function(newValue) {
						scope.ngModel(newValue);
						if (scope.onChange()) {
							scope.onChange();
						}
					});
			        
			    });
			});
		}
	};
});
