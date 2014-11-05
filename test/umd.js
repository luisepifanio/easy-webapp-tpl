(function(define){
    "use strict";
    define(function(require,exports,module){
        //...
        console.log("require enabled ", !!require );
        console.log("exports enabled ", !!exports );
        console.log("module  enabled ", !!module  );

        //exports.Cow = Cow;
        return {
            version : '1.0.0'
        };

    });
})((function(n,w){
    "use strict";
    return ( typeof define === 'function' && define.amd ) ?
            define
            : ( typeof module === 'object' ) ?
                function(c){
                    c(require,exports,module);
                }
                : function(c){
                    var m = {exports:{}},
                        r = function(n){
                            return w[n];
                        };
                        w[n] = c(r,m.exports,m) || m.exports;
                };
})('ModuleName',this));
