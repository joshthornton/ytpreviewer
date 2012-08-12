// Create namespace
( function ( window )
{
	
	// Regex
	var specPattern = /((https?\:\/\/i[0-9]+\.ytimg\.com\/sb\/([A-Za-z0-9\-_]{11})\/storyboard3_L\$L\/\$N\.jpg)\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#default\#[A-Za-z\-0-9_]{27})\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})\|([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})\|?([0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#[0-9]+\#M\$M\#[A-Za-z\-0-9_]{27})?)/mi;
	var secondsPattern = /"length_seconds": ([0-9]+)/m;
	var thumbnailPattern = /(https?\:\/\/i[0-9]+\.ytimg\.com\/vi\/([A-Za-z0-9\-_]{11})\/)/m;
	var qualityPattern = /([0-9]+)\#([0-9]+)\#([0-9]+)\#([0-9]+)\#([0-9]+)\#[0-9]+\#M\$M\#([A-Za-z\-0-9_]{27})/;
	var compilePattern = /(http)s?(\:\/\/i[0-9]+\.ytimg\.com\/sb\/[A-Za-z0-9\-_]{11}\/storyboard3_L)\$L(\/)\$N(\.jpg)/i;
	
	// Create constructor
	var Spec = window.Spec = function ( param )
	{
		
		// Cached object
		try {
			$.extend( this, JSON.parse( param ) );
			return this;
		} catch ( e ) {}

		// Load seconds
		var secondsMatch = secondsPattern.exec( param );
		if ( secondsMatch[ 1 ] )
			this.seconds = parseInt( secondsMatch[ 1 ] );
		else
			this.seconds = 0;
		
		// Match sections of spec string
		var matches = specPattern.exec( param );

		// Fallback to thumbnail if match fails
		if ( !matches )
		{
			var thumbMatch = thumbnailPattern.exec( param );
			try {
				this.url = thumbMatch[ 1 ];
				this.id = thumbMatch[ 2 ];
				this.high = this.medium = this.low = {
					imageWidth : 120,
					imageHeight : 90,
					thumbnailCount : 3,
					gridWidth : 1,
					gridHeight : 1
				};

				this.thumbnail = true;

				return this;
			} catch ( e ) {
				return null;
			}
		}

		// Get URL
		if ( matches[ 2 ] )
			this.url = matches[ 2 ];

		// Get ID
		if ( matches[ 3 ] )
			this.id = matches[ 3 ];

		// Get low quality
		if ( matches[ 5 ] ) {
			var low = qualityPattern.exec( matches[ 5 ] );
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
		if ( matches[ 6 ] ) {
			var medium = qualityPattern.exec( matches[ 6 ] );
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
		if ( matches.length[ 7 ] ) {
			var high = qualityPattern.exec( matches[ 7 ] );
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

		this.thumbnail = false;

		return this;
	}

	// image set function for preview images
	Spec.prototype.previewImageSet = function ( qualityString ) 
	{
		var images = [ ];
		var count = Math.ceil( this[ qualityString ].thumbnailCount / ( this[ qualityString ].gridWidth * this[ qualityString ].gridHeight ) );
		
		for ( var i = 0; i < count; ++i )
			images.push( this.url.replace( compilePattern, "$1" + ( window.location.protocol == 'https:' ? "s" : "" )  + "$2" + this[ qualityString ].lValue + "$3M" + i + "$4?sigh=" + this[ qualityString ].sigh ) ); 
		
		return images;
	}

	// image set function for thumbnaiil images
	Spec.prototype.thumbnailImageSet = function()
	{
		var images = [];
		for ( var i = 1; i <= 3; ++i )
			images.push( this.url + i + ".jpg" );
		return images;
	}
	
} )( window );

