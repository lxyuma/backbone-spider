# backbone-spider

This is backbone plugin for supporting your testing by sinon.

# usage

In your favorite test framework(jasmine/mocha etc).

- add ```spyAllFunc()```

```javascript
beforeEach(function(){
  this.view = new Backbone.View.extend({
    originalFunc: function(){}
  });
  this.view.spyAllFunc();
});
afterEach(function(){
  this.view.restoreAllFunc();
});
it('should spy all Backbone.View and YourView function ', function(){
  this.view.render();
  expect(this.view.render.called).to.be.true;

  this.view.originalFunc();
  expect(this.view.originalFunc).to.be.true;
});
```

# why use this?

In Backbone, we must write testdouble anytime for any reasons.

It's really annoying.

If it is set to most upper level(describe), it may solve it.

So, experimentally, I make it.

# todo

I want to add function for decreasing rebundant test double expression.

- event spy
- server fake
