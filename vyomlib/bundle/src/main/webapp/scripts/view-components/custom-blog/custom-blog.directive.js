(function () {
    'use strict';
    angular.module('com.vyom.vyomlib.view-components.custom-blog')
        .directive('comVyomVyomlibCustomBlog',

            function (rxNotificationMessage, rxRecordInstanceDataPageResource, rxRecordInstanceResource, rxGUID, $window, rxCurrentUser, $sce, rxViewComponentEventManager) {
                return {
                    restrict: 'E',
                    templateUrl: 'scripts/view-components/custom-blog/com-vyom-vyomlib-custom-blog.directive.html',

                    scope: {
                        rxConfiguration: '='
                    },

                    link: function ($scope, $element) {
                        var _config,
                            eventManager = rxViewComponentEventManager.getInstance($scope);




                        var init = function () {
                            _config = $scope.rxConfiguration.propertiesByName,

                                $scope.RecordDefinition = _config.recordDefinitionFullName;
                            $scope.HTMLField = _config.HTMLField;
                            $scope.RecInstanceId = _config.RecInstanceId;
                            $scope.enableEditButton = _config.enableEditButton;
                            $scope.staticHtml = "";
                            $scope.enableEditButton == 'true' ? $element.find('#edit').show() : $element.find('#edit').hide();
                            $scope.enableEditPane = _config.enableEditPane;
                            $scope.enableEditPane ? $element.find('.card-header').show() : $element.find('.card-header').hide();



                            $scope.CurrentUserFullName = rxCurrentUser.get().fullName;





                            //get unique instamce id for editor
                            $scope.editorID = _config.editorInstance.split("-").join("_");
                            $element.find(".card-footer").hide();


                            angular.element(document).ready(function () {

                                CKEDITOR.plugins.addExternal('codesnippet', '/com.vyom.vyomlib/resources/ckeditor-4.11.1/plugins/codesnippet_4.15.0/', 'plugin.js');
                                CKEDITOR.plugins.addExternal('chart', '/com.vyom.vyomlib/resources/ckeditor-4.11.1/plugins/chart_1.0.2/', 'plugin.js');
                                $scope.editor = CKEDITOR.inline($scope.editorID, {

                                    autoGrow_onStartup: false,
                                    resize_enabled: false,
                                    height: '500px',
                                    extraPlugins: ['image', 'find', 'sharedspace', 'base64image', 'wsc', 'imagepaste', 'codesnippet', 'chart', 'sourcedialog'],
                                    startupFocus: false,
                                    disableAutoInline: true,

                                });
                                $scope.editor.on('instanceReady', function () {
                                    $scope.toggleReadOnly(true);


                                    getHTML();
                                })




                            });

                            $scope.mydata = [];





                        };




                        // <!----------- buit in functions------------------>

                        $scope.updateHTML = function () {
                            $scope.editorData = $scope.editor.getData();

                            if ($scope.editorData && $scope.RecordDefinition) {
                                var objectRecord = rxRecordInstanceResource.withName($scope.RecordDefinition);
                                objectRecord.get($scope.RecInstanceId).then(
                                    function (record) {
                                        record.setValue($scope.HTMLField, $scope.editorData);
                                        record.put();
                                        getHTML();
                                        $scope.toggleReadOnly(true);

                                        rxNotificationMessage.success("Successfully Saved!!");

                                    }
                                );
                            }
                        };

                        function getHTML() {
                            var objectRecord = rxRecordInstanceResource.withName($scope.RecordDefinition);
                            objectRecord.get($scope.RecInstanceId).then(
                                function (record) {
                                    $scope.staticHtml = $sce.trustAsHtml(record.getValue($scope.HTMLField));
                                    $scope.editor.setData(record.getValue($scope.HTMLField));
                                }
                            );

                        }

                        $scope.onRefresh = function () {


                            rxRecordInstanceResource.withName($scope.RecordDefinition).get($scope.RecInstanceId).then(
                                function (record) {
                                    $scope.staticHtml = $sce.trustAsHtml(record.getValue($scope.HTMLField));
                                    $scope.editor.setData(record.getValue($scope.HTMLField));
                                    rxNotificationMessage.info("Refresh Complete");
                                    $scope.toggleReadOnly(true);
                                }
                            );


                        }

                        $scope.toggleReadOnly = function (isReadOnly) {

                            if (isReadOnly) {
                                $scope.editor.setReadOnly(isReadOnly);
                                $element.find("#" + $scope.editorID).hide();
                                $element.find("#CustomBlogEditor").show();
                                $element.find(".card-footer").hide();
                            } else {
                                $element.find("#CustomBlogEditor").hide();
                                $element.find("#" + $scope.editorID).show();
                                $scope.editor.setReadOnly(isReadOnly);
                                $element.find(".card-footer").show();
                            }



                        }



                        function refreshCustomBlog(params) {

                            $scope.onRefresh();
                        }

                        // Overriding the view component refresh method to use our own
                        // to refresh the custom blog.
                        $scope.rxConfiguration.api = {
                            refresh: refreshCustomBlog.bind(null, true)
                        };

                        eventManager.propertyChanged({
                            property: 'api',
                            newValue: $scope.rxConfiguration.api
                        });

                        $scope.$watch("rxConfiguration.propertiesByName.RecInstanceId", function (RecInstanceId) {
                            $scope.RecInstanceId = RecInstanceId;
                        });


                        init();


                    }

                };
            });
})();
