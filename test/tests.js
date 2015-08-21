window.$ = require('jquery');
var chai = require('chai');
var sinon = require('sinon');

describe('Inherited tests', function(){
  before(function(){
    this.clock = sinon.useFakeTimers();
    $("<div>").attr("id", "content").appendTo("body");
    this.view = require('../demo.js');
  });

  after(function(){
    $("#content").remove();
    this.clock.restore();
  });

  it('should render empty data properly', function(){
    chai.expect(this.view.ui.repeat.text()).to.equal("John");
    chai.expect(this.view.ui.repeat_2.text()).to.equal("The Well");

    chai.expect(this.view.ui.text.val()).to.equal("John");
    chai.expect(this.view.ui.text_2.val()).to.equal("The Well");
  });

  it('should allow me to change the backend model', function(){
    this.view.model.set("place", "Toon");
    this.clock.tick(150);

    chai.expect(this.view.ui.text_2.val()).to.equal("Toon");
    chai.expect(this.view.ui.repeat_2.text()).to.equal("Toon");

    this.view.model.set("name", "Bob");
    this.clock.tick(150);

    chai.expect(this.view.ui.text.val()).to.equal("Bob");
    chai.expect(this.view.ui.repeat.text()).to.equal("Bob");
  });

  it('should allow me to change inputs', function(){
    this.view.ui.text_2.val("Nowhere").trigger('__updated');
    this.clock.tick(1000);
    chai.expect(this.view.model.get("place")).to.equal("Nowhere");
    chai.expect(this.view.ui.repeat_2.text()).to.equal("Nowhere");

    this.view.ui.text.val("Me").trigger('__updated');
    this.clock.tick(1500);
    chai.expect(this.view.model.get("name")).to.equal("Me");
    chai.expect(this.view.ui.repeat.text()).to.equal("Me");
  });
});

// TODO: Figure out if this can be reduced so no duplication
describe('Mixin tests', function(){
  before(function(){
    this.clock = sinon.useFakeTimers();
    $("<div>").attr("id", "content").appendTo("body");
    this.view = require('./mixin.demo.js');
  });

  after(function(){
    $("#content").remove();
    this.clock.restore();
  });

  it('should render empty data properly', function(){
    chai.expect(this.view.ui.repeat.text()).to.equal("John");
    chai.expect(this.view.ui.repeat_2.text()).to.equal("The Well");

    chai.expect(this.view.ui.text.val()).to.equal("John");
    chai.expect(this.view.ui.text_2.val()).to.equal("The Well");
  });

  it('should allow me to change the backend model', function(){
    this.view.model.set("place", "Toon");
    this.clock.tick(150);

    chai.expect(this.view.ui.text_2.val()).to.equal("Toon");
    chai.expect(this.view.ui.repeat_2.text()).to.equal("Toon");

    this.view.model.set("name", "Bob");
    this.clock.tick(150);

    chai.expect(this.view.ui.text.val()).to.equal("Bob");
    chai.expect(this.view.ui.repeat.text()).to.equal("Bob");
  });

  it('should allow me to change inputs', function(){
    this.view.ui.text_2.val("Nowhere").trigger('__updated');
    this.clock.tick(1000);
    chai.expect(this.view.model.get("place")).to.equal("Nowhere");
    chai.expect(this.view.ui.repeat_2.text()).to.equal("Nowhere");

    this.view.ui.text.val("Me").trigger('__updated');
    this.clock.tick(1500);
    chai.expect(this.view.model.get("name")).to.equal("Me");
    chai.expect(this.view.ui.repeat.text()).to.equal("Me");
  });
});
