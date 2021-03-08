# jQuery calculateForm

jQuery plugin for creating a form-based calculator

# Usuage
```
$('form').calculateForm({
	triggerName: 'change',
	customNames: false,
	inputNumberMinMaxLimit: true
}, function(event, formData, fns) {
	if (!fns.IsValid('width', 'length')) {
		return;
	}


	let square_area = formData['width'] * formData['length'];
	
	$('h1').html('Square area ' + square_area);
}).change();
```

## Plugin parameters
The plugin expects an object and with possible properties:
- triggerName - form event during which the callback function is triggered
- customNames - set custom names attr, if not exists, for the fileds
- inputNumberMinMaxLimit - Special for input number, limit input field by max, min values


And callback function, which returns:
- event - jq event object
- formData - form data object for calc
- fnc - additional functions:
  - fns.isIsset(...names) - check isset fields by names list
  - fns.isChecked(name) - check is checked checkbox field
  - fns.isSelected(name, value) - check is selected need value in select
