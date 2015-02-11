/**
 * Created by amit on 11/02/15.
 */
(function (ng) {
    var emitVSbroadcastApp = ng.module("emitVSbroadcastApp", []);
    emitVSbroadcastApp.controller("AParentController", function ($scope) {
        $scope.$on('EventFromAController', function (event, data) {
            console.log(data, "In AParentController");
        });
    });
    emitVSbroadcastApp.controller("AController", function ($scope, $rootScope) {
        $scope.emitEvent = function () {
            console.log("$scope.$emit result:");
            $scope.$emit('EventFromAController', "EmitEventFromAController with $scope.$emit");
            console.log("\n\n\n$scope.$broadcast result:");
            $scope.$broadcast('EventFromAController', "BroadcastEventFromAController with $scope.$broadcast");
            console.log("\n\n\n$rootScope.$emit result:");
            $rootScope.$emit('EventFromAController', "EmitEventFromAController with $rootScope.$emit");
            console.log("\n\n\n$rootScope.$broadcast result:");
            $rootScope.$broadcast('EventFromAController', "BroadcastEventFromAController with $rootScope.$broadcast");
        };
        $scope.$on('EventFromAController', function (event, data) {
            console.log(data, "In AController");
        });
    });
    emitVSbroadcastApp.controller("AChildController", function ($scope) {
        $scope.$on('EventFromAController', function (event, data) {
            console.log(data, "In AChildController");
        });
    });
    emitVSbroadcastApp.controller("BController", function ($scope) {
        $scope.$on('EventFromAController', function (event, data) {
            console.log(data, "In BController");
        });
    });
    emitVSbroadcastApp.directive("isolatedScopeDirective", function () {
        return {
            scope: {},
            controller: function ($scope) {
                $scope.$on('EventFromAController', function (event, data) {
                    console.log(data, "In isolatedScopeDirective");
                });
            }
        }
    });
    emitVSbroadcastApp.directive("isolatedScopeDirective2", function () {
        return {
            scope: {},
            controller: function ($scope) {
                $scope.$on('EventFromAController', function (event, data) {
                    console.log(data, "In isolatedScopeDirective2");
                });
            }
        }
    });
}(angular));