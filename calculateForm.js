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
                if (field.value.trim() != '') {
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

            if (+this.value > +this.max) {
                this.value = this.max;
            } else if (+this.value < +this.min) {
                this.value = this.min;
            }
            
            $(this).change();
        }

        
        function IsValidElems() {
            let isValid = true,
                formData = this;

            Array.from(arguments).forEach(function (el) {
                if (formData[el] === undefined || typeof formData[el] !== 'number') {
                    isValid = false;
                }
            });

            return isValid;
        }

        function eventCallback(event) {
            let formData = getSerializeObject(this);

            callback.call(this, event, formData, {
                IsValid: IsValidElems.bind(formData)
            });
        }

        function init() {
            if (typeof options !== 'object') {
                throw new Error('calculateForm: Argument options must be a object');
            }            

            if (typeof callback !== 'function') {
                throw new Error('calculateForm: Argument callback must be a function');
            }

            if ($(this).prop('tagName').toLowerCase() !== 'form') {
                throw new Error('calculateForm: Init element must be a form');
            }


            $.extend(default_options, options);

            if (options.customNames) {
                $(form).find(':input').each(setCustomName);
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