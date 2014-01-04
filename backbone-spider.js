// backbone-spider 0.1.0
//
// (c) 2014 ryuma.tsukano
// Licensed under the MIT license.

(function(Backbone) {

    _.extend(Backbone.View.prototype, {
        // instance variables
        spider: {
            allFunc: [],
            spyEvents: {
                model : [],
                collection: []
            }
        },
        // spy function
        spyAllFunc: function() {
            this.spider.allFunc = this._getAllFunc();
            _.map(this.spider.allFunc, function(prop){
                sinon.spy(this, prop);
            }, this);
        },
        restoreAllFunc: function() {
            _.map(this.spider.allFunc, function(prop){
                if (this._isSpy(this[prop])){
                    this[prop].restore();
                };
            }, this);
        },
        _getAllFunc: function(){
            var allFunc = [];
            for (var prop in this){
                if (typeof this[prop] === "function") {
                    allFunc.push(prop);
                };
            };
            return allFunc;
        },
        _isSpy: function(func){
            return func.hasOwnProperty('called');
        },
        // spy events
        spyAllEvents: function(){
            this.spider.spyEvents.model = this.createEventsSpy(this.model);
            this.spider.spyEvents.collection = this.createEventsSpy(this.collection);
        },
        createEventsSpy: function(target){
            var eventsSpy = {};
            _.each(_.keys(target._events), function(eventName){
                var spy = sinon.spy();
                target.on(eventName, spy);
                eventsSpy[eventName] = spy;
            });
            return eventsSpy;
        },
    });
}).call(this, Backbone, sinon);
