ractive-extensions-crud
=======

[Ractive](http://www.ractivejs.org/) extension for use with crud.

  * [Overview](#overview)
  * [Install](#install)
  * [Events Listeners](#event-listeners)
  * [Events Emitted](#events-emitted)
  * [See Example](#see-example)
  * [Contribute](#contribute)

## Overview

There are a lot of redundant crud operations we do across our project, so the goal of this module is to help speed up the common things.

If you have an ractive template, maybe you want to list everything out in a form and have the data auto-saved on when submitted. Try this:

```html
<form action="javascript:;" on-submit="crud-update:{{users}}">
  {{#each users}}
    <h3>User {{.name}}</h3>
    <input type="text" placeholder="name" value={{.name}} />
    <input type="text" placeholder="age" value={{.age}} />
  {{/each}}
  <input type="submit" value="save changes" />
</form>
```

The part that says `on-submit="crud-update:{{users}}"` is where this extension comes into play. Ractive-extensions-crud listens for the event `crud-update` and then will update with the appropriate data.

To see other event listeners and more information on how to get them working, see [event listeners](#event-listeners).

## Install


To get started, you need to include the distributed file in your project.

```
bower install ractive-extensions-crud
```

Then you need to make sure that the module is loaded before you use Ractive. It will add the necessary features and event listeners to the Ractive object. If you're using [requirejs](http://requirejs.org/), you could do something like this:

```
define(['ractive', 'path/to/extension/dist/crud.min'], function(Ractive) {
  var ractive = new Ractive({
   /* Define Ractive object here */
  })
})
```

Now the extension is yours to use how you wish.

## Events Listeners

This module listens for the following events:

> Note: to pass arguments to the events in ractive, you add them comma-separated after a semicolon. So this: `<a on-click="crud-create:7,8,9">create</a>` will emit the event `crud-create` with the arguments 7, 8, and 9.

<a href="#event-crud-update" name="event-crud-update">#</a> crud-update(*object*)

  * *object* - the object to update or an array of objects to update.

Object should be a javascript object that was retrieved using [crud read](https://github.com/uhray/crud#eo-crud) because it will contain a `._crud` value explaining where it came from.

> Note: if it's an array of objects, then each will be updated individually.

Example:

```html
<form action="javascript:;" on-submit="crud-update:{{user}}">
  <input type="text" placeholder="name" value={{user.name}} />
  <input type="text" placeholder="age" value={{user.age}} />
  <input type="submit" value="save changes" />
</form>
```

<a href="#event-crud-delete" name="event-crud-delete">#</a> crud-delete(*object*)

  * *object* - the object to update to be deleted

Object should be a javascript object that was retrieved using [crud read](https://github.com/uhray/crud#eo-crud) because it will contain a `._crud` value explaining where it came from.

If this value is in an array, this module tries to use [Ractive.splice](http://docs.ractivejs.org/latest/ractive-splice) to remove it. This only works if the context of the event makes sense.


So if you do the following, we know what the context is because the event would say the context was `users.idx` where idx is whichever value in the array was clicked (0, 1, 2, ...):

```html
{{#each users}}
  <a on-click="crud-delete:{{.}}">delete user {{name}}</a>
{{/each}}
```


But if you tried this, there is no way for use to know the path in the array.

```html
<a on-click="crud-delete:{{users[0]}}">delete user {{users[0].name}}</a>
<a on-click="crud-delete:{{users[1]}}">delete user {{users[1].name}}</a>
<a on-click="crud-delete:{{users[2]}}">delete user {{users[2].name}}</a>
...
```

<a href="#event-crud-create" name="event-crud-create">#</a> crud-create(*array*, [*object*])

  * *array* - the array to create new object on
  * *object* (optional) - the new object to be appended.

Object should be a javascript object that was retrieved using [crud read](https://github.com/uhray/crud#eo-crud) because it will contain a `._crud` value explaining where it came from.

After the new object is created, it will be pushed to the array.

Example:

```
<h1>New User</h1>
<input value={{newUser.name}} />
<input type="button" on-click="crud-create:{{allUsers}},{{newUser}}" />
```

## Events Emitted

After this module does something, it emits events on the element that originated the call. These events can be listened like any Ractive event. Example:

```html
<form action="javascript:;" on-submit="crud-update:{{user}}"
      on-crudUpdate="set('updated', true)">
  <input type="text" placeholder="name" value={{user.name}} />
  <input type="text" placeholder="age" value={{user.age}} />
  <input type="submit" value="save changes" />
</form>
```

Events:

  * *crudUpdate* - After an update is done
  * *crudUpdateSuccess* - After an update is done and was successful
  * *crudUpdateFailure* - After an update fails
  * *crudDelete* - After a delete is done
  * *crudDeleteSuccess* - After a delete is done and was successful
  * *crudDeleteFailure* - After a delete fails
  * *crudCreate* - After a create is done
  * *crudCreateSuccess* - After a create is done and was successful
  * *crudCreateFailure* - After a create update fails

## See Example

To see the example page, clone the repo and run:

```
npm install
bower install
gulp example
```

Then visit http://127.0.0.1:8080/example/.

> Note: You'll need [bower](http://bower.io/) and [gulp](http://gulpjs.com/) installed.

## Contribute

The development code is located in [lib](lib). The example code is in [example](example).

After you develop, ling: `gulp lint`.

Then you can build and push: `gulp build` to build the files to [dist](dist). Make sure to test out that the built file work.

