(function(){
/*
 We only bind arrays to tables at the moment
 */
jQuery.fn.databind = function(data, settings){
	settings = jQuery.extend({
		allowChanges: true
	}, settings);
	var initial = this;
	return this.each(function(){
		
		// grab the tbody element
		var tbody = jQuery(this).find('tbody');
		
		// grab the repeatable section - the initial contents of tbody
		var repeat;
		if('jqRepeat' in this) {
			repeat = this.jqRepeat;
		}
		else {
			repeat = tbody.find('tr');
			this.jqRepeat = repeat;
			repeat.remove();
		}
		
		// prepare array of items bound to data rows
		this.bindRepeatItems = this.bindRepeatItems || [];
		
		// If items have been deleted from the array since the last bind
		// then the indexes in the repeat items array will be out of sync
		// with those of the data array. As a result we need to keep track 
		// of this offset.
		var workingOffset = 0;
		
		
		for(var i = 0; i < data.length; i++) {
			
			var newRepeat = false;
			
			// determine whether we've bound to this row before by checking 
			// for bindIndex property on data row
			if('bindIndex' in data[i]) {
			
				// bound to this data row before so check its index within the 
				// array hasn't changed as this tells us some preceding elements
				// have been deleted and that we will need to delete the related
				// repeat items
				
				// if rows were missing from the array earlier on then the offset
				// will already be out so compensate for this by subtracting the 
				// working offset from the bindIndex of the current row
				var bindIndexWithOffset = data[i].bindIndex - workingOffset;
				
				// check the corrected bindIndex against our current data array 
				// index
				if(bindIndexWithOffset !== i){
				
					// we're missing some elements so work out how many					
					var offset = bindIndexWithOffset - i;
					
					// update our working offset
					workingOffset += offset;
					
					// grab the related repeat items and remove
					removeRepeatItems(this.bindRepeatItems, i, offset);
				}
			}
			else {
			
				// not bound to this data item before so add a repeat item for it
								
				var clns;
				if(i >= this.bindRepeatItems.length){
					// adding to the end
					clns = repeat.clone().appendTo(tbody);
				}
				else {
					// inserting in the middle
					clns = repeat.clone().insertBefore(this.bindRepeatItems[i].eq(0));
				}
				
				// insert new repeat item in repeat items array
				this.bindRepeatItems.splice(i, 0, clns);
				
				newRepeat = true;
			}
			
			// should have done any adding and removing by this point so 
			// refresh repeat item content
			
			// bindable elements have a class of format "field[ {property name} ]" e.g. field[firstname]
			this.bindRepeatItems[i].find('[class*=field]').each(function(){
				var t = this;
				
				// get the actual property name out of the field using regex
				this.className.replace(/field\[(\w+)\]/g,function(){
					var propName = arguments[1];
					var row = data[i];
					
					// special case for creating a delete button - handler to delete current row
					if(propName == 'delete'){
						if(settings.allowChanges == true && newRepeat == true){
							$(t).click(function(){
								data.splice(row.bindIndex, 1);
								initial.databind(data, settings);
							});
						}
					}
					else {
						// not doing the delete special case so we're actually binding a value
						// so get the value from the data store
						var val = row[propName];
						switch(t.tagName.toUpperCase()){
							case 'INPUT':
								if(settings.allowChanges == true && newRepeat == true) {
									jQuery(t).blur(function(){
										row[propName] = this.value;
									});
								}
								switch(t.type.toUpperCase()){
									case 'CHECKBOX', 'RADIO':
										if(t.value === val){
											t.checked = 'checked';
										}
										else {
											t.checked = '';
										}
										break;
									case 'TEXT':
										t.value = val;
										break;
								}
								break;
							case 'TEXTAREA':
								if(settings.allowChanges == true && newRepeat == true) {
									jQuery(t).blur(function(){
										row[propName] = this.value;
									});
								}
								t.value = val;
								break;
							case 'A':
								t.href = val;
								break;
							default:
								t.innerHTML = val;
						}
					}
				});
			});
			
			// set our bindIndex so we can track adds and removals
			data[i].bindIndex = i;
			
		}
		
		// any remaining repeat items can be trimmed as their related data
		// item has been removed
		if(this.bindRepeatItems.length > data.length){
			removeRepeatItems(this.bindRepeatItems, data.length, this.bindRepeatItems.length - data.length);
		}
	
	});
};

var removeRepeatItems = function(aryItems, start, length){
	var aryItemsToRemove = aryItems.splice(start, length);
	for(var j = 0; j < aryItemsToRemove.length; j++){
		aryItemsToRemove[j].remove();
	}
}

})();