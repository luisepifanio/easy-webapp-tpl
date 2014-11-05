var Person;

Person = (function() {
  function Person(options) {
    this.name = options.name, this.lastname = options.lastname, this.age = options.age, this.height = options.height, this.weight = options.weight;
  }

  return Person;

})();

;(function(define){
    define(function(require,exports,module){
      "use strict";
      //...
      console.log("require enabled ", !!require );
      console.log("exports enabled ", !!exports );
      console.log("module  enabled ", !!module  );

      function Cow(name) {
        this.name = name || "Anon cow";
      }
      Cow.prototype = {
        greets: function(target) {
          if (!target){
            throw new Error("missing target");
          }
          return this.name + " greets " + target;
        }
      };
      //exports.Cow = Cow;
      return Cow;
    });
})((function(n,w){
    return typeof define === 'function' && define.amd
            ? define
            : typeof module === 'object'
                ? function(c){
                    c(require,exports,module);
                }
                : function(c){
                    var m = {exports:{}},
                        r = function(n){
                            return w[n];
                        };
                        w[n] = c(r,m.exports,m) || m.exports;
                };
})('Cow',this));



// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
