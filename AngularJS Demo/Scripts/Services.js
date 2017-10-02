/// <reference path="Script.js" />

//Custom Angular Service (a set of properties and functions)
myApp.factory("stringService", function () {
    return { //return an object containing properties and functions.
        processString: function (input) {
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
            return output;
        }
    }
})