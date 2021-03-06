/**
 * Sahana Eden Mobile - Standard Popup Dialogs Service
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

EdenMobile.factory('emDialogs', [
    '$ionicPopup', '$timeout',
    function ($ionicPopup, $timeout) {

        var dialogs = {

            /**
             * Show a confirmation popup
             *
             * @param {string} msg - the message to show
             * @param {function} callback - callback function to execute
             *                              after closing the popup
             */
            confirmation: function(msg, callback) {

                var confirmationPopup = $ionicPopup.show({
                    title: msg
                });

                // auto-hide after 800ms
                $timeout(function() {
                    confirmationPopup.close();
                    if (callback) {
                        callback();
                    }
                }, 800);
            },

            /**
             * Show an error popup with user confirmation
             *
             * @param {string} msg - the message to show
             * @param {function} callback - callback function to execute
             *                              after closing the popup
             */
            error: function(msg, callback) {

                var errorPopup = $ionicPopup.show({
                    title: msg,
                    buttons: [
                        {
                            text: '<b>Close</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                if (callback) {
                                    callback();
                                }
                            }
                        }
                    ]
                });
            },

            /**
             * Show a popup asking for user confirmation
             *
             * @param {string} title - title describing the action to confirm
             * @param {string} question - the question to ask
             * @param {function} actionCallback - callback function to execute
             *                                    if the user confirms the action
             * @param {function} cancelCallback - callback function to execute
             *                                    if the user cancels the action
             */
            confirmAction: function(title, question, actionCallback, cancelCallback) {

                var confirmPopup = $ionicPopup.confirm({
                    title: title,
                    template: question
                });

                confirmPopup.then(function(response) {
                    if (response) {
                        // User confirmed action
                        if (actionCallback) {
                            actionCallback();
                        }
                    } else {
                        // User cancelled action
                        if (cancelCallback) {
                            cancelCallback();
                        }
                    }
                });
            },

            /**
             * Show a popup prompting for a single string input
             *
             * @param {string} title - title describing the action to confirm
             * @param {string} question - the question to ask
             * @param {object} options - options for the input:
             *                           - inputType: 'text', 'password', ...
             *                           - inputPlaceholder: placeholder text
             *                           - defaultText: default value
             * @param {function} actionCallback - callback function to execute
             *                                    if the user submits the input,
             *                                    function(inputValue)
             * @param {function} cancelCallback - callback function to execute
             *                                    if the user cancels the dialog,
             *                                    takes no parameters
             */
            stringInput: function(title, question, options, actionCallback, cancelCallback) {

                if (options === undefined) {
                    options = {};
                }

                var stringInput = $ionicPopup.prompt({
                    title: title,
                    subTitle: question,
                    inputType: options.inputType || 'text',
                    inputPlaceholder: options.inputPlaceholder,
                    defaultText: options.defaultText
                });

                stringInput.then(function(inputValue) {
                    if (inputValue === undefined) {
                        if (cancelCallback) {
                            cancelCallback();
                        }
                    } else {
                        if (actionCallback) {
                            actionCallback(inputValue);
                        }
                    }
                });
            }
        };
        return dialogs;
    }
]);
