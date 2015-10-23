var MarionetteBinding = {};

if(window['Backbone'] && window['Marionette']){
  var Marionette = Backbone.Marionette;
} else{
  var Marionette = require('backbone.marionette');
}

MarionetteBinding.BindingMixin = {
  bindings: {},
  onRender: function(){
    this.startBindings();
  },

  startBindings: function(model, bindings){
    if(!model){
      model = this.model;
    }
    if(!bindings){
      bindings = this.bindings;
    }

    if(!model){
      // No model - no bindings!
      return;
    }

    var self = this;
    _.each(bindings, function(what, bind_to){
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
        if(el == undefined){
          // keeps it working + choice by
          // https://bocoup.com/weblog/jquery-fastest-way-to-select-nothing/
          el = this.$(false);
        }
      } else{ // everything else
        el = this.$(el);
      }

      // Now we change based on what we asked to do
      if(type == "value" || type == "val"){
        // Initial Value
        el.val(function(){return model.get(what)});

        // Update
        var eventHandler = function(){
          model.set(what, el.val(), {_sender: el});
        };
        el.on("keyup", eventHandler).on("change", eventHandler).on("__updated", eventHandler);

        // Listen to changes
        model.on("change:" + what, function(model, value, options){
          if(options['_sender'] == el) return; // Don't loop!
          el.val(model.get(what));
        });
      } else if(type == "text"){
        // Initial Value
        el.text(model.get(what));

        // Listen to changes
        model.on("change:" + what, function(model, value){
          el.text(model.get(what));
        });
      } else if(type == "html"){
        // Initial Value
        el.html(model.get(what));

        // Listen to changes
        model.on("change:" + what, function(model, value){
          el.html(model.get(what));
        });
      } else if(type == "checked"){
        // Update
        el.on("click", function(e){
          var tick = self.$(e.target);
          var type = tick.attr("type");
          if(type == "radio"){
            model.set(what, tick.attr('value'), {_sender: el});
          } else if(type == "checkbox"){
            model.set(what, tick.is(':checked'), {_sender: el});
          }
        });

        // Listen to changes
        model.on("change:" + what, function(model, value, options){
          if(options['_sender'] == el) return; // Don't loop!
          el.each(function(){
            var type = self.$(this).attr("type");
            if(type == "checkbox"){
              self.$(this).prop("checked", value);
            } else if(type == "radio"){
              if(self.$(this).attr("value") == value){
                self.$(this).get(0).checked = true;
              }
            }
          });
        }).trigger("change:" + what, model, model.get(what), {});
      } else{
        throw new Error("Binding type is not recognised")
      }
    }, this);
  }
};

MarionetteBinding.BindedView = Marionette.LayoutView.extend(
  MarionetteBinding.BindingMixin);


module.exports = MarionetteBinding;
