var _ = require('underscore');
var Backbone = require('backbone');




Presenter = function() {}

Presenter.extend = function( obj ) {
  return _(this).extend( obj );
}

Presenter.extend({


  bind: function( model ) {
    var self = this;

    model.present = function( strategy ) {
      var attributes = model.toJSON();
      return self.build( attributes, strategy );
    }
  }


, build: function( attributes, strategy ) {
    var self = this;
    var strategy = this.strategies[strategy];
    var result = _.clone( attributes );
    var attributesWrapper = {
      attributes: attributes
    , customAttribute: function( key ) {
        return self.customAttributes[key].call( this )
      }
    }

    // if the user has specified a strategy
    if ( strategy ) {

      // keep only the attributes we want
      if ( strategy.whitelist) {
        result = _( result ).pick( strategy.whitelist )
      }

      // remove attributes we don't want
      if ( strategy.blacklist) {
        result = _( result ).omit( strategy.blacklist )
      }

      // calculate any custom values we specified for this strategy
      _( strategy.customAttributes ).each( function( value ) {
        result[value] = self.customAttributes[value].call( attributesWrapper )
      })

    } else {

      // calculate all custom values for the presenter
      _( this.customAttributes ).each( function( value, key ) {
        result[key] = self.customAttributes[key].call( attributesWrapper )
      })

    }

    return result;
  }


})
// attach the class to the Backbone global object
Backbone.Presenter = Presenter;

module.exports = Backbone;