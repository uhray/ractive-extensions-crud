/**
 * @license ractive-validator Copyright (c) 2014, Uhray LLC
 * Available via the MIT license.
 * see: http://github.com/uhray for details
 */
define(['ractive', 'crud'], function(Ractive, crud) {
  var extension;

  // ========================== Custom Events =============================== //

  Ractive.events.crudUpdate = createEvent('crudUpdate');
  Ractive.events.crudUpdateSuccess = createEvent('crudUpdateSuccess');
  Ractive.events.crudUpdateFailure = createEvent('crudUpdateFailure');

  Ractive.events.crudDelete = createEvent('crudDelete');
  Ractive.events.crudDeleteSuccess = createEvent('crudDeleteSuccess');
  Ractive.events.crudDeleteFailure = createEvent('crudDeleteFailure');

  Ractive.events.crudCreate = createEvent('crudCreate');
  Ractive.events.crudCreateSuccess = createEvent('crudCreateSuccess');
  Ractive.events.crudCreateFailure = createEvent('crudCreateFailure');

  // ========================== Define Extension ============================ //

  extension = Ractive.extend({

    // Initialize on render ----------------------------------------------------
    onrender: function(options) {
      var self = this;

      this._super(options);

      this.on('crud-update', function(event, object) {
        var list = object instanceof Array ? object : [object];

        asyncMap(list, function(d, cb) {
          d._crud.update(d, cb);
        }, function(e, d) {
          var n = event.node;
          if (list != object) { d = d[0]; }
          n && n._firecrudUpdate && n._firecrudUpdate(event, e, d);
          if (e) n && n._firecrudUpdateFailure &&
                 n._firecrudUpdateFailure(event, e, d);
          if (!e) n && n._firecrudUpdateSuccess &&
                  n._firecrudUpdateSuccess(event, e, d);
        });
      });

      this.on('crud-delete', function(event, object) {
        var keyArr = event.keypath.split('.'),
            keyid = keyArr.pop(),
            keypath = keyArr.join('.');

        object._crud.del(function(e, d) {
          var n = event.node;
          if (!e && keyid !== '' && keyid !== undefined && keypath) {
            self.splice(keypath, keyid, 1);
          }
          n && n._firecrudDelete && n._firecrudDelete(event, e, d);
          if (e) n && n._firecrudDeleteFailure &&
                 n._firecrudDeleteFailure(event, e, d);
          if (!e) n && n._firecrudDeleteSuccess &&
                  n._firecrudDeleteSuccess(event, e, d);
        });
      });

      this.on('crud-create', function(event, arr, obj) {
        var c;

        if (arr instanceof Array) {
          c = arr._crud;
        } else {
          c = crud(arr);
          arr = [];
        }

        c.create(obj || {}, function(e, d) {
          var n = event.node;
          if (!e && d) arr.push(d);
          n && n._firecrudCreate && n._firecrudCreate(event, e, d);
          if (e) n && n._firecrudCreateFailure &&
                 n._firecrudCreateFailure(event, e, d);
          if (!e) n && n._firecrudCreateSuccess &&
                  n._firecrudCreateSuccess(event, e, d);
        });
      });
    }

  });

  // ========================= Activate Extension =========================== //

  Ractive.prototype = extension.prototype;

  // ============================= Utility Fns ============================== //

  function forEach(arr, fn, ctx) {
    var k;

    if ('length' in arr) {
      for (k = 0; k < arr.length; k++) fn.call(ctx || this, arr[k], k);
    } else {
      for (k in arr) fn.call(ctx || this, arr[k], k);
    }
  }

  function asyncMap(list, fn, callback) {
    var done = 0,
        num = list.length,
        res = [];

    forEach(list, function(d, i) {
      res.push(null);
      setTimeout(fn, 0, d, complete.bind({idx: i}));
    });

    function complete(e, d) {
      res[this.idx] = d;
      if (e) {
        done = num.length;
        callback(e, res);
      } else if (++done == num) {
        callback(null, res);
      }
    }
  }

  function createEvent(name) {
    var n = '_fire' + name;
    return function(node, fire) {
      var self = this;

      node[n] = function(event, e, d) {
        fire({
          node: node,
          name: name,
          target: self,
          original: event,
          error: e,
          data: d
        });
      };
    }
  };

});
