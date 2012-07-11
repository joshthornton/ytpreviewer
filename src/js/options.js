// Load setting from cache
cache.load( function ()
{

	// Run on document load
	$( document ).ready( function ()
	{

		// Get details from cache 
		var quality = cache.get( "quality" ) || "high";
		var scale = cache.get( "scale" ) || "2";
		var preload = cache.get( "preload" ) || true; 
		var delay = cache.get( "delay" ) || 0; 
	
		// Update form 
		$( "#quality" ).val( quality );
		$( "#scale" ).prop( "checked", scale == "1" ? "" : "checked" );
		$( "#preload" ).prop( "checked", preload?  "checked" : "" );
		$( "#delay" ).val( delay );
		
		// Set callback
		$( "#save" ).click( function ()
		{
		
			// Get values
			var quality = $( "#quality" ).val();
			var scale = $( "#scale" ).prop( "checked" ) ? "2" : "1";
			var preload = $( "#preload" ).prop( "checked" ) ? true : false;
			var delay = $( "#delay" ).val();
		
			// Save to cache 
			cache.set( "quality", quality );
			cache.set( "scale", scale );
			cache.set( "preload", preload );
			cache.set( "delay", delay );
		
			// Show options saved
			$( "#status" ).html( "Options Saved." );
			setTimeout( function ()
			{
				$( "#status" ).html( "" );
			}, 750 );
		});

		// Set clear
		$( "#clear" ).click( function ()
		{
			cache.clear();
		});
	
	});

});
