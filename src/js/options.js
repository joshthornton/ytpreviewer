(function ( window )
{

	// Create namespace
	var O = window.Options = this;

	O.init = function( params )
	{
		
		// Construct form
		var form = $( "<form></form>" );
		
		// Make table
		var table = $( "<table></table>" );

		// Add rows
		$( params.form ).each( function()
		{

			var option = this;

			var row = $( "<tr></tr>" );
			var name = $( "<td>" + option.name + ": </td>" );
			var value = $( "<td></td>" );
			var tooltip = $( "<td><div class='tooltip'><span>" + option.tooltip  + "</span></div></td>" );

			if ( option.type == "select" )
			{
				var select = $( "<select id='" + option.key  + "'></select" );

				$( option.options ).each( function ()
				{
					$( select ).append( $( "<option value='" + this.value + "' " + (this.value == option.value? "selected" : "")  + ">" + this.name + "</option>" ) );	
				});

				$( value ).append( select );

			} else {

				var input = $( "<input></input>" );
				$( input ).attr(
				{
					"id" : option.key,
					"type" : option.type == "boolean" ? "checkbox" : 
							 option.type == "button" ? "button" : "text",
					"value" : option.value
				});
				if ( option.type == "boolean" )
					input.attr( "checked", option.value );
				else if ( option.type == "button" )
					$( input ).click( option.action );
				else
					input.html( option.value );

				$( value ).append( input );
		
			}

			$( row ).append( name, value, tooltip );

			$( table ).append( row );

		});

		// Add save button
		$( table ).append( $( "<tr><td></td><td><input id='save' type='submit' value='Save' /></td><td><span id='status'></span></td></tr>" ) );

		// Add save action
		$( table ).find( "#save" ).click( function ()
		{
			
			var values = [];

			// Get each of the values
			$( params.form ).each( function()
			{
				if ( this.type == "boolean")
					values.push( { key : this.key, value : $( "#" + this.key ).attr( "checked" ) != undefined? "true" : "false" } );
				else if ( this.type != "button" )
					values.push( { key : this.key, value : $( "#" + this.key ).val() } );
			});

			// Callback
			params.callback( values );

			// Show status
			$( "#status" ).html( "Saved." ).show();
			setTimeout( function () { $( "#status" ).fadeOut() }, 750 );

			return false; // Prevent default

		});

		// Add table to form
		$( form ).append( table );

		// Add form to div
		$( params.div ).html( form );

	};
	

})( window );


// Load setting from cache
cache.load( function ()
{

	var options = {
		div : "#options",
		callback: function( values )
		{
			$( values ).each( function ()
			{
				cache.set( this.key, this.value );
			});
		},
		form: [
			{ key: "jump", value: cache.get( "jump" ) == "true", type : "boolean", name: "Jump", tooltip: "Link to the part of the video matching the current thumbnail" },
			{ key: "hover", value: cache.get( "hover" ) == "true", type: "boolean", name: "Hover", tooltip: "Keep video preview visible whilst hovering over thumbnails" },
			{ key: "preload", value: cache.get( "preload" ) == "true", type: "boolean", name: "Prefetch Video Information", tooltip: "Preload video information for faster loading. May waste bandwidth by prefetching video specs for never previewed videos" },
			{ key: "delay", value: cache.get( "delay" ), type: "int", name: "Preview delay (ms)", tooltip: "The delay between hovering over a link and the preview being shown" },
			{ key: "quality", value: cache.get( "quality" ), type: "select", options: [ { name: "low", value: "low" }, { name: "medium", value: "medium" }, { name: "high", value: "high" } ], name: "Thumbnail Quality", tooltip: "YouTube provides three quality levels for thumbnail previews. Higher quality == more bandwidth" },
			{ key: "scale", value: cache.get( "scale" ) == "true", type: "boolean", name: "Pixel-Double Preview", tooltip: "Show the preview at double the actual size" },
			{ key: "clear", value: "Clear Cache", type: "button", name: "Clear Cache", tooltip: "If you are experiencing problems, try clearing the cache.", action: function() { cache.clear() } }
		]
	};

	Options.init( options );

});
