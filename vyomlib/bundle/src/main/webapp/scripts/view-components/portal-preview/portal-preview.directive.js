(function () {
    'use strict';
    angular.module('com.vyom.vyomlib.view-components.portal-preview')
        .directive('comVyomVyomlibPortalPreview',

            function (rxRecordInstanceDataPageResource, rxRecordInstanceResource, $document, $window, $timeout, rxCurrentUser, rxNotificationMessage, rxGUID, $sce, rxViewComponentEventManager, rxRecordInstanceAttachmentResource, rxString, rxNamedListDataPageResource) {
                return {
                    restrict: 'E',
                    templateUrl: 'scripts/view-components/portal-preview/com-vyom-vyomlib-portal-preview.directive.html',

                    scope: {
                        rxConfiguration: '='
                    },

                    link: function ($scope, $element) {
                        var _config;

                        var init = function () {
                            _config = $scope.rxConfiguration.propertiesByName;
                            $scope.eventManager = rxViewComponentEventManager.getInstance($scope);

                            //Card fields
                            $scope.cardList = [];
                            $scope.RecordDefinition = _config.recordDefinitionFullName;
                            $scope.ApplicationName = _config.ApplicationName;
                            $scope.Description = _config.Description;
                            $scope.Color = _config.Color;
                            $scope.tooltipHeader = _config.tooltipHeader;
                            $scope.Icon = _config.Icon;
                            $scope.tooltipDescription = _config.tooltipDescription;
                            $scope.rateMeActionGuid = _config.rateMeActionGuid;
                            $scope.ratingCount = _config.ratingCount;
                            $scope.starsobj = [];

                            $scope.FilterExp = _config.FilterExp;
                            $scope.Views = _config.Views;
                            $scope.recordFlag = 'false';
                            $scope.adminConfiguration = _config.adminConfiguration;
                            $scope.cardVisible = _config.cardVisible ? _config.cardVisible : "";
                            $scope.cardErrorInformation = _config.cardErrorInformation ? _config.cardErrorInformation : "";
                            $scope.cardStatusNamedList = _config.cardStatusNamedList ? _config.cardStatusNamedList : "";

                            $scope.cardActionGuid = _config.cardActionGuid;
                            $scope.cardSorting = _config.cardSorting ? _config.cardSorting : "";
                            $scope.cardOrder = _config.cardOrder;

                            $scope.cardStatus = _config.cardStatus;
                            $scope.cardFavourite = _config.cardFavourite;
                            $scope.cardScope = _config.cardScope;



                            //search
                            $scope.SearchColor = _config.SearchColor;
                            $scope.titleColor = _config.titleColor;
                            $scope.Greetings = _config.Greetings;


                            //Images fields
                            $scope.BannerImage = _config.BannerImage;
                            $scope.BannerURL = _config.BannerURL;
                            $scope.carouselSpeed = _config.BannerScrollSpeed;

                            //Category
                            $scope.CategoryField = _config.CategoryField;
                            $scope.Category1 = _config.Category1;
                            $scope.Category2 = _config.Category2;
                            $scope.Category3 = _config.Category3;
                            $scope.Category4 = _config.Category4;
                            $scope.Category5 = _config.Category5;
                            $scope.Category6 = _config.Category6;
                            $scope.Category7 = _config.Category7;
                            $scope.Category8 = _config.Category8;
                            $scope.CategoryColor = _config.CategoryColor;

                            //User
                            $scope.CurrentUserFullName = rxCurrentUser.get().fullName;
                            $scope.CurrentUserLoginName = rxCurrentUser.get().loginName;
                            $scope.RecDef = "com.bmc.arsys.rx.foundation:Person";



                            $scope.getCardList();
                            $scope.mydata = [];
                            $scope.getApplicationStatusNamedList();
                            $scope.cardStatusDefaultValue = []; //namedListValues 
                            $scope.show_hide_recordGrid();





                        };
                        $scope.setUrlTOModal = function (indexurl) {
                            $scope.SetModalURL = indexurl;
                        }

                        $scope.trustSrc = function (url) {

                            return $sce.trustAsResourceUrl(url);
                        };

                        $scope.redirecturl = function (redurl) {
                            if (redurl) {
                                $window.open(redurl, '_blank');
                            }
                        };



                        $scope.getCardList = function () {
                            var foo = rxRecordInstanceDataPageResource.withName($scope.RecordDefinition);
                            var queryParams = {
                                propertySelection: "1,2,3,4,5,6,7,8,179," + $scope.ApplicationName + "," + $scope.Description + "," + $scope.Color + "," + $scope.tooltipHeader + "," + $scope.Icon + "," + $scope.tooltipDescription + "," + $scope.BannerURL + "," + $scope.BannerImage + "," + $scope.Views + "," + $scope.ratingCount + "," + $scope.cardStatus + "," + $scope.cardFavourite + "," + $scope.cardScope + "," + $scope.CategoryField + "," + $scope.cardVisible + "," + $scope.cardErrorInformation,
                                queryExpression: $scope.FilterExp ? $scope.FilterExp : ""

                            };

                            foo.get(100, 0, queryParams).then(
                                function (allRecords) {
                                    $scope.mydata = allRecords.data;
                                    if ($scope.cardOrder == "true") {

                                        $scope.cardList = $scope.mydata.sort(function (a, b) {
                                            return b[$scope.cardSorting] - a[$scope.cardSorting];
                                        });


                                    } else {
                                        $scope.cardList = _.sortBy(allRecords.data, $scope.cardSorting);
                                    }
                                    //.slice()




                                    $scope.firstSlideImageObject = _.max($scope.cardList, function (obj) {
                                        return obj[$scope.Views];
                                    });
                                    $scope.getImage(false, $scope.firstSlideImageObject[179], "first");

                                    $scope.secondSlideImageObject = _.max($scope.cardList, function (obj) {
                                        return $scope.firstSlideImageObject[$scope.Views] > obj[$scope.Views];
                                    });
                                    $scope.getImage(false, $scope.secondSlideImageObject[179], "second");

                                    $scope.thirdSlideImageObject = _.max($scope.cardList, function (obj) {
                                        return $scope.secondSlideImageObject[$scope.Views] > obj[$scope.Views];
                                    });
                                    $scope.getImage(false, $scope.thirdSlideImageObject[179], "third");



                                }
                            );

                        }

                        $scope.getApplicationStatusNamedList = function () {
                            rxNamedListDataPageResource.get($scope.cardStatusNamedList).then(function (data) {
                                $scope.cardStatusDefaultValue = data.data;
                            });

                        }

                        $scope.updateViewsCounter = function (RecInstanceId, views) {
                            if ($scope.RecordDefinition) {
                                var objectRecord = rxRecordInstanceResource.withName($scope.RecordDefinition);
                                objectRecord.get(RecInstanceId).then(
                                    function (record) {
                                        record.setValue($scope.Views, views + 1);
                                        record.put();

                                        $scope.getCardList();

                                    }
                                );
                            }

                        };

                        $scope.numFormatter = function (num) {
                            if (num > 999 && num < 1000000) {
                                return (num / 1000).toFixed(0) + 'K'; // convert to K for number from > 1000 < 1 million 
                            } else if (num > 1000000) {
                                return (num / 1000000).toFixed(0) + 'M'; // convert to M for number from > 1 million 
                            } else if (num < 1000) {
                                return num; // if value < 1000, nothing to do
                            }
                        }

                        $scope.getImage = function (save_picture, recordId, imageNumber) {
                            var attachmentsResource = rxRecordInstanceAttachmentResource.withName($scope.RecordDefinition);

                            attachmentsResource.get(recordId, ($scope.BannerImage).toString()).then(function (fileStream) {
                                if (fileStream) {

                                    var arrayBufferView = new Uint8Array(fileStream.data); //  eslint-disable-line  no-undef

                                    var file = new Blob([arrayBufferView], {
                                        type: fileStream.headers('content-type')
                                    });

                                    var urlCreator = window.URL || window.webkitURL;
                                    if (imageNumber == "first") {
                                        $scope.firstSlideImage = urlCreator.createObjectURL(file);
                                    } else if (imageNumber == "second") {
                                        $scope.secondSlideImage = urlCreator.createObjectURL(file);
                                    } else if (imageNumber == "third") {
                                        $scope.thirdSlideImage = urlCreator.createObjectURL(file);
                                    }
                                    debugger;


                                    //  function from file-saver.js library
                                    if (save_picture) {
                                        $scope.fileName = fileStream.headers('Content-Disposition').split('filename=')[1];
                                        saveAs(file, $scope.fileName); //  eslint-disable-line  no-undef
                                    }
                                }
                            });

                        }




                        $scope.setSelectedCardInstanceId = function (recInstanceID) {
                            // trigger the change property event
                            $scope.eventManager.propertyChanged({
                                property: 'CardInstanceId', // name of the property that changed
                                newValue: recInstanceID
                            });


                        }

                        $scope.executeAction = function (guid) {

                            $timeout(function () {
                                var button;


                                var buttonGuid = rxString.format('rx-action-button[rx-view-component-id=\'%s\'] > button', guid);

                                button = $document.find(buttonGuid);


                                if (button) {
                                    button.click();
                                } else {
                                    rxNotificationMessage.error('Cannot find button ' + $scope.buttonGuid);
                                }
                            });
                        }

                        $scope.clearSearchContainer = function () {
                            $scope.query = "";
                        }
                        $scope.assignCurrentCategory = function (filterinput) {
                            $scope.cardList = _.filter($scope.cardList, function (obj) {
                                return obj[$scope.CategoryField] == filterinput;
                            });
                        }

                        $scope.hoverIn = function (item) {
                            if (item == "popover") {
                                $('[rel="popover"]').popover();
                            }
                            $('[rel="tooltip"]').tooltip();
                        }
                        $scope.getCardScopeCSS = function (storedvalue) {

                            if (storedvalue == "true") {
                                return "d-icon-internet";

                            } else {
                                return "d-icon-mapmarker";
                            }

                        }
                        $scope.getCardStatusCSS = function (storedStatus) {


                            var NameListDisplayValue = _.find($scope.cardStatusDefaultValue, function (obj) {
                                var swappedObject = _.invert(obj);
                                var getcurrentkey = swappedObject[storedStatus];
                                return obj[getcurrentkey] == storedStatus;
                            });
                            var labelKey = _.keys(NameListDisplayValue);

                            return "w3-text-" + labelKey[0];

                        }


                        $scope.generateRating = function (starCount, guid) {


                            $scope.stars = [];


                            $scope.starSelectedColor = "color:orange";
                            $scope.starNotSelectedColor = "";

                            for (var i = 1; i <= 5; i++) {
                                $scope.stars[i] = {
                                    icon: i <= starCount ? 'd-icon-star ' : 'd-icon-star_o ',
                                    style: i <= starCount ? $scope.starSelectedColor : $scope.starNotSelectedColor
                                };
                            }
                            $scope.starsobj[guid] = $scope.stars;



                        }
                        $scope.updateCardFavourite = function (RecInstanceId, isFavourite) {

                            var favouriteValue = isFavourite == 'true' ? 'false' : 'true';
                            var currentCard = _.find($scope.cardList, {
                                '179': RecInstanceId
                            });

                            currentCard[$scope.cardFavourite] = favouriteValue;
                            if ($scope.RecordDefinition) {
                                var objectRecord = rxRecordInstanceResource.withName($scope.RecordDefinition);
                                objectRecord.get(RecInstanceId).then(
                                    function (record) {
                                        console.log(favouriteValue);
                                        record.setValue($scope.cardFavourite, favouriteValue);
                                        record.put();
                                        rxNotificationMessage.success("Saved Successfully!!");



                                    }
                                );
                            }

                        };

                        $scope.updateCardVisibility = function (RecInstanceId, isCardVisible) {

                            console.log(isCardVisible);

                            if ($scope.RecordDefinition) {
                                var objectRecord = rxRecordInstanceResource.withName($scope.RecordDefinition);
                                objectRecord.get(RecInstanceId).then(
                                    function (record) {

                                        record.setValue($scope.cardVisible, isCardVisible);
                                        record.put();

                                        rxNotificationMessage.success("Saved Successfully!!");

                                    }
                                );
                            }

                        };



                        $scope.getCardFavouriteClass = function (isFavouriteCard) {
                            if (isFavouriteCard == 'true') {
                                return "d-icon-heart w3-text-red";
                            } else {
                                return "d-icon-heart_o";
                            }
                        }



                        $scope.sortByViews = function () {
                            console.log("Selected value:" + $scope.selectedValue);

                            // if ($scope.selectedValue == $scope.cardFavourite || $scope.selectedValue == $scope.cardStatus) {
                            if ($scope.selectedValue == "clear") {
                                $(function () {
                                    $(".selector").show();
                                    $scope.getCardList();
                                });
                            }
                            if ($scope.selectedValue == "fav") {
                                $(function () {
                                    $(".selector").filter(function () {
                                        return $('span', this).hasClass('d-icon-heart_o');
                                    }).hide();
                                });
                            } else if ($scope.selectedValue == "status") {
                                $(function () {
                                    $(".selector").filter(function () {
                                        return $('span', this).hasClass('cardOffline');
                                    }).hide();
                                });
                            } else {
                                $scope.cardList = $scope.mydata.sort(function (a, b) {
                                    console.log(a.CardAvailibilty);
                                    // var textA = (a.CardAvailibilty) == true ? 1 : 0;
                                    // var textB = (b.CardAvailibilty) == true ? 1 : 0;
                                    // return b[textB] - a[textA];
                                    return b[$scope.selectedValue] - a[$scope.selectedValue];
                                });
                            }
                        }

                        //List-card
                        $scope.show_hide_recordGrid = function () {
                            $scope.recordFlag = ($scope.recordFlag == 'false') ? 'true' : 'false';

                            console.log($scope.recordFlag);
                            $scope.eventManager.propertyChanged({
                                property: 'recordFlag',
                                newValue: $scope.recordFlag
                            });
                        };




                        init();

                    }

                };
            });
})();
