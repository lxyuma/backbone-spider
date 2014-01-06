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
        spyAll: function() {
            this.spyAllFunc();
            this.spyAllEvents();
        },
        // spy function
        spyAllFunc: function() {
            var allFunc = this._getAllFunc();
            this.spider.allFunc = _.reduce(allFunc, function(spyArray, prop){
                if (! this._isSinonWrapped(this[prop])){
                    spyArray.push(sinon.spy(this, prop));
                };
                return spyArray;
            }, [], this);
        },
        restoreAllFunc: function() {
            _.map(this.spider.allFunc, function(prop){
                if (this._isSinonWrapped(prop)){
                    prop.restore();
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
        _isSinonWrapped: function(func){
            return func.restore && func.restore.sinon;
        },
        // spy events
        spyAllEvents: function(){
            this.spider.spyEvents.model = this.createEventsSpy(this.model);
            this.spider.spyEvents.collection = this.createEventsSpy(this.collection);
        },
        restoreAllEvents: function(){
            // Todo: fully delete these events.
            _.each(this.spider.spyEvents.model     , function(spy, eventName) { this.model.off(eventName, spy)}, this);
            this.spider.spyEvents.model = {};
            _.each(this.spider.spyEvents.collection, function(spy, eventName) { this.collection.off(eventName, spy)}, this);
            this.spider.spyEvents.collection = {};
        },
        createEventsSpy: function(target){
            var eventsSpy = {};
            if (target && target._events) {
                _.each(_.keys(target._events), function(eventName){
                    var spy = sinon.spy();
                    target.on(eventName, spy);
                    eventsSpy[eventName] = spy;
                });
            };
            return eventsSpy;
        },
    });
}).call(this, Backbone, sinon);
