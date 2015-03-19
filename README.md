# emit vs broadcast

This repository is for exploring **$emit** and **$broadcast** in **AngularJS**.

Many a times, we need the ```publisher/subscriber``` functionality to achieve our requirement. And when we are working on **AngularJS**, then we write our **AngularJS** code in modular/component form and many of them components/modules are independent components/modules.

Now suppose, we want to access a value in multiple **controllers**, so to make that value accessible in all those **controllers**, we put that value in parent **scope**, and as I said before, ```we write our AngularJS code in modular/component form and many of them components/modules are independent components/modules(e.g. isolated scope directive whose parent scope is only $rootScope)``` then **$rootScope** is the only option left as common parent **scope** for all the controller/components. And if we store that value in **$rootScope** then all the **controllers/components** can read/update that value and if one **controller/component** update **$rootScope** property then other **component/controller** will get updated one value and dependant value will get update as **AngularJS** ```$digest``` cycle will complete.

As we are adding that value in **$rootScope** so it will be accessible from whole **AngularJS** application. Which might be not good approach. Then where have to we store data which is common among multiple controllers?

We have one more option to store the common data in **AngularJS**, that is [**Factory**, **Service**](http://codechutney.in/blog/angularjs/providers-in-angularjs/). But if any of **controller/component** update any value into them, others will not get know that value has changed.

That time we use ```pub/sub``` pattern. **AngularJS** provide **$on, $emit/$broadcast** api methods for that. We can register **subscribers** with **$on** api **function** and publisher can **publish** messages with **$emit/$broadcast** api **function**.

> Now you would be thinking, why there are 2 api functions for publish the message? $emit and $broadcast ?

**$emit**: When we **emit** a message then all the listeners/subscribes will be call which are register on those **scope** which are applied on parent element/node in DOM and on that **scope** which is used to **emit** the message.

**$broadcast**: When we **broadcast** a message then all the listeners/subscribers will be called which are register on those **scope** which are applied on child element/node in DOM and on that **scope** which is used to **broadcast** the message.

Enough for theory, lets see how to bind listeners and how to **broadcast/emit** messages:

Binding a **listener** on event "EventFromAController":
```JavaScript
$scope.$on('EventFromAController', function (event, data) {
    console.log(data, "In isolatedScopeDirective");
});
```

**emitting** a message on event "EventFromAController":
```JavaScript
$scope.$emit('EventFromAController', "EmitEventFromAController with $scope.$emit");
```

**broadcast** a message on event "EventFromAController":
```JavaScript
$scope.$broadcast('EventFromAController', "EmitEventFromAController with $scope.$emit");
```

Lets see a demo:

**emit-vs-broadcast.html**
```HTML
<!DOCTYPE html>
<html ng-app="emitVSbroadcastApp">
<head>
    <title>Providers Test</title>
    <!-- Require AngularJS -->
    <script type="application/javascript" src="./js/angular.min.js"></script>
    <!-- Require providers-test JS -->
    <script type="application/javascript" src="./js/emitVSbroadcast.js"></script>
</head>
<body>
<div ng-controller="AParentController">
    <div ng-controller="AController">
        <button ng-click="emitEvent()">Emit Event</button>
        <div ng-controller="AChildController">
            <div isolated-scope-directive2></div>
        </div>
    </div>
    <div ng-controller="BController">
    </div>
</div>
<div isolated-scope-directive></div>
</body>
</html>
```

**emitVSbroadcast.js**
```JavaScript
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
```
