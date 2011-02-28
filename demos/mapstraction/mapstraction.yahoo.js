mxn.registerApi('yahoo', {
	Mapstraction: {
		addMarker: function(){alert('YAHOO addMarker');},
		removeMarker: function(){alert('YAHOO removeMarker');}
	},
	Marker: {
		setInfoBubble: function(){alert('YAHOO setInfoBubble');}
	}
});