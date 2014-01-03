/*global describe, it */
'use strict';
(function () {
  describe('Backbone Spider', function () {
    before(function(){
      this.MyView = Backbone.View.extend({
        url: "faked",
        originalMethod: function(){
          console.log('have called original method in test');
        }
      });
    });
    beforeEach(function(){
      this.view = new this.MyView();
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
  });
})();
