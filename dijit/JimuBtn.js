define([
    "dojo/_base/declare",
    "dojo/Evented",
    "dojo/on",
    "dojo/dom-class",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
  ], function(
    declare,
    Evented,
    on,
    domClass,
    lang,
    _WidgetBase,
    _TemplatedMixin,
  ){
    return declare([_WidgetBase, Evented, _TemplatedMixin], {
        baseClass: "jimu-btn",
        templateString: `<div>\${params.text}</div>`,
  
        _enabled: true,
  
        startup: function() {
          this.inherited(arguments)
  
          on(this.uploadLabel, "click", lang.hitch(this, function(e) {
            if (this._enabled)
              this.emit("click", e)
          }))
        },
  
        enable: function() {
          this._enabled = true
          domClass.remove(this.uploadLabel, "jimu-state-disabled");
        },
  
        disable: function() {
          this._enabled = false
          domClass.add(this.uploadLabel, "jimu-state-disabled");
        },
    })
  })