// Namespace
var cache = {};

// Object to store data
cache.data = {};

// Load from permanent background storage
cache.load = function ( callback )
{

	// Send request
	chrome.extension.sendRequest(
	{
		method: "loadCache"

	}, function ( response )
	{

		// Store each key / value pair
		for ( var key in response )
			cache.data[ key ] = response[ key ];


		// call callback
		if ( callback ) callback();
	});

}

cache.clear = function ()
{
	cache.data = {}

	// clear remotely
	chrome.extension.sendRequest(
	{
		method : "clearCache",
	});
}

cache.get = function ( key )
{
	return cache.data[ key ];
}

cache.set = function ( key, value )
{

	// Save locally
	cache.data[ key ] = value;

	// Save remotely
	chrome.extension.sendRequest(
	{
		method : "saveCache",
		key : key,
		value : value
	});

}
