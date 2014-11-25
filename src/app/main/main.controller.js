'use strict';

angular.module('finanse')
  .controller('MainCtrl', function ($scope, $cookies) {

        $scope.entries = {};
        $scope.expenses = localStorage.expenses ? JSON.parse(localStorage.expenses) : [];

        $scope.onFileSelect = function($files){

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = function(e) {

                var csv = 'transactionDate;entryDate;description;diff;diffCurrency;balanceAfter;balanceCurrency\n'+ e.target.result;

                $scope.entries = Papa.parse(csv, {
                    delimiter: ';',
                    dynamicTyping: true,
                    header: true
                });

                $scope.$apply();

                angular.forEach($scope.expenses, function(expense){
                    $scope.updateExpense(expense, $scope.entries.data)
                    $scope.$apply();
                });
            };

            // Read in the image file as a data URL.
            reader.readAsText($files[0], 'CP1250');
        };

        $scope.getExpensesSum = function(){
            return $scope.expenses.reduce(function(sum, expense){
                return sum + (expense.sum || 0);
            },0);
        };

        $scope.getUncategorizedEntries = function(){
            return $scope.entries;
        }

        $scope.updateExpense = function(expense, entries){
            expense.sum = $scope.sumEntries(filterEntries(entries, expense.filterString))
            localStorage.expenses = JSON.stringify(serializeExpenses($scope.expenses));
        };


        function stringContainsAnyOf(string, wantedStrings){
            return _.some(wantedStrings, function(wanted){
                return string.toLowerCase().search(wanted.toLowerCase()) !== -1;
            });
        }

        $scope.getUncategorizedEntries = function(){
            return _.filter($scope.entries.data, function(entry){

                var allFiltersString = $scope.expenses.reduce(function(filtersCombined, expense){

                   return filtersCombined + ',' + expense.filterString;

                },'');

                return !stringContainsAnyOf(entry.description, buildFilterChunks(allFiltersString));
            });
        };

        function filterEntries(entries, filterString){
            return _.filter(entries, function(entry){
                return stringContainsAnyOf(entry.description, buildFilterChunks(filterString))
            })
        }

        function buildFilterChunks(filterString){

            var filterChunks = filterString.split(',');

            filterChunks = _.map(filterChunks, function(item){
                return item.trim();
            });

            return _.filter(filterChunks, function(chunk){
                return chunk.length;
            });
        }

        function serializeExpenses(expenses){
            var expenses = _.map(expenses, function(expense){

                return {
                    name: expense.name,
                    filterString: expense.filterString
                }

            });

            return expenses;
        }

        function diffToNumber(diff) {
            var diff = parseFloat(diff.replace(',', '.'));
            diff = (diff > 0 ? 0 : diff);
            return diff;
        }

        $scope.sumEntries = function(entries){

            var sum = _.reduce(entries, function(sum, entry) {

                var diff = diffToNumber(entry.diff);

                return sum + diff;
            },0);

            return sum;

        }
  });
