var reVars = new RegExp().compile('\\$(\\w+)\\$', 'g');
var reNests = new RegExp().compile('(([^;\\}]+)\\s*\\{[^\\}]+)\\s(([^;\\}]+)\\s*\\{[^\\{\\}]+\\})', 'g');
WhenDomReady(function(){
	var h = document.getElementsByTagName('head')[0];
	var scps = document.getElementsByTagName('script');
	for(var i = 0; i < scps.length; i++){
		if(scps[i].type === 'text/csspp'){
			var blah = scps[i].innerHTML;
			var sty = document.createElement('style');
			sty.type = 'text/css';
			sty.textContent = Process(blah);
			h.appendChild(sty);
		}
	}


	function Process(strCSSPP){
		// replace the vars
		var strCSS = strCSSPP.replace(reVars, function(){
			return cssVars[arguments[1]];
		});
		
		//sort nesting
		var strExtracted = '';
		var strOutCSS = strCSS;
		do {
			strCSS = strOutCSS;
			strOutCSS = strCSS.replace(reNests, function(){
				strExtracted += arguments[2] + arguments[3];
				return arguments[1];
			});
			
		} while(strCSS !== strOutCSS)
		
		return strOutCSS + strExtracted;
	}

});
