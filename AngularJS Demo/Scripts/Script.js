/// <reference path="angular.min.js" />

//This module is associated with ng-app directive
var myApp = angular.module("myModule", []);

//This controller is associated with ng-controller directive
var myController = function ($scope) {

    //Objects
    //Register objects in scope
    $scope.message = "AngularJS Tutorial";
    var employee = {
        firstName: "Febe",
        lastName: "Wu",
        gender: "Female",
        icon: "/Images/Cat.jpg"
    };
    $scope.employee = employee;

    var employees = [
        { firstName: "Amy", lastName: "Black", DOB: new Date("November 23, 1980"), gender: "Male", genderCode: 1, salary: 55000.788, city: "Richmond" },
        { firstName: "Coco", lastName: "Dianmond", DOB: new Date("May 05, 1981"), gender: "Female", genderCode: 2, salary: 68000, city: "Richmond" },
        { firstName: "Erick", lastName: "Franklin", DOB: new Date("Janurary 24, 1985"), gender: "Male", genderCode: 1, salary: 57000, city: "Houston" },
        { firstName: "Greg", lastName: "Homes", DOB: new Date("December 23, 1960"), gender: "Female", genderCode: 3, salary: 53000, city: "New York" },
    ];
    $scope.employees = employees;

    var countries = [
        {
            name: "UK",
            cities: [
                { name: "London" },
                { name: "Manchester" },
                { name: "Birmingham" }
            ]
        },
        {
            name: "USA",
            cities: [
                { name: "Houston" },
                { name: "New York" },
                { name: "Richmond" }
            ]
        },
        {
            name: "China",
            cities: [
                { name: "Shenyang" },
                { name: "Beijing" },
                { name: "Shanghai" }
            ]
        }
    ];
    $scope.countries = countries;

    //Handling Events
    //Like and Dislike buttons
    var technologies = [
        { name: "C#", likes: 0, dislikes: 0 },
        { name: "ASP.NET", likes: 0, dislikes: 0 },
        { name: "SQL Server", likes: 0, dislikes: 0 },
        { name: "AngularJS", likes: 0, dislikes: 0 }
    ];
    $scope.technologies = technologies;
    $scope.incrementLikes = function (technology) {
        technology.likes++;
    }
    $scope.incrementDislikes = function (technology) {
        technology.dislikes++;
    }

    //Filters
    //Filters: sort data, limit number of rows, search
    $scope.rowLimit = 4;
    $scope.sortColumn = "firstName";
    $scope.reverseSort = false;

    //If click on the same column, set reverseSort to the other value; otherwise, click on another column, set reverseSort as false.
    $scope.sortData = function (column) {
        $scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
        $scope.sortColumn = column;
    }
    //Add arrow to sort column
    $scope.getSortClass = function (column) {
        if ($scope.sortColumn == column) {
            return $scope.reverseSort ? 'arrow-down' : 'arrow-up';
        }
        return '';
    }

    //Search by matching any column
    $scope.search = function (item) {
        if ($scope.searchText == undefined) {
            return true; //If empty, display all rows.
        }
        else { //If machteched either name or city, display the row.
            if (item.firstName.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1 ||
                item.city.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1) {
                return true;
            }
        }
        return false;
    }

    //Use ng-include to include a property
    $scope.employeeView = "EmployeeTable.html";
};

myApp.controller("myController", myController); //Register controller with module

//Another way to register controller
myApp.controller("myController2", function ($scope) {
    $scope.message = "Another way to register controller";
});

//Use method chaining to create module and controller in one line
var myApp2 = angular.module("myModule2", [])
    .controller("myController", function ($scope) {
        $scope.message = "One Line";
    });

//Consume Web Services using $http
myApp.controller("serviceController", function ($scope, $http, $log) {
    $http.get("EmployeeService.asmx/GetAllEmployees")
        .then(function (response) { //Called when request is completed successfully
            $scope.dbEmployees = response.data;
            $log.info(response); //log object to browser console
        }, function (reason) { //Caleed when request is failed.
            $scope.error = reason.data;
            $log.info(reason);
        });
});

//Another way to use $http
myApp.controller("serviceController2", function ($scope, $http, $log) {
    var successCallBack = function (response) {
        $scope.dbEmployees = response.data;
        $log.info(response);
    };

    var errorCallBack = function (reason) {
        $log.info(reason);
    };

    $http({
        method: "Get",
        url: "EmployeeService.asmx/GetAllEmployees"
    }).then(successCallBack, errorCallBack); //Pass function parameters
});

//Include all logic in controller
myApp.controller("customsvrController2", function ($scope) {
    $scope.transformString = function (input) {
        if (!input) {
            return input;
        }
        var output = "";
        for (var i = 0; i < input.length; i++) {
            if (i > 0 && input[i] == input[i].toUpperCase()) {
                output += " ";
            }
            output += input[i];
        }
        $scope.output = output;
    }
});

//Create a custom service and inject service to controller
myApp.controller("customsvrController", function ($scope, stringService) {
    $scope.transformString = function (input) {
        $scope.output = stringService.processString(input); //All the above logics are moved to service
    }
});

//Use of anchorscroll
myApp.controller("scrollController", function ($scope, $location, $anchorScroll) {
    $scope.scrollTo = function (scrollLocation) {
        $location.hash(scrollLocation);//Append location to url
        $anchorScroll.yOffset = 20; //Add space between element and brower border
        $anchorScroll(); //Read location from url
    }
});

//Use of anchorscroll with database data
myApp.controller("countryController", function ($scope, $http, $location, $anchorScroll) {
    $http.get("CountryService.asmx/GetData") //Call service to retreive data 
        .then(function (response) {
            $scope.dbCountries = response.data;
        });
    $scope.dbScrollTo = function (countryName) {
        $location.hash(countryName);
        $anchorScroll();
    }
});

//Nested scopes and controller as syntax
myApp
    .controller("nationController", function ($scope) {
        $scope.name = "US";
    })
    .controller("stateController", function ($scope) {
        $scope.name = "Texas";
    })
    .controller("cityController", function ($scope) {
        $scope.name = "Houston";
    });

myApp
    .controller("nationController2", function () {
        this.name = "US";
    })
    .controller("stateController2", function () {
        this.name = "Texas";
    })
    .controller("cityController2", function () {
        this.name = "Houston";
    });

