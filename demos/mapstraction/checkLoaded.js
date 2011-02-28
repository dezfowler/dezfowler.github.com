
function Mapstraction(sApi, loaded){
	this.api = sApi;
	this.loaded = {};
	this.loaded[this.api] = loaded;
	this.onload = {};
	this.onload[this.api] = [];
}

Mapstraction.prototype.simulateLoad = function() {
	this.loaded[this.api] = true;
	var loadHandlers = this.onload[this.api];
	while(loadHandlers.length > 0){
		var fn = loadHandlers.pop();
		fn();
	}
}

Mapstraction.prototype.checkLoad = function(funcDetails){
	if(this.loaded[this.api] === false) {
		var scope = this;
		this.onload[this.api].push( function() { funcDetails.callee.apply(scope, funcDetails); } );
		return true;
	}
	return false;
}

Mapstraction.prototype.addLargeControls = function() {
	if(this.loaded[this.api] === false) {
		var me = this;
		this.onload[this.api].push( function() { me.addLargeControls(); } );
		return;
	}
	
	alert('Running addLargeControls ' + arguments[0]);
}

Mapstraction.prototype.addMapTypeControls = function() {
	if (this.checkLoad(arguments)) return;
		
	alert('Running addMapTypeControls ' + arguments[0]);
}


