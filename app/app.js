
var app = angular.module('beta-optimizer', ['ngRoute', 'App.Filters']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/holdings',
            {
                controller: 'HoldingsController',
                templateUrl: '/app/views/holdings.html'
            })
        .when('/transactions',
            {
                controller: 'TransactionsController',
                templateUrl: '/app/views/transactions.html'
            })
        .when('/products',
            {
                controller: 'ProductsController',
                templateUrl: '/app/views/products.html'
            })
        .when('/platforms',
            {
                controller: 'PlatformsController',
                templateUrl: '/app/views/platforms.html'
            })
        .otherwise({ redirectTo: '/holdings' });
});

   

  

