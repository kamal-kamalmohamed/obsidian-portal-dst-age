// Global Options
csx_opts = {
	'setupCallback': function(item){fage_simple_setup(item);},
	'uiContainer': function(){return document;},
	'defaultFieldValue':'',
	'imagePath':'https://chainsawxiv.github.io/DST/common/images/',
	'preloadFiles':[
		'add.png',
		'add_hover.png',
		'balance.png',
		'balance_hover.png',
		'bold_active.png',
		'bold_hover.png',
		'bullet.png',
		'fb_back_bottom.png',
		'fb_back_main.png',
		'fb_back_top.png',
		'grab.png',
		'grab_hover.png',
		'indent.png',
		'indent_active.png',
		'indent_hover.png',
		'italic.png',
		'italic_active.png',
		'italic_hover.png',
		'tip.png',
		'tip_hover.png',
		'trash.png',
		'trash_active.png',
		'trash_hover.png',
		'underline.png',
		'underline_active.png',
		'underline_hover.png',
		'../../sheets/lphillips_exalted_sidereal/images/check-0.png',
		'../../sheets/lphillips_exalted_sidereal/images/check-1.png',
	],
};

// Pre-Load Configuration
function fage_simple_dataPreLoad(opts){
	aisleten.characters.jeditablePlaceholder = csx_opts.defaultFieldValue;
}

// Master Startup
function fage_simple_dataPostLoad(data){

	csx_opts.defaultContext = document.getElementById(data.containerId);
	csx_opts.uiContainer = csx_opts.defaultContext.querySelector('.uicontainer');
	csx_opts.isEditable = data.isEditable;

	// Force user off of management page when not editing
	if (!csx_opts.isEditable && localStorage[ 'lastPage' ] == 'manage' )
		localStorage[ 'lastPage' ] = 'crunch';

	// Include the shared script file
	var includes = document.createElement('script');
	includes.type = 'text/javascript';
	includes.src = 'https://chainsawxiv.github.io/DST/common/js/csx_dd4e_common.js';
	includes.onload = function(){

		// Fix container properties
		csx_firstParentWithClass(csx_opts.defaultContext,'dynamic_sheet_container').style.overflow = 'visible';
		
		// Set up the editing interface
		csx_opts.setupCallback();
		
	};
	document.body.appendChild(includes);
	
	// Preload rollover images 
	// Deferred to prevent blocking
	window.setTimeout(function(){
		if (document.images){
			for (var i = 0; i < csx_opts.preloadFiles.length; i++){
				var img = new Image();
				img.src = csx_opts.imagePath + csx_opts.preloadFiles[i];
			}
		}
	},500);
	
}

// Setup After Script Load
function fage_simple_setup(context){

	// Provide default context
	if (context == undefined)
		context = csx_opts.defaultContext;
	
	// Do setup for interfaces
	csx_check(context);
	csx_edit(context);
	csx_tip(context);
	csx_list(context);
	csx_tab(context);

}

// Shutdown Before Save
function fage_simple_dataPreSave(){

	// Default the context if not set
	var context = csx_opts.defaultContext;

	// Bake everything down to its field values
	var checks = context.querySelectorAll('.check');
	for (var i = 0; i < checks.length; i++)
		checks[i].unrender();

	var edits = context.querySelectorAll('.dsf:not(.readonly),.edit');
	for (var i = 0; i < edits.length; i++)
		edits[i].unrender();

	var lists = context.querySelectorAll('.list');
	for (var i = 0; i < lists.length; i++)
		lists[i].unrender();

}

// From: https://github.com/ChainsawXIV/DST/blob/master/common/js/csx_check.js
function csx_check(context){

	// Default the context if not set
	if (!context) context = document;

	// Convert each check field
	var checkFields = context.querySelectorAll('.check');
	for (var i = 0; i < checkFields.length; i++){

		var field = checkFields[i];

		// Gets the field value from the embedded image or the text
		field.value = function(){

			// Return the cached value if it exists
			if(this.valueCache != null)
				return this.valueCache;

			// Get the value from the text content, cache, and return
			var value = parseInt(this.innerHTML);
			if ( this.innerHTML == '' ){
				if ( this.className.match( 'checkDefaultOn' ) )
					value = 1;
				else
					value = 0;
			}
			this.valueCache = value;
			return value;

		};

		// Converts the associated span element's contents to a pips image
		field.render = function(){

			// Replace the contents with the appropriate check image
			var status = (this.value()) ? 'checkOn' : 'checkOff';
			var mark = document.createElement('div');
			mark.className = 'checkMark ' + status;
			var border = document.createElement('div');
			border.className = 'checkBorder';
			this.innerHTML = '';
			mark.appendChild(border);
			this.appendChild(mark);

			// Activate the check
			this.activate();

		};

		// Converts the associated span element's contents to a text value
		field.unrender = function(){

			// Replace the contents with the appropriate value string
			this.innerHTML = this.value();

		};

		// Assigns clickability to a pips image element
		field.activate = function(){

			// Only enable if editing
			if (!csx_opts.isEditable)
				return;

			// Activate the element's pips interface
			this.addEventListener('click', this.click, false);

			// Set the element's alt text
			if (!this.title)
				this.title = 'Click to toggle';

		};

		// Click event handler for the pips interface
		field.click = function(){

			// Flip the value of the field
			if(this.value() == 1)
				this.valueCache = 0;
			else
				this.valueCache = 1;

			// Rerender the field
			this.render();

			// Call the onUpdate event
			this.onUpdate();

		};

		// On Update event function, typicaly overriden
		field.onUpdate = function(){

		}

		// Render the field
		field.render();

	}

}
