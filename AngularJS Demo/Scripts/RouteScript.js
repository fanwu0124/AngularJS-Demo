/// <reference path="angular.min.js" />
/// <reference path="angular-route.min.js" />


var app = angular.module("Demo", ["ngRoute"])
                 .config(function ($routeProvider, $locationProvider) { //Config routing
                     $routeProvider
                        .when("/home", {
                            templateUrl: "Templates/Home.html",
                            //template: "<h1>This is Home Page</h1>", //Inline template
                            controller: "homeController",
                            caseInsensitiveMatch: true //Set case insensitive in url
                        })
                        .when("/courses", {
                            templateUrl: "Templates/Courses.html",
                            controller: "coursesController",
                            caseInsensitiveMatch: true
                        })
                        .when("/students", {
                            templateUrl: "Templates/Students.html",
                            controller: "studentsController",
                            caseInsensitiveMatch: true
                        })
                        .when("/students/:id", {
                            templateUrl: "Templates/StudentDetails.html",
                            controller: "studentDetailsController",
                            caseInsensitiveMatch: true
                        })
                        .otherwise({
                            redirectTo: "/home" //Set default url
                        })
                     $locationProvider.html5Mode(true); //remove "#" in routing url
                 })
                 .controller("homeController", function ($scope) {
                     $scope.message = "Home Page";
                 })
                 .controller("coursesController", function ($scope) {
                     $scope.courses = ["C#", "VB.NET", "SQL Server", "ASP.NET"];
                 })
                 .controller("studentsController", function ($http, $scope, $route) {
                     $scope.reloadData = function () {
                         $route.reload(); //Works like refreshing the page to reload student list, but calls StudentService.asmx/GetAllStudents only without reloading the other files.
                     }
                     $http.get("StudentService.asmx/GetAllStudents")
                        .then(function (response) {
                            $scope.students = response.data;
                        })
                 })
                 .controller("studentDetailsController", function ($scope, $http, $routeParams) {
                     $http({
                         url: "/StudentService.asmx/GetStudent",
                         params: { id: $routeParams.id },
                         method: "get"
                     })
                     .then(function (response) {
                         $scope.student = response.data;
                     })
                 });
