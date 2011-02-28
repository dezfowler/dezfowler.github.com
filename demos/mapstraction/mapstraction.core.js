(function(){

var loadedApis = {};
var loadedLevs = {};

// Compatibility levels array defining objects and methods 
// required for a specific compatibility level
var compatLevels = [
	// level 0
	{
		'Mapstraction': [ 'addMarker', 'removeMarker' ], 
		'Marker': [ 'setInfoBubble' ]
	},
	// level 1
	{
		'Mapstraction': [ 'addPolyline' ]
	}
];

// Register a native API implementation
var registerApi = function(sApiId, oApiImpl){
	loadedApis[sApiId] = oApiImpl;
	loadedLevs[sApiId] = getCompat(oApiImpl);
};

// Ascertain compatibility level
var getCompat = function(oApiImpl){
	for(var i = 0; i < compatLevels.length; i++) {
		var cc = compatLevels[i];
		for(var sObjName in cc){
			for(var iFnInd in cc[sObjName]){
				var sFnName = cc[sObjName][iFnInd];
				if(typeof(oApiImpl[sObjName][sFnName]) == 'undefined') {
					return i-1;
				}
			}
		}
	}
	return i-1;
};

// Get the API specific implementation of a particular method
// Note: methods could just be called unguarded i.e.
//    loadedApis[sApiId].Mapstraction.addMarker()
// however guarding and throwing a more meaningful error when 
// some functionality isn't supported would be better
var getApiImpl = function(sApiId, sObjName, sFnName){
	if(typeof(loadedApis[sApiId][sObjName]) == 'undefined' || 
		typeof(loadedApis[sApiId][sObjName][sFnName]) == 'undefined') {
		throw 'Method ' + sFnName + ' of object ' + sObjName + ' is not supported by API ' + sApiId;
	}
	return loadedApis[sApiId][sObjName][sFnName];
};

// Just basic arguments here - not bothering with actual DOM 
// elements or maps. The optional level argument, if specified 
// will check the API to ensure it caters for all the functionality 
// you require and throw an error if not.
var Mapstraction = function(sApiId, iLevel){
	if(!loadedApis.hasOwnProperty(sApiId)) {
		throw 'API ' + sApiId + ' not loaded';
	}
	var _currentApiId = sApiId;
	if(typeof(iLevel) != 'undefined' && loadedLevs[_currentApiId] < iLevel) {
		throw 'API ' + sApiId + ' does not support level ' + iLevel + ' functionality';
	}
	this.getApiId = function(){return _currentApiId;};
	this.getApiLevel = function(){return loadedLevs[_currentApiId];};
};

// Example stub method
Mapstraction.prototype.addMarker = function(){
	getApiImpl(this.getApiId(), 'Mapstraction',  'addMarker')();
};

// Example stub method
Mapstraction.prototype.removeMarker = function(){
	getApiImpl(this.getApiId(), 'Mapstraction',  'removeMarker')();
};

// Example stub method
Mapstraction.prototype.addPolyline = function(){
	getApiImpl(this.getApiId(), 'Mapstraction',  'addPolyline')();
};

window.mxn = {
	'registerApi': registerApi,
	'Mapstraction': Mapstraction
};
	
})();