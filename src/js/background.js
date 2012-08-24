(function( window )
{

	// Add listener
	chrome.extension.onConnect.addListener( function ( port )
	{
		
		// Register a unique listener
		port.onMessage.addListener( function( request )
		{
			if ( request.method == "loadCache" )
			{

				var ls = {};

				for ( var i = 0; i < localStorage.length; i++ )
					ls[ localStorage.key( i ) ] = localStorage.getItem( localStorage.key( i ) );

				port.postMessage( ls );

			} else if ( request.method == "saveCache" )
			{
				// Save locally
				localStorage[ request.key ] = request.value;

			} else if ( request.method == "clearCache" )
			{
				localStorage.clear();
			}
		});

	});

})( window );

