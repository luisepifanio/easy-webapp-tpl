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
