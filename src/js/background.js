chrome.extension.onRequest.addListener( function(request, sender, sendResponse)
{
	if ( request.method == "loadCache" ) {

		var ls = {};

		for ( var i = 0; i < localStorage.length; i++ )
		{
			ls[ localStorage.key( i ) ] = localStorage.getItem( localStorage.key ( i ) );
		}

		log();

		sendResponse( ls );
	} else if ( request.method == "saveCache" ) {

		localStorage[ request.key ] = request.value;

		log();

    	sendResponse( {} );
	} else if ( request.method == "clearCache" ) {
		localStorage.clear();	

		sendResponse( {} );

		log();

    } else {
    	sendResponse( {} ); // snub them.
    }
});


log = function () {
	
	for ( var i = 0; i < localStorage.length; i++ )
	{
		console.log( localStorage.key( i ) + ": " + localStorage[ localStorage.key( i ) ] );
	}
}
