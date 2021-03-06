# backbone-spider

This is Backbone.js plugin for supporting your test double by sinon.

If you use this, you can write spy at once for using events/methods spy every time.

# usage

In your favorite test framework(jasmine/mocha etc).

- In ```before``` sentence, add ```spyAll()```
- So, you can spy all functions and all events.

```javascript
// Your Backbone View
var YourView = Backbone.View.extend({
    initialize: function(){
        this.listenTo(this.model, 'request', function(){console.log('Saving');});
    },
    originalMethod: function(){
        // any sentence ...
        this.commonMethod();
    },
    commonMethod: function(){ }
});
var YourModel = Backbone.Model.extend({});

// mocha + chai
beforeEach(function(){
    this.view = new YourView({ model: new YourModel({name: "test"}) });
    this.view.spyAll();
});
it('should spy all Backbone.View', function(){
    this.view.render();
    expect(this.view.render.called).to.be.true;
});
it('should spy all your original View', function(){
    this.view.originalMethod();
    expect(this.view.commonMethod.calledOnce).to.be.true;
});
it('should spy all events', function(){
    this.view.model.save();
    expect(this.view.modelSpy('request').called).to.be.true;
});
```

# why use this?

In Backbone, we must write testdouble anytime for any reasons.

It's really annoying.

If it is set to most upper level(describe), it may solve it.

So, I make it experimentally.

# doc

now, writing.

- view.model.includeEvent('sync', this.callback)


# todo

I want to add function for decreasing rebundant test double expression.

- model/collection methods wrapping
- observe listenTo(when add events, add eventsSpy)
- observe all built in events(include not initialized)
- server fake
- for stubbing interface to methods wrapped by this plugin
- restore eventspy(now, it's no completed)
- marionette.ui spy/restore
- adjust spy apply range for improving performance
