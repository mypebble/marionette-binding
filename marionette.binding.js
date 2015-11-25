/* global _ */
/* global Backbone */
/**
Marionette Binding

Copyright 2015 Pebble
*/
let Marionette = null;

if(window['Backbone'] && window['Marionette']){
  Marionette = Backbone.Marionette;
} else{
  Marionette = require('backbone.marionette');
}

/*
This looks after a value to monitor on the model. This allows us to do
some neat things such as "value__isnull" a la Django style
*/
export class ModelValue {
  constructor(model, key){
    this.model = model;
    this.key = key;
  }

  get() {
    return this.model.get(this.key);
  }

  set(val, args) {
    return this.model.set(this.key, val, args);
  }

  change(fn){
    this.model.on("change:" + this.key, fn);
  }
}

export class IsNullValue extends ModelValue {
  constructor(model, key){
      super(model, key);
      this.oldValue = '';
  }

  get() {
    return super.get() == null;
  }

  set(val, args){
    if(val == true){
      this.oldValue = super.get();
      return super.set(null, args);
    } else{
      return super.set(this.oldValue, args);
    }
  }
}

export let ValueLookups = {
  'eq': ModelValue,
  'isnull': IsNullValue,
}

/*
This deals with the binding and keeping it all up to date

@abstract
*/
export class Binding {
  constructor(element, val, jQ){
    this.element = element;
    this.val = val;
    this.$ = jQ;
  }

  start(){
    throw new Error("start() not implemented");
  }
}

export class ValueBinding extends Binding {
  start(){
    // Initial Value
    this.element.val(this.val.get());

    // Update
    var eventHandler = () => {
      this.val.set(this.element.val(), {_sender: this.element});
    };
    this.element.on("keyup", eventHandler).on(
      "change", eventHandler).on("__updated", eventHandler);

    // Listen to changes
    this.val.change((model, value, options) => {
      if(options['_sender'] == this.element) return; // Don't loop!
      this.element.val(this.val.get());
    });
  }
}

export class TextBinding extends Binding {
  start(){
    // Initial Value
    this.element.text(this.val.get());

    // Listen to changes
    this.val.change((model, value) => {
      this.element.text(this.val.get());
    });
  }
}

export class HtmlBinding extends Binding {
  start(){
    // Initial Value
    this.element.html(this.val.get());

    // Listen to changes
    this.val.change((model, value) => {
      this.element.html(this.val.get());
    });
  }
}

export class CheckedBinding extends Binding{
  start(){
    // Update
    this.element.on("click", (e) => {
      var tick = this.$(e.target);
      var type = tick.attr("type");
      if(type == "radio"){
        this.val.set(tick.attr('value'), {_sender: this.element});
      } else if(type == "checkbox"){
        this.val.set(tick.is(':checked'), {_sender: this.element});
      }
    });

    // Listen to changes
    this.val.change(_.bind(this.change, this));
    this.change(null, this.val.get(), {});
  }

  change(model, wrong_value, options){
    let value = this.val.get();
    if(options['_sender'] == this.element) return; // Don't loop!
    this.element.each((k, v) => {
      var type = this.$(v).attr("type");
      if(type == "checkbox"){
        this.$(v).prop("checked", value);
      } else if(type == "radio"){
        if(this.$(v).attr("value") == value){
          this.$(v).get(0).checked = true;
        }
      }
    });
  }
}

export let Bindings = {
  'value': ValueBinding,
  'text': TextBinding,
  'html': HtmlBinding,
  'checked': CheckedBinding,
};

export let BindingMixin = {
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

    _.each(bindings, function(what, bind_to){
      // Split up the definition
      let binding = bind_to.split(" ");
      if(binding.length != 2){
        throw new Error("Binding not setup correctly");
      }

      // Deal with the binding definition
      let type = binding[0];
      let el = binding[1];
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

      let lookup = what.split('__');
      let val = null;
      if(lookup.length >= 2){
        lookup = lookup[lookup.length-1];
        if(!ValueLookups[lookup]){
          throw new Error("Value lookup not found for " + lookup);
        }
        val = new ValueLookups[lookup](model,
          what.substr(0, what.length - lookup.length - 2));
      } else{
        val = new ModelValue(model, what);
      }

      if(Bindings[type]){
        let binding = new Bindings[type](el, val, _.bind(this.$, this));
        binding.start();
      } else{
        throw new Error("Binding not found for " + type);
      }
    }, this);
  }
};

export let BindedView = Marionette.LayoutView.extend(
  BindingMixin);
