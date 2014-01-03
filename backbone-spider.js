// backbone-spider 0.1.0
//
// (c) 2014 ryuma.tsukano
// Licensed under the MIT license.

(function(Backbone) {

  _.extend(Backbone.View.prototype, {

    spyAllFunc: function() {
      this.allFunc = this._getAllFunc();
      _.map(this.allFunc, function(prop){
        sinon.spy(this, prop);
      }, this);
    },
    restoreAllFunc: function() {
      _.map(this.allFunc, function(prop){
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
    }


    // namespace
    //spider: {
    //  _setFuncOnce: function(){
    //    if(typeof this.allProp !== "object") {
    //      for (var prop in this){
    //        this.allProp.push(prop);
    //        if (this.hasOwnProperty(prop)){
    //          this.originalFunc.push(prop);
    //        }
    //      };
    //    };
    //  };
    //}
  });

}).call(this, Backbone, sinon);
