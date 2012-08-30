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
