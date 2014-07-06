define([
    'jquery',
    'underscore',
    'backbone',
    'd3',
    'app',
    'text!../../../templates/search/timeslider.html'
],
function($, _, Backbone, d3, app, timeSliderTemplate){
    var TimeSliderView = Backbone.View.extend({
        initialize: function(options){
            // Control visibility on init. Element is shown on first query.
            this.is_visible = true;
            app.vent.once('QueryInput:input', this.toggleVisibility, this);

            this.date_facet_name = options.date_facet;
            this.model.on('change:dateHistogram', this.updateFacetValues, this);
            
            app.vent.on('model:redraw:' + this.model.get('name'), function(){
                var histogram = this.model.get('dateHistogram');
                if(histogram.length < 1){
                    return;
                }
                var min = histogram[0].time;
                var max = histogram[histogram.length - 1].time;
                this.updateSliderLabels(min, max);
            }, this);

            this.convertTime = {
                year: {
                    display: d3.time.format('%Y'),
                    interval: d3.time.year
                },
                month: {
                    display: d3.time.format('%b. %Y'),
                    interval: d3.time.month
                },
                week: {
                    display: d3.time.format('%e %b. %Y'),
                    interval: d3.time.week
                },
                day: {
                    display: d3.time.format('%e %b. %Y'),
                    interval: d3.time.day
                }
            };
        },

        render: function(){
            if (DEBUG) console.log('TimeSliderView:render');

            var self = this;

            this.$el.html(_.template(timeSliderTemplate));
            this.timeslider = this.$el.find('.slider').slider({
                range: true,
                step: 1,
                animate: 'slow',
                start: function(event, ui){
                    // set start value for logging purposes
                    self.startValue = ui.value;
                },
                slide: function(event, ui){
                    self.updateSliderLabels(ui.values[0], ui.values[1]);
                },
                stop: function(event, ui){
                    self.changeFilter(event, ui, self.date_facet_name);
                    app.vent.trigger('Logging:clicks', {
                        action: 'daterange_facet',
                        fromDateMs: self.startValue,
                        toDateMs: ui.value,
                        modelName: self.model.get('name')
                    });
                }
            });

            return this;
        },

        updateSliderLabels: function(min, max){
            if (DEBUG) console.log('TimeSliderView:updateSliderLabels');
            var interval = this.model.get('interval');
            if(!interval) interval = 'year';

            console.log(interval);

            min = this.convertTime[interval].display(new Date(min));
            max = this.convertTime[interval].display(new Date(max));

            this.$el.find('.slider-lower-val').html(min);
            this.$el.find('.slider-upper-val').html(max);
        },

        updateFacetValues: function(){
            if (DEBUG) console.log('TimeSliderView:updateFacetValues');

            var date_stats = this.model.get('aggregations')[DATE_STATS_AGGREGATION];

            // if(histogram.length < 1){
            //     this.disabled = true;
            //     return;
            // }
            // else {
            //     if(this.disabled === true){
            //         this.disabled = false;
            //     }
            // }

            this.min = date_stats.min;
            this.max = date_stats.max;

            this.timeslider.slider('option', 'min', this.min);
            this.timeslider.slider('option', 'max', this.max);
            this.timeslider.slider('option', 'values', [this.min, this.max]);
            this.updateSliderLabels(this.min, this.max);
        },

        changeFilter: function(event, ui, facet){
            var self = this;
            
            var min = new Date(ui.values[0]);
            var max = new Date(ui.values[1]);
            if (DEBUG) console.log('TimeSliderView:changeFilter', [min, max]);

            var interval = this.model.get('interval');
            
            // Round down to the nearest date for the given interval,
            // for exmpale, when interval is 'year', 2000-04-05T14:13 will
            // become 2000-01-01T00:00.
            min = this.convertTime[interval].interval.floor(min);

            // Round up to the nearest date for the given interval
            max = this.convertTime[interval].interval.ceil(max);

            // Perform the actual query
            this.model.modifyQueryFilter(this.date_facet_name, [min, max], true);

            // To prevent the date range slider from updating the min and max
            // values as soon as the user moves a handle, we temporary switch
            // off the facet value change listener.
            this.model.off('change:dateHistogram', this.updateFacetValues, this);

            // Update the facet values and set the slider to min/max positions directly after
            // the user submits a new keyword query
            app.vent.once('QueryInput:input:' + this.model.get('name'), function(){
                console.log('!!!!!!!!!!!');
                //self.updateFacetValues();
                self.model.on('change:dateHistogram', self.updateFacetValues, self);
            });
        },

        toggleVisibility: function(){
            if (DEBUG) console.log('TimeSeriesView:toggleVisibility');

            if(this.is_visible){
                this.$el.hide();
                this.is_visible = false;
            }
            else {
                this.$el.show();
                this.is_visible = true;
            }
            this.$el.show();
            return this;
        }
    });

    return TimeSliderView;
});
