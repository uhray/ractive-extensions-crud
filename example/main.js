
require.config({
  baseUrl: '/',
  paths: {
    crud:          'bower_components/crud/dist/crud',
    ractive:       'bower_components/ractive/ractive',
    rv:            'bower_components/rv/rv'
  }
});

requirejs(['ractive', 'crud', 'rv!example/template', 'lib/main'],
function(Ractive, crud, template) {
  crud.configure({
    base: 'localhost:3000',
    idGetter: 'id',
    protocol: 'http://',
    getData: function(d) { return d; },
    getError: function(d) { return null; }
  });

  c = crud;

  crud('/users').read(function(e, users) {
    var ractive = new Ractive({
          el: '#container',
          template: template,
          data: {
            users: users
          }
        });

    ractive.on('crud-updated-success', function() {
      console.log('crud-update-success', arguments);
    });

    ractive.on('crud-updated', function() {
      console.log('crud-update', arguments);
    });

    ractive.on('crud-updated-failure', function() {
      console.log('crud-update-failure', arguments);
    });

    ractive.on('crud-deleted-success', function() {
      console.log('crud-delete-success', arguments);
    });

    ractive.on('crud-deleted', function() {
      console.log('crud-delete', arguments);
    });

    ractive.on('crud-deleted-failure', function() {
      console.log('crud-delete-failure', arguments);
    });

    ractive.on('crud-created-success', function() {
      console.log('crud-create-success', arguments);
    });

    ractive.on('crud-created', function() {
      console.log('crud-create', arguments);
    });

    ractive.on('crud-created-failure', function() {
      console.log('crud-create-failure', arguments);
    });

  });
});
