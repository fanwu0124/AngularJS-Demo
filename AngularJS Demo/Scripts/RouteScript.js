/// <reference path="angular.min.js" />
/// <reference path="angular-route.min.js" />


var app = angular.module("Demo", ["ngRoute"])
                 .config(function ($routeProvider, $locationProvider) { //Config routing
                     //$routeProvider.caseInsensitiveMatch = true; //This line alone makes all the urls case insensitive. No need to set caseInsensitiveMatch for each url.

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
                            caseInsensitiveMatch: true,
                            resolve: { //This page will not open until the response of StudentService is returned, that is until studentsList is assigned with student list.
                                studentsList: function ($http) { //Call StudentService and assign response to property studentsList. studentsList can be directly injected into studentsController.
                                    return $http.get("StudentService.asmx/GetAllStudents")
                                        .then(function (response) {
                                            return response.data;
                                        })
                                }
                            }
                        })
                        .when("/students/:id", {
                            templateUrl: "Templates/StudentDetails.html",
                            controller: "studentDetailsController",
                            caseInsensitiveMatch: true
                        })
                        .when("/studentsSearch/:name?", { //add ? to make parameter optional
                            templateUrl: "Templates/StudentsSearch.html",
                            controller: "studentsSearchController",
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
                 .controller("coursesController", function ($scope, $log) {
                     $scope.$on("$locationChangeStart", function (event, next, current) {//next is the next route we are navigating to; current is the current route we are on.
                         if (!confirm("Are you sure you want to navigate away from this page to " + next)) { //next is the full url
                             event.preventDefault(); //Cancel the route change (stop this event)
                         }
                         $log.debug("LocationChangeStart Event"); //Check log in console of browser developer tools.
                         $log.debug(event); //event is an object containing multiple info.
                         $log.debug(next); //next and current are full urls.
                         $log.debug(current);
                     });

                     $scope.$on("$locationChangeSuccess", function () {
                         $log.debug("LocationChangeSuccess Event"); //log when route change succeeds
                     })

                     $scope.courses = ["C#", "VB.NET", "SQL Server", "ASP.NET"];
                 })
                 .controller("studentsController", function ($http, $scope, $route, $log, $location, studentsList) {
                     //Display alert when navigate to another route
                     //When a route change event occurs in AngularJS, four events will happen: $routeChangeStart, $routeChangeSuccess, $locationChangeStart, $locationChangeSuccess
                     //The difference between $routeChangeStart and $locationChangeStart is that, in $locationChangeStart, next and current contains the full url. See example in coursesController
                     $scope.$on("$routeChangeStart", function (event, next, current) {//next is the next route we are navigating to; current is the current route we are on.
                         if (!confirm("Are you sure you want to navigate away from this page to " + next.$$route.originalPath)) {
                             event.preventDefault(); //Cancel the route change (stop this event)
                         }
                         $log.debug("RouteChangeStart Event"); //Check log in console of browser developer tools
                         $log.debug(event); //event, next and current are objects containing multiple info.
                         $log.debug(next);
                         $log.debug(current);
                     });

                     $scope.$on("$routeChangeSuccess", function () {
                         $log.debug("RouteChangeSuccess Event"); //log when route change succeeds
                     })

                     $scope.reloadData = function () {
                         $route.reload(); //Works like refreshing the page to reload student list, but calls StudentService.asmx/GetAllStudents only without reloading the other files.
                     }

                     //Get the list of students (comment out to use route resolve instead)
                     //$http.get("StudentService.asmx/GetAllStudents")
                     //   .then(function (response) {
                     //       $scope.students = response.data;
                     //   })

                     $scope.students = studentsList; //studentsList is the route resolve property.

                     //Get students by name
                     $scope.searchStudent = function () {//Triggered if student search button is clicked. 
                         if ($scope.name) { //Parameter name is optional.
                             $location.url("/studentsSearch/" + $scope.name);
                         }
                         else {
                             $location.url("/studentsSearch");
                         }
                     }
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
                 })
                 .controller("studentsSearchController", function ($scope, $http, $routeParams) {//Search students by name
                     if ($routeParams.name) { //If there is a search parameter, get students by name.
                         $http({
                             url: "/StudentService.asmx/GetStudentsByName",
                             params: { name: $routeParams.name },
                             method: "get"
                         })
                         .then(function (response) {
                             $scope.students = response.data;
                         })
                     }
                     else { //If there is no search parameter, get all students.
                         $http.get("StudentService.asmx/GetAllStudents")
                            .then(function (response) {
                                $scope.students = response.data;
                            })
                     }
                 });

