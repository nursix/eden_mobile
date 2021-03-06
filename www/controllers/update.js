/**
 * Sahana Eden Mobile - Update-Form Controller
 *
 * Copyright (c) 2016: Sahana Software Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

"use strict";

/**
 * Update-form
 */
EdenMobile.controller("EMDataUpdate", [
    '$scope', '$state', '$stateParams', 'emDB', 'emDialogs',
    function($scope, $state, $stateParams, emDB, emDialogs) {

        var formName = $stateParams.formName,
            recordID = $stateParams.recordID,
            query = formName + '.id=' + recordID;

        $scope.formName = formName;
        $scope.recordID = recordID;

        // Start with empty master (populated asynchronously)
        $scope.master = {};

        // Read default values from schema
        emDB.table(formName).then(function(table) {

            // Get form fields from schema
            var schema = table.schema,
                fields = [];

            for (var fieldName in schema) {
                if (fieldName[0] != '_') {
                    fields.push(fieldName);
                }
            }

            // Set the form title
            var strings = table.schema._strings,
                formTitle = formName;
            if (strings) {
                formTitle = strings.name || listTitle;
            }
            $scope.formTitle = formTitle;
            //$scope.$apply();

            // Extract current record
            table.select(fields, query, function(records, result) {

                var form = $scope.form,
                    master = $scope.master;

                if (records.length == 1) {

                    // Write data into both master and form
                    var row = records[0];
                    for (var i=0, len=fields.length; i<len; i++) {
                        var field = fields[i],
                            value = row[field];
                        if (value !== undefined) {
                            master[field] = value;
                            form[field] = value;
                        }
                    }

                    // Update scope
                    $scope.$apply();

                } else {

                    // Show error popup, then go back to list
                    emDialogs.error('Record not found', function() {
                        $state.go('data.list',
                            {formName: $scope.formName},
                            {location: 'replace'}
                        );
                    });
                }
            });

        });

        // Confirmation message for successful update
        var confirmUpdate = function(recordID) {
            // Show confirmation popup and go back to list
            emDialogs.confirmation('Record updated', function() {
                $state.go('data.list',
                    {formName: $scope.formName},
                    {location: 'replace'}
                );
            });
        };

        // Submit function
        $scope.submit = function(form) {

            emDB.table(formName).then(function(table) {

                // @todo: validate
                var empty = true;
                for (var field in form) {
                    if (form[field] !== undefined && form[field] !== null) {
                        empty = false;
                        break;
                    }
                }
                if (!empty) {
                    // Copy to master (only useful if not changing state)
                    //$scope.master = angular.copy(form);

                    // Commit to database and confirm
                    table.update(form, query, confirmUpdate);
                }
            });
        };

        // Confirmation message for successful delete
        var confirmDelete = function(rowsAffected) {
            // Show confirmation popup and go back to list
            // @todo: should this actually check that rowsAffected is 1?
            emDialogs.confirmation('Record deleted', function() {
                $state.go('data.list',
                    {formName: $scope.formName},
                    {location: 'replace'}
                );
            });
        };

        // Delete-action
        $scope.deleteRecord = function() {

            emDialogs.confirmAction(
                'Delete Record',
                'Are you sure you want to delete this record?',
                function() {
                    emDB.table(formName).then(function(table) {
                        table.deleteRecords(query, confirmDelete);
                    });
                }
            );
        };

        // @todo: expose reset in UI
        $scope.reset = function() {
            $scope.form = angular.copy($scope.master);
        };

        // Initial reset
        $scope.reset();
    }
]);
