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
      // Split up the definition
      var binding = bind_to.split(" ");
      if(binding.length != 2){
        throw new Error("Binding not setup correctly");
      }

      // Deal with the binding definition
      var type = binding[0];
      var el = binding[1];
      // @ui.etc is dealt with
      if(el.indexOf("@ui.") == 0){
        el = this.ui[el.substr(4)];
      } else{ // everything else
        el = $(el, this.$el);
      }

      // Now we change based on what we asked to do
      if(type == "value" || type == "val"){
        // Initial Value
        el.val(this.model.get(what));

        // Update
        var eventHandler = function(){
          self.model.set(what, el.val(), {_sender: el});
        };
        el.on("keyup", eventHandler).on("change", eventHandler);

        // Listen to changes
        this.model.on("change:" + what, function(model, value, options){
          if(options['_sender'] == el) return; // Don't loop!
          el.val(value);
        });
      } else if(type == "text"){
        // Initial Value
        el.text(this.model.get(what));

        // Listen to changes
        this.model.on("change:" + what, function(model, value){
          el.text(value);
        });
      } else if(type == "html"){
        // Initial Value
        el.html(this.model.get(what));

        // Listen to changes
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
