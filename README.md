# emit vs broadcast

This repository is for exploring **$emit** and **$broadcast** in **AngularJS**.

Many a times, we need the ```publisher/subscriber``` functionality to achieve our requirement. And when we are working on **AngularJS**, then we write our **AngularJS** code in modular/component form and many of them are independent component/module.

Now suppose, we are accessing a value in multiple **controllers**. So to make that value accessible in all the **controllers**, we put that value in parent **scope**, and as I said before, ```we write our AngularJS code in modular/component form and many of them are independent component/module(e.g. isolated scope directive whose parent scope is only $rootScope)``` then **$rootScope** is the only option left as common parent **scope** for all the controller/components. And any controller/component can read/update that value, if one controller/component update **$rootScope** property then other component/controller will get updated one value and dependant value will get update as ```$digest``` cycle will complete.

But if we add that value in **$rootScope** then it will be accessible from whole **AngularJS** application. Which might be not good approach. Then where have to we store common thing among multiple controllers?

We have one more option to store the data in **AngularJS**, that is [**Provider**, **Factory**, **Service**](http://codechutney.in/blog/angularjs/providers-in-angularjs/). But if any of controller/component update value into them, others will not get know.

