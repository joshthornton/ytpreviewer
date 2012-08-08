(function( window )
{
	
	// Namespace
	var cache = window.cache = this;

	// Object to store key / value pairs
	cache.data = {};

	// Setup port
	var port = chrome.extension.connect( { name : "ytpreviewer" } );

	// Load method
	cache.load = function( callback )
	{
	
		port.postMessage( { method: "loadCache" } );
		port.onMessage.addListener( function ( response )
		{
	
			if ( response )
			{
				// Store each key / value pair
				for ( var key in response )
					cache.data[ key ] = response[ key ];

			}
			
			// call callback
			if ( callback ) callback();
		
		});
	}

	// Get method
	cache.get = function ( key )
	{
		return cache.data[ key ];
	}

	// Set method
	cache.set = function ( key, value )
	{
		
		// Save locally
		cache.data[ key ] = value;

		// Save remotely
		port.postMessage(
		{
			method : "saveCache",
			key :	key,
			value : value
		});
	}

	cache.clear = function()
	{
		port.postMessage(
		{
			method: "clearCache"
		});

		cache.data = {};
	}

})( window );

