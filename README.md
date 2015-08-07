# Marionette.Binding.js

![NPM](https://nodei.co/npm/marionette.binding.png)](https://npmjs.org/package/marionette.binding)

This provides two-way UI bindings to marionette.js.

## Demo

Currently the fastest way to get a demo up and running is to do the following:

  git clone https://github.com/kennydude/marionette-binding.git
  cd marionette-binding
  npm install
  [sudo] npm install beefy
  beefy demo.js

Open a browser to http://localhost:9966/demo.html

(Hopefully a live demo can be put together soon)

## Usage

This is designed for usage via [Browserify](//browserify.org) and it's fairly
simple. There are two ways to activating Marionette.Binding:

- **Reconmended route:** If you already extend from LayoutView you can just
  swap this out for `MarionetteBinding.BindedView`
- Otherwise you'll have to use the mixin `MarionetteBinding.BindingMixin`
  (more details coming soon)

You're views are exactly the same and we reconmend you use the `ui` hash
to keep things neat.

Now all you need is to setup the `bindings` hash like so:

    var DemoView = MarionetteBinding.BindedView.extend({
      // ... other stuff ...
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
      // ... other stuff ...
    });

The keys on the binding work similar to triggers, but instead of events it's
where you want the value to go.

## Binding definition

The definition is always:

    "how_you_want_to_bind what_to_bind" : "bind_to_what"

How you want to bind can be one of the following:

- `value` or `val` which is an input's value (or anything `$.val` works on)
- `text` is setting the text contents
- `html` sets the innerHTML. **Warning:** This could be dangerous! [Don't use
  this ever on user-input unless you absolutely mean to](http://www.businessinsider.com/tweetdeck-major-security-vulnerability-twitter-2014-6?IR=T)

## License

[The MIT License (MIT)](http://choosealicense.com/licenses/mit/)

Copyright (c) [2015] [Joe Simpson]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
