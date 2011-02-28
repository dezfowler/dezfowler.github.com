mxn.registerApi('google', {
	Mapstraction: {
		addMarker: function(){alert('Google addMarker');},
		addPolyline: function(){alert('Google addPolyline');},
		removeMarker: function(){alert('Google removeMarker');}
	},
	Marker: {
		setInfoBubble: function(){alert('Google setInfoBubble');}
	}
});