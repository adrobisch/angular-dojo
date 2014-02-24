if (!String.prototype.trim) {
   String.prototype.trim=function(){return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');};
}


angular.module('angular-dojo', []).directive('dojoWidget', function($timeout) {
    
    var parseProps = function(props, scope) {
        var result = {};
        if (props != undefined) {
            angular.forEach(props.split(";"), function (prop, index) {
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
                    
                    attrs.$observe('ngModel', function() {
                        if (scope.ngModel != undefined) {
                            scope.widget.set('value', scope.ngModel);
                            scope.widget.set('checked', scope.ngModel);
                        }
                    });
                    
                    on(scope.widget, "blur", function () {
                        $timeout(function() {
                            if (scope.widget.displayedValue != undefined) {
                                scope.dojoDisplayValue = scope.widget.displayedValue;
                            }
                        });
                    });

                    on(scope.widget, "change", function(newValue) {
                        scope.ngModel = newValue;
                        $timeout(function() {
                            scope.$apply();
                            if (scope.ngChange != undefined) {
                                scope.ngChange();
                            }
                        });
                    });

                    on(scope.widget, 'click', function() {
                        $timeout(function() {
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
