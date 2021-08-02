(function () {
    'use strict';
    angular.module('com.vyom.vyomlib.view-components.landing-console')
        .directive('comVyomVyomlibLandingConsole',

            function (rxRecordInstanceDataPageResource, rxRecordInstanceResource, $document, $window, $timeout, rxCurrentUser, rxNotificationMessage, rxViewComponentEventManager, rxGUID, $sce, rxRecordInstanceAttachmentResource, rxString, rxNamedListDataPageResource) {
                return {
                    restrict: 'E',
                    templateUrl: 'scripts/view-components/landing-console/com-vyom-vyomlib-landing-console.directive.html',

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
                            $scope.starsobj = [];

                            $scope.FilterExp = _config.FilterExp;
                            $scope.Views = _config.Views;
                            $scope.recordFlag = 'false';
                            $scope.cardActionGuid = _config.cardActionGuid;
                            $scope.adminConfiguration = _config.adminConfiguration;
                            $scope.adminConfigurationLabel = _config.adminConfigurationLabel;
                            $scope.cardVisible = _config.cardVisible ? _config.cardVisible : "";
                            $scope.cardErrorInformation = _config.cardErrorInformation ? _config.cardErrorInformation : "";
                            $scope.cardStatusNamedList = _config.cardStatusNamedList ? _config.cardStatusNamedList : "";
                            $scope.userApplicationNamedList = _config.userApplicationNamedList ? _config.userApplicationNamedList : "";
                            $scope.cardBottomActionGuid = _config.cardBottomActionGuid;

                            $scope.cardSorting = _config.cardSorting ? _config.cardOrder == "true" ? "-" + _config.cardSorting : _config.cardSorting : "";
                            $scope.cardOrder = _config.cardOrder;

                            $scope.cardStatus = _config.cardStatus;
                            $scope.cardFavourite = _config.cardFavourite;
                            $scope.cardScope = _config.cardScope;

                            $scope.rateMeActionGuid = _config.rateMeActionGuid;
                            $scope.ratingCount = _config.ratingCount;


                            //search

                            $scope.titleColor = _config.titleColor;
                            $scope.Greetings = _config.Greetings;
                            $scope.search = _config.search;

                            //Images fields
                            $scope.BannerRecordDefinition = _config.BannerRecordDefinition;
                            $scope.BannerInstanceId = _config.BannerInstanceId;
                            $scope.BannerImage = _config.BannerImage;
                            $scope.BannerURL = _config.BannerURL;
                            $scope.BannerCaption = _config.BannerCaption;
                            $scope.BannerSubCaption = _config.BannerSubCaption;

                            //Category
                            $scope.CategoryField = _config.CategoryField ? _config.CategoryField : "";
                            $scope.Category1 = _config.Category1;
                            $scope.Category2 = _config.Category2;
                            $scope.Category3 = _config.Category3;
                            $scope.Category4 = _config.Category4;
                            $scope.Category5 = _config.Category5;
                            $scope.Category6 = _config.Category6;
                            $scope.Category7 = _config.Category7;
                            $scope.Category8 = _config.Category8;
                            $scope.CategoryColor = _config.CategoryColor;

                            //DataSets
                            $scope.query = "";
                            $scope.DataSet1Label = _config.DataSet1Label;
                            $scope.DataSet1 = _config.DataSet1;
                            $scope.DataSet1Field = _config.DataSet1Field;
                            $scope.dataset1searchfield = _config.dataset1searchfield;
                            $scope.dataset1displayfield = _config.dataset1displayfield;
                            $scope.firstdataset = [];
                            $scope.getDataSet($scope.DataSet1, $scope.DataSet1Field, 'first');
                            $scope.DataSet2Label = _config.DataSet2Label;
                            $scope.DataSet2 = _config.DataSet2;
                            $scope.DataSet2Field = _config.DataSet2Field;
                            $scope.dataset2searchfield = _config.dataset2searchfield;
                            $scope.dataset2displayfield = _config.dataset2displayfield;
                            $scope.seconddataset = [];
                            $scope.getDataSet($scope.DataSet2, $scope.DataSet2Field, 'second');

                            //User
                            $scope.CurrentUserFullName = rxCurrentUser.get().fullName;
                            $scope.CurrentUserLoginName = rxCurrentUser.get().loginName;
                            $scope.RecDef = "com.bmc.arsys.rx.foundation:Person";


                            $scope.getCardList();
                            $scope.mydata = [];

                            $scope.getImage();
                            $scope.bannerGeneratedImage = "";

                            $scope.getApplicationStatusNamedList();
                            $scope.cardStatusDefaultValue = []; //namedListValues 

                            $scope.getUserApplicationNamedList();
                            $scope.userApplications = []; //namedListValues 

                            $scope.show_hide_recordGrid('false');






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
                                propertySelection: "1,2,3,4,5,6,7,8,179," + $scope.ApplicationName + "," + $scope.Description + "," + $scope.Color + "," + $scope.tooltipHeader + "," + $scope.Icon + "," + $scope.tooltipDescription + "," + $scope.Views + "," + $scope.ratingCount + "," + $scope.cardStatus + "," + $scope.cardFavourite + "," + $scope.cardScope + "," + $scope.CategoryField + "," + $scope.cardVisible + "," + $scope.cardErrorInformation,
                                queryExpression: $scope.FilterExp ? $scope.FilterExp : "",
                                sortBy: $scope.cardSorting

                            };

                            foo.get(-1, 0, queryParams).then(
                                function (allRecords) {
                                    $scope.mydata = allRecords.data;
                                    $scope.cardList = $scope.mydata;

                                }
                            );

                        }

                        $scope.getDataSet = function (datasetname, fieldvalues, datasetflag) {
                            var fieldvalues = fieldvalues == undefined ? "" : fieldvalues;
                            if (datasetname) {
                                var foo = rxRecordInstanceDataPageResource.withName(datasetname);
                                var queryParams = {
                                    propertySelection: "1,2,3,4,5,6,7,8,179," + fieldvalues,
                                };

                                foo.get(-1, 0, queryParams).then(
                                    function (allRecords) {
                                        if (datasetflag === 'first') {
                                            $scope.firstdataset = allRecords.data;
                                        } else {
                                            $scope.seconddataset = allRecords.data;
                                        }

                                    }
                                );
                            }
                        }

                        $scope.getApplicationStatusNamedList = function () {
                            rxNamedListDataPageResource.get($scope.cardStatusNamedList).then(function (data) {
                                $scope.cardStatusDefaultValue = data.data;
                            });

                        }

                        $scope.getUserApplicationNamedList = function () {
                            if ($scope.userApplicationNamedList) {
                                rxNamedListDataPageResource.get($scope.userApplicationNamedList).then(function (data) {
                                    $scope.userApplications = data.data;
                                });
                            }

                        }
                        $scope.userhaspermission = function (obj) {
                            if ($scope.userApplicationNamedList) {
                                return _.findKey($scope.userApplications, obj[$scope.ApplicationName]);
                            } else {
                                return true;
                            }
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
                                return (num / 1000).toFixed(0) + 'K';
                            } else if (num > 1000000) {
                                return (num / 1000000).toFixed(0) + 'M';
                            } else if (num < 1000) {
                                return num;
                            }
                        }

                        $scope.getImage = function () {
                            var save_picture = false;

                            if ($scope.adminConfiguration != true) {
                                var attachmentsResource = rxRecordInstanceAttachmentResource.withName($scope.BannerRecordDefinition);

                                attachmentsResource.get($scope.BannerInstanceId, ($scope.BannerImage).toString()).then(function (fileStream) {
                                    if (fileStream) {

                                        var arrayBufferView = new Uint8Array(fileStream.data); //  eslint-disable-line  no-undef

                                        var file = new Blob([arrayBufferView], {
                                            type: fileStream.headers('content-type')
                                        });

                                        var urlCreator = window.URL || window.webkitURL;

                                        $scope.bannerGeneratedImage = urlCreator.createObjectURL(file);

                                        debugger;



                                        if (save_picture) {
                                            $scope.fileName = fileStream.headers('Content-Disposition').split('filename=')[1];
                                            saveAs(file, $scope.fileName); //  eslint-disable-line  no-undef
                                        }
                                    }
                                });
                            }
                        }





                        $scope.filterCurrentCategoryOrSearchText = function (filterinput, type) {

                            if (type === 'Category') {
                                if (filterinput == "ALL") {
                                    $scope.cardList = $scope.mydata;
                                } else {
                                    $scope.cardList = _.filter($scope.mydata, function (obj) {
                                        return obj[$scope.CategoryField] == filterinput;
                                    });
                                }
                            } else {
                                if (filterinput == "" || filterinput == null) {
                                    $scope.cardList = $scope.mydata;
                                } else {
                                    $scope.cardList = _.filter($scope.mydata, function (obj) {

                                        return (obj[$scope.ApplicationName]).toLowerCase().match(filterinput.toLowerCase());
                                    });
                                }
                            }
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

                        $scope.updateCardFavourite = function (RecInstanceId, favObject) {
                            var isFavourite = angular.fromJson(favObject);


                            if (angular.isArray(isFavourite)) {
                                var currentUserFav = _.find(isFavourite, function (obj) {
                                    return obj.username == $scope.CurrentUserLoginName;
                                });
                                if (currentUserFav) {

                                    var favouriteValue = currentUserFav.isfavourite == 'true' ? 'false' : 'true';
                                    currentUserFav.isfavourite = favouriteValue;

                                    $scope.updatedbfav(RecInstanceId, isFavourite);
                                } else {
                                    isFavourite.push({
                                        username: $scope.CurrentUserLoginName,
                                        isfavourite: 'true'
                                    });
                                    $scope.updatedbfav(RecInstanceId, isFavourite);
                                }
                            } else {
                                isFavourite = [];
                                isFavourite.push({
                                    username: $scope.CurrentUserLoginName,
                                    isfavourite: 'true'
                                });
                                $scope.updatedbfav(RecInstanceId, isFavourite);
                            }





                        };

                        $scope.updatedbfav = function (RecInstanceId, isFavourite) {
                            var currentCard = _.find($scope.cardList, {
                                '179': RecInstanceId
                            });

                            currentCard[$scope.cardFavourite] = isFavourite;
                            if ($scope.RecordDefinition) {
                                var objectRecord = rxRecordInstanceResource.withName($scope.RecordDefinition);
                                objectRecord.get(RecInstanceId).then(
                                    function (record) {

                                        record.setValue($scope.cardFavourite, angular.toJson(isFavourite));
                                        record.put();
                                        rxNotificationMessage.success("Saved Successfully!!");



                                    }
                                );
                            }
                        }


                        $scope.updateCardVisibility = function (RecInstanceId, isCardVisible) {



                            if ($scope.RecordDefinition) {
                                var currentCardVisible = _.find($scope.cardList, {
                                    '179': RecInstanceId
                                });

                                currentCardVisible[$scope.cardVisible] = isCardVisible ? "false" : "true";

                                var objectRecord = rxRecordInstanceResource.withName($scope.RecordDefinition);
                                objectRecord.get(RecInstanceId).then(
                                    function (record) {

                                        record.setValue($scope.cardVisible, currentCardVisible[$scope.cardVisible]);
                                        record.put();

                                        rxNotificationMessage.success("Saved Successfully!!");

                                    }
                                );
                            }

                        };

                        $scope.getCardFavouriteClass = function (currentfavcssobject) {

                            var FavouriteCardCSSObject = angular.fromJson(currentfavcssobject);
                            var favarray = angular.isArray(FavouriteCardCSSObject) ? FavouriteCardCSSObject : [];
                            var favObject = _.find(favarray, function (obj) {
                                return obj.username == $scope.CurrentUserLoginName
                            });
                            if (favObject != undefined) {
                                if (favObject.isfavourite == 'true') {
                                    return "d-icon-heart w3-text-red";
                                } else {
                                    return "d-icon-heart_o";
                                }
                            } else {
                                return "d-icon-heart_o";
                            }



                        }

                        var toggle = false;
                        $scope.sortByFav = function () {
                            toggle = toggle === false ? true : false;
                            if (toggle) {
                                $scope.limit = $scope.cardList.length;
                                $(function () {
                                    $(".selector").filter(function () {
                                        return $('span', this).hasClass('d-icon-heart_o');
                                    }).hide();
                                });
                            } else {
                                $scope.limit = 8;
                                $(".selector").show();
                                $scope.cardList = $scope.mydata;
                            }
                        }


                        $scope.sortByViews = function () {

                            if ($scope.selectedValue == "clear") {
                                $scope.limit = 6;
                                $(".selector").show();
                                $scope.cardList = $scope.mydata;
                            }
                            if ($scope.selectedValue == "fav") {
                                $scope.limit = $scope.cardList.length;
                                $(function () {
                                    $(".selector").filter(function () {
                                        return $('span', this).hasClass('d-icon-heart_o');
                                    }).hide();
                                });
                            } else if ($scope.selectedValue == "status") {
                                var firstObjectValue = _.values(_.find($scope.cardStatusDefaultValue, function (obj) {
                                    return obj['green'];
                                }));
                                $scope.cardList = _.filter($scope.mydata, function (obj) {
                                    return obj[$scope.cardStatus] == firstObjectValue[0];
                                });
                            } else if ($scope.selectedValue == "published") {

                                $scope.cardList = _.filter($scope.mydata, function (obj) {
                                    return obj[$scope.cardVisible] === "true";
                                });
                            } else {
                                $scope.cardList = $scope.mydata.sort(function (a, b) {
                                    return b[$scope.selectedValue] - a[$scope.selectedValue];
                                });
                            }
                        }

                        //List-card
                        $scope.show_hide_recordGrid = function (gridflag) {
                            $scope.recordFlag = (gridflag == 'false') ? 'true' : 'false';
                            $scope.recordFlag == 'false' ? $(".hideme").hide() : $(".hideme").show();

                            $scope.eventManager.propertyChanged({
                                property: 'recordFlag',
                                newValue: $scope.recordFlag
                            });
                        };


                        $scope.opensearchmodal = function (value) {
                            if (value == "" || value == null) {
                                $element.find(".landingmodalcontainer").hide();
                            } else {
                                $element.find(".landingmodalcontainer").show();
                            }
                        }

                        $scope.intializesearch = function (searchtext) {
                            $scope.query = searchtext;
                            $scope.filterCurrentCategoryOrSearchText($scope.query, 'Search');
                        }

                        $scope.filtersearchboxapplication = function (obj) {
                            return (obj[$scope.ApplicationName]).toLowerCase().match($scope.query.toLowerCase());
                        }

                        $scope.filtersearchboxdataset1 = function (obj) {

                            return (obj[$scope.dataset1searchfield] == undefined ? "" : obj[$scope.dataset1searchfield]).toLowerCase().match($scope.query.toLowerCase());
                        }
                        $scope.filtersearchboxdataset2 = function (obj) {
                            return (obj[$scope.dataset2searchfield] == undefined ? "" : obj[$scope.dataset2searchfield]).toLowerCase().match($scope.query.toLowerCase());
                        }


                        init();

                    }

                };
            });
})();