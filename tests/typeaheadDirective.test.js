describe('Typeahead Directive', function() {

	var $compile;
	var $rootScope;
 
	// Load the myApp module, which contains the directive
	beforeEach(angular.mock.module('typeaheadTestApp'));
 
	// Store references to $rootScope and $compile
	// so they are available to all tests in this describe block
	beforeEach(angular.mock.inject(function(_$compile_, _$rootScope_, $controller, _$document_, _$templateCache_ ){
	

		// The injector unwraps the underscores (_) from around the parameter names when matching
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$document = _$document_;
		$templateCache = _$templateCache_;


		// Load testing controller used for real world UI test
		ctrl = $controller('typeaheadTestController', {
			$scope: $rootScope
		} );

	} ) );

	var html = '<input type="text" ng-model="typeaheadInput" class="typeaheadDirective" typeahead-empty-data-source="getDefaultResults" typeahead-data-source="allResults" typeahead-max-results="5" typeahead-search-term-function="getSearchTerm" typeahead-select-handler="selectHandlerCallback"></input>';
		


	describe( "visibility", function() {

		it( "shows resultList when focussed", function() {

			var element = $compile( html )( $rootScope );
			$rootScope.$digest();

			expect( element.next().hasClass( 'ng-hide' ) ).toBe( true );

			element.triggerHandler( "focus" );
			expect( element.next().hasClass( 'ng-hide' ) ).toBe( false );

			element.triggerHandler( "blur" );
			expect( element.next().hasClass( 'ng-hide' ) ).toBe( true );

		} );






		it( "hides results on ESC and click outside", function() {

			var element = $compile( html )( $rootScope );
			$rootScope.$digest();

			element.val( "a" ).triggerHandler( "change" );
			element.triggerHandler( "focus" );
			expect( element.next().hasClass( 'ng-hide' ) ).toBe( false );

			var escKey = $.Event( "keydown", { keyCode: 27 } );
			element.trigger( escKey );

			expect( element.next().hasClass( 'ng-hide' ) ).toBe( true );


			// Re-focus
			element.triggerHandler( "focus" );
			expect( element.next().hasClass( 'ng-hide' ) ).toBe( false );

			// Click outside
			var clickOutside = $.Event( "mousedown" );
			$document.find( "body" ).trigger( clickOutside );
			//expect( element.next().hasClass( 'ng-hide' ) ).toBe( true );

		} );




	} );





	describe( "results", function() {




		// Empty input: Show default results on focus
		it( "shows default values on focus and when input is empty", function() {

			var element = $compile( html )( $rootScope );
			$rootScope.$digest();

			element.triggerHandler( "focus" );

			// «x More results» is hidden
			expect( element.next().find( "li:last" ).hasClass( 'ng-hide') ).toBe( true );

			// 2 Results are displayed
			expect( element.next().find( "li:not(.ng-hide)" ).length ).toBe( 2 );
			expect( element.next().html() ).toContain( "default" );
			expect( element.next().html() ).toContain( "default2" );

			// When entering data and removing, default results are displayed
			element.val( "a" );
			element.triggerHandler( "change" );

			element.val( "" );
			element.triggerHandler( "change" );

			// 2 Results are displayed
			expect( element.next().find( "li:not(.ng-hide)" ).length ).toBe( 2 );

		} );







		it( "displays the correct results when a function is provided as data-source", function() {

			var el = angular.element( html );
			el.attr( "typeahead-data-source", "getAllResults()" );
			var element = $compile( el )( $rootScope );
			$rootScope.$digest();

			element.val( "ar" );
			element.triggerHandler( "change" );
			expect( element.next().find( "li:not(.more-results)" ).length ).toBe( 3 );

			expect( element.next().html() ).toContain( "Delaware" );
			expect( element.next().html() ).toContain( "Arizona" );
			expect( element.next().html() ).toContain( "Arkansas" );

		} );






		it( "displays the correct results when an array is provided as data-source", function() {

			var element = $compile( html )( $rootScope );
			$rootScope.$digest();

			element.val( "ar" );
			element.triggerHandler( "change" );
			expect( element.next().find( "li:not(.more-results)" ).length ).toBe( 3 );

			expect( element.next().html() ).toContain( "Delaware" );
			expect( element.next().html() ).toContain( "Arizona" );
			expect( element.next().html() ).toContain( "Arkansas" );

		} );



	} ); 







	describe( "too many results", function() {

		it( "displays 'more available' when too many results were found", function() {

			var element = $compile( html )( $rootScope );
			$rootScope.$digest();

			element.val( "a" );
			element.triggerHandler( "change" );

			var moreResults = element.next().find( ".more-results" );

			expect( moreResults.hasClass( "ng-hide" ) ).toBe( false );

			// «9 more» shall be displayed
			expect( moreResults.text() ).toContain( "9" );

			// Check length of all results (5 + 'more available' );
			expect( element.next().find( "li" ).length ).toBe( 6 );


			// Removes 'more available' when no more are available
			element.val( "ar" );
			element.triggerHandler( "change" );

			expect( element.next().find( "li:not(.more-results)" ).length ).toBe( 3 );



		} );

	} )









	describe( "templates", function() {

		it( "uses template when provided", function() {

			var el = angular.element( html );
			el.attr( "typeahead-template-url", "resultListTemplate.html" );

			$templateCache.put('resultListTemplate.html', "<ul><li style='border:1px solid black' ng-repeat='match in matches'>{{match.id}}</li></ul>");

			var element = $compile( el )( $rootScope );
			$rootScope.$digest();

			expect( el.next().find( "li:first" ).css( 'border' ) ).toEqual( "1px solid black" );

		} );


	} );













	describe( "no results", function() {


		it( "displays 'no results found' when no results are found", function() {

			var element = $compile( html )( $rootScope );
			$rootScope.$digest();

			element.val( "andasa" ).triggerHandler( "change" );

			// Only display '.no-results', but nothing else
			expect( element.next().find( ".no-results" ).hasClass( 'ng-hide' ) ).toBe( false );
			expect( element.next().find( ".more-results" ).hasClass( 'ng-hide' ) ).toBe( true );
			expect( element.next().find( "ul" ).hasClass( 'ng-hide' ) ).toBe( true );


		} );







		it( "doesn't call changeHandler when no results are displayed", function() {

			var element = $compile( html )( $rootScope );
			$rootScope.$digest();

			spyOn( $rootScope, 'selectHandlerCallback' );

			element.val( "afk" ).triggerHandler( "change" );

			var enter = $.Event( "keydown", { keyCode: 13 } );
			element.next().find( "li:first" ).trigger( enter );

			expect( $rootScope.selectHandlerCallback ).not.toHaveBeenCalled()

		} );



	} );







	describe( "keyboard and mouse interaction", function() {

		it( "sets activeIndex correctly on arrow up/down", function() {

			var element = $compile( html )( $rootScope );
			$rootScope.$digest();


			//
			// First element has active class
			//
			expect( element.next().find( "li:first" ).hasClass( 'active') ).toBe( true );


			//
			// Active goes down 
			//

			// Enter «a» to have lots of results
			element.val( "a" ).triggerHandler( 'change' );

			// Trigger arrow down
			var e = $.Event( "keydown", { keyCode: 40 } );
			element.trigger( e );

			// First doesn't have .active any more, but second
			expect( element.next().find( "li:first" ).hasClass( 'active' ) ).toBe( false );
			expect( element.next().find( "li" ).eq( 1 ).hasClass( 'active' ) ).toBe( true );


			//
			// Don't go below length of li
			//
			element.trigger( e ).trigger( e ).trigger( e ).trigger( e ).trigger( e ).trigger( e ).trigger( e );

			// Last list item is highlighted
			expect( element.next().find( "li:not(.more-results):last" ).hasClass( 'active' ) ).toBe( true );

			// Highlight no more than 1 list item
			expect( element.next().find( "li.active" ).length ).toBe( 1 );

			// Don't go above 0
			var up = $.Event( "keydown", { keyCode: 38 } );
			element.trigger( up ).trigger( up ).trigger( up ).trigger( up ).trigger( up ).trigger( up ).trigger( up ).trigger( up ).trigger( up );
			expect( element.next().find( "li:first" ).hasClass( 'active' ) ).toBe( true );


			//
			// New input: First element is selected
			//
			element.trigger( e ).trigger( e );
			element.val( "ar" ).triggerHandler( 'change' );
			expect( element.next().find( "li:first" ).hasClass( 'active' ) ).toBe( true );

		} );






		it( "calls changeHandler with correct data on enter", function() {

			var element = $compile( html )( $rootScope );
			$rootScope.$digest();

			// Create spy for selectHandlerCallback
			spyOn( $rootScope, 'selectHandlerCallback' );

			var enter = $.Event( "keydown", { keyCode: 13 } );


			// With no input value (default results)
			element.triggerHandler( "focus" );
			element.trigger( enter );

			var arg = $rootScope.getDefaultResults()[ 0 ];
			expect( $rootScope.selectHandlerCallback ).toHaveBeenCalledWith( arg );	


			// With value «a»
			element.val( "a" ).triggerHandler( "change" );
			element.trigger( enter );

			var arg = $rootScope.allResults[ 0 ];
			expect( $rootScope.selectHandlerCallback ).toHaveBeenCalledWith( arg );


			// Is form reset afterwards?
			expect( element.val() ).toBe( "" );
			expect( element.after().hasClass( 'ng-hide' ) ).toBe( false );
			expect( element.next().find( "li:not(.more-results)" ).length ).toBe( 2 );


		} );




		
		it( "calls changeHandler with correct data on click", function() {

			var element = $compile( html )( $rootScope );
			$rootScope.$digest();

			// Create spy for selectHandlerCallback
			spyOn( $rootScope, 'selectHandlerCallback' );
			var click = $.Event( "mousedown" );

			// Display result list
			element.val( "a" ).triggerHandler( "change" );

			// «more results» can't be clicked on and doesn't hide results
			element.next().find( ".more-results" ).click();
			expect( $rootScope.selectHandlerCallback ).not.toHaveBeenCalled();
			expect( element.after().hasClass( 'ng-hide' ) ).toBe( false );


			var arg = $rootScope.allResults[ 0 ];

			// Click on first result element
			element.next().find( "li:first" ).trigger( click );

			expect( $rootScope.selectHandlerCallback ).toHaveBeenCalledWith( arg );


		} );


	} )





	describe( "insert after", function() {

		it( "inserts the result list after typeahead-insert-after, if provided", function() {


			var outerHTML = function( el ) {
				return el.appendTo( angular.element( "<div></div>" ) ).html();
			}


			var body = angular.element( document ).find( "body" );


			var el = angular.element( "<div class='inner'>" + html + "</div>" );
			el.find( "input" ).attr( 'typeahead-insert-after', '.inner' );


			// Append wrapper to body before $compile, as it is needed in the compilation phase 
			// to append result-list
			body.append( el );


			// Compile el
			var element = $compile( el )( $rootScope );

			//console.log( body.html() );
			expect( body.find( ".inner" ).next().hasClass( 'typeahead-result-list') ).toBe( true );


			// Remove from body
			afterEach( function() {
				angular.element( document ).find( "body" ).find( ".inner" ).remove();
			} );

		} );


	} );



});













