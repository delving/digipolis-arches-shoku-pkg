define(['knockout', 'underscore', 'viewmodels/widget', 'templates/views/components/widgets/iiif-tify-ext.htm'],
    function (ko, _, WidgetViewModel, widgetTemplate) {

    const initialize = function (element, valueAccessor, allBindings) {
        var modelValue = valueAccessor();
        var value = ko.utils.unwrapObservable(valueAccessor());

        // Only global Tify works (from require below doesn't)
        const viewer = new Tify({
            container: element,
            manifestUrl: value
        });
    };

    ko.bindingHandlers.iiifTifyExt = {
        init: (element, valueAccessor, allBindings) => {
            require(['tify/dist/tify'], Tify => {
                initialize(element, valueAccessor, allBindings, Tify);
            });
        }
    };

    /**
    * registers an IIIF component for use in forms and reports
    * @function external:"ko.components".iiif-tify-ext
    * @param {object} params
    * @param {string} params.value - the value being managed as a URL
    * @param {function} params.config - observable containing config object
    * @param {string} params.config().label - label to use alongside the component
    * @param {string} params.config().defaultValue - default IIIF URL as a string
    */
    return ko.components.register('iiif-tify-ext', {
        viewModel: function (params) {
            params.configKeys = ['defaultValue'];
            WidgetViewModel.apply(this, [params]);

            const config = this.config();
            if (typeof this.value === 'function' && this.value()) {
                this.currentURL = ko.observable(this.value());
            } else if (typeof this.value === 'object' && typeof this.value.url === 'function' && this.value.url()) {
                this.currentURL = ko.observable(this.value.url());
            } else {
                this.currentURL = ko.observable(config.defaultValue);
            };

            this.currentURL.subscribe(newValue => {
                if (typeof this.value === 'function') {
                    this.value(newValue);
                } else if (typeof this.value === 'object' && typeof this.value.url === 'function') {
                    this.value.url(newValue);
                }
            });
        },
        template: widgetTemplate
    });
});
