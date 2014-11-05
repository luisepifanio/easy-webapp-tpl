//cow_test.js
(function(define){
  "use strict";
  define(function(require,exports,module){
    console.log("require enabled ", !!require );
    console.log("exports enabled ", !!exports );
    console.log("module  enabled ", !!module  );
    //...
    var chai   = require("chai")
        , expect = chai.expect
        , Cow = require("Cow")
        ;

    describe("Cow", function() {
      describe("constructor", function() {
        it("should have a default name", function() {
          var cow = new Cow();
          expect(cow.name).to.equal("Anon cow");
        });

        it("should set cow's name if provided", function() {
          var cow = new Cow("Kate");
          expect(cow.name).to.equal("Kate");
        });
      });

      describe("#greets", function() {
        it("should throw if no target is passed in", function() {
          expect(function() {
            (new Cow()).greets();
          }).to.throw(Error);
        });

        it("should greet passed target", function() {
          var greetings = (new Cow("Kate")).greets("Baby");
          expect(greetings).to.equal("Kate greets Baby");
        });
      });
    });
    //..
    return {
        version : '1.0'
    };
  });
})((function(n,w){
    "use strict";
    return typeof define === 'function' && define.amd
            ? define
            : typeof module === 'object'
                ? function(c){
                    c(require,exports,module);
                }
                : function(c){
                    var m = {exports:{}},
                        r = function(n){
                            console.log('Asking for "' + n + '" in' + w );
                            return w[n];
                        };
                        w[n] = c(r,m.exports,m) || m.exports;
                };
})('CowTest',this));
