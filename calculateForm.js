(function($) {
    $.fn.calculateForm = function (options, callback) {
        let default_options = {
            triggerName: 'change',
            customNames: false,
            inputNumberMinMaxLimit: false
        };

        function isNumeric(num) {
            return !isNaN(parseFloat(num)) && isFinite(num);
        }

        function getSerializeObject(form) {
            let serializeArray = $(form).serializeArray(),
                formData = {};
            
            $.each(serializeArray, function(i, field){
                if (field.value.trim() !== '') {
                    field.value = isNumeric(field.value) ? +field.value : field.value;

                    formData[field.name] = field.value;
                }
            });
            
            return formData;
        }

        function setCustomName() {
            if ($(this).attr('name') === undefined) {
                let name = this.tagName.toLowerCase() + '_' + this.type + '_' + $(this).index();

                $(this).attr('name', name);
            }
        }

        function setInputNumberMinMaxLimit() {
            if (this.value === '') {
                return;
            }

            if (this.max !== '' && +this.value > +this.max) {
                this.value = this.max;
            } else if (this.min !== '' && +this.value < +this.min) {
                this.value = this.min;
            }
        }
        
        function isIsset(...names) {
            let isIsset = true,
                formData = this;

            names.forEach(function (el) {
                if (formData[el] === undefined) {
                    isIsset = false;
                }
            });

            return isIsset;
        }

        function isChecked(name) {
            let formData = this;

            return formData[name] !== undefined;
        }

        function isSelected(name, value) {
            let isSelected = false,
                formData = this;

            value = isNumeric(value) ? +value : value;

            if (formData[name] !== undefined) {
                isSelected = formData[name] === value;
            }

            return isSelected;
        }

        function eventCallback(event) {
            var formData = getSerializeObject(this);

            callback.call(this, event, formData, {
                isIsset: isIsset.bind(formData),
                isChecked: isChecked.bind(formData),
                isSelected: isSelected.bind(formData)
            });
        }

        function init() {
            if (typeof options !== 'object') {
                throw new Error('calculateForm: Argument options must be a object');
            }            

            if (typeof callback !== 'function') {
                throw new Error('calculateForm: Argument callback must be a function');
            }

            if ($(this).prop('tagName') && $(this).prop('tagName').toLowerCase() !== 'form') {
                throw new Error('calculateForm: Init element must be a form');
            }


            $.extend(default_options, options);

            if (options.customNames) {
                $(this).find(':input').each(setCustomName);
            }

            if (options.inputNumberMinMaxLimit) {
                $(this).find('input[type="number"]').on('propertychange input', setInputNumberMinMaxLimit);
            }
            
            $(this).on(options.triggerName, eventCallback);
        }

        init.call(this);

        return $(this);
    };
})(jQuery);