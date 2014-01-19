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
                sinon.spy(this.view, 'spyAllViewFunction');
                sinon.spy(this.view, 'spyAllEvents');
            });
            it('should spy all function and events', function(){
                this.view.spyAll();
                expect(this.view.spyAllViewFunction.called).to.be.true;
                expect(this.view.spyAllEvents.called).to.be.true;
            });
        });
        describe('restoreAll()', function() {
            beforeEach(function(){
                sinon.spy(this.view, 'restoreAllViewFunction');
                sinon.spy(this.view, 'restoreAllEvents');
            });
            it('should spy all function and events', function(){
                this.view.spyAll();
                expect(Backbone.spider.isSinonWrapped(this.view.spyAllViewFunction)).to.be.true;
                expect(Backbone.spider.isSinonWrapped(this.view.spyAllEvents)).to.be.true;
                this.view.restoreAll();
                expect(Backbone.spider.isSinonWrapped(this.view.spyAllViewFunction)).to.be.false;
                expect(Backbone.spider.isSinonWrapped(this.view.spyAllEvents)).to.be.false;
            });
        });
        describe('spyAllViewFunction()', function () {
            beforeEach(function(){
                this.view.spyAllViewFunction();
            });
            afterEach(function(){
                this.view.restoreAllViewFunction();
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
        describe('restoreAllViewFunction()', function(){
            beforeEach(function(){
                this.view.spyAllViewFunction();
            });
            it('should restore sinon wrapper', function(){
                this.view.render();
                expect(Backbone.spider.isSinonWrapped(this.view.render)).to.be.true;
                this.view.restoreAllViewFunction();
                expect(Backbone.spider.isSinonWrapped(this.view.render)).to.be.false;
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
                    expect(Backbone.spider.isSinonWrapped(this.view._spider.spyEvents.model['sync'])).to.be.true;
                    expect(Backbone.spider.isSinonWrapped(this.view.modelSpy('sync'))).to.be.true;
                    expect(Backbone.spider.isSinonWrapped(this.view.modelSpy('change'))).to.be.true;
                    expect(Backbone.spider.isSinonWrapped(this.view.collectionSpy('reset'))).to.be.true;
                    this.view.collection.reset([]);
                    expect(this.view.collectionSpy('reset').calledOnce).to.be.true;
                });
                describe('when view has no model and collection', function(){
                    beforeEach(function(){
                        this.noResourceView = new MyView();
                    });
                    it('should not create spyEvents', function(){
                        this.noResourceView.spyAllEvents();
                        expect(this.noResourceView._spider.spyEvents.model).to.eql([]);
                    });
                });
            });
            describe('restoreAllEvents()', function(){
                it('should restore all events', function(){
                    this.view.spyAllEvents();
                    expect(Backbone.spider.isSinonWrapped(this.view._spider.spyEvents.model['sync'])).to.be.true;

                    this.view.restoreAllEvents();
                    expect(this.view._spider.spyEvents.model['sync']).to.be.undefined;
                    console.log(this.view.model._events);
                });
            });
            describe('_createEventsSpy()', function(){
                it('should spy', function(){
                    var eventsSpy = this.view._createEventsSpy(this.view.model);

                    expect(Backbone.spider.isSinonWrapped(eventsSpy['sync'])).to.be.true;
                    expect(Backbone.spider.isSinonWrapped(eventsSpy['change'])).to.be.true;
                });

            });
        });
        describe('hasModelEvent() and hasCollectionEvent()', function(){
            beforeEach(function(){
                this.view.model = new MyModel();
                this.callback = function(){ console.log('spider!'); };
                this.view.listenTo(this.view.model, 'sync', this.callback);

                this.view.collection = new MyCollection();
                this.view.listenTo(this.view.collection, 'reset', this.callback);
            });
            it('should check if having event', function(){
                expect(this.view.model.includeEvent('sync', this.callback)).to.be.true;
                expect(this.view.collection.includeEvent('reset', this.callback)).to.be.true;
            });
        });
        describe('Marionette.ui bind',function(){
            beforeEach(function(){
                var MarioView = Backbone.Marionette.View.extend({
                    ui: {
                        test: "#test"
                    },
                    hideTest: function(){
                        this.ui.test.hide();
                    },
                    render: function(){
                        this.$el.html($('<div>', {id: "test"}));
                        return this;
                    }
                });
                this.m_view = new MarioView();
                this.m_view.render();
                this.m_view.bindUIElements();
            });
            it('should get spy ui',function(){
                this.m_view.spyUI();
                this.m_view.hideTest();
                expect(this.m_view.ui.test.hide.calledOnce).to.be.true;
            });
        });
        describe('Backbone.spider', function(){
            beforeEach(function(){
                this.target = {
                    func: function() {},
                    func2: function() {},
                    stringProp: "faked",
                    alreadyWrapped: sinon.spy()
                };
            });
            describe('spyAllFunction()', function(){
                it('should get only func spy', function(){
                    var spyArray = Backbone.spider.spyAllFunction(this.target);
                    expect(spyArray.length).to.eql(2);
                    expect(Backbone.spider.isSinonWrapped(spyArray[0])).to.be.true;
                    expect(Backbone.spider.isSinonWrapped(spyArray[1])).to.be.true;

                    this.target.func();
                    expect(this.target.func.calledOnce).to.be.true;
                });
            });
            describe('restoreAllFunction()', function(){
                it('should restore spy', function(){
                    var spyArray = Backbone.spider.spyAllFunction(this.target);
                    this.target.func();
                    expect(this.target.func.calledOnce).to.be.true;
                    Backbone.spider.restoreAllFunction(spyArray);
                    expect(this.target.func.calledOnce).to.be.undefined;
                });
            });
            describe('isSinonWrapped()', function(){
                beforeEach(function(){
                    this.func = {
                        f: function(){}
                    };
                });
                it('shoud be true if arg is already wrapped by sinon', function(){
                    sinon.spy(this.func, "f");
                    expect(Backbone.spider.isSinonWrapped(this.func.f)).to.be.true;
                });
            });
        });
    });
})();
