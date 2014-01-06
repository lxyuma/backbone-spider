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
        describe('spyAll()', function(){
            beforeEach(function(){
                sinon.stub(this.view, 'spyAllFunc');
                sinon.stub(this.view, 'spyAllEvents');
            });
            it('should spy all function and events', function(){
                this.view.spyAll();
                expect(this.view.spyAllFunc.called).to.be.true;
                expect(this.view.spyAllEvents.called).to.be.true;
            });
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
        describe('EVENT SPY', function(){
            beforeEach(function(){
                this.view.model = new MyModel();
                this.view.listenTo(this.view.model, 'sync', function(){ });
                this.view.listenTo(this.view.model, 'change', function(){ });

                this.view.collection = new MyCollection();
                this.view.listenTo(this.view.collection, 'reset', function(){});
            });
            describe('spyAllEvents()', function(){
                it('should spy all model / collection events', function(){
                    this.view.spyAllEvents();
                    expect(this.view.spider.spyEvents.model['sync'].hasOwnProperty('called')).to.be.true;
                    expect(this.view.spider.spyEvents.model['change'].hasOwnProperty('called')).to.be.true;
                    expect(this.view.spider.spyEvents.collection['reset'].hasOwnProperty('called')).to.be.true;
                    this.view.collection.reset([]);
                    expect(this.view.spider.spyEvents.collection['reset'].calledOnce).to.be.true;
                });
                describe('when view has no model and collection', function(){
                    beforeEach(function(){
                        this.noResourceView = new MyView();
                    });
                    it('should not create spyEvents', function(){
                        this.noResourceView.spyAllEvents();
                        expect(this.noResourceView.spider.spyEvents.model).to.eql([]);
                    });
                });
            });
            describe('restoreAllEvents()', function(){
                it('should restore all events', function(){
                    this.view.spyAllEvents();
                    expect(this.view.spider.spyEvents.model['sync'].hasOwnProperty('called')).to.be.true;

                    this.view.restoreAllEvents();
                    expect(this.view.spider.spyEvents.model['sync']).to.be.undefined;
                    console.log(this.view.model._events);
                });
            });
            describe('createEventsSpy()', function(){
                it('should spy', function(){
                    var eventsSpy = this.view.createEventsSpy(this.view.model);

                    expect(eventsSpy['sync'].hasOwnProperty('called')).to.be.true;
                    expect(eventsSpy['change'].hasOwnProperty('called')).to.be.true;
                });

            });
        });
    });
})();
