// backbone-spider 0.1.0
//
// (c) 2014 ryuma.tsukano
// Licensed under the MIT license.

(function(Backbone) {

    _.extend(Backbone.View.prototype, {
        // instance variables
        spider: {
            spyFunctions: [],
            spyEvents: {
                model : [],
                collection: []
            }
        },
        // SPY ALL
        spyAll: function() {
            this.spyAllFunc();
            this.spyAllEvents();
        },
        restoreAll: function(){
            this.restoreAllFunc();
            this.restoreAllEvents();
        },
        // SPY FUNCTION
        spyAllFunc: function() {
            return this.spider.spyFunctions = _.reduce(_.functions(this), function(spyArray, prop){
                if (! this._isSinonWrapped(this[prop])){
                    spyArray.push(sinon.spy(this, prop));
                };
                return spyArray;
            }, [], this);
        },
        restoreAllFunc: function() {
            return _.map(this.spider.spyFunctions, function(prop){
                if (this._isSinonWrapped(prop)){
                    prop.restore();
                };
            }, this);
        },
        _isSinonWrapped: function(func){
            // this is the same checking in sinon.js
            return ((func.restore && func.restore.sinon) || func.calledBefore) ? true : false;
        },
        // SPY EVENTS
        spyAllEvents: function(){
            this.spider.spyEvents.model = this._createEventsSpy(this.model);
            this.spider.spyEvents.collection = this._createEventsSpy(this.collection);
        },
        restoreAllEvents: function(){
            // Todo: fully delete these events.(now, it's not completed)
            _.each(this.spider.spyEvents.model     , function(spy, eventName) { this.model.off(eventName, spy)}, this);
            this.spider.spyEvents.model = {};
            _.each(this.spider.spyEvents.collection, function(spy, eventName) { this.collection.off(eventName, spy)}, this);
            this.spider.spyEvents.collection = {};
        },
        _createEventsSpy: function(target){
            if (target && target._events) {
                return _.reduce(_.keys(target._events), function(eventObj, eventName){
                    var spy = sinon.spy();
                    target.on(eventName, spy);
                    eventObj[eventName] = spy;
                    return eventObj;
                }, {});
            } else {
                return [];
            };
        },
        // SPY getter
        spyModel: function(eventName){
            return this.spider.spyEvents.model[eventName];
        },
        spyCollection: function(eventName){
            return this.spider.spyEvents.collection[eventName];
        }
    });
}).call(this, Backbone, sinon);
