angular.module('angular-dojo', []).
directive('calendar', function() {
	return {
		restrict: "A",
		replace: false,
		transclude: false,
		scope: {
			value: 'accessor'
		},
		link: function(scope, element, attrs) {
			require(["dojo/ready", "dijit/dijit",
			"dijit/Calendar", "dojo/date", "dojo/on"], function(ready, dijit, Calendar, date, on) {
				var elem = angular.element(element[0]);
				scope.calendar = new Calendar({
					value: new Date()
				}, element[0]);
				on(scope.calendar, "change", function(newValue) {
					scope.value(newValue);
				});
				scope.value(scope.calendar.value);
			});
		}
	};
});