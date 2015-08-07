var MarionetteBinding = {};

var Marionette = require('backbone.marionette');

MarionetteBinding.BindingMixin = {
  bindings: {},
  onRender: function(){
    this.startBindings();
  },

  startBindings: function(){
    var self = this;
    _.each(this.bindings, function(what, bind_to){
      var binding = bind_to.split(" ");
      if(binding.length != 2){
        throw new Error("Binding not setup correctly");
      }

      var type = binding[0];
      var el = binding[1];
      if(el.indexOf("@ui.") == 0){
        el = this.ui[el.substr(4)];
      } else{
        el = $(el, this.$el);
      }

      if(type == "value"){
        el.val(this.model.get(what));
        el.on("keyup", function(){
          self.model.set(what, el.val(), {_sender: el});
        });
        this.model.on("change:" + what, function(model, value, options){
          if(options['_sender'] == el) return;
          el.val(value);
        });
      } else if(type == "text"){
        el.text(this.model.get(what));
        this.model.on("change:" + what, function(model, value){
          el.text(value);
        });
      } else if(type == "html"){
        el.html(this.model.get(what));
        this.model.on("change:" + what, function(model, value){
          el.html(value);
        });
      } else{
        throw new Error("Binding type is not recognised")
      }
    }, this);
  }
};

MarionetteBinding.BindedView = Marionette.LayoutView.extend(
  MarionetteBinding.BindingMixin);


module.exports = MarionetteBinding;
