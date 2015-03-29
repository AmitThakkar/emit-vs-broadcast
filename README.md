# emit vs broadcast

This repository is for exploring **$emit** and **$broadcast** in **AngularJS**.

Many a times, we need the ```publisher/subscriber``` functionality to achieve our requirement. And when we are working on **AngularJS**, then we write our **AngularJS** code in modular/component form and many of those components/modules are independent components/modules.

Now suppose, we want to access a value in multiple **controllers**, so to make that value accessible to all those **controllers**, we put that value in parent **scope**, and as I said before, ```we write our AngularJS code in modular/component form and many of those components/modules are independent components/modules(e.g. isolated scope directive whose parent scope is only $rootScope)``` then **$rootScope** is the only option left as common parent **scope** for all the controller/components. And if we store that value in **$rootScope** then all the **controllers/components** can read/update that value and if one **controller/component** updates **$rootScope** property then other **component/controller** will get updated value and dependent values will get updated as **AngularJS** ```$digest``` cycle will complete.

As we are adding the value in **$rootScope** so it will be accessible from whole **AngularJS** application which might be not good approach. Well, then where can we store data which is common among multiple controllers?

We have one more option to store the common data in **AngularJS**, that is [**Factory**, **Service**](http://codechutney.in/blog/angularjs/providers-in-angularjs/). But if any of the **controller/component** updates any value, others will not get know that value has changed.

To counter this situation, **AngularJS** provides **$on, $emit/$broadcast** api methods to use ```pub/sub``` pattern. We can register **subscribers** with **$on** api **function** and publisher can **publish** messages with **$emit/$broadcast** api **function**.

> Now you would be thinking, why there are 2 api functions for publishing the message? $emit and $broadcast ?

**$emit**: When we **emit** a message then all the listeners/subscribes will be called which are registered on those **scopes** which are visible on parent element/node in DOM and on that **scope** which is used to **emit** the message.

**$broadcast**: When we **broadcast** a message then all the listeners/subscribers will be called which are registered on those **scopes** which are visible on child element/node in DOM and on that **scope** which is used to **broadcast** the message.

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

**broadcasting** a message on event "EventFromAController":
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
        <button ng-click="testEvent()">Event Test</button>
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
 * Created by Amit Thakkar on 11/02/15.
 */
(function (ng) {
    var emitVSbroadcastApp = ng.module("emitVSbroadcastApp", []);
    emitVSbroadcastApp.controller("AParentController", function ($scope) {
        $scope.$on('EventFromAController', function (event, data) {
            console.log(data, "In AParentController");
        });
    });
    emitVSbroadcastApp.controller("AController", function ($scope, $rootScope) {
        $scope.testEvent = function () {
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

> You might be thinking that isolated scope directives get inherited by $rootScope only so if we broadcast a message with any other scope(which is not $rootScope and not that isolated scope) then those listeners will not called which are registered with isolated scope. Then you are wrong! You are missing a key point of this blog:

**When we broadcast a message then all the listeners/subscribers will be called which are registered on those scopes which are visible on child element/node in DOM and on that scope which is used to broadcast the message.**

So if isolated scope directive is marked on child element/node of that **scope** then **listeners** of **isolated scope** will be called.

**How to run this Demo ??** You can clone this working demo from [Github link](https://github.com/AmitThakkar/emit-vs-broadcast). And then open **emit-vs-broadcast.html** into your favourite browser.

You will notice we have 7 scope as shown here in diagram:

![DOMScope](https://raw.githubusercontent.com/AmitThakkar/emit-vs-broadcast/master/images/DOMScope.png)

Few Things:

1. If we **broadcast** any message with **$rootScope**, then all the **subscribers/listeners** will be called because all the HTML nodes are directly or indirectly children of ```ng-app``` node.
2. If we **emit** any message with **$$rootScope**, then only those **subscribers/listeners** will be called which are registered with **$rootScope** because there is no parent **AngularJS** node.
3. If we **broadcast** any message with **"A Controller Scope"**, then only those **subscribers/listeners** will be called which are registered with **"A Controller Scope"**, **"A Child Controller Scope"** and **"isolated Scope directive 2"**. Because **"A Child Controller Scope"** and **"isolated Scope directive 2"** are visible on child node of **"A Controller Scope"**.

Now click on button ![Test Event](https://raw.githubusercontent.com/AmitThakkar/emit-vs-broadcast/master/images/button.png) in the browser, you will see output:

![Output](https://raw.githubusercontent.com/AmitThakkar/emit-vs-broadcast/master/images/output.png)

In the output, you will notice that, when we are **broadcast**ing a message with **$rootScope** then all the registered **subscribers/listeners** are getting called and when we are **emitting** a message with **$rootScope**, then no **subscriber/listener** is getting called because there are no **subscriber/listeners** registered with **$rootScope**.

> Best Practice: Register subscribers/listeners with $rootScope and emit messages with $rootScope only so AngularJS does not have to traverse complete DOM tree to find all the listeners.
