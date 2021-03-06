window._ = require('underscore');
var MarionetteBinding = require('../marionette.binding');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');

var BaseView = Marionette.LayoutView.extend({});
_.extend(BaseView.prototype, MarionetteBinding.BindingMixin);

var DemoView = BaseView.extend({
  template: function(){
    return "<p>Test of Marionette.Binding</p>" +
      "<input type='text' id='text' />" +
      "<p>Hi <span id='repeat'></span></p>" +
      "<input type='text' id='text_2' />" +
      "<p>It sounds nice in <span id='repeat_2'></span> (html allowed on this one!)</p>";
  },
  onRender: function(){
    this.startBindings();
  },
  ui: {
    "text": "#text",
    "repeat": "#repeat",
    "text_2": "#text_2",
    "repeat_2": "#repeat_2"
  },
  bindings: {
    "value @ui.text": "name",
    "text @ui.repeat": "name",
    "value @ui.text_2": "place",
    "html @ui.repeat_2": "place"
  }
});

var regions = new Marionette.RegionManager({
  regions: {
    body: "#content"
  }
});

var view = new DemoView({
  model: new Backbone.Model({name: "John", place: "The Well"})
});
regions.get("body").show(view);
module.exports = view;
