(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
        typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.IDGenerator = {}));
}(this, (function (exports) {
    function IDGenerator() {
        let id = 0

        return () => id++
    }

    exports.getID = IDGenerator()
})));
