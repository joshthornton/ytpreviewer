// Load settings from cache then load extension
cache.load( function ()
{

	// Create Namespace
	( function ( window )
	{
	
		// Create Object
		var ytp = window.ytpreviewer = {};
	
		// Scoped Variables
		var ytBaseURL = "http://www.youtube.com/watch?v=";

		// Default options - there has to be a more elegant way to do this
		if ( cache.get( "jump" ) != "true" && cache.get( "jump" ) != "false" )
			cache.set( "jump", "false" );
		if ( cache.get( "hover" ) != "true" && cache.get( "hover" ) != "false" )
			cache.set( "hover", "false" );
		if ( cache.get( "preload" ) != "true" && cache.get( "preload" ) != "false" )
			cache.set( "preload", "true" );
		if ( cache.get( "scale" ) != "true" && cache.get( "scale" ) != "false" )
			cache.set( "scale", "true" );
		if ( isNaN( parseInt( cache.get( "delay" ) ) ) )
			cache.set( "delay", "250" );
		if ( cache.get( "quality" ) != "high" && cache.get( "quality" ) != "medium" && cache.get( "quality" ) != "low" ) 
			cache.set( "quality", "high" );

		// Getting user options
		var jump = cache.get( "jump" ) == "true";
		var hover = cache.get( "hover" ) == "true";
		var preload = cache.get( "preload" ) == "true";
		var delay = Number( cache.get( "delay" ) );
		var quality = cache.get( "quality" );
		var scale = cache.get( "scale" ) == "true"? 2 : 1;
		
		// Regex
		var specPattern = /((https?\:\/\/i[0-9]+\.ytimg\.com\/sb\/[A-Za-z0-9\-_]{11}\/storyboard3_L\$L\/\$N\.jpg)\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#default\#[A-Za-z\-0-9_]{27})\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})\|?([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})?)/mi;
		var secondsPattern = /"length_seconds": ([0-9]+)/m;
		var ytURLPattern = /(youtube.com\/watch\/?\?.*v=|youtu.be\/)([a-zA-Z0-9\-_]{11})/;
	
		// Method to add mouseover action to yt links
		ytp.setup = function ()
		{
	
			ytp.listen( false );

			// Add new css class to DOM
			$( "html > head" ).append( $( "<style> .yt-overflow { overflow: visible !important; } </style>" ) );

	
			$( "a" ).each( function ()
			{
				var id;
				var elem = this;
	
				// Try match link "href" attribute against youtube video url pattern
				try {
					id = unescape( $( elem ).attr( "href" ) ).match( ytURLPattern )[ 2 ];
					if ( !id ) return;
				} catch ( e ) {
					return
				}
	
				if ( preload ) {
					ytp.lookup( id, function ( spec  )
					{
						$( elem ).mouseover( function( event )
						{
							var wait = setTimeout( function () { if ( $( elem ).find( ".ytpreviewer" ).length ==  0 ) { ytp.preview( elem, spec, event ); } }, delay );
							$( elem ).mouseout( function () { clearInterval( wait ); } );
						});
					});
				} else {
					$( this ).mouseover( function ( event )
					{
						var wait = setTimeout( function ()
						{ 
							ytp.lookup( id, function( spec )
							{
								ytp.preview( elem, spec, event ); 
							});
						}, delay );
						$( elem ).mouseout( function () { clearInterval( wait ); } );
					});
				}
	
			});
	
			setTimeout( function () { ytp.listen( true ); }, 1000 );
		}
	
		// Get spec from id either from cache or via ajax
		ytp.lookup = function ( id, callback )
		{
			// Check cache
			var spec = cache.get( id ); 
			if ( spec ) { 
				if ( spec != "unavailable" )
					callback( new Spec( spec ) );
				else
					cache.clear();
			} else {
				
				// Ajax lookup
				$.ajax(
				{
					url: ytBaseURL + id,
					method: "GET",
					success: function ( response )
					{
						try {
							// Extract spec from source
							var spec = new Spec( unescape( String( response ) ) );
							if ( !spec ) return;
	
							// Cache spec
							cache.set( id, JSON.stringify( spec ) );
	
							callback( spec );
						} catch ( e ) {}
					}
				});
			}
		}
		
		// Show the preview popup
		ytp.preview = function ( elem, spec, event )
		{
			
			// Turn off listen
			ytp.listen( false );

			// Get spec details
			var images = spec.thumbnail ? spec.thumbnailImageSet() : spec.previewImageSet( quality );
			var s = spec[ quality ]; // Save lots of characters!
			
			// Add event listeners
			$( elem ).bind( hover? "mouseleave":"mouseout", function () { ytp.listen( false ); $( ".ytpreviewer" ).remove(); $( elem ).parents().removeClass( "yt-overflow" ); ytp.listen( true ); } );
			$( elem ).mousemove( function ( event ) { ytp.move( s, scale, event ); } );
			
			// Ensure parents will not hide preview
			$( elem ).parents().addClass( "yt-overflow" );
	
			// Create DOM elements
			var div = $( "<div class='ytpreviewer'></div>" );
			div.css(
			{
				"width" : scale * s.imageWidth,
				"height" : scale * s.imageHeight,
				"top" : $( elem ).height(), /*( $( elem ).offset().top + Number( ( event.clientY > $( window ).height() / 2 )? - scale * s.imageHeight : $( elem ).height() ) ),
				"left" : $( elem ).offset().left*/
			});
			var list = $( "<ul></ul>" );
			list.css(
			{
				"width" : scale * s.imageWidth,
				"height" : scale * s.imageHeight * s.thumbnailCount,
				"list-style-type" : "none",
				"margin" : "0px",
				"padding" : "0px"
			});
	
			for ( var i = 0; i < s.thumbnailCount; ++i )
			{
				var frame = $( "<li></li>" );
				frame.css(
				{
					"background-image" : "url( '" + images[ Math.floor( i / ( s.gridWidth * s.gridHeight ) ) ] +"' )",
					"width" : scale * s.imageWidth,
					"height" : scale * s.imageHeight,
					"background-position-x" : ( i % ( s.gridWidth * s.gridHeight ) ) % s.gridWidth * scale * s.imageWidth,
					"background-position-y" : Math.floor( ( i % ( s.gridWidth * s.gridHeight ) ) / s.gridHeight )  * scale * s.imageHeight,
					"background-size" : ( scale * s.imageWidth * s.gridWidth ) + "px " + ( scale * s.imageHeight * s.gridHeight ) + "px",
					"margin" : "0px",
					"padding" : "0px"
				});
				
				$( list ).append( frame );
	
			}
	
			// If link element is statically positioned, relatively position it
			if ( $( elem ).css( "position" ) == "static" ) $( elem ).css( "position", "relative" );
	
			// Add click action to video section
			if ( jump ) {
				$( elem ).click( function ( event )
				{	
					var percentage = ( event.pageX - $( event.target ).offset().left ) / $( event.target ).width();  
					$( elem ).attr( "href", ytBaseURL + spec.id + "&t=" + Math.round( spec.seconds * percentage ) + "s" );
				});
			}
			
			// Add elements to page
			$( div ).append( list );
			//$( "body" ).append( div );
			$( elem ).append( div );
	
			// Turn on listen
			ytp.listen( true );
	
		}
	
		// Make the video scroll as the mouse is moved
		ytp.move = function ( spec, scale, event )
		{
			var percentage = ( event.pageX - $( event.target ).offset().left ) / $( event.target ).width();  
			$( ".ytpreviewer" ).find( "ul" ).css( "margin-top", -Math.floor( percentage * spec.thumbnailCount ) * scale * spec.imageHeight ); 
		}
		
		// Compatibility with infinite scrolling pages
		ytp.listen = function ( enable )
		{
			if ( enable)
				$( "body" ).bind( "DOMSubtreeModified",  ytp.setup );
			else
				$( "body" ).unbind( "DOMSubtreeModified" );
				
		}
	
	
	} ) ( window );

	/*$( document ).ready( ytpreviewer.setup ); */
	ytpreviewer.setup(); // Don't wait for every resource to load
});
