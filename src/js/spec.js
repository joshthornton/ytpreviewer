// Create namespace
( function ( window )
{
	
	// Regex
	specPattern = /((https?\:\/\/i[0-9]+\.ytimg\.com\/sb\/[A-Za-z0-9\-_]{11}\/storyboard3_L\$L\/\$N\.jpg)\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#default\#[A-Za-z\-0-9_]{27})\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})\|?([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})?)/mi;
	qualityPattern = /([0-9]+)\#([0-9]+)\#([0-9]+)\#([0-9]+)\#([0-9]+)\#[0-9]+\#M\$M\#([A-Za-z\-0-9_]{27})/;
	compilePattern = /(https?\:\/\/i[0-9]+\.ytimg\.com\/sb\/[A-Za-z0-9\-_]{11}\/storyboard3_L)\$L(\/)\$N(\.jpg)/i;
	
	// Create constructor
	var Spec = window.Spec = function ( specObject )
	{
		
		// Handle empty spec string
		if ( typeof( specObject ) != "string" ) 
			return;

		
		// Cached object
		try {
			this.data = JSON.parse( specObject );
			return;
		} catch ( e ) {}

		// Match sections of spec string
		var matches = specPattern.exec( specObject );
	
		this.data = {};

		// Get URL
		if ( matches[ 2 ] )
			this.data.url = matches[ 2 ];
	
		// Get low quality
		if ( matches[ 4 ] ) {
			var low = qualityPattern.exec( matches[ 4 ] );
			this.data.low = {
				imageWidth : low[ 1 ],
				imageHeight : low[ 2 ],
				thumbnailCount : low[ 3 ],
				gridWidth : low[ 4 ],
				gridHeight : low[ 5 ],
				sigh : low[ 6 ],
				lValue : 1
			};
		}
	
		// Get medium quality
		if ( matches[ 5 ] ) {
			var medium = qualityPattern.exec( matches[ 5 ] );
			this.data.medium = {
				imageWidth : medium[ 1 ],
				imageHeight : medium[ 2 ],
				thumbnailCount : medium[ 3 ],
				gridWidth : medium[ 4 ],
				gridHeight : medium[ 5 ],
				sigh : medium[ 6 ],
				lValue : 2
			};
		}
	
		// Get high quality
		if ( matches[ 6 ] ) {
			var high = qualityPattern.exec( matches[ 6 ] );
			this.data.high = {
				imageWidth : high[ 1 ],
				imageHeight : high[ 2 ],
				thumbnailCount : high[ 3 ],
				gridWidth : high[ 4 ],
				gridHeight : high[ 5 ],
				sigh : high[ 6 ],
				lValue : 3
			};
		}

		return this;
	}
	
	// Compiles an array of images from spec
	Spec.prototype.getImageSet = function ( qualityString )
	{
		var images = [ ];
		var qualitySpec = this.getQualitySpec( qualityString );
		var count = Math.ceil( qualitySpec.thumbnailCount / ( qualitySpec.gridWidth * qualitySpec.gridHeight ) );
		
		for ( var i = 0; i < count; ++i )
			images.push( this.data.url.replace( compilePattern, "$1" + qualitySpec.lValue + "$2M" + i + "$3?sigh=" + qualitySpec.sigh ) ); 
		
		return images;
	}
	
	
	Spec.prototype.getQualitySpec = function( qualityString )
	{
		if ( !qualityString || qualityString == "high" )
			return this.data.high || this.data.medium || this.data.low || {};
		if ( qualityString == "medium" )
			return this.data.medium || this.data.low || {};
		if ( qualityString == "low" )
			return this.data.low || {};
	}

	

} )( window );
