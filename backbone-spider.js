// backbone-spider 0.1.0
//
// (c) 2014 ryuma.tsukano
// Licensed under the MIT license.

(function(Backbone) {

    _.extend(Backbone.View.prototype, {
        // instance variables
        _spider: {
            spyFunctions: {
                model: [],
                collection: [],
                view: []
            },
            spyEvents: {
                model : [],
                collection: []
            }
        },
        // SPY ALL
        spyAll: function() {
            this.spyAllViewFunction();
//            this.spyAllModelFunction();
            this.spyAllEvents();
        },
        restoreAll: function(){
            this.restoreAllViewFunction();
            this.restoreAllEvents();
        },
        // SPY FUNCTION
        spyAllViewFunction: function() {
            return this._spider.spyFunctions.view = Backbone.spider.spyAllFunction(this);
        },
//        spyAllModelFunction: function() {
//            return this._spider.spyFunctions.model = Backbone.spider.spyAllFunction(this.model);
//        },
        restoreAllViewFunction: function() {
            return Backbone.spider.restoreAllFunction(this._spider.spyFunctions.view);
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
        modelSpy: function(eventName){
            return this._spider.spyEvents.model[eventName];
        },
        collectionSpy: function(eventName){
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

    Backbone.spider = {
        spyAllFunction: function(target){
            return _.reduce(_.functions(target), function(spyArray, prop){
                if (! Backbone.spider.isSinonWrapped(target[prop])){
                    spyArray.push(sinon.spy(target, prop));
                };
                return spyArray;
            }, []);
        },
        isSinonWrapped: function(func){
            // this is the same checking in sinon.js
            return ((func.restore && func.restore.sinon) || func.calledBefore) ? true : false;
        },
        restoreAllFunction: function(target){
            return _.map(target, function(prop){
                if (Backbone.spider.isSinonWrapped(prop)){
                    prop.restore();
                };
            });
        },
    };
}).call(this, Backbone, sinon);
