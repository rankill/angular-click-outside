/*
 * Modified by John Darwin Morales
 * Forked from https://github.com/IamAdamJowett/angular-click-outside by Rankill
 */


/**
 * @ngdoc directive
 * @description Directiva que permite realizar clcik por fuera del elemento objetivo, permitiendo ejecutar una
 * accion al cumplirse la condicion
 * @param clickOutSide {Function} Function a ejecutar al hacer click por fuera del elemento
 * @param listOutsideIfNot {Array} Array de clases que excluiran la ejecucion de la funcion pasada como parametro
 */
(function() {
	'use strict';
	angular
		.module('angular-click-outside', [])
		.directive('clickOutside', ['$document', clickOutside]);

	/**
	 * @ngdoc funcion
	 * @description Function de la directiva que se encarga de procesar la info y ejecutar la accion en su debido
	 * momento
	 * @param $document
	 * @returns {{restrict: string, scope: {clickOutside: string, listOutsideIfNot: string}, link: link}}
	 */
	function clickOutside($document) {
		return {
			restrict: 'A',
			scope: {
				clickOutside: '&',
				listOutsideIfNot:'='
			},
			link: function ($scope, elem, attr) {

				//Vars declaration
				var classList = [];

				if (attr.id !== undefined) classList.push(attr.id);



				$scope.$watch('listOutsideIfNot',function(newVal){
					if(angular.isDefined(newVal)){
						classList=newVal;
						if (attr.id !== undefined) classList.push(attr.id);
					}
				});

				/**
				 * @ngdoc funcion
				 * @description Handler del document click, se encargara de la ejecucion del evento siemprte y
				 * cuando pase las
				 * condiciones aca propuestas
				 * @param e
				 * @returns {*}
				 */
				var eventHandler = function(e) {

					//check if our element already hiden
					if(angular.element(elem).hasClass("ng-hide")){
						return;
					}

					var i = 0,
					    element;

					// if there is no click target, no point going on
					if (!e || !e.target) {
						return;
					}

					// loop through the available elements, looking for classes in the class list that might match and so will eat
					for (element = e.target; element; element = element.parentNode) {
						var id = element.id,
						    classNames = element.className,
						    l = classList.length;

						// Unwrap SVGAnimatedString
						if (classNames && classNames.baseVal !== undefined) {
							classNames = classNames.baseVal;
						}

						// loop through the elements id's and classnames looking for exceptions
						for (i = 0; i < l; i++) {
							// check for id's or classes, but only if they exist in the first place
							if ((id !== undefined && id.indexOf(classList[i]) > -1) || (classNames && classNames.indexOf(classList[i]) > -1)) {
								// now let's exit out as it is an element that has been defined as being ignored for clicking outside
								return;
							}
						}
					}

					// if we have got this far, then we are good to go with processing the command passed in via the click-outside attribute
					return $scope.$apply(function () {
						return $scope.$eval($scope.clickOutside);
					});
				};


				// assign the document click handler to a variable so we can un-register it when the directive is destroyed
				$document.on('click', eventHandler);

				// when the scope is destroyed, clean up the documents click handler as we don't want it hanging around
				$scope.$on('$destroy', function() {
					$document.off('click', eventHandler);
				});
			}
		};
	}

})();
