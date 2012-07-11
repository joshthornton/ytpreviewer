// Create namespace
( function ( window )
{
	
	// Regex
	var specPattern = /((https?\:\/\/i[0-9]+\.ytimg\.com\/sb\/[A-Za-z0-9\-_]{11}\/storyboard3_L\$L\/\$N\.jpg)\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#default\#[A-Za-z\-0-9_]{27})\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})\|?([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})?)/mi;
	var qualityPattern = /([0-9]+)\#([0-9]+)\#([0-9]+)\#([0-9]+)\#([0-9]+)\#[0-9]+\#M\$M\#([A-Za-z\-0-9_]{27})/;
	var compilePattern = /(http)s?(\:\/\/i[0-9]+\.ytimg\.com\/sb\/[A-Za-z0-9\-_]{11}\/storyboard3_L)\$L(\/)\$N(\.jpg)/i;
	
	// Create constructor
	var Spec = window.Spec = function ( specObject )
	{
		
		// Handle empty spec string
		if ( typeof( specObject ) != "string" ) 
			return;
		
		// Cached object
		try {
			$.extend( this, JSON.parse( specObject ) );
			return this;
		} catch ( e ) {}
		
		// Match sections of spec string
		var matches = specPattern.exec( specObject );

		// Get URL
		if ( matches[ 2 ] )
			this.url = matches[ 2 ];

		// Get low quality
		if ( matches[ 4 ] ) {
			var low = qualityPattern.exec( matches[ 4 ] );
			this.low = {
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
			this.medium = {
				imageWidth : medium[ 1 ],
				imageHeight : medium[ 2 ],
				thumbnailCount : medium[ 3 ],
				gridWidth : medium[ 4 ],
				gridHeight : medium[ 5 ],
				sigh : medium[ 6 ],
				lValue : 2
			};
		} else {
			this.medium = this.low;
		}

		// Get high quality
		if ( matches[ 6 ] ) {
			var high = qualityPattern.exec( matches[ 6 ] );
			this.high = {
				imageWidth : high[ 1 ],
				imageHeight : high[ 2 ],
				thumbnailCount : high[ 3 ],
				gridWidth : high[ 4 ],
				gridHeight : high[ 5 ],
				sigh : high[ 6 ],
				lValue : 3
			};
		} else {
			this.high = this.medium
		}

		return this;
	}
	
	// Compiles an array of images from spec
	Spec.prototype.getImageSet = function ( qualityString )
	{
		var images = [ ];
		var count = Math.ceil( this[ qualityString ].thumbnailCount / ( this[ qualityString ].gridWidth * this[ qualityString ].gridHeight ) );
		
		for ( var i = 0; i < count; ++i )
			images.push( this.url.replace( compilePattern, "$1" + window.location.protocol == 'https:'? "":"s"  + "$2" + this[ qualityString ].lValue + "$3M" + i + "$4?sigh=" + this[ qualityString ].sigh ) ); 
		
		return images;
	}

} )( window );

