'use strict';
 
var app = angular.module('typeaheadTestApp', [ "fxstr.directives.typeahead" ]);

app.controller( 'typeaheadTestController', [ '$scope', function( $scope ) {


	$scope.allResults = [ {
			id: 5
			, name: "Alabama"
		}, {
			id: 7
			, name: "Alaska"
		}, {
			id: 3
			, name: "Arizona"
		}, {
			id: 4
			, name: "Arkansas"
		}, {
			id: 1
			, name: "California"
		}, {
			id: 2
			, name: "Colorado"
		}, {
			id: 6
			, name: "Connecticut"
		}, {
			id: 8
			, name: "Delaware"
		}, {
			id: 9
			, name: "Florida"
		}, {
			id: 10
			, name: "Georgia"
		}, {
			id: 11
			, name: "Hawaii"
		}, {
			id: 12
			, name: "Idaho"
		}, {
			id: 13
			, name: "Indiana"
		}, {
			id: 14
			, name: "Iowa"
		}, {
			id: 15
			, name: "Kansas"
		}, {
			id: 16
			, name: "Kentucky"
		}, {
			id: 17
			, name: "Kentucky Pomme"
		}, {
			id: 18
			, name: "Kentucky90912Pomme"
		}, {
			id: 19
			, name: "9123Indiana"
		}, {
			id: 20
			, name: "Kentucky...Pomme"
		}, {
			id: 21
			, name: "Kentucky?;pomme"
	} ]


	$scope.getAllResults = function() {
		return $scope.allResults;
	}


	var defaultResults = [ { 
			id: 1
			, name: "default" 
		}, { 
			id: 2
			, name: "default2" 
		} ];



	$scope.typeaheadInput = "";

	$scope.getSearchTerm = function( item ) {
		var searchTerm = item.name + " " + item.id;
		return searchTerm;
	}


	$scope.getDefaultResults = function() {
		return defaultResults;
	}

	$scope.selectHandlerCallback = function( data ) {
		console.error(" ADDDDD %o", data );
	}


} ] );