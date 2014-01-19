// backbone-spider 0.1.0
//
// (c) 2014 ryuma.tsukano
// Licensed under the MIT license.

(function(Backbone) {

     _.extend(Backbone.View.prototype, {
        // instance variables
        _spider: {
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
            return this._spider.spyFunctions = _.reduce(_.functions(this), function(spyArray, prop){
                if (! this._isSinonWrapped(this[prop])){
                    spyArray.push(sinon.spy(this, prop));
                };
                return spyArray;
            }, [], this);
        },
        restoreAllFunc: function() {
            return _.map(this._spider.spyFunctions, function(prop){
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
            this._spider.spyEvents.model = this._createEventsSpy(this.model);
            this._spider.spyEvents.collection = this._createEventsSpy(this.collection);
        },
        restoreAllEvents: function(){
            // Todo: fully delete these events.(now, it's not completed)
            _.each(this._spider.spyEvents.model     , function(spy, eventName) { this.model.off(eventName, spy)}, this);
            this._spider.spyEvents.model = {};
            _.each(this._spider.spyEvents.collection, function(spy, eventName) { this.collection.off(eventName, spy)}, this);
            this._spider.spyEvents.collection = {};
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
            return this._spider.spyEvents.model[eventName];
        },
        spyCollection: function(eventName){
            return this._spider.spyEvents.collection[eventName];
        },
        // bind Marionette UI
        spyUI: function(){
            if(this.ui && typeof this.ui === "object"){
                _.each(this.ui, function(jqObj, uiName) {
                    if(typeof jqObj !== "string"){
                        _.each(_.functions(jqObj), function(func) {
                            sinon.spy(jqObj, func);
                        });
                    };
                });
            }
        },
    });
    var includeEvent = {
        // validate event
        includeEvent: function(eventName, callback) {
            var callbackWithContext = _.find(this._events[eventName], function(callbackWithContext) {
                return callbackWithContext.callback === callback;
            });
            return callbackWithContext.callback === callback ? true : false;
        }
    };
    _.extend(Backbone.Model.prototype, includeEvent);
    _.extend(Backbone.Collection.prototype, includeEvent);
}).call(this, Backbone, sinon);
