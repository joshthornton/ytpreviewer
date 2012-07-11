// Create Namespace
( function ( window )
{

	// Create Object
	var ytp = window.ytpreviewer = {};

	// Scoped Variables
	var ytBaseURL = "http://www.youtube.com/watch?v=";
	var defaultQuality = "high";
	var defaultScale = 2;
	var defaultPreload = true;

	// Regex
	var specPattern = /((https?\:\/\/i[0-9]+\.ytimg\.com\/sb\/[A-Za-z0-9\-_]{11}\/storyboard3_L\$L\/\$N\.jpg)\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#default\#[A-Za-z\-0-9_]{27})\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})\|?([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})?)/mi;
	var ytURLPattern = /(youtube.com\/watch\/?\?.*v=|youtu.be\/)([a-zA-Z0-9\-_]{11})/;

	// Method to add mouseover action to yt links
	ytp.setup = function ()
	{

		ytp.listen( false );

		console.log( "ytp.setup" );

		$( "a" ).each( function ()
		{
			var id;
			var elem = this;
			var preload = cache.get( "preload" ) || defaultPreload;

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
						ytp.preview( elem, spec, event );
					});
				});
			} else {
				$( this ).mouseover( function ( event )
				{
					ytp.lookup( id, function( spec )
					{
						ytp.preview( elem, spec, event ); 
					});
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
			if ( spec != "unavailable" ) callback( new Spec( spec ) );
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
						var spec = new Spec( String( specPattern.exec( unescape( String( response ) ) )[ 1 ] ) );
						if ( !spec ) return;

						// Cache spec
						cache.set( id, JSON.stringify( spec ) );

						callback( spec );
					} catch ( e ) {
						cache.set( id, "unavailable" );
					}
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
		var quality = cache.get( "quality" ) || defaultQuality;
		var scale = cache.get( "scale" ) || defaultScale;
		var images = spec.getImageSet( quality );
		var s = spec[ quality ]; // Save lots of characters!
		
		// Add event listeners
		$( elem ).mouseout( function () { ytp.listen( false ); $( ".ytpreviewer" ).remove(); ytp.listen( true ); } );
		$( elem ).mousemove( function ( event ) { ytp.move( s, scale, event ); } );

		// Create DOM elements
		var div = $( "<div class='ytpreviewer'></div>" );
		div.css(
		{
			"width" : scale * s.imageWidth,
			"height" : scale * s.imageHeight,
			"top" : ( $( elem ).offset().top + Number( ( event.clientY > $( window ).height() / 2 )? - scale * s.imageHeight : $( elem ).height() ) ),
			"left" : $( elem ).offset().left
		});
		var list = $( "<ul></ul>" );
		list.css(
		{
			"width" : scale * s.imageWidth,
			"height" : scale * s.imageHeight * s.thumbnailCount
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
				"background-size" : ( scale * s.imageWidth * s.gridWidth ) + "px " + ( scale * s.imageHeight * s.gridHeight ) + "px"
			});
			
			$( list ).append( frame );

		}

		// If link element is statically positioned, relatively position it
		if ( $( elem ).css( "position" ) == "static" ) $( elem ).css( "position", "relative" );
		
		// Add elements to page
		$( div ).append( list );
		$( "body" ).append( div );

		// Turn on listen
		ytp.listen( true );

	}

	// Make the video scroll as the mouse is moved
	ytp.move = function ( spec, scale, event )
	{
		var percentage = ( event.pageX - $( event.target ).offset().left ) / $( event.target ).width();  
		$( ".ytpreviewer" ).find( "ul" ).css( "margin-top", -Math.round( percentage * spec.thumbnailCount ) * scale * spec.imageHeight ); 
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

// Load settings from cache then load extension
cache.load( function ()
{
	$( document ).ready( ytpreviewer.setup );
});
