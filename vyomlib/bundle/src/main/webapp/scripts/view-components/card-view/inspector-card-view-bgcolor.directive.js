// This directive is used at design time to choose a field.
(function () {
  'use strict';

  angular.module('com.vyom.vyomlib.view-components.card-view')
    .directive('comVyomVyomlibInspectorCardViewBgcolor', function (RX_RECORD_DEFINITION, $timeout) {
      return {
        restrict: 'E',
        templateUrl: 'scripts/view-components/card-view/com-vyom-vyomlib-inspector-card-view-bgcolor.directive.html',

        link: function ($scope) {

          $scope.data = {
            fields: [],
            selectedField: null
          };

          $scope.names = ["erric_default", "blue", "red", "green", "orange", "lime", "gray", "black", "pink", "brown", "dark-grey", "purple", "deep-purple", "indigo", "light-blue", "cyan", "teal", "light-green", "khaki", "yellow", "amber", "deep-orange", "blue-grey", "light-grey"];

          function initMaxStarValue() {
            $scope.HChange = $scope.cell.prop($scope.path);
          }

          // Saving the parameter
          function saveMaxStarValue() {
            $scope.cell.prop($scope.path, $scope.HChange);

          }

          // We watch "$scope.minSliderValue" to save it.
          $scope.$watch('HChange', saveMaxStarValue)
          initMaxStarValue();
        }
      };
    });
})();