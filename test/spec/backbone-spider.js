/*global describe, it */
'use strict';
(function () {
    var MyView, MyModel, MyCollection;
    describe('Backbone Spider', function () {
        before(function(){
            MyView = Backbone.View.extend({
                url: "faked",
                originalMethod: function(){
                    console.log('have called original method in test');
                }
            });
            MyModel = Backbone.Model.extend({});
            MyCollection = Backbone.Collection.extend({});
        });
        beforeEach(function(){
            this.view = new MyView();
        });
        describe('spyAllFunc()', function () {
            describe('basic usage', function(){
                beforeEach(function(){
                    this.view.spyAllFunc();
                });
                afterEach(function(){
                    this.view.restoreAllFunc();
                });
                it('should spy Backbone.View function', function () {
                    this.view.render();
                    expect(this.view.render.calledOnce).to.be.true;
                });
                it('should spy YourView function', function () {
                    this.view.originalMethod();
                    expect(this.view.originalMethod.calledOnce).to.be.true;
                });
                it('should not affect to sinon.stub (if you use restore)', function(){
                    this.view.render.restore();
                    sinon.stub(this.view, "render").returns('fakedTrue');
                    expect(this.view.render()).to.eql('fakedTrue');
                    this.view.render.restore();
                });
            });
        });
        describe('restoreAllFunc()', function(){
            beforeEach(function(){
                this.view.spyAllFunc();
            });
            it('should restore sinon wrapper', function(){
                this.view.render();
                expect(this.view.render.hasOwnProperty('called')).to.be.true;
                this.view.restoreAllFunc();
                expect(this.view.render.hasOwnProperty('called')).to.be.false;
            });
        });
        describe('spyAllEvent()', function(){

        });
        describe('restoreAllEvent()', function(){

        });
        describe('haveCalledEvent()', function(){
            it('should call event'); // , function(){
            //    expect(this.view.model.eventSpy('sync').calledOnce).to.be(true);
            //});
        });
        describe('_getAllEvents()', function(){
            beforeEach(function(){
                this.view.model = new MyModel();
                this.view.collection = new MyCollection();

                this.view.listenTo(this.view.model, 'sync', function(){ });
                this.view.listenTo(this.view.collection, 'changed', function(){ });

            });
            it('should get all events', function(){
                var allEvents = this.view._getAllEvents();

                _.each(allEvents, function(targetEvents){
                    console.log(targetEvents.target);
                    console.log(targetEvents.events);
                });
            });
        });
    });
})();
