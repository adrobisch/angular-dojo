angular.module('angular-dojo', []).directive('dojoWidget', function($timeout) {
    
    var parseProps = function(props, scope) {
        if (typeof props === 'undefined') return {};

    	props = '[{' + props + '}]';
        return eval(props)[0];
    };
    
    return {
        restrict: "A",
        replace: false,
        transclude: false,
        require: '?ngModel',
        scope: {
            'ngModel' : '=?',
            'ngClick' : '&',
            'ngChange' : '&',
            'dojoStore' : '&',
            'dojoProps' : '@',
            'dojoDisplayValue' : '=?'
        },
        link: function(scope, element, attrs, model) {
            require(["dojo/ready", "dijit/dijit", attrs.dojoWidget, "dojo/on"], function(ready, dijit, DojoWidget, on) {
          
                ready(function () {                
                    scope.widget = new DojoWidget({}, element[0]);
                    
                    attrs.$observe('dojoProps', function(dojoProps) {
                        scope.widget.set(parseProps(dojoProps, scope));
                    });
                    
                    attrs.$observe('dojoStore', function() {
                        if (scope.dojoStore != undefined) {
                            scope.widget.store = scope.dojoStore();     
                        }
                    });
                    
                    scope.$watch('ngModel', function() {
                        if (scope.ngModel != undefined) {
                        	if (attrs.dojoWidget == 'dijit/form/FilteringSelect' || attrs.dojoWidget == 'dijit/form/Select') {
                        		scope.widget.set('item', scope.ngModel);
                        	}
                        	else {
                        		scope.widget.set('value', scope.ngModel);
                                scope.widget.set('checked', scope.ngModel);
                        	}
                        }
                    });
                    
                    on(scope.widget, "blur", function () {
                        if (scope.widget.displayedValue != undefined) {
                            scope.dojoDisplayValue = scope.widget.displayedValue;
                        }
                    });

                    on(scope.widget, "change", function(newValue) {
                    	if (attrs.dojoWidget == 'dijit/form/FilteringSelect' || attrs.dojoWidget == 'dijit/form/Select') {
                    		scope.ngModel = this.item;
                    	}
                    	else {
                     		scope.ngModel = newValue;
                    	}
                    	                        
                        $timeout(function() {
                            scope.$apply();
                            if (scope.ngChange != undefined) {
                                scope.ngChange();
                            }
                        });
                    });

                    on(scope.widget, 'click', function() {
                        $timeout(function() {
                            scope.$apply();
                            if (scope.ngClick != undefined) {
                                scope.ngClick();
                            }
                        });
                    });
                });
            });
        }
    };
});
