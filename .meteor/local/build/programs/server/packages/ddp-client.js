(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Retry = Package.retry.Retry;
var IdMap = Package['id-map'].IdMap;
var ECMAScript = Package.ecmascript.ECMAScript;
var Hook = Package['callback-hook'].Hook;
var DDPCommon = Package['ddp-common'].DDPCommon;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var MongoID = Package['mongo-id'].MongoID;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var options, DDP;

var require = meteorInstall({"node_modules":{"meteor":{"ddp-client":{"server":{"server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp-client/server/server.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("../common/namespace.js"), {
  DDP(v) {
    exports.DDP = v;
  }

}, 0);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"common":{"MethodInvoker.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp-client/common/MethodInvoker.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => MethodInvoker
});

class MethodInvoker {
  constructor(options) {
    // Public (within this file) fields.
    this.methodId = options.methodId;
    this.sentMessage = false;
    this._callback = options.callback;
    this._connection = options.connection;
    this._message = options.message;

    this._onResultReceived = options.onResultReceived || (() => {});

    this._wait = options.wait;
    this.noRetry = options.noRetry;
    this._methodResult = null;
    this._dataVisible = false; // Register with the connection.

    this._connection._methodInvokers[this.methodId] = this;
  } // Sends the method message to the server. May be called additional times if
  // we lose the connection and reconnect before receiving a result.


  sendMessage() {
    // This function is called before sending a method (including resending on
    // reconnect). We should only (re)send methods where we don't already have a
    // result!
    if (this.gotResult()) throw new Error('sendingMethod is called on method with result'); // If we're re-sending it, it doesn't matter if data was written the first
    // time.

    this._dataVisible = false;
    this.sentMessage = true; // If this is a wait method, make all data messages be buffered until it is
    // done.

    if (this._wait) this._connection._methodsBlockingQuiescence[this.methodId] = true; // Actually send the message.

    this._connection._send(this._message);
  } // Invoke the callback, if we have both a result and know that all data has
  // been written to the local cache.


  _maybeInvokeCallback() {
    if (this._methodResult && this._dataVisible) {
      // Call the callback. (This won't throw: the callback was wrapped with
      // bindEnvironment.)
      this._callback(this._methodResult[0], this._methodResult[1]); // Forget about this method.


      delete this._connection._methodInvokers[this.methodId]; // Let the connection know that this method is finished, so it can try to
      // move on to the next block of methods.

      this._connection._outstandingMethodFinished();
    }
  } // Call with the result of the method from the server. Only may be called
  // once; once it is called, you should not call sendMessage again.
  // If the user provided an onResultReceived callback, call it immediately.
  // Then invoke the main callback if data is also visible.


  receiveResult(err, result) {
    if (this.gotResult()) throw new Error('Methods should only receive results once');
    this._methodResult = [err, result];

    this._onResultReceived(err, result);

    this._maybeInvokeCallback();
  } // Call this when all data written by the method is visible. This means that
  // the method has returns its "data is done" message *AND* all server
  // documents that are buffered at that time have been written to the local
  // cache. Invokes the main callback if the result has been received.


  dataVisible() {
    this._dataVisible = true;

    this._maybeInvokeCallback();
  } // True if receiveResult has been called.


  gotResult() {
    return !!this._methodResult;
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livedata_connection.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp-client/common/livedata_connection.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends = require("@babel/runtime/helpers/builtin/extends");

module.export({
  Connection: () => Connection
});
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let DDPCommon;
module.watch(require("meteor/ddp-common"), {
  DDPCommon(v) {
    DDPCommon = v;
  }

}, 1);
let Tracker;
module.watch(require("meteor/tracker"), {
  Tracker(v) {
    Tracker = v;
  }

}, 2);
let EJSON;
module.watch(require("meteor/ejson"), {
  EJSON(v) {
    EJSON = v;
  }

}, 3);
let Random;
module.watch(require("meteor/random"), {
  Random(v) {
    Random = v;
  }

}, 4);
let Hook;
module.watch(require("meteor/callback-hook"), {
  Hook(v) {
    Hook = v;
  }

}, 5);
let MongoID;
module.watch(require("meteor/mongo-id"), {
  MongoID(v) {
    MongoID = v;
  }

}, 6);
let DDP;
module.watch(require("./namespace.js"), {
  DDP(v) {
    DDP = v;
  }

}, 7);
let MethodInvoker;
module.watch(require("./MethodInvoker.js"), {
  default(v) {
    MethodInvoker = v;
  }

}, 8);
let hasOwn, slice, keys, isEmpty, last;
module.watch(require("meteor/ddp-common/utils.js"), {
  hasOwn(v) {
    hasOwn = v;
  },

  slice(v) {
    slice = v;
  },

  keys(v) {
    keys = v;
  },

  isEmpty(v) {
    isEmpty = v;
  },

  last(v) {
    last = v;
  }

}, 9);

if (Meteor.isServer) {
  var Fiber = Npm.require('fibers');

  var Future = Npm.require('fibers/future');
}

class MongoIDMap extends IdMap {
  constructor() {
    super(MongoID.idStringify, MongoID.idParse);
  }

} // @param url {String|Object} URL to Meteor app,
//   or an object as a test hook (see code)
// Options:
//   reloadWithOutstanding: is it OK to reload if there are outstanding methods?
//   headers: extra headers to send on the websockets connection, for
//     server-to-server DDP only
//   _sockjsOptions: Specifies options to pass through to the sockjs client
//   onDDPNegotiationVersionFailure: callback when version negotiation fails.
//
// XXX There should be a way to destroy a DDP connection, causing all
// outstanding method calls to fail.
//
// XXX Our current way of handling failure and reconnection is great
// for an app (where we want to tolerate being disconnected as an
// expect state, and keep trying forever to reconnect) but cumbersome
// for something like a command line tool that wants to make a
// connection, call a method, and print an error if connection
// fails. We should have better usability in the latter case (while
// still transparently reconnecting if it's just a transient failure
// or the server migrating us).


class Connection {
  constructor(url, options) {
    var self = this;
    this.options = options = _extends({
      onConnected() {},

      onDDPVersionNegotiationFailure(description) {
        Meteor._debug(description);
      },

      heartbeatInterval: 17500,
      heartbeatTimeout: 15000,
      npmFayeOptions: Object.create(null),
      // These options are only for testing.
      reloadWithOutstanding: false,
      supportedDDPVersions: DDPCommon.SUPPORTED_DDP_VERSIONS,
      retry: true,
      respondToPings: true,
      // When updates are coming within this ms interval, batch them together.
      bufferedWritesInterval: 5,
      // Flush buffers immediately if writes are happening continuously for more than this many ms.
      bufferedWritesMaxAge: 500
    }, options); // If set, called when we reconnect, queuing method calls _before_ the
    // existing outstanding ones.
    // NOTE: This feature has been preserved for backwards compatibility. The
    // preferred method of setting a callback on reconnect is to use
    // DDP.onReconnect.

    self.onReconnect = null; // as a test hook, allow passing a stream instead of a url.

    if (typeof url === 'object') {
      self._stream = url;
    } else {
      const {
        ClientStream
      } = require("meteor/socket-stream-client");

      self._stream = new ClientStream(url, {
        retry: options.retry,
        ConnectionError: DDP.ConnectionError,
        headers: options.headers,
        _sockjsOptions: options._sockjsOptions,
        // Used to keep some tests quiet, or for other cases in which
        // the right thing to do with connection errors is to silently
        // fail (e.g. sending package usage stats). At some point we
        // should have a real API for handling client-stream-level
        // errors.
        _dontPrintErrors: options._dontPrintErrors,
        connectTimeoutMs: options.connectTimeoutMs,
        npmFayeOptions: options.npmFayeOptions
      });
    }

    self._lastSessionId = null;
    self._versionSuggestion = null; // The last proposed DDP version.

    self._version = null; // The DDP version agreed on by client and server.

    self._stores = Object.create(null); // name -> object with methods

    self._methodHandlers = Object.create(null); // name -> func

    self._nextMethodId = 1;
    self._supportedDDPVersions = options.supportedDDPVersions;
    self._heartbeatInterval = options.heartbeatInterval;
    self._heartbeatTimeout = options.heartbeatTimeout; // Tracks methods which the user has tried to call but which have not yet
    // called their user callback (ie, they are waiting on their result or for all
    // of their writes to be written to the local cache). Map from method ID to
    // MethodInvoker object.

    self._methodInvokers = Object.create(null); // Tracks methods which the user has called but whose result messages have not
    // arrived yet.
    //
    // _outstandingMethodBlocks is an array of blocks of methods. Each block
    // represents a set of methods that can run at the same time. The first block
    // represents the methods which are currently in flight; subsequent blocks
    // must wait for previous blocks to be fully finished before they can be sent
    // to the server.
    //
    // Each block is an object with the following fields:
    // - methods: a list of MethodInvoker objects
    // - wait: a boolean; if true, this block had a single method invoked with
    //         the "wait" option
    //
    // There will never be adjacent blocks with wait=false, because the only thing
    // that makes methods need to be serialized is a wait method.
    //
    // Methods are removed from the first block when their "result" is
    // received. The entire first block is only removed when all of the in-flight
    // methods have received their results (so the "methods" list is empty) *AND*
    // all of the data written by those methods are visible in the local cache. So
    // it is possible for the first block's methods list to be empty, if we are
    // still waiting for some objects to quiesce.
    //
    // Example:
    //  _outstandingMethodBlocks = [
    //    {wait: false, methods: []},
    //    {wait: true, methods: [<MethodInvoker for 'login'>]},
    //    {wait: false, methods: [<MethodInvoker for 'foo'>,
    //                            <MethodInvoker for 'bar'>]}]
    // This means that there were some methods which were sent to the server and
    // which have returned their results, but some of the data written by
    // the methods may not be visible in the local cache. Once all that data is
    // visible, we will send a 'login' method. Once the login method has returned
    // and all the data is visible (including re-running subs if userId changes),
    // we will send the 'foo' and 'bar' methods in parallel.

    self._outstandingMethodBlocks = []; // method ID -> array of objects with keys 'collection' and 'id', listing
    // documents written by a given method's stub. keys are associated with
    // methods whose stub wrote at least one document, and whose data-done message
    // has not yet been received.

    self._documentsWrittenByStub = Object.create(null); // collection -> IdMap of "server document" object. A "server document" has:
    // - "document": the version of the document according the
    //   server (ie, the snapshot before a stub wrote it, amended by any changes
    //   received from the server)
    //   It is undefined if we think the document does not exist
    // - "writtenByStubs": a set of method IDs whose stubs wrote to the document
    //   whose "data done" messages have not yet been processed

    self._serverDocuments = Object.create(null); // Array of callbacks to be called after the next update of the local
    // cache. Used for:
    //  - Calling methodInvoker.dataVisible and sub ready callbacks after
    //    the relevant data is flushed.
    //  - Invoking the callbacks of "half-finished" methods after reconnect
    //    quiescence. Specifically, methods whose result was received over the old
    //    connection (so we don't re-send it) but whose data had not been made
    //    visible.

    self._afterUpdateCallbacks = []; // In two contexts, we buffer all incoming data messages and then process them
    // all at once in a single update:
    //   - During reconnect, we buffer all data messages until all subs that had
    //     been ready before reconnect are ready again, and all methods that are
    //     active have returned their "data done message"; then
    //   - During the execution of a "wait" method, we buffer all data messages
    //     until the wait method gets its "data done" message. (If the wait method
    //     occurs during reconnect, it doesn't get any special handling.)
    // all data messages are processed in one update.
    //
    // The following fields are used for this "quiescence" process.
    // This buffers the messages that aren't being processed yet.

    self._messagesBufferedUntilQuiescence = []; // Map from method ID -> true. Methods are removed from this when their
    // "data done" message is received, and we will not quiesce until it is
    // empty.

    self._methodsBlockingQuiescence = Object.create(null); // map from sub ID -> true for subs that were ready (ie, called the sub
    // ready callback) before reconnect but haven't become ready again yet

    self._subsBeingRevived = Object.create(null); // map from sub._id -> true
    // if true, the next data update should reset all stores. (set during
    // reconnect.)

    self._resetStores = false; // name -> array of updates for (yet to be created) collections

    self._updatesForUnknownStores = Object.create(null); // if we're blocking a migration, the retry func

    self._retryMigrate = null;
    self.__flushBufferedWrites = Meteor.bindEnvironment(self._flushBufferedWrites, 'flushing DDP buffered writes', self); // Collection name -> array of messages.

    self._bufferedWrites = Object.create(null); // When current buffer of updates must be flushed at, in ms timestamp.

    self._bufferedWritesFlushAt = null; // Timeout handle for the next processing of all pending writes

    self._bufferedWritesFlushHandle = null;
    self._bufferedWritesInterval = options.bufferedWritesInterval;
    self._bufferedWritesMaxAge = options.bufferedWritesMaxAge; // metadata for subscriptions.  Map from sub ID to object with keys:
    //   - id
    //   - name
    //   - params
    //   - inactive (if true, will be cleaned up if not reused in re-run)
    //   - ready (has the 'ready' message been received?)
    //   - readyCallback (an optional callback to call when ready)
    //   - errorCallback (an optional callback to call if the sub terminates with
    //                    an error, XXX COMPAT WITH 1.0.3.1)
    //   - stopCallback (an optional callback to call when the sub terminates
    //     for any reason, with an error argument if an error triggered the stop)

    self._subscriptions = Object.create(null); // Reactive userId.

    self._userId = null;
    self._userIdDeps = new Tracker.Dependency(); // Block auto-reload while we're waiting for method responses.

    if (Meteor.isClient && Package.reload && !options.reloadWithOutstanding) {
      Package.reload.Reload._onMigrate(retry => {
        if (!self._readyToMigrate()) {
          if (self._retryMigrate) throw new Error('Two migrations in progress?');
          self._retryMigrate = retry;
          return false;
        } else {
          return [true];
        }
      });
    }

    var onDisconnect = () => {
      if (self._heartbeat) {
        self._heartbeat.stop();

        self._heartbeat = null;
      }
    };

    if (Meteor.isServer) {
      self._stream.on('message', Meteor.bindEnvironment(this.onMessage.bind(this), 'handling DDP message'));

      self._stream.on('reset', Meteor.bindEnvironment(this.onReset.bind(this), 'handling DDP reset'));

      self._stream.on('disconnect', Meteor.bindEnvironment(onDisconnect, 'handling DDP disconnect'));
    } else {
      self._stream.on('message', this.onMessage.bind(this));

      self._stream.on('reset', this.onReset.bind(this));

      self._stream.on('disconnect', onDisconnect);
    }
  } // 'name' is the name of the data on the wire that should go in the
  // store. 'wrappedStore' should be an object with methods beginUpdate, update,
  // endUpdate, saveOriginals, retrieveOriginals. see Collection for an example.


  registerStore(name, wrappedStore) {
    var self = this;
    if (name in self._stores) return false; // Wrap the input object in an object which makes any store method not
    // implemented by 'store' into a no-op.

    var store = Object.create(null);
    ['update', 'beginUpdate', 'endUpdate', 'saveOriginals', 'retrieveOriginals', 'getDoc', '_getCollection'].forEach(method => {
      store[method] = (...args) => {
        if (wrappedStore[method]) {
          return wrappedStore[method](...args);
        }
      };
    });
    self._stores[name] = store;
    var queued = self._updatesForUnknownStores[name];

    if (queued) {
      store.beginUpdate(queued.length, false);
      queued.forEach(msg => {
        store.update(msg);
      });
      store.endUpdate();
      delete self._updatesForUnknownStores[name];
    }

    return true;
  }
  /**
   * @memberOf Meteor
   * @importFromPackage meteor
   * @alias Meteor.subscribe
   * @summary Subscribe to a record set.  Returns a handle that provides
   * `stop()` and `ready()` methods.
   * @locus Client
   * @param {String} name Name of the subscription.  Matches the name of the
   * server's `publish()` call.
   * @param {EJSONable} [arg1,arg2...] Optional arguments passed to publisher
   * function on server.
   * @param {Function|Object} [callbacks] Optional. May include `onStop`
   * and `onReady` callbacks. If there is an error, it is passed as an
   * argument to `onStop`. If a function is passed instead of an object, it
   * is interpreted as an `onReady` callback.
   */


  subscribe(name
  /* .. [arguments] .. (callback|callbacks) */
  ) {
    var self = this;
    var params = slice.call(arguments, 1);
    var callbacks = Object.create(null);

    if (params.length) {
      var lastParam = params[params.length - 1];

      if (typeof lastParam === 'function') {
        callbacks.onReady = params.pop();
      } else if (lastParam && [lastParam.onReady, // XXX COMPAT WITH 1.0.3.1 onError used to exist, but now we use
      // onStop with an error callback instead.
      lastParam.onError, lastParam.onStop].some(f => typeof f === "function")) {
        callbacks = params.pop();
      }
    } // Is there an existing sub with the same name and param, run in an
    // invalidated Computation? This will happen if we are rerunning an
    // existing computation.
    //
    // For example, consider a rerun of:
    //
    //     Tracker.autorun(function () {
    //       Meteor.subscribe("foo", Session.get("foo"));
    //       Meteor.subscribe("bar", Session.get("bar"));
    //     });
    //
    // If "foo" has changed but "bar" has not, we will match the "bar"
    // subcribe to an existing inactive subscription in order to not
    // unsub and resub the subscription unnecessarily.
    //
    // We only look for one such sub; if there are N apparently-identical subs
    // being invalidated, we will require N matching subscribe calls to keep
    // them all active.


    var existing;
    keys(self._subscriptions).some(id => {
      const sub = self._subscriptions[id];

      if (sub.inactive && sub.name === name && EJSON.equals(sub.params, params)) {
        return existing = sub;
      }
    });
    var id;

    if (existing) {
      id = existing.id;
      existing.inactive = false; // reactivate

      if (callbacks.onReady) {
        // If the sub is not already ready, replace any ready callback with the
        // one provided now. (It's not really clear what users would expect for
        // an onReady callback inside an autorun; the semantics we provide is
        // that at the time the sub first becomes ready, we call the last
        // onReady callback provided, if any.)
        // If the sub is already ready, run the ready callback right away.
        // It seems that users would expect an onReady callback inside an
        // autorun to trigger once the the sub first becomes ready and also
        // when re-subs happens.
        if (existing.ready) {
          callbacks.onReady();
        } else {
          existing.readyCallback = callbacks.onReady;
        }
      } // XXX COMPAT WITH 1.0.3.1 we used to have onError but now we call
      // onStop with an optional error argument


      if (callbacks.onError) {
        // Replace existing callback if any, so that errors aren't
        // double-reported.
        existing.errorCallback = callbacks.onError;
      }

      if (callbacks.onStop) {
        existing.stopCallback = callbacks.onStop;
      }
    } else {
      // New sub! Generate an id, save it locally, and send message.
      id = Random.id();
      self._subscriptions[id] = {
        id: id,
        name: name,
        params: EJSON.clone(params),
        inactive: false,
        ready: false,
        readyDeps: new Tracker.Dependency(),
        readyCallback: callbacks.onReady,
        // XXX COMPAT WITH 1.0.3.1 #errorCallback
        errorCallback: callbacks.onError,
        stopCallback: callbacks.onStop,
        connection: self,

        remove() {
          delete this.connection._subscriptions[this.id];
          this.ready && this.readyDeps.changed();
        },

        stop() {
          this.connection._send({
            msg: 'unsub',
            id: id
          });

          this.remove();

          if (callbacks.onStop) {
            callbacks.onStop();
          }
        }

      };

      self._send({
        msg: 'sub',
        id: id,
        name: name,
        params: params
      });
    } // return a handle to the application.


    var handle = {
      stop() {
        if (!hasOwn.call(self._subscriptions, id)) {
          return;
        }

        self._subscriptions[id].stop();
      },

      ready() {
        // return false if we've unsubscribed.
        if (!hasOwn.call(self._subscriptions, id)) {
          return false;
        }

        var record = self._subscriptions[id];
        record.readyDeps.depend();
        return record.ready;
      },

      subscriptionId: id
    };

    if (Tracker.active) {
      // We're in a reactive computation, so we'd like to unsubscribe when the
      // computation is invalidated... but not if the rerun just re-subscribes
      // to the same subscription!  When a rerun happens, we use onInvalidate
      // as a change to mark the subscription "inactive" so that it can
      // be reused from the rerun.  If it isn't reused, it's killed from
      // an afterFlush.
      Tracker.onInvalidate(c => {
        if (hasOwn.call(self._subscriptions, id)) {
          self._subscriptions[id].inactive = true;
        }

        Tracker.afterFlush(() => {
          if (hasOwn.call(self._subscriptions, id) && self._subscriptions[id].inactive) {
            handle.stop();
          }
        });
      });
    }

    return handle;
  } // options:
  // - onLateError {Function(error)} called if an error was received after the ready event.
  //     (errors received before ready cause an error to be thrown)


  _subscribeAndWait(name, args, options) {
    var self = this;
    var f = new Future();
    var ready = false;
    var handle;
    args = args || [];
    args.push({
      onReady() {
        ready = true;
        f['return']();
      },

      onError(e) {
        if (!ready) f['throw'](e);else options && options.onLateError && options.onLateError(e);
      }

    });
    handle = self.subscribe.apply(self, [name].concat(args));
    f.wait();
    return handle;
  }

  methods(methods) {
    keys(methods).forEach(name => {
      const func = methods[name];

      if (typeof func !== 'function') {
        throw new Error("Method '" + name + "' must be a function");
      }

      if (this._methodHandlers[name]) {
        throw new Error("A method named '" + name + "' is already defined");
      }

      this._methodHandlers[name] = func;
    });
  }
  /**
   * @memberOf Meteor
   * @importFromPackage meteor
   * @alias Meteor.call
   * @summary Invokes a method passing any number of arguments.
   * @locus Anywhere
   * @param {String} name Name of method to invoke
   * @param {EJSONable} [arg1,arg2...] Optional method arguments
   * @param {Function} [asyncCallback] Optional callback, which is called asynchronously with the error or result after the method is complete. If not provided, the method runs synchronously if possible (see below).
   */


  call(name
  /* .. [arguments] .. callback */
  ) {
    // if it's a function, the last argument is the result callback,
    // not a parameter to the remote method.
    var args = slice.call(arguments, 1);
    if (args.length && typeof args[args.length - 1] === 'function') var callback = args.pop();
    return this.apply(name, args, callback);
  }
  /**
   * @memberOf Meteor
   * @importFromPackage meteor
   * @alias Meteor.apply
   * @summary Invoke a method passing an array of arguments.
   * @locus Anywhere
   * @param {String} name Name of method to invoke
   * @param {EJSONable[]} args Method arguments
   * @param {Object} [options]
   * @param {Boolean} options.wait (Client only) If true, don't send this method until all previous method calls have completed, and don't send any subsequent method calls until this one is completed.
   * @param {Function} options.onResultReceived (Client only) This callback is invoked with the error or result of the method (just like `asyncCallback`) as soon as the error or result is available. The local cache may not yet reflect the writes performed by the method.
   * @param {Boolean} options.noRetry (Client only) if true, don't send this method again on reload, simply call the callback an error with the error code 'invocation-failed'.
   * @param {Boolean} options.throwStubExceptions (Client only) If true, exceptions thrown by method stubs will be thrown instead of logged, and the method will not be invoked on the server.
   * @param {Boolean} options.returnStubValue (Client only) If true then in cases where we would have otherwise discarded the stub's return value and returned undefined, instead we go ahead and return it. Specifically, this is any time other than when (a) we are already inside a stub or (b) we are in Node and no callback was provided. Currently we require this flag to be explicitly passed to reduce the likelihood that stub return values will be confused with server return values; we may improve this in future.
   * @param {Function} [asyncCallback] Optional callback; same semantics as in [`Meteor.call`](#meteor_call).
   */


  apply(name, args, options, callback) {
    var self = this; // We were passed 3 arguments. They may be either (name, args, options)
    // or (name, args, callback)

    if (!callback && typeof options === 'function') {
      callback = options;
      options = Object.create(null);
    }

    options = options || Object.create(null);

    if (callback) {
      // XXX would it be better form to do the binding in stream.on,
      // or caller, instead of here?
      // XXX improve error message (and how we report it)
      callback = Meteor.bindEnvironment(callback, "delivering result of invoking '" + name + "'");
    } // Keep our args safe from mutation (eg if we don't send the message for a
    // while because of a wait method).


    args = EJSON.clone(args);

    var enclosing = DDP._CurrentMethodInvocation.get();

    var alreadyInSimulation = enclosing && enclosing.isSimulation; // Lazily generate a randomSeed, only if it is requested by the stub.
    // The random streams only have utility if they're used on both the client
    // and the server; if the client doesn't generate any 'random' values
    // then we don't expect the server to generate any either.
    // Less commonly, the server may perform different actions from the client,
    // and may in fact generate values where the client did not, but we don't
    // have any client-side values to match, so even here we may as well just
    // use a random seed on the server.  In that case, we don't pass the
    // randomSeed to save bandwidth, and we don't even generate it to save a
    // bit of CPU and to avoid consuming entropy.

    var randomSeed = null;

    var randomSeedGenerator = () => {
      if (randomSeed === null) {
        randomSeed = DDPCommon.makeRpcSeed(enclosing, name);
      }

      return randomSeed;
    }; // Run the stub, if we have one. The stub is supposed to make some
    // temporary writes to the database to give the user a smooth experience
    // until the actual result of executing the method comes back from the
    // server (whereupon the temporary writes to the database will be reversed
    // during the beginUpdate/endUpdate process.)
    //
    // Normally, we ignore the return value of the stub (even if it is an
    // exception), in favor of the real return value from the server. The
    // exception is if the *caller* is a stub. In that case, we're not going
    // to do a RPC, so we use the return value of the stub as our return
    // value.


    var stub = self._methodHandlers[name];

    if (stub) {
      var setUserId = userId => {
        self.setUserId(userId);
      };

      var invocation = new DDPCommon.MethodInvocation({
        isSimulation: true,
        userId: self.userId(),
        setUserId: setUserId,

        randomSeed() {
          return randomSeedGenerator();
        }

      });
      if (!alreadyInSimulation) self._saveOriginals();

      try {
        // Note that unlike in the corresponding server code, we never audit
        // that stubs check() their arguments.
        var stubReturnValue = DDP._CurrentMethodInvocation.withValue(invocation, () => {
          if (Meteor.isServer) {
            // Because saveOriginals and retrieveOriginals aren't reentrant,
            // don't allow stubs to yield.
            return Meteor._noYieldsAllowed(() => {
              // re-clone, so that the stub can't affect our caller's values
              return stub.apply(invocation, EJSON.clone(args));
            });
          } else {
            return stub.apply(invocation, EJSON.clone(args));
          }
        });
      } catch (e) {
        var exception = e;
      }
    } // If we're in a simulation, stop and return the result we have,
    // rather than going on to do an RPC. If there was no stub,
    // we'll end up returning undefined.


    if (alreadyInSimulation) {
      if (callback) {
        callback(exception, stubReturnValue);
        return undefined;
      }

      if (exception) throw exception;
      return stubReturnValue;
    } // We only create the methodId here because we don't actually need one if
    // we're already in a simulation


    const methodId = '' + self._nextMethodId++;

    if (stub) {
      self._retrieveAndStoreOriginals(methodId);
    } // Generate the DDP message for the method call. Note that on the client,
    // it is important that the stub have finished before we send the RPC, so
    // that we know we have a complete list of which local documents the stub
    // wrote.


    var message = {
      msg: 'method',
      method: name,
      params: args,
      id: methodId
    }; // If an exception occurred in a stub, and we're ignoring it
    // because we're doing an RPC and want to use what the server
    // returns instead, log it so the developer knows
    // (unless they explicitly ask to see the error).
    //
    // Tests can set the '_expectedByTest' flag on an exception so it won't
    // go to log.

    if (exception) {
      if (options.throwStubExceptions) {
        throw exception;
      } else if (!exception._expectedByTest) {
        Meteor._debug("Exception while simulating the effect of invoking '" + name + "'", exception, exception.stack);
      }
    } // At this point we're definitely doing an RPC, and we're going to
    // return the value of the RPC to the caller.
    // If the caller didn't give a callback, decide what to do.


    if (!callback) {
      if (Meteor.isClient) {
        // On the client, we don't have fibers, so we can't block. The
        // only thing we can do is to return undefined and discard the
        // result of the RPC. If an error occurred then print the error
        // to the console.
        callback = err => {
          err && Meteor._debug("Error invoking Method '" + name + "':", err, err.stack);
        };
      } else {
        // On the server, make the function synchronous. Throw on
        // errors, return on success.
        var future = new Future();
        callback = future.resolver();
      }
    } // Send the randomSeed only if we used it


    if (randomSeed !== null) {
      message.randomSeed = randomSeed;
    }

    var methodInvoker = new MethodInvoker({
      methodId,
      callback: callback,
      connection: self,
      onResultReceived: options.onResultReceived,
      wait: !!options.wait,
      message: message,
      noRetry: !!options.noRetry
    });

    if (options.wait) {
      // It's a wait method! Wait methods go in their own block.
      self._outstandingMethodBlocks.push({
        wait: true,
        methods: [methodInvoker]
      });
    } else {
      // Not a wait method. Start a new block if the previous block was a wait
      // block, and add it to the last block of methods.
      if (isEmpty(self._outstandingMethodBlocks) || last(self._outstandingMethodBlocks).wait) {
        self._outstandingMethodBlocks.push({
          wait: false,
          methods: []
        });
      }

      last(self._outstandingMethodBlocks).methods.push(methodInvoker);
    } // If we added it to the first block, send it out now.


    if (self._outstandingMethodBlocks.length === 1) methodInvoker.sendMessage(); // If we're using the default callback on the server,
    // block waiting for the result.

    if (future) {
      return future.wait();
    }

    return options.returnStubValue ? stubReturnValue : undefined;
  } // Before calling a method stub, prepare all stores to track changes and allow
  // _retrieveAndStoreOriginals to get the original versions of changed
  // documents.


  _saveOriginals() {
    if (!this._waitingForQuiescence()) {
      this._flushBufferedWrites();
    }

    keys(this._stores).forEach(storeName => {
      this._stores[storeName].saveOriginals();
    });
  } // Retrieves the original versions of all documents modified by the stub for
  // method 'methodId' from all stores and saves them to _serverDocuments (keyed
  // by document) and _documentsWrittenByStub (keyed by method ID).


  _retrieveAndStoreOriginals(methodId) {
    var self = this;
    if (self._documentsWrittenByStub[methodId]) throw new Error('Duplicate methodId in _retrieveAndStoreOriginals');
    var docsWritten = [];
    keys(self._stores).forEach(collection => {
      var originals = self._stores[collection].retrieveOriginals(); // not all stores define retrieveOriginals


      if (!originals) return;
      originals.forEach((doc, id) => {
        docsWritten.push({
          collection,
          id
        });

        if (!hasOwn.call(self._serverDocuments, collection)) {
          self._serverDocuments[collection] = new MongoIDMap();
        }

        var serverDoc = self._serverDocuments[collection].setDefault(id, Object.create(null));

        if (serverDoc.writtenByStubs) {
          // We're not the first stub to write this doc. Just add our method ID
          // to the record.
          serverDoc.writtenByStubs[methodId] = true;
        } else {
          // First stub! Save the original value and our method ID.
          serverDoc.document = doc;
          serverDoc.flushCallbacks = [];
          serverDoc.writtenByStubs = Object.create(null);
          serverDoc.writtenByStubs[methodId] = true;
        }
      });
    });

    if (!isEmpty(docsWritten)) {
      self._documentsWrittenByStub[methodId] = docsWritten;
    }
  } // This is very much a private function we use to make the tests
  // take up fewer server resources after they complete.


  _unsubscribeAll() {
    keys(this._subscriptions).forEach(id => {
      const sub = this._subscriptions[id]; // Avoid killing the autoupdate subscription so that developers
      // still get hot code pushes when writing tests.
      //
      // XXX it's a hack to encode knowledge about autoupdate here,
      // but it doesn't seem worth it yet to have a special API for
      // subscriptions to preserve after unit tests.

      if (sub.name !== 'meteor_autoupdate_clientVersions') {
        sub.stop();
      }
    });
  } // Sends the DDP stringification of the given message object


  _send(obj) {
    this._stream.send(DDPCommon.stringifyDDP(obj));
  } // We detected via DDP-level heartbeats that we've lost the
  // connection.  Unlike `disconnect` or `close`, a lost connection
  // will be automatically retried.


  _lostConnection(error) {
    this._stream._lostConnection(error);
  }
  /**
   * @memberOf Meteor
   * @importFromPackage meteor
   * @alias Meteor.status
   * @summary Get the current connection status. A reactive data source.
   * @locus Client
   */


  status(...args) {
    return this._stream.status(...args);
  }
  /**
   * @summary Force an immediate reconnection attempt if the client is not connected to the server.
   This method does nothing if the client is already connected.
   * @memberOf Meteor
   * @importFromPackage meteor
   * @alias Meteor.reconnect
   * @locus Client
   */


  reconnect(...args) {
    return this._stream.reconnect(...args);
  }
  /**
   * @memberOf Meteor
   * @importFromPackage meteor
   * @alias Meteor.disconnect
   * @summary Disconnect the client from the server.
   * @locus Client
   */


  disconnect(...args) {
    return this._stream.disconnect(...args);
  }

  close() {
    return this._stream.disconnect({
      _permanent: true
    });
  } ///
  /// Reactive user system
  ///


  userId() {
    if (this._userIdDeps) this._userIdDeps.depend();
    return this._userId;
  }

  setUserId(userId) {
    // Avoid invalidating dependents if setUserId is called with current value.
    if (this._userId === userId) return;
    this._userId = userId;
    if (this._userIdDeps) this._userIdDeps.changed();
  } // Returns true if we are in a state after reconnect of waiting for subs to be
  // revived or early methods to finish their data, or we are waiting for a
  // "wait" method to finish.


  _waitingForQuiescence() {
    return !isEmpty(this._subsBeingRevived) || !isEmpty(this._methodsBlockingQuiescence);
  } // Returns true if any method whose message has been sent to the server has
  // not yet invoked its user callback.


  _anyMethodsAreOutstanding() {
    const invokers = this._methodInvokers;
    return keys(invokers).some(id => {
      return invokers[id].sentMessage;
    });
  }

  _livedata_connected(msg) {
    var self = this;

    if (self._version !== 'pre1' && self._heartbeatInterval !== 0) {
      self._heartbeat = new DDPCommon.Heartbeat({
        heartbeatInterval: self._heartbeatInterval,
        heartbeatTimeout: self._heartbeatTimeout,

        onTimeout() {
          self._lostConnection(new DDP.ConnectionError('DDP heartbeat timed out'));
        },

        sendPing() {
          self._send({
            msg: 'ping'
          });
        }

      });

      self._heartbeat.start();
    } // If this is a reconnect, we'll have to reset all stores.


    if (self._lastSessionId) self._resetStores = true;

    if (typeof msg.session === 'string') {
      var reconnectedToPreviousSession = self._lastSessionId === msg.session;
      self._lastSessionId = msg.session;
    }

    if (reconnectedToPreviousSession) {
      // Successful reconnection -- pick up where we left off.  Note that right
      // now, this never happens: the server never connects us to a previous
      // session, because DDP doesn't provide enough data for the server to know
      // what messages the client has processed. We need to improve DDP to make
      // this possible, at which point we'll probably need more code here.
      return;
    } // Server doesn't have our data any more. Re-sync a new session.
    // Forget about messages we were buffering for unknown collections. They'll
    // be resent if still relevant.


    self._updatesForUnknownStores = Object.create(null);

    if (self._resetStores) {
      // Forget about the effects of stubs. We'll be resetting all collections
      // anyway.
      self._documentsWrittenByStub = Object.create(null);
      self._serverDocuments = Object.create(null);
    } // Clear _afterUpdateCallbacks.


    self._afterUpdateCallbacks = []; // Mark all named subscriptions which are ready (ie, we already called the
    // ready callback) as needing to be revived.
    // XXX We should also block reconnect quiescence until unnamed subscriptions
    //     (eg, autopublish) are done re-publishing to avoid flicker!

    self._subsBeingRevived = Object.create(null);
    keys(self._subscriptions).forEach(id => {
      if (self._subscriptions[id].ready) {
        self._subsBeingRevived[id] = true;
      }
    }); // Arrange for "half-finished" methods to have their callbacks run, and
    // track methods that were sent on this connection so that we don't
    // quiesce until they are all done.
    //
    // Start by clearing _methodsBlockingQuiescence: methods sent before
    // reconnect don't matter, and any "wait" methods sent on the new connection
    // that we drop here will be restored by the loop below.

    self._methodsBlockingQuiescence = Object.create(null);

    if (self._resetStores) {
      const invokers = self._methodInvokers;
      keys(invokers).forEach(id => {
        const invoker = invokers[id];

        if (invoker.gotResult()) {
          // This method already got its result, but it didn't call its callback
          // because its data didn't become visible. We did not resend the
          // method RPC. We'll call its callback when we get a full quiesce,
          // since that's as close as we'll get to "data must be visible".
          self._afterUpdateCallbacks.push((...args) => invoker.dataVisible(...args));
        } else if (invoker.sentMessage) {
          // This method has been sent on this connection (maybe as a resend
          // from the last connection, maybe from onReconnect, maybe just very
          // quickly before processing the connected message).
          //
          // We don't need to do anything special to ensure its callbacks get
          // called, but we'll count it as a method which is preventing
          // reconnect quiescence. (eg, it might be a login method that was run
          // from onReconnect, and we don't want to see flicker by seeing a
          // logged-out state.)
          self._methodsBlockingQuiescence[invoker.methodId] = true;
        }
      });
    }

    self._messagesBufferedUntilQuiescence = []; // If we're not waiting on any methods or subs, we can reset the stores and
    // call the callbacks immediately.

    if (!self._waitingForQuiescence()) {
      if (self._resetStores) {
        keys(self._stores).forEach(storeName => {
          const s = self._stores[storeName];
          s.beginUpdate(0, true);
          s.endUpdate();
        });
        self._resetStores = false;
      }

      self._runAfterUpdateCallbacks();
    }
  }

  _processOneDataMessage(msg, updates) {
    const messageType = msg.msg; // msg is one of ['added', 'changed', 'removed', 'ready', 'updated']

    if (messageType === 'added') {
      this._process_added(msg, updates);
    } else if (messageType === 'changed') {
      this._process_changed(msg, updates);
    } else if (messageType === 'removed') {
      this._process_removed(msg, updates);
    } else if (messageType === 'ready') {
      this._process_ready(msg, updates);
    } else if (messageType === 'updated') {
      this._process_updated(msg, updates);
    } else if (messageType === 'nosub') {// ignore this
    } else {
      Meteor._debug('discarding unknown livedata data message type', msg);
    }
  }

  _livedata_data(msg) {
    var self = this;

    if (self._waitingForQuiescence()) {
      self._messagesBufferedUntilQuiescence.push(msg);

      if (msg.msg === 'nosub') {
        delete self._subsBeingRevived[msg.id];
      }

      if (msg.subs) {
        msg.subs.forEach(subId => {
          delete self._subsBeingRevived[subId];
        });
      }

      if (msg.methods) {
        msg.methods.forEach(methodId => {
          delete self._methodsBlockingQuiescence[methodId];
        });
      }

      if (self._waitingForQuiescence()) {
        return;
      } // No methods or subs are blocking quiescence!
      // We'll now process and all of our buffered messages, reset all stores,
      // and apply them all at once.


      const bufferedMessages = self._messagesBufferedUntilQuiescence;
      keys(bufferedMessages).forEach(id => {
        self._processOneDataMessage(bufferedMessages[id], self._bufferedWrites);
      });
      self._messagesBufferedUntilQuiescence = [];
    } else {
      self._processOneDataMessage(msg, self._bufferedWrites);
    } // Immediately flush writes when:
    //  1. Buffering is disabled. Or;
    //  2. any non-(added/changed/removed) message arrives.


    var standardWrite = msg.msg === "added" || msg.msg === "changed" || msg.msg === "removed";

    if (self._bufferedWritesInterval === 0 || !standardWrite) {
      self._flushBufferedWrites();

      return;
    }

    if (self._bufferedWritesFlushAt === null) {
      self._bufferedWritesFlushAt = new Date().valueOf() + self._bufferedWritesMaxAge;
    } else if (self._bufferedWritesFlushAt < new Date().valueOf()) {
      self._flushBufferedWrites();

      return;
    }

    if (self._bufferedWritesFlushHandle) {
      clearTimeout(self._bufferedWritesFlushHandle);
    }

    self._bufferedWritesFlushHandle = setTimeout(self.__flushBufferedWrites, self._bufferedWritesInterval);
  }

  _flushBufferedWrites() {
    var self = this;

    if (self._bufferedWritesFlushHandle) {
      clearTimeout(self._bufferedWritesFlushHandle);
      self._bufferedWritesFlushHandle = null;
    }

    self._bufferedWritesFlushAt = null; // We need to clear the buffer before passing it to
    //  performWrites. As there's no guarantee that it
    //  will exit cleanly.

    var writes = self._bufferedWrites;
    self._bufferedWrites = Object.create(null);

    self._performWrites(writes);
  }

  _performWrites(updates) {
    var self = this;

    if (self._resetStores || !isEmpty(updates)) {
      // Begin a transactional update of each store.
      keys(self._stores).forEach(storeName => {
        self._stores[storeName].beginUpdate(hasOwn.call(updates, storeName) ? updates[storeName].length : 0, self._resetStores);
      });
      self._resetStores = false;
      keys(updates).forEach(storeName => {
        const updateMessages = updates[storeName];
        var store = self._stores[storeName];

        if (store) {
          updateMessages.forEach(updateMessage => {
            store.update(updateMessage);
          });
        } else {
          // Nobody's listening for this data. Queue it up until
          // someone wants it.
          // XXX memory use will grow without bound if you forget to
          // create a collection or just don't care about it... going
          // to have to do something about that.
          const updates = self._updatesForUnknownStores;

          if (!hasOwn.call(updates, storeName)) {
            updates[storeName] = [];
          }

          updates[storeName].push(...updateMessages);
        }
      }); // End update transaction.

      keys(self._stores).forEach(storeName => {
        self._stores[storeName].endUpdate();
      });
    }

    self._runAfterUpdateCallbacks();
  } // Call any callbacks deferred with _runWhenAllServerDocsAreFlushed whose
  // relevant docs have been flushed, as well as dataVisible callbacks at
  // reconnect-quiescence time.


  _runAfterUpdateCallbacks() {
    var self = this;
    var callbacks = self._afterUpdateCallbacks;
    self._afterUpdateCallbacks = [];
    callbacks.forEach(c => {
      c();
    });
  }

  _pushUpdate(updates, collection, msg) {
    if (!hasOwn.call(updates, collection)) {
      updates[collection] = [];
    }

    updates[collection].push(msg);
  }

  _getServerDoc(collection, id) {
    var self = this;

    if (!hasOwn.call(self._serverDocuments, collection)) {
      return null;
    }

    var serverDocsForCollection = self._serverDocuments[collection];
    return serverDocsForCollection.get(id) || null;
  }

  _process_added(msg, updates) {
    var self = this;
    var id = MongoID.idParse(msg.id);

    var serverDoc = self._getServerDoc(msg.collection, id);

    if (serverDoc) {
      // Some outstanding stub wrote here.
      var isExisting = serverDoc.document !== undefined;
      serverDoc.document = msg.fields || Object.create(null);
      serverDoc.document._id = id;

      if (self._resetStores) {
        // During reconnect the server is sending adds for existing ids.
        // Always push an update so that document stays in the store after
        // reset. Use current version of the document for this update, so
        // that stub-written values are preserved.
        var currentDoc = self._stores[msg.collection].getDoc(msg.id);

        if (currentDoc !== undefined) msg.fields = currentDoc;

        self._pushUpdate(updates, msg.collection, msg);
      } else if (isExisting) {
        throw new Error('Server sent add for existing id: ' + msg.id);
      }
    } else {
      self._pushUpdate(updates, msg.collection, msg);
    }
  }

  _process_changed(msg, updates) {
    var self = this;

    var serverDoc = self._getServerDoc(msg.collection, MongoID.idParse(msg.id));

    if (serverDoc) {
      if (serverDoc.document === undefined) throw new Error('Server sent changed for nonexisting id: ' + msg.id);
      DiffSequence.applyChanges(serverDoc.document, msg.fields);
    } else {
      self._pushUpdate(updates, msg.collection, msg);
    }
  }

  _process_removed(msg, updates) {
    var self = this;

    var serverDoc = self._getServerDoc(msg.collection, MongoID.idParse(msg.id));

    if (serverDoc) {
      // Some outstanding stub wrote here.
      if (serverDoc.document === undefined) throw new Error('Server sent removed for nonexisting id:' + msg.id);
      serverDoc.document = undefined;
    } else {
      self._pushUpdate(updates, msg.collection, {
        msg: 'removed',
        collection: msg.collection,
        id: msg.id
      });
    }
  }

  _process_updated(msg, updates) {
    var self = this; // Process "method done" messages.

    msg.methods.forEach(methodId => {
      const docs = self._documentsWrittenByStub[methodId];
      keys(docs).forEach(id => {
        const written = docs[id];

        const serverDoc = self._getServerDoc(written.collection, written.id);

        if (!serverDoc) {
          throw new Error('Lost serverDoc for ' + JSON.stringify(written));
        }

        if (!serverDoc.writtenByStubs[methodId]) {
          throw new Error('Doc ' + JSON.stringify(written) + ' not written by  method ' + methodId);
        }

        delete serverDoc.writtenByStubs[methodId];

        if (isEmpty(serverDoc.writtenByStubs)) {
          // All methods whose stubs wrote this method have completed! We can
          // now copy the saved document to the database (reverting the stub's
          // change if the server did not write to this object, or applying the
          // server's writes if it did).
          // This is a fake ddp 'replace' message.  It's just for talking
          // between livedata connections and minimongo.  (We have to stringify
          // the ID because it's supposed to look like a wire message.)
          self._pushUpdate(updates, written.collection, {
            msg: 'replace',
            id: MongoID.idStringify(written.id),
            replace: serverDoc.document
          }); // Call all flush callbacks.


          serverDoc.flushCallbacks.forEach(c => {
            c();
          }); // Delete this completed serverDocument. Don't bother to GC empty
          // IdMaps inside self._serverDocuments, since there probably aren't
          // many collections and they'll be written repeatedly.

          self._serverDocuments[written.collection].remove(written.id);
        }
      });
      delete self._documentsWrittenByStub[methodId]; // We want to call the data-written callback, but we can't do so until all
      // currently buffered messages are flushed.

      const callbackInvoker = self._methodInvokers[methodId];

      if (!callbackInvoker) {
        throw new Error('No callback invoker for method ' + methodId);
      }

      self._runWhenAllServerDocsAreFlushed((...args) => callbackInvoker.dataVisible(...args));
    });
  }

  _process_ready(msg, updates) {
    var self = this; // Process "sub ready" messages. "sub ready" messages don't take effect
    // until all current server documents have been flushed to the local
    // database. We can use a write fence to implement this.

    msg.subs.forEach(subId => {
      self._runWhenAllServerDocsAreFlushed(() => {
        var subRecord = self._subscriptions[subId]; // Did we already unsubscribe?

        if (!subRecord) return; // Did we already receive a ready message? (Oops!)

        if (subRecord.ready) return;
        subRecord.ready = true;
        subRecord.readyCallback && subRecord.readyCallback();
        subRecord.readyDeps.changed();
      });
    });
  } // Ensures that "f" will be called after all documents currently in
  // _serverDocuments have been written to the local cache. f will not be called
  // if the connection is lost before then!


  _runWhenAllServerDocsAreFlushed(f) {
    var self = this;

    var runFAfterUpdates = () => {
      self._afterUpdateCallbacks.push(f);
    };

    var unflushedServerDocCount = 0;

    var onServerDocFlush = () => {
      --unflushedServerDocCount;

      if (unflushedServerDocCount === 0) {
        // This was the last doc to flush! Arrange to run f after the updates
        // have been applied.
        runFAfterUpdates();
      }
    };

    keys(self._serverDocuments).forEach(collection => {
      self._serverDocuments[collection].forEach(serverDoc => {
        const writtenByStubForAMethodWithSentMessage = keys(serverDoc.writtenByStubs).some(methodId => {
          var invoker = self._methodInvokers[methodId];
          return invoker && invoker.sentMessage;
        });

        if (writtenByStubForAMethodWithSentMessage) {
          ++unflushedServerDocCount;
          serverDoc.flushCallbacks.push(onServerDocFlush);
        }
      });
    });

    if (unflushedServerDocCount === 0) {
      // There aren't any buffered docs --- we can call f as soon as the current
      // round of updates is applied!
      runFAfterUpdates();
    }
  }

  _livedata_nosub(msg) {
    var self = this; // First pass it through _livedata_data, which only uses it to help get
    // towards quiescence.

    self._livedata_data(msg); // Do the rest of our processing immediately, with no
    // buffering-until-quiescence.
    // we weren't subbed anyway, or we initiated the unsub.


    if (!hasOwn.call(self._subscriptions, msg.id)) {
      return;
    } // XXX COMPAT WITH 1.0.3.1 #errorCallback


    var errorCallback = self._subscriptions[msg.id].errorCallback;
    var stopCallback = self._subscriptions[msg.id].stopCallback;

    self._subscriptions[msg.id].remove();

    var meteorErrorFromMsg = msgArg => {
      return msgArg && msgArg.error && new Meteor.Error(msgArg.error.error, msgArg.error.reason, msgArg.error.details);
    }; // XXX COMPAT WITH 1.0.3.1 #errorCallback


    if (errorCallback && msg.error) {
      errorCallback(meteorErrorFromMsg(msg));
    }

    if (stopCallback) {
      stopCallback(meteorErrorFromMsg(msg));
    }
  }

  _livedata_result(msg) {
    // id, result or error. error has error (code), reason, details
    var self = this; // Lets make sure there are no buffered writes before returning result.

    if (!isEmpty(self._bufferedWrites)) {
      self._flushBufferedWrites();
    } // find the outstanding request
    // should be O(1) in nearly all realistic use cases


    if (isEmpty(self._outstandingMethodBlocks)) {
      Meteor._debug('Received method result but no methods outstanding');

      return;
    }

    var currentMethodBlock = self._outstandingMethodBlocks[0].methods;
    var m;

    for (var i = 0; i < currentMethodBlock.length; i++) {
      m = currentMethodBlock[i];
      if (m.methodId === msg.id) break;
    }

    if (!m) {
      Meteor._debug("Can't match method response to original method call", msg);

      return;
    } // Remove from current method block. This may leave the block empty, but we
    // don't move on to the next block until the callback has been delivered, in
    // _outstandingMethodFinished.


    currentMethodBlock.splice(i, 1);

    if (hasOwn.call(msg, 'error')) {
      m.receiveResult(new Meteor.Error(msg.error.error, msg.error.reason, msg.error.details));
    } else {
      // msg.result may be undefined if the method didn't return a
      // value
      m.receiveResult(undefined, msg.result);
    }
  } // Called by MethodInvoker after a method's callback is invoked.  If this was
  // the last outstanding method in the current block, runs the next block. If
  // there are no more methods, consider accepting a hot code push.


  _outstandingMethodFinished() {
    var self = this;
    if (self._anyMethodsAreOutstanding()) return; // No methods are outstanding. This should mean that the first block of
    // methods is empty. (Or it might not exist, if this was a method that
    // half-finished before disconnect/reconnect.)

    if (!isEmpty(self._outstandingMethodBlocks)) {
      var firstBlock = self._outstandingMethodBlocks.shift();

      if (!isEmpty(firstBlock.methods)) throw new Error('No methods outstanding but nonempty block: ' + JSON.stringify(firstBlock)); // Send the outstanding methods now in the first block.

      if (!isEmpty(self._outstandingMethodBlocks)) self._sendOutstandingMethods();
    } // Maybe accept a hot code push.


    self._maybeMigrate();
  } // Sends messages for all the methods in the first block in
  // _outstandingMethodBlocks.


  _sendOutstandingMethods() {
    var self = this;

    if (isEmpty(self._outstandingMethodBlocks)) {
      return;
    }

    self._outstandingMethodBlocks[0].methods.forEach(m => {
      m.sendMessage();
    });
  }

  _livedata_error(msg) {
    Meteor._debug('Received error from server: ', msg.reason);

    if (msg.offendingMessage) Meteor._debug('For: ', msg.offendingMessage);
  }

  _callOnReconnectAndSendAppropriateOutstandingMethods() {
    var self = this;
    var oldOutstandingMethodBlocks = self._outstandingMethodBlocks;
    self._outstandingMethodBlocks = [];
    self.onReconnect && self.onReconnect();

    DDP._reconnectHook.each(callback => {
      callback(self);
      return true;
    });

    if (isEmpty(oldOutstandingMethodBlocks)) return; // We have at least one block worth of old outstanding methods to try
    // again. First: did onReconnect actually send anything? If not, we just
    // restore all outstanding methods and run the first block.

    if (isEmpty(self._outstandingMethodBlocks)) {
      self._outstandingMethodBlocks = oldOutstandingMethodBlocks;

      self._sendOutstandingMethods();

      return;
    } // OK, there are blocks on both sides. Special case: merge the last block of
    // the reconnect methods with the first block of the original methods, if
    // neither of them are "wait" blocks.


    if (!last(self._outstandingMethodBlocks).wait && !oldOutstandingMethodBlocks[0].wait) {
      oldOutstandingMethodBlocks[0].methods.forEach(m => {
        last(self._outstandingMethodBlocks).methods.push(m); // If this "last block" is also the first block, send the message.

        if (self._outstandingMethodBlocks.length === 1) {
          m.sendMessage();
        }
      });
      oldOutstandingMethodBlocks.shift();
    } // Now add the rest of the original blocks on.


    oldOutstandingMethodBlocks.forEach(block => {
      self._outstandingMethodBlocks.push(block);
    });
  } // We can accept a hot code push if there are no methods in flight.


  _readyToMigrate() {
    return isEmpty(this._methodInvokers);
  } // If we were blocking a migration, see if it's now possible to continue.
  // Call whenever the set of outstanding/blocked methods shrinks.


  _maybeMigrate() {
    var self = this;

    if (self._retryMigrate && self._readyToMigrate()) {
      self._retryMigrate();

      self._retryMigrate = null;
    }
  }

  onMessage(raw_msg) {
    try {
      var msg = DDPCommon.parseDDP(raw_msg);
    } catch (e) {
      Meteor._debug('Exception while parsing DDP', e);

      return;
    } // Any message counts as receiving a pong, as it demonstrates that
    // the server is still alive.


    if (this._heartbeat) {
      this._heartbeat.messageReceived();
    }

    if (msg === null || !msg.msg) {
      // XXX COMPAT WITH 0.6.6. ignore the old welcome message for back
      // compat.  Remove this 'if' once the server stops sending welcome
      // messages (stream_server.js).
      if (!(msg && msg.server_id)) Meteor._debug('discarding invalid livedata message', msg);
      return;
    }

    if (msg.msg === 'connected') {
      this._version = this._versionSuggestion;

      this._livedata_connected(msg);

      this.options.onConnected();
    } else if (msg.msg === 'failed') {
      if (this._supportedDDPVersions.indexOf(msg.version) >= 0) {
        this._versionSuggestion = msg.version;

        this._stream.reconnect({
          _force: true
        });
      } else {
        var description = 'DDP version negotiation failed; server requested version ' + msg.version;

        this._stream.disconnect({
          _permanent: true,
          _error: description
        });

        this.options.onDDPVersionNegotiationFailure(description);
      }
    } else if (msg.msg === 'ping' && this.options.respondToPings) {
      this._send({
        msg: 'pong',
        id: msg.id
      });
    } else if (msg.msg === 'pong') {// noop, as we assume everything's a pong
    } else if (['added', 'changed', 'removed', 'ready', 'updated'].includes(msg.msg)) {
      this._livedata_data(msg);
    } else if (msg.msg === 'nosub') {
      this._livedata_nosub(msg);
    } else if (msg.msg === 'result') {
      this._livedata_result(msg);
    } else if (msg.msg === 'error') {
      this._livedata_error(msg);
    } else {
      Meteor._debug('discarding unknown livedata message type', msg);
    }
  }

  onReset() {
    // Send a connect message at the beginning of the stream.
    // NOTE: reset is called even on the first connection, so this is
    // the only place we send this message.
    var msg = {
      msg: 'connect'
    };
    if (this._lastSessionId) msg.session = this._lastSessionId;
    msg.version = this._versionSuggestion || this._supportedDDPVersions[0];
    this._versionSuggestion = msg.version;
    msg.support = this._supportedDDPVersions;

    this._send(msg); // Mark non-retry calls as failed. This has to be done early as getting these methods out of the
    // current block is pretty important to making sure that quiescence is properly calculated, as
    // well as possibly moving on to another useful block.
    // Only bother testing if there is an outstandingMethodBlock (there might not be, especially if
    // we are connecting for the first time.


    if (this._outstandingMethodBlocks.length > 0) {
      // If there is an outstanding method block, we only care about the first one as that is the
      // one that could have already sent messages with no response, that are not allowed to retry.
      const currentMethodBlock = this._outstandingMethodBlocks[0].methods;
      this._outstandingMethodBlocks[0].methods = currentMethodBlock.filter(methodInvoker => {
        // Methods with 'noRetry' option set are not allowed to re-send after
        // recovering dropped connection.
        if (methodInvoker.sentMessage && methodInvoker.noRetry) {
          // Make sure that the method is told that it failed.
          methodInvoker.receiveResult(new Meteor.Error('invocation-failed', 'Method invocation might have failed due to dropped connection. ' + 'Failing because `noRetry` option was passed to Meteor.apply.'));
        } // Only keep a method if it wasn't sent or it's allowed to retry.
        // This may leave the block empty, but we don't move on to the next
        // block until the callback has been delivered, in _outstandingMethodFinished.


        return !(methodInvoker.sentMessage && methodInvoker.noRetry);
      });
    } // Now, to minimize setup latency, go ahead and blast out all of
    // our pending methods ands subscriptions before we've even taken
    // the necessary RTT to know if we successfully reconnected. (1)
    // They're supposed to be idempotent, and where they are not,
    // they can block retry in apply; (2) even if we did reconnect,
    // we're not sure what messages might have gotten lost
    // (in either direction) since we were disconnected (TCP being
    // sloppy about that.)
    // If the current block of methods all got their results (but didn't all get
    // their data visible), discard the empty block now.


    if (this._outstandingMethodBlocks.length > 0 && this._outstandingMethodBlocks[0].methods.length === 0) {
      this._outstandingMethodBlocks.shift();
    } // Mark all messages as unsent, they have not yet been sent on this
    // connection.


    keys(this._methodInvokers).forEach(id => {
      this._methodInvokers[id].sentMessage = false;
    }); // If an `onReconnect` handler is set, call it first. Go through
    // some hoops to ensure that methods that are called from within
    // `onReconnect` get executed _before_ ones that were originally
    // outstanding (since `onReconnect` is used to re-establish auth
    // certificates)

    this._callOnReconnectAndSendAppropriateOutstandingMethods(); // add new subscriptions at the end. this way they take effect after
    // the handlers and we don't see flicker.


    keys(this._subscriptions).forEach(id => {
      const sub = this._subscriptions[id];

      this._send({
        msg: 'sub',
        id: id,
        name: sub.name,
        params: sub.params
      });
    });
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"namespace.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp-client/common/namespace.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  DDP: () => DDP
});
let DDPCommon;
module.watch(require("meteor/ddp-common"), {
  DDPCommon(v) {
    DDPCommon = v;
  }

}, 0);
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let keys;
module.watch(require("meteor/ddp-common/utils.js"), {
  keys(v) {
    keys = v;
  }

}, 2);
let Connection;
module.watch(require("./livedata_connection.js"), {
  Connection(v) {
    Connection = v;
  }

}, 3);
// This array allows the `_allSubscriptionsReady` method below, which
// is used by the `spiderable` package, to keep track of whether all
// data is ready.
const allConnections = [];
/**
 * @namespace DDP
 * @summary Namespace for DDP-related methods/classes.
 */

const DDP = {};
// This is private but it's used in a few places. accounts-base uses
// it to get the current user. Meteor.setTimeout and friends clear
// it. We can probably find a better way to factor this.
DDP._CurrentMethodInvocation = new Meteor.EnvironmentVariable();
DDP._CurrentPublicationInvocation = new Meteor.EnvironmentVariable(); // XXX: Keep DDP._CurrentInvocation for backwards-compatibility.

DDP._CurrentInvocation = DDP._CurrentMethodInvocation; // This is passed into a weird `makeErrorType` function that expects its thing
// to be a constructor

function connectionErrorConstructor(message) {
  this.message = message;
}

DDP.ConnectionError = Meteor.makeErrorType('DDP.ConnectionError', connectionErrorConstructor);
DDP.ForcedReconnectError = Meteor.makeErrorType('DDP.ForcedReconnectError', () => {}); // Returns the named sequence of pseudo-random values.
// The scope will be DDP._CurrentMethodInvocation.get(), so the stream will produce
// consistent values for method calls on the client and server.

DDP.randomStream = name => {
  var scope = DDP._CurrentMethodInvocation.get();

  return DDPCommon.RandomStream.get(scope, name);
}; // @param url {String} URL to Meteor app,
//     e.g.:
//     "subdomain.meteor.com",
//     "http://subdomain.meteor.com",
//     "/",
//     "ddp+sockjs://ddp--****-foo.meteor.com/sockjs"

/**
 * @summary Connect to the server of a different Meteor application to subscribe to its document sets and invoke its remote methods.
 * @locus Anywhere
 * @param {String} url The URL of another Meteor application.
 */


DDP.connect = (url, options) => {
  var ret = new Connection(url, options);
  allConnections.push(ret); // hack. see below.

  return ret;
};

DDP._reconnectHook = new Hook({
  bindEnvironment: false
});
/**
 * @summary Register a function to call as the first step of
 * reconnecting. This function can call methods which will be executed before
 * any other outstanding methods. For example, this can be used to re-establish
 * the appropriate authentication context on the connection.
 * @locus Anywhere
 * @param {Function} callback The function to call. It will be called with a
 * single argument, the [connection object](#ddp_connect) that is reconnecting.
 */

DDP.onReconnect = callback => {
  return DDP._reconnectHook.register(callback);
}; // Hack for `spiderable` package: a way to see if the page is done
// loading all the data it needs.
//


DDP._allSubscriptionsReady = () => {
  return allConnections.every(conn => {
    return keys(conn._subscriptions).every(id => {
      return conn._subscriptions[id].ready;
    });
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("/node_modules/meteor/ddp-client/server/server.js");

/* Exports */
Package._define("ddp-client", exports, {
  DDP: DDP
});

})();

//# sourceURL=meteor://💻app/packages/ddp-client.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZGRwLWNsaWVudC9zZXJ2ZXIvc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kZHAtY2xpZW50L2NvbW1vbi9NZXRob2RJbnZva2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kZHAtY2xpZW50L2NvbW1vbi9saXZlZGF0YV9jb25uZWN0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kZHAtY2xpZW50L2NvbW1vbi9uYW1lc3BhY2UuanMiXSwibmFtZXMiOlsibW9kdWxlIiwid2F0Y2giLCJyZXF1aXJlIiwiRERQIiwidiIsImV4cG9ydHMiLCJleHBvcnQiLCJkZWZhdWx0IiwiTWV0aG9kSW52b2tlciIsImNvbnN0cnVjdG9yIiwib3B0aW9ucyIsIm1ldGhvZElkIiwic2VudE1lc3NhZ2UiLCJfY2FsbGJhY2siLCJjYWxsYmFjayIsIl9jb25uZWN0aW9uIiwiY29ubmVjdGlvbiIsIl9tZXNzYWdlIiwibWVzc2FnZSIsIl9vblJlc3VsdFJlY2VpdmVkIiwib25SZXN1bHRSZWNlaXZlZCIsIl93YWl0Iiwid2FpdCIsIm5vUmV0cnkiLCJfbWV0aG9kUmVzdWx0IiwiX2RhdGFWaXNpYmxlIiwiX21ldGhvZEludm9rZXJzIiwic2VuZE1lc3NhZ2UiLCJnb3RSZXN1bHQiLCJFcnJvciIsIl9tZXRob2RzQmxvY2tpbmdRdWllc2NlbmNlIiwiX3NlbmQiLCJfbWF5YmVJbnZva2VDYWxsYmFjayIsIl9vdXRzdGFuZGluZ01ldGhvZEZpbmlzaGVkIiwicmVjZWl2ZVJlc3VsdCIsImVyciIsInJlc3VsdCIsImRhdGFWaXNpYmxlIiwiQ29ubmVjdGlvbiIsIk1ldGVvciIsIkREUENvbW1vbiIsIlRyYWNrZXIiLCJFSlNPTiIsIlJhbmRvbSIsIkhvb2siLCJNb25nb0lEIiwiaGFzT3duIiwic2xpY2UiLCJrZXlzIiwiaXNFbXB0eSIsImxhc3QiLCJpc1NlcnZlciIsIkZpYmVyIiwiTnBtIiwiRnV0dXJlIiwiTW9uZ29JRE1hcCIsIklkTWFwIiwiaWRTdHJpbmdpZnkiLCJpZFBhcnNlIiwidXJsIiwic2VsZiIsIm9uQ29ubmVjdGVkIiwib25ERFBWZXJzaW9uTmVnb3RpYXRpb25GYWlsdXJlIiwiZGVzY3JpcHRpb24iLCJfZGVidWciLCJoZWFydGJlYXRJbnRlcnZhbCIsImhlYXJ0YmVhdFRpbWVvdXQiLCJucG1GYXllT3B0aW9ucyIsIk9iamVjdCIsImNyZWF0ZSIsInJlbG9hZFdpdGhPdXRzdGFuZGluZyIsInN1cHBvcnRlZEREUFZlcnNpb25zIiwiU1VQUE9SVEVEX0REUF9WRVJTSU9OUyIsInJldHJ5IiwicmVzcG9uZFRvUGluZ3MiLCJidWZmZXJlZFdyaXRlc0ludGVydmFsIiwiYnVmZmVyZWRXcml0ZXNNYXhBZ2UiLCJvblJlY29ubmVjdCIsIl9zdHJlYW0iLCJDbGllbnRTdHJlYW0iLCJDb25uZWN0aW9uRXJyb3IiLCJoZWFkZXJzIiwiX3NvY2tqc09wdGlvbnMiLCJfZG9udFByaW50RXJyb3JzIiwiY29ubmVjdFRpbWVvdXRNcyIsIl9sYXN0U2Vzc2lvbklkIiwiX3ZlcnNpb25TdWdnZXN0aW9uIiwiX3ZlcnNpb24iLCJfc3RvcmVzIiwiX21ldGhvZEhhbmRsZXJzIiwiX25leHRNZXRob2RJZCIsIl9zdXBwb3J0ZWRERFBWZXJzaW9ucyIsIl9oZWFydGJlYXRJbnRlcnZhbCIsIl9oZWFydGJlYXRUaW1lb3V0IiwiX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzIiwiX2RvY3VtZW50c1dyaXR0ZW5CeVN0dWIiLCJfc2VydmVyRG9jdW1lbnRzIiwiX2FmdGVyVXBkYXRlQ2FsbGJhY2tzIiwiX21lc3NhZ2VzQnVmZmVyZWRVbnRpbFF1aWVzY2VuY2UiLCJfc3Vic0JlaW5nUmV2aXZlZCIsIl9yZXNldFN0b3JlcyIsIl91cGRhdGVzRm9yVW5rbm93blN0b3JlcyIsIl9yZXRyeU1pZ3JhdGUiLCJfX2ZsdXNoQnVmZmVyZWRXcml0ZXMiLCJiaW5kRW52aXJvbm1lbnQiLCJfZmx1c2hCdWZmZXJlZFdyaXRlcyIsIl9idWZmZXJlZFdyaXRlcyIsIl9idWZmZXJlZFdyaXRlc0ZsdXNoQXQiLCJfYnVmZmVyZWRXcml0ZXNGbHVzaEhhbmRsZSIsIl9idWZmZXJlZFdyaXRlc0ludGVydmFsIiwiX2J1ZmZlcmVkV3JpdGVzTWF4QWdlIiwiX3N1YnNjcmlwdGlvbnMiLCJfdXNlcklkIiwiX3VzZXJJZERlcHMiLCJEZXBlbmRlbmN5IiwiaXNDbGllbnQiLCJQYWNrYWdlIiwicmVsb2FkIiwiUmVsb2FkIiwiX29uTWlncmF0ZSIsIl9yZWFkeVRvTWlncmF0ZSIsIm9uRGlzY29ubmVjdCIsIl9oZWFydGJlYXQiLCJzdG9wIiwib24iLCJvbk1lc3NhZ2UiLCJiaW5kIiwib25SZXNldCIsInJlZ2lzdGVyU3RvcmUiLCJuYW1lIiwid3JhcHBlZFN0b3JlIiwic3RvcmUiLCJmb3JFYWNoIiwibWV0aG9kIiwiYXJncyIsInF1ZXVlZCIsImJlZ2luVXBkYXRlIiwibGVuZ3RoIiwibXNnIiwidXBkYXRlIiwiZW5kVXBkYXRlIiwic3Vic2NyaWJlIiwicGFyYW1zIiwiY2FsbCIsImFyZ3VtZW50cyIsImNhbGxiYWNrcyIsImxhc3RQYXJhbSIsIm9uUmVhZHkiLCJwb3AiLCJvbkVycm9yIiwib25TdG9wIiwic29tZSIsImYiLCJleGlzdGluZyIsImlkIiwic3ViIiwiaW5hY3RpdmUiLCJlcXVhbHMiLCJyZWFkeSIsInJlYWR5Q2FsbGJhY2siLCJlcnJvckNhbGxiYWNrIiwic3RvcENhbGxiYWNrIiwiY2xvbmUiLCJyZWFkeURlcHMiLCJyZW1vdmUiLCJjaGFuZ2VkIiwiaGFuZGxlIiwicmVjb3JkIiwiZGVwZW5kIiwic3Vic2NyaXB0aW9uSWQiLCJhY3RpdmUiLCJvbkludmFsaWRhdGUiLCJjIiwiYWZ0ZXJGbHVzaCIsIl9zdWJzY3JpYmVBbmRXYWl0IiwicHVzaCIsImUiLCJvbkxhdGVFcnJvciIsImFwcGx5IiwiY29uY2F0IiwibWV0aG9kcyIsImZ1bmMiLCJlbmNsb3NpbmciLCJfQ3VycmVudE1ldGhvZEludm9jYXRpb24iLCJnZXQiLCJhbHJlYWR5SW5TaW11bGF0aW9uIiwiaXNTaW11bGF0aW9uIiwicmFuZG9tU2VlZCIsInJhbmRvbVNlZWRHZW5lcmF0b3IiLCJtYWtlUnBjU2VlZCIsInN0dWIiLCJzZXRVc2VySWQiLCJ1c2VySWQiLCJpbnZvY2F0aW9uIiwiTWV0aG9kSW52b2NhdGlvbiIsIl9zYXZlT3JpZ2luYWxzIiwic3R1YlJldHVyblZhbHVlIiwid2l0aFZhbHVlIiwiX25vWWllbGRzQWxsb3dlZCIsImV4Y2VwdGlvbiIsInVuZGVmaW5lZCIsIl9yZXRyaWV2ZUFuZFN0b3JlT3JpZ2luYWxzIiwidGhyb3dTdHViRXhjZXB0aW9ucyIsIl9leHBlY3RlZEJ5VGVzdCIsInN0YWNrIiwiZnV0dXJlIiwicmVzb2x2ZXIiLCJtZXRob2RJbnZva2VyIiwicmV0dXJuU3R1YlZhbHVlIiwiX3dhaXRpbmdGb3JRdWllc2NlbmNlIiwic3RvcmVOYW1lIiwic2F2ZU9yaWdpbmFscyIsImRvY3NXcml0dGVuIiwiY29sbGVjdGlvbiIsIm9yaWdpbmFscyIsInJldHJpZXZlT3JpZ2luYWxzIiwiZG9jIiwic2VydmVyRG9jIiwic2V0RGVmYXVsdCIsIndyaXR0ZW5CeVN0dWJzIiwiZG9jdW1lbnQiLCJmbHVzaENhbGxiYWNrcyIsIl91bnN1YnNjcmliZUFsbCIsIm9iaiIsInNlbmQiLCJzdHJpbmdpZnlERFAiLCJfbG9zdENvbm5lY3Rpb24iLCJlcnJvciIsInN0YXR1cyIsInJlY29ubmVjdCIsImRpc2Nvbm5lY3QiLCJjbG9zZSIsIl9wZXJtYW5lbnQiLCJfYW55TWV0aG9kc0FyZU91dHN0YW5kaW5nIiwiaW52b2tlcnMiLCJfbGl2ZWRhdGFfY29ubmVjdGVkIiwiSGVhcnRiZWF0Iiwib25UaW1lb3V0Iiwic2VuZFBpbmciLCJzdGFydCIsInNlc3Npb24iLCJyZWNvbm5lY3RlZFRvUHJldmlvdXNTZXNzaW9uIiwiaW52b2tlciIsInMiLCJfcnVuQWZ0ZXJVcGRhdGVDYWxsYmFja3MiLCJfcHJvY2Vzc09uZURhdGFNZXNzYWdlIiwidXBkYXRlcyIsIm1lc3NhZ2VUeXBlIiwiX3Byb2Nlc3NfYWRkZWQiLCJfcHJvY2Vzc19jaGFuZ2VkIiwiX3Byb2Nlc3NfcmVtb3ZlZCIsIl9wcm9jZXNzX3JlYWR5IiwiX3Byb2Nlc3NfdXBkYXRlZCIsIl9saXZlZGF0YV9kYXRhIiwic3VicyIsInN1YklkIiwiYnVmZmVyZWRNZXNzYWdlcyIsInN0YW5kYXJkV3JpdGUiLCJEYXRlIiwidmFsdWVPZiIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJ3cml0ZXMiLCJfcGVyZm9ybVdyaXRlcyIsInVwZGF0ZU1lc3NhZ2VzIiwidXBkYXRlTWVzc2FnZSIsIl9wdXNoVXBkYXRlIiwiX2dldFNlcnZlckRvYyIsInNlcnZlckRvY3NGb3JDb2xsZWN0aW9uIiwiaXNFeGlzdGluZyIsImZpZWxkcyIsIl9pZCIsImN1cnJlbnREb2MiLCJnZXREb2MiLCJEaWZmU2VxdWVuY2UiLCJhcHBseUNoYW5nZXMiLCJkb2NzIiwid3JpdHRlbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZXBsYWNlIiwiY2FsbGJhY2tJbnZva2VyIiwiX3J1bldoZW5BbGxTZXJ2ZXJEb2NzQXJlRmx1c2hlZCIsInN1YlJlY29yZCIsInJ1bkZBZnRlclVwZGF0ZXMiLCJ1bmZsdXNoZWRTZXJ2ZXJEb2NDb3VudCIsIm9uU2VydmVyRG9jRmx1c2giLCJ3cml0dGVuQnlTdHViRm9yQU1ldGhvZFdpdGhTZW50TWVzc2FnZSIsIl9saXZlZGF0YV9ub3N1YiIsIm1ldGVvckVycm9yRnJvbU1zZyIsIm1zZ0FyZyIsInJlYXNvbiIsImRldGFpbHMiLCJfbGl2ZWRhdGFfcmVzdWx0IiwiY3VycmVudE1ldGhvZEJsb2NrIiwibSIsImkiLCJzcGxpY2UiLCJmaXJzdEJsb2NrIiwic2hpZnQiLCJfc2VuZE91dHN0YW5kaW5nTWV0aG9kcyIsIl9tYXliZU1pZ3JhdGUiLCJfbGl2ZWRhdGFfZXJyb3IiLCJvZmZlbmRpbmdNZXNzYWdlIiwiX2NhbGxPblJlY29ubmVjdEFuZFNlbmRBcHByb3ByaWF0ZU91dHN0YW5kaW5nTWV0aG9kcyIsIm9sZE91dHN0YW5kaW5nTWV0aG9kQmxvY2tzIiwiX3JlY29ubmVjdEhvb2siLCJlYWNoIiwiYmxvY2siLCJyYXdfbXNnIiwicGFyc2VERFAiLCJtZXNzYWdlUmVjZWl2ZWQiLCJzZXJ2ZXJfaWQiLCJpbmRleE9mIiwidmVyc2lvbiIsIl9mb3JjZSIsIl9lcnJvciIsImluY2x1ZGVzIiwic3VwcG9ydCIsImZpbHRlciIsImFsbENvbm5lY3Rpb25zIiwiRW52aXJvbm1lbnRWYXJpYWJsZSIsIl9DdXJyZW50UHVibGljYXRpb25JbnZvY2F0aW9uIiwiX0N1cnJlbnRJbnZvY2F0aW9uIiwiY29ubmVjdGlvbkVycm9yQ29uc3RydWN0b3IiLCJtYWtlRXJyb3JUeXBlIiwiRm9yY2VkUmVjb25uZWN0RXJyb3IiLCJyYW5kb21TdHJlYW0iLCJzY29wZSIsIlJhbmRvbVN0cmVhbSIsImNvbm5lY3QiLCJyZXQiLCJyZWdpc3RlciIsIl9hbGxTdWJzY3JpcHRpb25zUmVhZHkiLCJldmVyeSIsImNvbm4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLHdCQUFSLENBQWIsRUFBK0M7QUFBQ0MsTUFBSUMsQ0FBSixFQUFNO0FBQUNDLFlBQVFGLEdBQVIsR0FBWUMsQ0FBWjtBQUFjOztBQUF0QixDQUEvQyxFQUF1RSxDQUF2RSxFOzs7Ozs7Ozs7OztBQ0FBSixPQUFPTSxNQUFQLENBQWM7QUFBQ0MsV0FBUSxNQUFJQztBQUFiLENBQWQ7O0FBS2UsTUFBTUEsYUFBTixDQUFvQjtBQUNqQ0MsY0FBWUMsT0FBWixFQUFxQjtBQUNuQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0JELFFBQVFDLFFBQXhCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixLQUFuQjtBQUVBLFNBQUtDLFNBQUwsR0FBaUJILFFBQVFJLFFBQXpCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQkwsUUFBUU0sVUFBM0I7QUFDQSxTQUFL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QUFtQjBCLFFBQW5CLENBQTRCOVQsUUFBNUIsQ0FBUDtBQUNELENBRkQsQyxDQUlBO0FBQ0E7QUFDQTs7O0FBQ0FYLElBQUkwVSxzQkFBSixHQUE2QixNQUFNO0FBQ2pDLFNBQU9iLGVBQWVjLEtBQWYsQ0FBcUJDLFFBQVE7QUFDbEMsV0FBTy9SLEtBQUsrUixLQUFLaE8sY0FBVixFQUEwQitOLEtBQTFCLENBQWdDcEwsTUFBTTtBQUMzQyxhQUFPcUwsS0FBS2hPLGNBQUwsQ0FBb0IyQyxFQUFwQixFQUF3QkksS0FBL0I7QUFDRCxLQUZNLENBQVA7QUFHRCxHQUpNLENBQVA7QUFLRCxDQU5ELEMiLCJmaWxlIjoiL3BhY2thZ2VzL2RkcC1jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgeyBERFAgfSBmcm9tICcuLi9jb21tb24vbmFtZXNwYWNlLmpzJztcbiIsIi8vIEEgTWV0aG9kSW52b2tlciBtYW5hZ2VzIHNlbmRpbmcgYSBtZXRob2QgdG8gdGhlIHNlcnZlciBhbmQgY2FsbGluZyB0aGUgdXNlcidzXG4vLyBjYWxsYmFja3MuIE9uIGNvbnN0cnVjdGlvbiwgaXQgcmVnaXN0ZXJzIGl0c2VsZiBpbiB0aGUgY29ubmVjdGlvbidzXG4vLyBfbWV0aG9kSW52b2tlcnMgbWFwOyBpdCByZW1vdmVzIGl0c2VsZiBvbmNlIHRoZSBtZXRob2QgaXMgZnVsbHkgZmluaXNoZWQgYW5kXG4vLyB0aGUgY2FsbGJhY2sgaXMgaW52b2tlZC4gVGhpcyBvY2N1cnMgd2hlbiBpdCBoYXMgYm90aCByZWNlaXZlZCBhIHJlc3VsdCxcbi8vIGFuZCB0aGUgZGF0YSB3cml0dGVuIGJ5IGl0IGlzIGZ1bGx5IHZpc2libGUuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXRob2RJbnZva2VyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIC8vIFB1YmxpYyAod2l0aGluIHRoaXMgZmlsZSkgZmllbGRzLlxuICAgIHRoaXMubWV0aG9kSWQgPSBvcHRpb25zLm1ldGhvZElkO1xuICAgIHRoaXMuc2VudE1lc3NhZ2UgPSBmYWxzZTtcblxuICAgIHRoaXMuX2NhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjaztcbiAgICB0aGlzLl9jb25uZWN0aW9uID0gb3B0aW9ucy5jb25uZWN0aW9uO1xuICAgIHRoaXMuX21lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XG4gICAgdGhpcy5fb25SZXN1bHRSZWNlaXZlZCA9IG9wdGlvbnMub25SZXN1bHRSZWNlaXZlZCB8fCAoKCkgPT4ge30pO1xuICAgIHRoaXMuX3dhaXQgPSBvcHRpb25zLndhaXQ7XG4gICAgdGhpcy5ub1JldHJ5ID0gb3B0aW9ucy5ub1JldHJ5O1xuICAgIHRoaXMuX21ldGhvZFJlc3VsdCA9IG51bGw7XG4gICAgdGhpcy5fZGF0YVZpc2libGUgPSBmYWxzZTtcblxuICAgIC8vIFJlZ2lzdGVyIHdpdGggdGhlIGNvbm5lY3Rpb24uXG4gICAgdGhpcy5fY29ubmVjdGlvbi5fbWV0aG9kSW52b2tlcnNbdGhpcy5tZXRob2RJZF0gPSB0aGlzO1xuICB9XG4gIC8vIFNlbmRzIHRoZSBtZXRob2QgbWVzc2FnZSB0byB0aGUgc2VydmVyLiBNYXkgYmUgY2FsbGVkIGFkZGl0aW9uYWwgdGltZXMgaWZcbiAgLy8gd2UgbG9zZSB0aGUgY29ubmVjdGlvbiBhbmQgcmVjb25uZWN0IGJlZm9yZSByZWNlaXZpbmcgYSByZXN1bHQuXG4gIHNlbmRNZXNzYWdlKCkge1xuICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGJlZm9yZSBzZW5kaW5nIGEgbWV0aG9kIChpbmNsdWRpbmcgcmVzZW5kaW5nIG9uXG4gICAgLy8gcmVjb25uZWN0KS4gV2Ugc2hvdWxkIG9ubHkgKHJlKXNlbmQgbWV0aG9kcyB3aGVyZSB3ZSBkb24ndCBhbHJlYWR5IGhhdmUgYVxuICAgIC8vIHJlc3VsdCFcbiAgICBpZiAodGhpcy5nb3RSZXN1bHQoKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignc2VuZGluZ01ldGhvZCBpcyBjYWxsZWQgb24gbWV0aG9kIHdpdGggcmVzdWx0Jyk7XG5cbiAgICAvLyBJZiB3ZSdyZSByZS1zZW5kaW5nIGl0LCBpdCBkb2Vzbid0IG1hdHRlciBpZiBkYXRhIHdhcyB3cml0dGVuIHRoZSBmaXJzdFxuICAgIC8vIHRpbWUuXG4gICAgdGhpcy5fZGF0YVZpc2libGUgPSBmYWxzZTtcbiAgICB0aGlzLnNlbnRNZXNzYWdlID0gdHJ1ZTtcblxuICAgIC8vIElmIHRoaXMgaXMgYSB3YWl0IG1ldGhvZCwgbWFrZSBhbGwgZGF0YSBtZXNzYWdlcyBiZSBidWZmZXJlZCB1bnRpbCBpdCBpc1xuICAgIC8vIGRvbmUuXG4gICAgaWYgKHRoaXMuX3dhaXQpXG4gICAgICB0aGlzLl9jb25uZWN0aW9uLl9tZXRob2RzQmxvY2tpbmdRdWllc2NlbmNlW3RoaXMubWV0aG9kSWRdID0gdHJ1ZTtcblxuICAgIC8vIEFjdHVhbGx5IHNlbmQgdGhlIG1lc3NhZ2UuXG4gICAgdGhpcy5fY29ubmVjdGlvbi5fc2VuZCh0aGlzLl9tZXNzYWdlKTtcbiAgfVxuICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrLCBpZiB3ZSBoYXZlIGJvdGggYSByZXN1bHQgYW5kIGtub3cgdGhhdCBhbGwgZGF0YSBoYXNcbiAgLy8gYmVlbiB3cml0dGVuIHRvIHRoZSBsb2NhbCBjYWNoZS5cbiAgX21heWJlSW52b2tlQ2FsbGJhY2soKSB7XG4gICAgaWYgKHRoaXMuX21ldGhvZFJlc3VsdCAmJiB0aGlzLl9kYXRhVmlzaWJsZSkge1xuICAgICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2suIChUaGlzIHdvbid0IHRocm93OiB0aGUgY2FsbGJhY2sgd2FzIHdyYXBwZWQgd2l0aFxuICAgICAgLy8gYmluZEVudmlyb25tZW50LilcbiAgICAgIHRoaXMuX2NhbGxiYWNrKHRoaXMuX21ldGhvZFJlc3VsdFswXSwgdGhpcy5fbWV0aG9kUmVzdWx0WzFdKTtcblxuICAgICAgLy8gRm9yZ2V0IGFib3V0IHRoaXMgbWV0aG9kLlxuICAgICAgZGVsZXRlIHRoaXMuX2Nvbm5lY3Rpb24uX21ldGhvZEludm9rZXJzW3RoaXMubWV0aG9kSWRdO1xuXG4gICAgICAvLyBMZXQgdGhlIGNvbm5lY3Rpb24ga25vdyB0aGF0IHRoaXMgbWV0aG9kIGlzIGZpbmlzaGVkLCBzbyBpdCBjYW4gdHJ5IHRvXG4gICAgICAvLyBtb3ZlIG9uIHRvIHRoZSBuZXh0IGJsb2NrIG9mIG1ldGhvZHMuXG4gICAgICB0aGlzLl9jb25uZWN0aW9uLl9vdXRzdGFuZGluZ01ldGhvZEZpbmlzaGVkKCk7XG4gICAgfVxuICB9XG4gIC8vIENhbGwgd2l0aCB0aGUgcmVzdWx0IG9mIHRoZSBtZXRob2QgZnJvbSB0aGUgc2VydmVyLiBPbmx5IG1heSBiZSBjYWxsZWRcbiAgLy8gb25jZTsgb25jZSBpdCBpcyBjYWxsZWQsIHlvdSBzaG91bGQgbm90IGNhbGwgc2VuZE1lc3NhZ2UgYWdhaW4uXG4gIC8vIElmIHRoZSB1c2VyIHByb3ZpZGVkIGFuIG9uUmVzdWx0UmVjZWl2ZWQgY2FsbGJhY2ssIGNhbGwgaXQgaW1tZWRpYXRlbHkuXG4gIC8vIFRoZW4gaW52b2tlIHRoZSBtYWluIGNhbGxiYWNrIGlmIGRhdGEgaXMgYWxzbyB2aXNpYmxlLlxuICByZWNlaXZlUmVzdWx0KGVyciwgcmVzdWx0KSB7XG4gICAgaWYgKHRoaXMuZ290UmVzdWx0KCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZHMgc2hvdWxkIG9ubHkgcmVjZWl2ZSByZXN1bHRzIG9uY2UnKTtcbiAgICB0aGlzLl9tZXRob2RSZXN1bHQgPSBbZXJyLCByZXN1bHRdO1xuICAgIHRoaXMuX29uUmVzdWx0UmVjZWl2ZWQoZXJyLCByZXN1bHQpO1xuICAgIHRoaXMuX21heWJlSW52b2tlQ2FsbGJhY2soKTtcbiAgfVxuICAvLyBDYWxsIHRoaXMgd2hlbiBhbGwgZGF0YSB3cml0dGVuIGJ5IHRoZSBtZXRob2QgaXMgdmlzaWJsZS4gVGhpcyBtZWFucyB0aGF0XG4gIC8vIHRoZSBtZXRob2QgaGFzIHJldHVybnMgaXRzIFwiZGF0YSBpcyBkb25lXCIgbWVzc2FnZSAqQU5EKiBhbGwgc2VydmVyXG4gIC8vIGRvY3VtZW50cyB0aGF0IGFyZSBidWZmZXJlZCBhdCB0aGF0IHRpbWUgaGF2ZSBiZWVuIHdyaXR0ZW4gdG8gdGhlIGxvY2FsXG4gIC8vIGNhY2hlLiBJbnZva2VzIHRoZSBtYWluIGNhbGxiYWNrIGlmIHRoZSByZXN1bHQgaGFzIGJlZW4gcmVjZWl2ZWQuXG4gIGRhdGFWaXNpYmxlKCkge1xuICAgIHRoaXMuX2RhdGFWaXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLl9tYXliZUludm9rZUNhbGxiYWNrKCk7XG4gIH1cbiAgLy8gVHJ1ZSBpZiByZWNlaXZlUmVzdWx0IGhhcyBiZWVuIGNhbGxlZC5cbiAgZ290UmVzdWx0KCkge1xuICAgIHJldHVybiAhIXRoaXMuX21ldGhvZFJlc3VsdDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBERFBDb21tb24gfSBmcm9tICdtZXRlb3IvZGRwLWNvbW1vbic7XG5pbXBvcnQgeyBUcmFja2VyIH0gZnJvbSAnbWV0ZW9yL3RyYWNrZXInO1xuaW1wb3J0IHsgRUpTT04gfSBmcm9tICdtZXRlb3IvZWpzb24nO1xuaW1wb3J0IHsgUmFuZG9tIH0gZnJvbSAnbWV0ZW9yL3JhbmRvbSc7XG5pbXBvcnQgeyBIb29rIH0gZnJvbSAnbWV0ZW9yL2NhbGxiYWNrLWhvb2snO1xuaW1wb3J0IHsgTW9uZ29JRCB9IGZyb20gJ21ldGVvci9tb25nby1pZCc7XG5pbXBvcnQgeyBERFAgfSBmcm9tICcuL25hbWVzcGFjZS5qcyc7XG5pbXBvcnQgTWV0aG9kSW52b2tlciBmcm9tICcuL01ldGhvZEludm9rZXIuanMnO1xuaW1wb3J0IHtcbiAgaGFzT3duLFxuICBzbGljZSxcbiAga2V5cyxcbiAgaXNFbXB0eSxcbiAgbGFzdCxcbn0gZnJvbSBcIm1ldGVvci9kZHAtY29tbW9uL3V0aWxzLmpzXCI7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgdmFyIEZpYmVyID0gTnBtLnJlcXVpcmUoJ2ZpYmVycycpO1xuICB2YXIgRnV0dXJlID0gTnBtLnJlcXVpcmUoJ2ZpYmVycy9mdXR1cmUnKTtcbn1cblxuY2xhc3MgTW9uZ29JRE1hcCBleHRlbmRzIElkTWFwIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoTW9uZ29JRC5pZFN0cmluZ2lmeSwgTW9uZ29JRC5pZFBhcnNlKTtcbiAgfVxufVxuXG4vLyBAcGFyYW0gdXJsIHtTdHJpbmd8T2JqZWN0fSBVUkwgdG8gTWV0ZW9yIGFwcCxcbi8vICAgb3IgYW4gb2JqZWN0IGFzIGEgdGVzdCBob29rIChzZWUgY29kZSlcbi8vIE9wdGlvbnM6XG4vLyAgIHJlbG9hZFdpdGhPdXRzdGFuZGluZzogaXMgaXQgT0sgdG8gcmVsb2FkIGlmIHRoZXJlIGFyZSBvdXRzdGFuZGluZyBtZXRob2RzP1xuLy8gICBoZWFkZXJzOiBleHRyYSBoZWFkZXJzIHRvIHNlbmQgb24gdGhlIHdlYnNvY2tldHMgY29ubmVjdGlvbiwgZm9yXG4vLyAgICAgc2VydmVyLXRvLXNlcnZlciBERFAgb25seVxuLy8gICBfc29ja2pzT3B0aW9uczogU3BlY2lmaWVzIG9wdGlvbnMgdG8gcGFzcyB0aHJvdWdoIHRvIHRoZSBzb2NranMgY2xpZW50XG4vLyAgIG9uRERQTmVnb3RpYXRpb25WZXJzaW9uRmFpbHVyZTogY2FsbGJhY2sgd2hlbiB2ZXJzaW9uIG5lZ290aWF0aW9uIGZhaWxzLlxuLy9cbi8vIFhYWCBUaGVyZSBzaG91bGQgYmUgYSB3YXkgdG8gZGVzdHJveSBhIEREUCBjb25uZWN0aW9uLCBjYXVzaW5nIGFsbFxuLy8gb3V0c3RhbmRpbmcgbWV0aG9kIGNhbGxzIHRvIGZhaWwuXG4vL1xuLy8gWFhYIE91ciBjdXJyZW50IHdheSBvZiBoYW5kbGluZyBmYWlsdXJlIGFuZCByZWNvbm5lY3Rpb24gaXMgZ3JlYXRcbi8vIGZvciBhbiBhcHAgKHdoZXJlIHdlIHdhbnQgdG8gdG9sZXJhdGUgYmVpbmcgZGlzY29ubmVjdGVkIGFzIGFuXG4vLyBleHBlY3Qgc3RhdGUsIGFuZCBrZWVwIHRyeWluZyBmb3JldmVyIHRvIHJlY29ubmVjdCkgYnV0IGN1bWJlcnNvbWVcbi8vIGZvciBzb21ldGhpbmcgbGlrZSBhIGNvbW1hbmQgbGluZSB0b29sIHRoYXQgd2FudHMgdG8gbWFrZSBhXG4vLyBjb25uZWN0aW9uLCBjYWxsIGEgbWV0aG9kLCBhbmQgcHJpbnQgYW4gZXJyb3IgaWYgY29ubmVjdGlvblxuLy8gZmFpbHMuIFdlIHNob3VsZCBoYXZlIGJldHRlciB1c2FiaWxpdHkgaW4gdGhlIGxhdHRlciBjYXNlICh3aGlsZVxuLy8gc3RpbGwgdHJhbnNwYXJlbnRseSByZWNvbm5lY3RpbmcgaWYgaXQncyBqdXN0IGEgdHJhbnNpZW50IGZhaWx1cmVcbi8vIG9yIHRoZSBzZXJ2ZXIgbWlncmF0aW5nIHVzKS5cbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uIHtcbiAgY29uc3RydWN0b3IodXJsLCBvcHRpb25zKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyA9IHtcbiAgICAgIG9uQ29ubmVjdGVkKCkge30sXG4gICAgICBvbkREUFZlcnNpb25OZWdvdGlhdGlvbkZhaWx1cmUoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgTWV0ZW9yLl9kZWJ1ZyhkZXNjcmlwdGlvbik7XG4gICAgICB9LFxuICAgICAgaGVhcnRiZWF0SW50ZXJ2YWw6IDE3NTAwLFxuICAgICAgaGVhcnRiZWF0VGltZW91dDogMTUwMDAsXG4gICAgICBucG1GYXllT3B0aW9uczogT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICAgIC8vIFRoZXNlIG9wdGlvbnMgYXJlIG9ubHkgZm9yIHRlc3RpbmcuXG4gICAgICByZWxvYWRXaXRoT3V0c3RhbmRpbmc6IGZhbHNlLFxuICAgICAgc3VwcG9ydGVkRERQVmVyc2lvbnM6IEREUENvbW1vbi5TVVBQT1JURURfRERQX1ZFUlNJT05TLFxuICAgICAgcmV0cnk6IHRydWUsXG4gICAgICByZXNwb25kVG9QaW5nczogdHJ1ZSxcbiAgICAgIC8vIFdoZW4gdXBkYXRlcyBhcmUgY29taW5nIHdpdGhpbiB0aGlzIG1zIGludGVydmFsLCBiYXRjaCB0aGVtIHRvZ2V0aGVyLlxuICAgICAgYnVmZmVyZWRXcml0ZXNJbnRlcnZhbDogNSxcbiAgICAgIC8vIEZsdXNoIGJ1ZmZlcnMgaW1tZWRpYXRlbHkgaWYgd3JpdGVzIGFyZSBoYXBwZW5pbmcgY29udGludW91c2x5IGZvciBtb3JlIHRoYW4gdGhpcyBtYW55IG1zLlxuICAgICAgYnVmZmVyZWRXcml0ZXNNYXhBZ2U6IDUwMCxcblxuICAgICAgLi4ub3B0aW9uc1xuICAgIH07XG5cbiAgICAvLyBJZiBzZXQsIGNhbGxlZCB3aGVuIHdlIHJlY29ubmVjdCwgcXVldWluZyBtZXRob2QgY2FsbHMgX2JlZm9yZV8gdGhlXG4gICAgLy8gZXhpc3Rpbmcgb3V0c3RhbmRpbmcgb25lcy5cbiAgICAvLyBOT1RFOiBUaGlzIGZlYXR1cmUgaGFzIGJlZW4gcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4gVGhlXG4gICAgLy8gcHJlZmVycmVkIG1ldGhvZCBvZiBzZXR0aW5nIGEgY2FsbGJhY2sgb24gcmVjb25uZWN0IGlzIHRvIHVzZVxuICAgIC8vIEREUC5vblJlY29ubmVjdC5cbiAgICBzZWxmLm9uUmVjb25uZWN0ID0gbnVsbDtcblxuICAgIC8vIGFzIGEgdGVzdCBob29rLCBhbGxvdyBwYXNzaW5nIGEgc3RyZWFtIGluc3RlYWQgb2YgYSB1cmwuXG4gICAgaWYgKHR5cGVvZiB1cmwgPT09ICdvYmplY3QnKSB7XG4gICAgICBzZWxmLl9zdHJlYW0gPSB1cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHsgQ2xpZW50U3RyZWFtIH0gPSByZXF1aXJlKFwibWV0ZW9yL3NvY2tldC1zdHJlYW0tY2xpZW50XCIpO1xuICAgICAgc2VsZi5fc3RyZWFtID0gbmV3IENsaWVudFN0cmVhbSh1cmwsIHtcbiAgICAgICAgcmV0cnk6IG9wdGlvbnMucmV0cnksXG4gICAgICAgIENvbm5lY3Rpb25FcnJvcjogRERQLkNvbm5lY3Rpb25FcnJvcixcbiAgICAgICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICBfc29ja2pzT3B0aW9uczogb3B0aW9ucy5fc29ja2pzT3B0aW9ucyxcbiAgICAgICAgLy8gVXNlZCB0byBrZWVwIHNvbWUgdGVzdHMgcXVpZXQsIG9yIGZvciBvdGhlciBjYXNlcyBpbiB3aGljaFxuICAgICAgICAvLyB0aGUgcmlnaHQgdGhpbmcgdG8gZG8gd2l0aCBjb25uZWN0aW9uIGVycm9ycyBpcyB0byBzaWxlbnRseVxuICAgICAgICAvLyBmYWlsIChlLmcuIHNlbmRpbmcgcGFja2FnZSB1c2FnZSBzdGF0cykuIEF0IHNvbWUgcG9pbnQgd2VcbiAgICAgICAgLy8gc2hvdWxkIGhhdmUgYSByZWFsIEFQSSBmb3IgaGFuZGxpbmcgY2xpZW50LXN0cmVhbS1sZXZlbFxuICAgICAgICAvLyBlcnJvcnMuXG4gICAgICAgIF9kb250UHJpbnRFcnJvcnM6IG9wdGlvbnMuX2RvbnRQcmludEVycm9ycyxcbiAgICAgICAgY29ubmVjdFRpbWVvdXRNczogb3B0aW9ucy5jb25uZWN0VGltZW91dE1zLFxuICAgICAgICBucG1GYXllT3B0aW9uczogb3B0aW9ucy5ucG1GYXllT3B0aW9uc1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VsZi5fbGFzdFNlc3Npb25JZCA9IG51bGw7XG4gICAgc2VsZi5fdmVyc2lvblN1Z2dlc3Rpb24gPSBudWxsOyAvLyBUaGUgbGFzdCBwcm9wb3NlZCBERFAgdmVyc2lvbi5cbiAgICBzZWxmLl92ZXJzaW9uID0gbnVsbDsgLy8gVGhlIEREUCB2ZXJzaW9uIGFncmVlZCBvbiBieSBjbGllbnQgYW5kIHNlcnZlci5cbiAgICBzZWxmLl9zdG9yZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpOyAvLyBuYW1lIC0+IG9iamVjdCB3aXRoIG1ldGhvZHNcbiAgICBzZWxmLl9tZXRob2RIYW5kbGVycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7IC8vIG5hbWUgLT4gZnVuY1xuICAgIHNlbGYuX25leHRNZXRob2RJZCA9IDE7XG4gICAgc2VsZi5fc3VwcG9ydGVkRERQVmVyc2lvbnMgPSBvcHRpb25zLnN1cHBvcnRlZEREUFZlcnNpb25zO1xuXG4gICAgc2VsZi5faGVhcnRiZWF0SW50ZXJ2YWwgPSBvcHRpb25zLmhlYXJ0YmVhdEludGVydmFsO1xuICAgIHNlbGYuX2hlYXJ0YmVhdFRpbWVvdXQgPSBvcHRpb25zLmhlYXJ0YmVhdFRpbWVvdXQ7XG5cbiAgICAvLyBUcmFja3MgbWV0aG9kcyB3aGljaCB0aGUgdXNlciBoYXMgdHJpZWQgdG8gY2FsbCBidXQgd2hpY2ggaGF2ZSBub3QgeWV0XG4gICAgLy8gY2FsbGVkIHRoZWlyIHVzZXIgY2FsbGJhY2sgKGllLCB0aGV5IGFyZSB3YWl0aW5nIG9uIHRoZWlyIHJlc3VsdCBvciBmb3IgYWxsXG4gICAgLy8gb2YgdGhlaXIgd3JpdGVzIHRvIGJlIHdyaXR0ZW4gdG8gdGhlIGxvY2FsIGNhY2hlKS4gTWFwIGZyb20gbWV0aG9kIElEIHRvXG4gICAgLy8gTWV0aG9kSW52b2tlciBvYmplY3QuXG4gICAgc2VsZi5fbWV0aG9kSW52b2tlcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgLy8gVHJhY2tzIG1ldGhvZHMgd2hpY2ggdGhlIHVzZXIgaGFzIGNhbGxlZCBidXQgd2hvc2UgcmVzdWx0IG1lc3NhZ2VzIGhhdmUgbm90XG4gICAgLy8gYXJyaXZlZCB5ZXQuXG4gICAgLy9cbiAgICAvLyBfb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MgaXMgYW4gYXJyYXkgb2YgYmxvY2tzIG9mIG1ldGhvZHMuIEVhY2ggYmxvY2tcbiAgICAvLyByZXByZXNlbnRzIGEgc2V0IG9mIG1ldGhvZHMgdGhhdCBjYW4gcnVuIGF0IHRoZSBzYW1lIHRpbWUuIFRoZSBmaXJzdCBibG9ja1xuICAgIC8vIHJlcHJlc2VudHMgdGhlIG1ldGhvZHMgd2hpY2ggYXJlIGN1cnJlbnRseSBpbiBmbGlnaHQ7IHN1YnNlcXVlbnQgYmxvY2tzXG4gICAgLy8gbXVzdCB3YWl0IGZvciBwcmV2aW91cyBibG9ja3MgdG8gYmUgZnVsbHkgZmluaXNoZWQgYmVmb3JlIHRoZXkgY2FuIGJlIHNlbnRcbiAgICAvLyB0byB0aGUgc2VydmVyLlxuICAgIC8vXG4gICAgLy8gRWFjaCBibG9jayBpcyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIGZpZWxkczpcbiAgICAvLyAtIG1ldGhvZHM6IGEgbGlzdCBvZiBNZXRob2RJbnZva2VyIG9iamVjdHNcbiAgICAvLyAtIHdhaXQ6IGEgYm9vbGVhbjsgaWYgdHJ1ZSwgdGhpcyBibG9jayBoYWQgYSBzaW5nbGUgbWV0aG9kIGludm9rZWQgd2l0aFxuICAgIC8vICAgICAgICAgdGhlIFwid2FpdFwiIG9wdGlvblxuICAgIC8vXG4gICAgLy8gVGhlcmUgd2lsbCBuZXZlciBiZSBhZGphY2VudCBibG9ja3Mgd2l0aCB3YWl0PWZhbHNlLCBiZWNhdXNlIHRoZSBvbmx5IHRoaW5nXG4gICAgLy8gdGhhdCBtYWtlcyBtZXRob2RzIG5lZWQgdG8gYmUgc2VyaWFsaXplZCBpcyBhIHdhaXQgbWV0aG9kLlxuICAgIC8vXG4gICAgLy8gTWV0aG9kcyBhcmUgcmVtb3ZlZCBmcm9tIHRoZSBmaXJzdCBibG9jayB3aGVuIHRoZWlyIFwicmVzdWx0XCIgaXNcbiAgICAvLyByZWNlaXZlZC4gVGhlIGVudGlyZSBmaXJzdCBibG9jayBpcyBvbmx5IHJlbW92ZWQgd2hlbiBhbGwgb2YgdGhlIGluLWZsaWdodFxuICAgIC8vIG1ldGhvZHMgaGF2ZSByZWNlaXZlZCB0aGVpciByZXN1bHRzIChzbyB0aGUgXCJtZXRob2RzXCIgbGlzdCBpcyBlbXB0eSkgKkFORCpcbiAgICAvLyBhbGwgb2YgdGhlIGRhdGEgd3JpdHRlbiBieSB0aG9zZSBtZXRob2RzIGFyZSB2aXNpYmxlIGluIHRoZSBsb2NhbCBjYWNoZS4gU29cbiAgICAvLyBpdCBpcyBwb3NzaWJsZSBmb3IgdGhlIGZpcnN0IGJsb2NrJ3MgbWV0aG9kcyBsaXN0IHRvIGJlIGVtcHR5LCBpZiB3ZSBhcmVcbiAgICAvLyBzdGlsbCB3YWl0aW5nIGZvciBzb21lIG9iamVjdHMgdG8gcXVpZXNjZS5cbiAgICAvL1xuICAgIC8vIEV4YW1wbGU6XG4gICAgLy8gIF9vdXRzdGFuZGluZ01ldGhvZEJsb2NrcyA9IFtcbiAgICAvLyAgICB7d2FpdDogZmFsc2UsIG1ldGhvZHM6IFtdfSxcbiAgICAvLyAgICB7d2FpdDogdHJ1ZSwgbWV0aG9kczogWzxNZXRob2RJbnZva2VyIGZvciAnbG9naW4nPl19LFxuICAgIC8vICAgIHt3YWl0OiBmYWxzZSwgbWV0aG9kczogWzxNZXRob2RJbnZva2VyIGZvciAnZm9vJz4sXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1ldGhvZEludm9rZXIgZm9yICdiYXInPl19XVxuICAgIC8vIFRoaXMgbWVhbnMgdGhhdCB0aGVyZSB3ZXJlIHNvbWUgbWV0aG9kcyB3aGljaCB3ZXJlIHNlbnQgdG8gdGhlIHNlcnZlciBhbmRcbiAgICAvLyB3aGljaCBoYXZlIHJldHVybmVkIHRoZWlyIHJlc3VsdHMsIGJ1dCBzb21lIG9mIHRoZSBkYXRhIHdyaXR0ZW4gYnlcbiAgICAvLyB0aGUgbWV0aG9kcyBtYXkgbm90IGJlIHZpc2libGUgaW4gdGhlIGxvY2FsIGNhY2hlLiBPbmNlIGFsbCB0aGF0IGRhdGEgaXNcbiAgICAvLyB2aXNpYmxlLCB3ZSB3aWxsIHNlbmQgYSAnbG9naW4nIG1ldGhvZC4gT25jZSB0aGUgbG9naW4gbWV0aG9kIGhhcyByZXR1cm5lZFxuICAgIC8vIGFuZCBhbGwgdGhlIGRhdGEgaXMgdmlzaWJsZSAoaW5jbHVkaW5nIHJlLXJ1bm5pbmcgc3VicyBpZiB1c2VySWQgY2hhbmdlcyksXG4gICAgLy8gd2Ugd2lsbCBzZW5kIHRoZSAnZm9vJyBhbmQgJ2JhcicgbWV0aG9kcyBpbiBwYXJhbGxlbC5cbiAgICBzZWxmLl9vdXRzdGFuZGluZ01ldGhvZEJsb2NrcyA9IFtdO1xuXG4gICAgLy8gbWV0aG9kIElEIC0+IGFycmF5IG9mIG9iamVjdHMgd2l0aCBrZXlzICdjb2xsZWN0aW9uJyBhbmQgJ2lkJywgbGlzdGluZ1xuICAgIC8vIGRvY3VtZW50cyB3cml0dGVuIGJ5IGEgZ2l2ZW4gbWV0aG9kJ3Mgc3R1Yi4ga2V5cyBhcmUgYXNzb2NpYXRlZCB3aXRoXG4gICAgLy8gbWV0aG9kcyB3aG9zZSBzdHViIHdyb3RlIGF0IGxlYXN0IG9uZSBkb2N1bWVudCwgYW5kIHdob3NlIGRhdGEtZG9uZSBtZXNzYWdlXG4gICAgLy8gaGFzIG5vdCB5ZXQgYmVlbiByZWNlaXZlZC5cbiAgICBzZWxmLl9kb2N1bWVudHNXcml0dGVuQnlTdHViID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAvLyBjb2xsZWN0aW9uIC0+IElkTWFwIG9mIFwic2VydmVyIGRvY3VtZW50XCIgb2JqZWN0LiBBIFwic2VydmVyIGRvY3VtZW50XCIgaGFzOlxuICAgIC8vIC0gXCJkb2N1bWVudFwiOiB0aGUgdmVyc2lvbiBvZiB0aGUgZG9jdW1lbnQgYWNjb3JkaW5nIHRoZVxuICAgIC8vICAgc2VydmVyIChpZSwgdGhlIHNuYXBzaG90IGJlZm9yZSBhIHN0dWIgd3JvdGUgaXQsIGFtZW5kZWQgYnkgYW55IGNoYW5nZXNcbiAgICAvLyAgIHJlY2VpdmVkIGZyb20gdGhlIHNlcnZlcilcbiAgICAvLyAgIEl0IGlzIHVuZGVmaW5lZCBpZiB3ZSB0aGluayB0aGUgZG9jdW1lbnQgZG9lcyBub3QgZXhpc3RcbiAgICAvLyAtIFwid3JpdHRlbkJ5U3R1YnNcIjogYSBzZXQgb2YgbWV0aG9kIElEcyB3aG9zZSBzdHVicyB3cm90ZSB0byB0aGUgZG9jdW1lbnRcbiAgICAvLyAgIHdob3NlIFwiZGF0YSBkb25lXCIgbWVzc2FnZXMgaGF2ZSBub3QgeWV0IGJlZW4gcHJvY2Vzc2VkXG4gICAgc2VsZi5fc2VydmVyRG9jdW1lbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIC8vIEFycmF5IG9mIGNhbGxiYWNrcyB0byBiZSBjYWxsZWQgYWZ0ZXIgdGhlIG5leHQgdXBkYXRlIG9mIHRoZSBsb2NhbFxuICAgIC8vIGNhY2hlLiBVc2VkIGZvcjpcbiAgICAvLyAgLSBDYWxsaW5nIG1ldGhvZEludm9rZXIuZGF0YVZpc2libGUgYW5kIHN1YiByZWFkeSBjYWxsYmFja3MgYWZ0ZXJcbiAgICAvLyAgICB0aGUgcmVsZXZhbnQgZGF0YSBpcyBmbHVzaGVkLlxuICAgIC8vICAtIEludm9raW5nIHRoZSBjYWxsYmFja3Mgb2YgXCJoYWxmLWZpbmlzaGVkXCIgbWV0aG9kcyBhZnRlciByZWNvbm5lY3RcbiAgICAvLyAgICBxdWllc2NlbmNlLiBTcGVjaWZpY2FsbHksIG1ldGhvZHMgd2hvc2UgcmVzdWx0IHdhcyByZWNlaXZlZCBvdmVyIHRoZSBvbGRcbiAgICAvLyAgICBjb25uZWN0aW9uIChzbyB3ZSBkb24ndCByZS1zZW5kIGl0KSBidXQgd2hvc2UgZGF0YSBoYWQgbm90IGJlZW4gbWFkZVxuICAgIC8vICAgIHZpc2libGUuXG4gICAgc2VsZi5fYWZ0ZXJVcGRhdGVDYWxsYmFja3MgPSBbXTtcblxuICAgIC8vIEluIHR3byBjb250ZXh0cywgd2UgYnVmZmVyIGFsbCBpbmNvbWluZyBkYXRhIG1lc3NhZ2VzIGFuZCB0aGVuIHByb2Nlc3MgdGhlbVxuICAgIC8vIGFsbCBhdCBvbmNlIGluIGEgc2luZ2xlIHVwZGF0ZTpcbiAgICAvLyAgIC0gRHVyaW5nIHJlY29ubmVjdCwgd2UgYnVmZmVyIGFsbCBkYXRhIG1lc3NhZ2VzIHVudGlsIGFsbCBzdWJzIHRoYXQgaGFkXG4gICAgLy8gICAgIGJlZW4gcmVhZHkgYmVmb3JlIHJlY29ubmVjdCBhcmUgcmVhZHkgYWdhaW4sIGFuZCBhbGwgbWV0aG9kcyB0aGF0IGFyZVxuICAgIC8vICAgICBhY3RpdmUgaGF2ZSByZXR1cm5lZCB0aGVpciBcImRhdGEgZG9uZSBtZXNzYWdlXCI7IHRoZW5cbiAgICAvLyAgIC0gRHVyaW5nIHRoZSBleGVjdXRpb24gb2YgYSBcIndhaXRcIiBtZXRob2QsIHdlIGJ1ZmZlciBhbGwgZGF0YSBtZXNzYWdlc1xuICAgIC8vICAgICB1bnRpbCB0aGUgd2FpdCBtZXRob2QgZ2V0cyBpdHMgXCJkYXRhIGRvbmVcIiBtZXNzYWdlLiAoSWYgdGhlIHdhaXQgbWV0aG9kXG4gICAgLy8gICAgIG9jY3VycyBkdXJpbmcgcmVjb25uZWN0LCBpdCBkb2Vzbid0IGdldCBhbnkgc3BlY2lhbCBoYW5kbGluZy4pXG4gICAgLy8gYWxsIGRhdGEgbWVzc2FnZXMgYXJlIHByb2Nlc3NlZCBpbiBvbmUgdXBkYXRlLlxuICAgIC8vXG4gICAgLy8gVGhlIGZvbGxvd2luZyBmaWVsZHMgYXJlIHVzZWQgZm9yIHRoaXMgXCJxdWllc2NlbmNlXCIgcHJvY2Vzcy5cblxuICAgIC8vIFRoaXMgYnVmZmVycyB0aGUgbWVzc2FnZXMgdGhhdCBhcmVuJ3QgYmVpbmcgcHJvY2Vzc2VkIHlldC5cbiAgICBzZWxmLl9tZXNzYWdlc0J1ZmZlcmVkVW50aWxRdWllc2NlbmNlID0gW107XG4gICAgLy8gTWFwIGZyb20gbWV0aG9kIElEIC0+IHRydWUuIE1ldGhvZHMgYXJlIHJlbW92ZWQgZnJvbSB0aGlzIHdoZW4gdGhlaXJcbiAgICAvLyBcImRhdGEgZG9uZVwiIG1lc3NhZ2UgaXMgcmVjZWl2ZWQsIGFuZCB3ZSB3aWxsIG5vdCBxdWllc2NlIHVudGlsIGl0IGlzXG4gICAgLy8gZW1wdHkuXG4gICAgc2VsZi5fbWV0aG9kc0Jsb2NraW5nUXVpZXNjZW5jZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgLy8gbWFwIGZyb20gc3ViIElEIC0+IHRydWUgZm9yIHN1YnMgdGhhdCB3ZXJlIHJlYWR5IChpZSwgY2FsbGVkIHRoZSBzdWJcbiAgICAvLyByZWFkeSBjYWxsYmFjaykgYmVmb3JlIHJlY29ubmVjdCBidXQgaGF2ZW4ndCBiZWNvbWUgcmVhZHkgYWdhaW4geWV0XG4gICAgc2VsZi5fc3Vic0JlaW5nUmV2aXZlZCA9IE9iamVjdC5jcmVhdGUobnVsbCk7IC8vIG1hcCBmcm9tIHN1Yi5faWQgLT4gdHJ1ZVxuICAgIC8vIGlmIHRydWUsIHRoZSBuZXh0IGRhdGEgdXBkYXRlIHNob3VsZCByZXNldCBhbGwgc3RvcmVzLiAoc2V0IGR1cmluZ1xuICAgIC8vIHJlY29ubmVjdC4pXG4gICAgc2VsZi5fcmVzZXRTdG9yZXMgPSBmYWxzZTtcblxuICAgIC8vIG5hbWUgLT4gYXJyYXkgb2YgdXBkYXRlcyBmb3IgKHlldCB0byBiZSBjcmVhdGVkKSBjb2xsZWN0aW9uc1xuICAgIHNlbGYuX3VwZGF0ZXNGb3JVbmtub3duU3RvcmVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAvLyBpZiB3ZSdyZSBibG9ja2luZyBhIG1pZ3JhdGlvbiwgdGhlIHJldHJ5IGZ1bmNcbiAgICBzZWxmLl9yZXRyeU1pZ3JhdGUgPSBudWxsO1xuXG4gICAgc2VsZi5fX2ZsdXNoQnVmZmVyZWRXcml0ZXMgPSBNZXRlb3IuYmluZEVudmlyb25tZW50KFxuICAgICAgc2VsZi5fZmx1c2hCdWZmZXJlZFdyaXRlcyxcbiAgICAgICdmbHVzaGluZyBERFAgYnVmZmVyZWQgd3JpdGVzJyxcbiAgICAgIHNlbGZcbiAgICApO1xuICAgIC8vIENvbGxlY3Rpb24gbmFtZSAtPiBhcnJheSBvZiBtZXNzYWdlcy5cbiAgICBzZWxmLl9idWZmZXJlZFdyaXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgLy8gV2hlbiBjdXJyZW50IGJ1ZmZlciBvZiB1cGRhdGVzIG11c3QgYmUgZmx1c2hlZCBhdCwgaW4gbXMgdGltZXN0YW1wLlxuICAgIHNlbGYuX2J1ZmZlcmVkV3JpdGVzRmx1c2hBdCA9IG51bGw7XG4gICAgLy8gVGltZW91dCBoYW5kbGUgZm9yIHRoZSBuZXh0IHByb2Nlc3Npbmcgb2YgYWxsIHBlbmRpbmcgd3JpdGVzXG4gICAgc2VsZi5fYnVmZmVyZWRXcml0ZXNGbHVzaEhhbmRsZSA9IG51bGw7XG5cbiAgICBzZWxmLl9idWZmZXJlZFdyaXRlc0ludGVydmFsID0gb3B0aW9ucy5idWZmZXJlZFdyaXRlc0ludGVydmFsO1xuICAgIHNlbGYuX2J1ZmZlcmVkV3JpdGVzTWF4QWdlID0gb3B0aW9ucy5idWZmZXJlZFdyaXRlc01heEFnZTtcblxuICAgIC8vIG1ldGFkYXRhIGZvciBzdWJzY3JpcHRpb25zLiAgTWFwIGZyb20gc3ViIElEIHRvIG9iamVjdCB3aXRoIGtleXM6XG4gICAgLy8gICAtIGlkXG4gICAgLy8gICAtIG5hbWVcbiAgICAvLyAgIC0gcGFyYW1zXG4gICAgLy8gICAtIGluYWN0aXZlIChpZiB0cnVlLCB3aWxsIGJlIGNsZWFuZWQgdXAgaWYgbm90IHJldXNlZCBpbiByZS1ydW4pXG4gICAgLy8gICAtIHJlYWR5IChoYXMgdGhlICdyZWFkeScgbWVzc2FnZSBiZWVuIHJlY2VpdmVkPylcbiAgICAvLyAgIC0gcmVhZHlDYWxsYmFjayAoYW4gb3B0aW9uYWwgY2FsbGJhY2sgdG8gY2FsbCB3aGVuIHJlYWR5KVxuICAgIC8vICAgLSBlcnJvckNhbGxiYWNrIChhbiBvcHRpb25hbCBjYWxsYmFjayB0byBjYWxsIGlmIHRoZSBzdWIgdGVybWluYXRlcyB3aXRoXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIGFuIGVycm9yLCBYWFggQ09NUEFUIFdJVEggMS4wLjMuMSlcbiAgICAvLyAgIC0gc3RvcENhbGxiYWNrIChhbiBvcHRpb25hbCBjYWxsYmFjayB0byBjYWxsIHdoZW4gdGhlIHN1YiB0ZXJtaW5hdGVzXG4gICAgLy8gICAgIGZvciBhbnkgcmVhc29uLCB3aXRoIGFuIGVycm9yIGFyZ3VtZW50IGlmIGFuIGVycm9yIHRyaWdnZXJlZCB0aGUgc3RvcClcbiAgICBzZWxmLl9zdWJzY3JpcHRpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIC8vIFJlYWN0aXZlIHVzZXJJZC5cbiAgICBzZWxmLl91c2VySWQgPSBudWxsO1xuICAgIHNlbGYuX3VzZXJJZERlcHMgPSBuZXcgVHJhY2tlci5EZXBlbmRlbmN5KCk7XG5cbiAgICAvLyBCbG9jayBhdXRvLXJlbG9hZCB3aGlsZSB3ZSdyZSB3YWl0aW5nIGZvciBtZXRob2QgcmVzcG9uc2VzLlxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiZcbiAgICAgICAgUGFja2FnZS5yZWxvYWQgJiZcbiAgICAgICAgISBvcHRpb25zLnJlbG9hZFdpdGhPdXRzdGFuZGluZykge1xuICAgICAgUGFja2FnZS5yZWxvYWQuUmVsb2FkLl9vbk1pZ3JhdGUocmV0cnkgPT4ge1xuICAgICAgICBpZiAoISBzZWxmLl9yZWFkeVRvTWlncmF0ZSgpKSB7XG4gICAgICAgICAgaWYgKHNlbGYuX3JldHJ5TWlncmF0ZSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHdvIG1pZ3JhdGlvbnMgaW4gcHJvZ3Jlc3M/Jyk7XG4gICAgICAgICAgc2VsZi5fcmV0cnlNaWdyYXRlID0gcmV0cnk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBbdHJ1ZV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBvbkRpc2Nvbm5lY3QgPSAoKSA9PiB7XG4gICAgICBpZiAoc2VsZi5faGVhcnRiZWF0KSB7XG4gICAgICAgIHNlbGYuX2hlYXJ0YmVhdC5zdG9wKCk7XG4gICAgICAgIHNlbGYuX2hlYXJ0YmVhdCA9IG51bGw7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHNlbGYuX3N0cmVhbS5vbihcbiAgICAgICAgJ21lc3NhZ2UnLFxuICAgICAgICBNZXRlb3IuYmluZEVudmlyb25tZW50KFxuICAgICAgICAgIHRoaXMub25NZXNzYWdlLmJpbmQodGhpcyksXG4gICAgICAgICAgJ2hhbmRsaW5nIEREUCBtZXNzYWdlJ1xuICAgICAgICApXG4gICAgICApO1xuICAgICAgc2VsZi5fc3RyZWFtLm9uKFxuICAgICAgICAncmVzZXQnLFxuICAgICAgICBNZXRlb3IuYmluZEVudmlyb25tZW50KHRoaXMub25SZXNldC5iaW5kKHRoaXMpLCAnaGFuZGxpbmcgRERQIHJlc2V0JylcbiAgICAgICk7XG4gICAgICBzZWxmLl9zdHJlYW0ub24oXG4gICAgICAgICdkaXNjb25uZWN0JyxcbiAgICAgICAgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChvbkRpc2Nvbm5lY3QsICdoYW5kbGluZyBERFAgZGlzY29ubmVjdCcpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLl9zdHJlYW0ub24oJ21lc3NhZ2UnLCB0aGlzLm9uTWVzc2FnZS5iaW5kKHRoaXMpKTtcbiAgICAgIHNlbGYuX3N0cmVhbS5vbigncmVzZXQnLCB0aGlzLm9uUmVzZXQuYmluZCh0aGlzKSk7XG4gICAgICBzZWxmLl9zdHJlYW0ub24oJ2Rpc2Nvbm5lY3QnLCBvbkRpc2Nvbm5lY3QpO1xuICAgIH1cbiAgfVxuXG4gIC8vICduYW1lJyBpcyB0aGUgbmFtZSBvZiB0aGUgZGF0YSBvbiB0aGUgd2lyZSB0aGF0IHNob3VsZCBnbyBpbiB0aGVcbiAgLy8gc3RvcmUuICd3cmFwcGVkU3RvcmUnIHNob3VsZCBiZSBhbiBvYmplY3Qgd2l0aCBtZXRob2RzIGJlZ2luVXBkYXRlLCB1cGRhdGUsXG4gIC8vIGVuZFVwZGF0ZSwgc2F2ZU9yaWdpbmFscywgcmV0cmlldmVPcmlnaW5hbHMuIHNlZSBDb2xsZWN0aW9uIGZvciBhbiBleGFtcGxlLlxuICByZWdpc3RlclN0b3JlKG5hbWUsIHdyYXBwZWRTdG9yZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmIChuYW1lIGluIHNlbGYuX3N0b3JlcykgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gV3JhcCB0aGUgaW5wdXQgb2JqZWN0IGluIGFuIG9iamVjdCB3aGljaCBtYWtlcyBhbnkgc3RvcmUgbWV0aG9kIG5vdFxuICAgIC8vIGltcGxlbWVudGVkIGJ5ICdzdG9yZScgaW50byBhIG5vLW9wLlxuICAgIHZhciBzdG9yZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgWyAndXBkYXRlJyxcbiAgICAgICdiZWdpblVwZGF0ZScsXG4gICAgICAnZW5kVXBkYXRlJyxcbiAgICAgICdzYXZlT3JpZ2luYWxzJyxcbiAgICAgICdyZXRyaWV2ZU9yaWdpbmFscycsXG4gICAgICAnZ2V0RG9jJyxcbiAgICAgICdfZ2V0Q29sbGVjdGlvbidcbiAgICBdLmZvckVhY2gobWV0aG9kID0+IHtcbiAgICAgIHN0b3JlW21ldGhvZF0gPSAoLi4uYXJncykgPT4ge1xuICAgICAgICBpZiAod3JhcHBlZFN0b3JlW21ldGhvZF0pIHtcbiAgICAgICAgICByZXR1cm4gd3JhcHBlZFN0b3JlW21ldGhvZF0oLi4uYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICBzZWxmLl9zdG9yZXNbbmFtZV0gPSBzdG9yZTtcblxuICAgIHZhciBxdWV1ZWQgPSBzZWxmLl91cGRhdGVzRm9yVW5rbm93blN0b3Jlc1tuYW1lXTtcbiAgICBpZiAocXVldWVkKSB7XG4gICAgICBzdG9yZS5iZWdpblVwZGF0ZShxdWV1ZWQubGVuZ3RoLCBmYWxzZSk7XG4gICAgICBxdWV1ZWQuZm9yRWFjaChtc2cgPT4ge1xuICAgICAgICBzdG9yZS51cGRhdGUobXNnKTtcbiAgICAgIH0pO1xuICAgICAgc3RvcmUuZW5kVXBkYXRlKCk7XG4gICAgICBkZWxldGUgc2VsZi5fdXBkYXRlc0ZvclVua25vd25TdG9yZXNbbmFtZV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQG1lbWJlck9mIE1ldGVvclxuICAgKiBAaW1wb3J0RnJvbVBhY2thZ2UgbWV0ZW9yXG4gICAqIEBhbGlhcyBNZXRlb3Iuc3Vic2NyaWJlXG4gICAqIEBzdW1tYXJ5IFN1YnNjcmliZSB0byBhIHJlY29yZCBzZXQuICBSZXR1cm5zIGEgaGFuZGxlIHRoYXQgcHJvdmlkZXNcbiAgICogYHN0b3AoKWAgYW5kIGByZWFkeSgpYCBtZXRob2RzLlxuICAgKiBAbG9jdXMgQ2xpZW50XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHN1YnNjcmlwdGlvbi4gIE1hdGNoZXMgdGhlIG5hbWUgb2YgdGhlXG4gICAqIHNlcnZlcidzIGBwdWJsaXNoKClgIGNhbGwuXG4gICAqIEBwYXJhbSB7RUpTT05hYmxlfSBbYXJnMSxhcmcyLi4uXSBPcHRpb25hbCBhcmd1bWVudHMgcGFzc2VkIHRvIHB1Ymxpc2hlclxuICAgKiBmdW5jdGlvbiBvbiBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fSBbY2FsbGJhY2tzXSBPcHRpb25hbC4gTWF5IGluY2x1ZGUgYG9uU3RvcGBcbiAgICogYW5kIGBvblJlYWR5YCBjYWxsYmFja3MuIElmIHRoZXJlIGlzIGFuIGVycm9yLCBpdCBpcyBwYXNzZWQgYXMgYW5cbiAgICogYXJndW1lbnQgdG8gYG9uU3RvcGAuIElmIGEgZnVuY3Rpb24gaXMgcGFzc2VkIGluc3RlYWQgb2YgYW4gb2JqZWN0LCBpdFxuICAgKiBpcyBpbnRlcnByZXRlZCBhcyBhbiBgb25SZWFkeWAgY2FsbGJhY2suXG4gICAqL1xuICBzdWJzY3JpYmUobmFtZSAvKiAuLiBbYXJndW1lbnRzXSAuLiAoY2FsbGJhY2t8Y2FsbGJhY2tzKSAqLykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBwYXJhbXMgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGNhbGxiYWNrcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgaWYgKHBhcmFtcy5sZW5ndGgpIHtcbiAgICAgIHZhciBsYXN0UGFyYW0gPSBwYXJhbXNbcGFyYW1zLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKHR5cGVvZiBsYXN0UGFyYW0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2FsbGJhY2tzLm9uUmVhZHkgPSBwYXJhbXMucG9wKCk7XG4gICAgICB9IGVsc2UgaWYgKGxhc3RQYXJhbSAmJiBbXG4gICAgICAgIGxhc3RQYXJhbS5vblJlYWR5LFxuICAgICAgICAvLyBYWFggQ09NUEFUIFdJVEggMS4wLjMuMSBvbkVycm9yIHVzZWQgdG8gZXhpc3QsIGJ1dCBub3cgd2UgdXNlXG4gICAgICAgIC8vIG9uU3RvcCB3aXRoIGFuIGVycm9yIGNhbGxiYWNrIGluc3RlYWQuXG4gICAgICAgIGxhc3RQYXJhbS5vbkVycm9yLFxuICAgICAgICBsYXN0UGFyYW0ub25TdG9wXG4gICAgICBdLnNvbWUoZiA9PiB0eXBlb2YgZiA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgICAgICBjYWxsYmFja3MgPSBwYXJhbXMucG9wKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSXMgdGhlcmUgYW4gZXhpc3Rpbmcgc3ViIHdpdGggdGhlIHNhbWUgbmFtZSBhbmQgcGFyYW0sIHJ1biBpbiBhblxuICAgIC8vIGludmFsaWRhdGVkIENvbXB1dGF0aW9uPyBUaGlzIHdpbGwgaGFwcGVuIGlmIHdlIGFyZSByZXJ1bm5pbmcgYW5cbiAgICAvLyBleGlzdGluZyBjb21wdXRhdGlvbi5cbiAgICAvL1xuICAgIC8vIEZvciBleGFtcGxlLCBjb25zaWRlciBhIHJlcnVuIG9mOlxuICAgIC8vXG4gICAgLy8gICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbiAoKSB7XG4gICAgLy8gICAgICAgTWV0ZW9yLnN1YnNjcmliZShcImZvb1wiLCBTZXNzaW9uLmdldChcImZvb1wiKSk7XG4gICAgLy8gICAgICAgTWV0ZW9yLnN1YnNjcmliZShcImJhclwiLCBTZXNzaW9uLmdldChcImJhclwiKSk7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vXG4gICAgLy8gSWYgXCJmb29cIiBoYXMgY2hhbmdlZCBidXQgXCJiYXJcIiBoYXMgbm90LCB3ZSB3aWxsIG1hdGNoIHRoZSBcImJhclwiXG4gICAgLy8gc3ViY3JpYmUgdG8gYW4gZXhpc3RpbmcgaW5hY3RpdmUgc3Vic2NyaXB0aW9uIGluIG9yZGVyIHRvIG5vdFxuICAgIC8vIHVuc3ViIGFuZCByZXN1YiB0aGUgc3Vic2NyaXB0aW9uIHVubmVjZXNzYXJpbHkuXG4gICAgLy9cbiAgICAvLyBXZSBvbmx5IGxvb2sgZm9yIG9uZSBzdWNoIHN1YjsgaWYgdGhlcmUgYXJlIE4gYXBwYXJlbnRseS1pZGVudGljYWwgc3Vic1xuICAgIC8vIGJlaW5nIGludmFsaWRhdGVkLCB3ZSB3aWxsIHJlcXVpcmUgTiBtYXRjaGluZyBzdWJzY3JpYmUgY2FsbHMgdG8ga2VlcFxuICAgIC8vIHRoZW0gYWxsIGFjdGl2ZS5cbiAgICB2YXIgZXhpc3Rpbmc7XG4gICAga2V5cyhzZWxmLl9zdWJzY3JpcHRpb25zKS5zb21lKGlkID0+IHtcbiAgICAgIGNvbnN0IHN1YiA9IHNlbGYuX3N1YnNjcmlwdGlvbnNbaWRdO1xuICAgICAgaWYgKHN1Yi5pbmFjdGl2ZSAmJlxuICAgICAgICAgIHN1Yi5uYW1lID09PSBuYW1lICYmXG4gICAgICAgICAgRUpTT04uZXF1YWxzKHN1Yi5wYXJhbXMsIHBhcmFtcykpIHtcbiAgICAgICAgcmV0dXJuIGV4aXN0aW5nID0gc3ViO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGlkO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgaWQgPSBleGlzdGluZy5pZDtcbiAgICAgIGV4aXN0aW5nLmluYWN0aXZlID0gZmFsc2U7IC8vIHJlYWN0aXZhdGVcblxuICAgICAgaWYgKGNhbGxiYWNrcy5vblJlYWR5KSB7XG4gICAgICAgIC8vIElmIHRoZSBzdWIgaXMgbm90IGFscmVhZHkgcmVhZHksIHJlcGxhY2UgYW55IHJlYWR5IGNhbGxiYWNrIHdpdGggdGhlXG4gICAgICAgIC8vIG9uZSBwcm92aWRlZCBub3cuIChJdCdzIG5vdCByZWFsbHkgY2xlYXIgd2hhdCB1c2VycyB3b3VsZCBleHBlY3QgZm9yXG4gICAgICAgIC8vIGFuIG9uUmVhZHkgY2FsbGJhY2sgaW5zaWRlIGFuIGF1dG9ydW47IHRoZSBzZW1hbnRpY3Mgd2UgcHJvdmlkZSBpc1xuICAgICAgICAvLyB0aGF0IGF0IHRoZSB0aW1lIHRoZSBzdWIgZmlyc3QgYmVjb21lcyByZWFkeSwgd2UgY2FsbCB0aGUgbGFzdFxuICAgICAgICAvLyBvblJlYWR5IGNhbGxiYWNrIHByb3ZpZGVkLCBpZiBhbnkuKVxuICAgICAgICAvLyBJZiB0aGUgc3ViIGlzIGFscmVhZHkgcmVhZHksIHJ1biB0aGUgcmVhZHkgY2FsbGJhY2sgcmlnaHQgYXdheS5cbiAgICAgICAgLy8gSXQgc2VlbXMgdGhhdCB1c2VycyB3b3VsZCBleHBlY3QgYW4gb25SZWFkeSBjYWxsYmFjayBpbnNpZGUgYW5cbiAgICAgICAgLy8gYXV0b3J1biB0byB0cmlnZ2VyIG9uY2UgdGhlIHRoZSBzdWIgZmlyc3QgYmVjb21lcyByZWFkeSBhbmQgYWxzb1xuICAgICAgICAvLyB3aGVuIHJlLXN1YnMgaGFwcGVucy5cbiAgICAgICAgaWYgKGV4aXN0aW5nLnJlYWR5KSB7XG4gICAgICAgICAgY2FsbGJhY2tzLm9uUmVhZHkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleGlzdGluZy5yZWFkeUNhbGxiYWNrID0gY2FsbGJhY2tzLm9uUmVhZHk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gWFhYIENPTVBBVCBXSVRIIDEuMC4zLjEgd2UgdXNlZCB0byBoYXZlIG9uRXJyb3IgYnV0IG5vdyB3ZSBjYWxsXG4gICAgICAvLyBvblN0b3Agd2l0aCBhbiBvcHRpb25hbCBlcnJvciBhcmd1bWVudFxuICAgICAgaWYgKGNhbGxiYWNrcy5vbkVycm9yKSB7XG4gICAgICAgIC8vIFJlcGxhY2UgZXhpc3RpbmcgY2FsbGJhY2sgaWYgYW55LCBzbyB0aGF0IGVycm9ycyBhcmVuJ3RcbiAgICAgICAgLy8gZG91YmxlLXJlcG9ydGVkLlxuICAgICAgICBleGlzdGluZy5lcnJvckNhbGxiYWNrID0gY2FsbGJhY2tzLm9uRXJyb3I7XG4gICAgICB9XG5cbiAgICAgIGlmIChjYWxsYmFja3Mub25TdG9wKSB7XG4gICAgICAgIGV4aXN0aW5nLnN0b3BDYWxsYmFjayA9IGNhbGxiYWNrcy5vblN0b3A7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5ldyBzdWIhIEdlbmVyYXRlIGFuIGlkLCBzYXZlIGl0IGxvY2FsbHksIGFuZCBzZW5kIG1lc3NhZ2UuXG4gICAgICBpZCA9IFJhbmRvbS5pZCgpO1xuICAgICAgc2VsZi5fc3Vic2NyaXB0aW9uc1tpZF0gPSB7XG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgcGFyYW1zOiBFSlNPTi5jbG9uZShwYXJhbXMpLFxuICAgICAgICBpbmFjdGl2ZTogZmFsc2UsXG4gICAgICAgIHJlYWR5OiBmYWxzZSxcbiAgICAgICAgcmVhZHlEZXBzOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5KCksXG4gICAgICAgIHJlYWR5Q2FsbGJhY2s6IGNhbGxiYWNrcy5vblJlYWR5LFxuICAgICAgICAvLyBYWFggQ09NUEFUIFdJVEggMS4wLjMuMSAjZXJyb3JDYWxsYmFja1xuICAgICAgICBlcnJvckNhbGxiYWNrOiBjYWxsYmFja3Mub25FcnJvcixcbiAgICAgICAgc3RvcENhbGxiYWNrOiBjYWxsYmFja3Mub25TdG9wLFxuICAgICAgICBjb25uZWN0aW9uOiBzZWxmLFxuICAgICAgICByZW1vdmUoKSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuY29ubmVjdGlvbi5fc3Vic2NyaXB0aW9uc1t0aGlzLmlkXTtcbiAgICAgICAgICB0aGlzLnJlYWR5ICYmIHRoaXMucmVhZHlEZXBzLmNoYW5nZWQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24uX3NlbmQoeyBtc2c6ICd1bnN1YicsIGlkOiBpZCB9KTtcbiAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuXG4gICAgICAgICAgaWYgKGNhbGxiYWNrcy5vblN0b3ApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5vblN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBzZWxmLl9zZW5kKHsgbXNnOiAnc3ViJywgaWQ6IGlkLCBuYW1lOiBuYW1lLCBwYXJhbXM6IHBhcmFtcyB9KTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gYSBoYW5kbGUgdG8gdGhlIGFwcGxpY2F0aW9uLlxuICAgIHZhciBoYW5kbGUgPSB7XG4gICAgICBzdG9wKCkge1xuICAgICAgICBpZiAoISBoYXNPd24uY2FsbChzZWxmLl9zdWJzY3JpcHRpb25zLCBpZCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5fc3Vic2NyaXB0aW9uc1tpZF0uc3RvcCgpO1xuICAgICAgfSxcbiAgICAgIHJlYWR5KCkge1xuICAgICAgICAvLyByZXR1cm4gZmFsc2UgaWYgd2UndmUgdW5zdWJzY3JpYmVkLlxuICAgICAgICBpZiAoISBoYXNPd24uY2FsbChzZWxmLl9zdWJzY3JpcHRpb25zLCBpZCkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlY29yZCA9IHNlbGYuX3N1YnNjcmlwdGlvbnNbaWRdO1xuICAgICAgICByZWNvcmQucmVhZHlEZXBzLmRlcGVuZCgpO1xuICAgICAgICByZXR1cm4gcmVjb3JkLnJlYWR5O1xuICAgICAgfSxcbiAgICAgIHN1YnNjcmlwdGlvbklkOiBpZFxuICAgIH07XG5cbiAgICBpZiAoVHJhY2tlci5hY3RpdmUpIHtcbiAgICAgIC8vIFdlJ3JlIGluIGEgcmVhY3RpdmUgY29tcHV0YXRpb24sIHNvIHdlJ2QgbGlrZSB0byB1bnN1YnNjcmliZSB3aGVuIHRoZVxuICAgICAgLy8gY29tcHV0YXRpb24gaXMgaW52YWxpZGF0ZWQuLi4gYnV0IG5vdCBpZiB0aGUgcmVydW4ganVzdCByZS1zdWJzY3JpYmVzXG4gICAgICAvLyB0byB0aGUgc2FtZSBzdWJzY3JpcHRpb24hICBXaGVuIGEgcmVydW4gaGFwcGVucywgd2UgdXNlIG9uSW52YWxpZGF0ZVxuICAgICAgLy8gYXMgYSBjaGFuZ2UgdG8gbWFyayB0aGUgc3Vic2NyaXB0aW9uIFwiaW5hY3RpdmVcIiBzbyB0aGF0IGl0IGNhblxuICAgICAgLy8gYmUgcmV1c2VkIGZyb20gdGhlIHJlcnVuLiAgSWYgaXQgaXNuJ3QgcmV1c2VkLCBpdCdzIGtpbGxlZCBmcm9tXG4gICAgICAvLyBhbiBhZnRlckZsdXNoLlxuICAgICAgVHJhY2tlci5vbkludmFsaWRhdGUoYyA9PiB7XG4gICAgICAgIGlmIChoYXNPd24uY2FsbChzZWxmLl9zdWJzY3JpcHRpb25zLCBpZCkpIHtcbiAgICAgICAgICBzZWxmLl9zdWJzY3JpcHRpb25zW2lkXS5pbmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBUcmFja2VyLmFmdGVyRmx1c2goKCkgPT4ge1xuICAgICAgICAgIGlmIChoYXNPd24uY2FsbChzZWxmLl9zdWJzY3JpcHRpb25zLCBpZCkgJiZcbiAgICAgICAgICAgICAgc2VsZi5fc3Vic2NyaXB0aW9uc1tpZF0uaW5hY3RpdmUpIHtcbiAgICAgICAgICAgIGhhbmRsZS5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBoYW5kbGU7XG4gIH1cblxuICAvLyBvcHRpb25zOlxuICAvLyAtIG9uTGF0ZUVycm9yIHtGdW5jdGlvbihlcnJvcil9IGNhbGxlZCBpZiBhbiBlcnJvciB3YXMgcmVjZWl2ZWQgYWZ0ZXIgdGhlIHJlYWR5IGV2ZW50LlxuICAvLyAgICAgKGVycm9ycyByZWNlaXZlZCBiZWZvcmUgcmVhZHkgY2F1c2UgYW4gZXJyb3IgdG8gYmUgdGhyb3duKVxuICBfc3Vic2NyaWJlQW5kV2FpdChuYW1lLCBhcmdzLCBvcHRpb25zKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBmID0gbmV3IEZ1dHVyZSgpO1xuICAgIHZhciByZWFkeSA9IGZhbHNlO1xuICAgIHZhciBoYW5kbGU7XG4gICAgYXJncyA9IGFyZ3MgfHwgW107XG4gICAgYXJncy5wdXNoKHtcbiAgICAgIG9uUmVhZHkoKSB7XG4gICAgICAgIHJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgZlsncmV0dXJuJ10oKTtcbiAgICAgIH0sXG4gICAgICBvbkVycm9yKGUpIHtcbiAgICAgICAgaWYgKCFyZWFkeSkgZlsndGhyb3cnXShlKTtcbiAgICAgICAgZWxzZSBvcHRpb25zICYmIG9wdGlvbnMub25MYXRlRXJyb3IgJiYgb3B0aW9ucy5vbkxhdGVFcnJvcihlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGhhbmRsZSA9IHNlbGYuc3Vic2NyaWJlLmFwcGx5KHNlbGYsIFtuYW1lXS5jb25jYXQoYXJncykpO1xuICAgIGYud2FpdCgpO1xuICAgIHJldHVybiBoYW5kbGU7XG4gIH1cblxuICBtZXRob2RzKG1ldGhvZHMpIHtcbiAgICBrZXlzKG1ldGhvZHMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICBjb25zdCBmdW5jID0gbWV0aG9kc1tuYW1lXTtcbiAgICAgIGlmICh0eXBlb2YgZnVuYyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2QgJ1wiICsgbmFtZSArIFwiJyBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fbWV0aG9kSGFuZGxlcnNbbmFtZV0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQSBtZXRob2QgbmFtZWQgJ1wiICsgbmFtZSArIFwiJyBpcyBhbHJlYWR5IGRlZmluZWRcIik7XG4gICAgICB9XG4gICAgICB0aGlzLl9tZXRob2RIYW5kbGVyc1tuYW1lXSA9IGZ1bmM7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG1lbWJlck9mIE1ldGVvclxuICAgKiBAaW1wb3J0RnJvbVBhY2thZ2UgbWV0ZW9yXG4gICAqIEBhbGlhcyBNZXRlb3IuY2FsbFxuICAgKiBAc3VtbWFyeSBJbnZva2VzIGEgbWV0aG9kIHBhc3NpbmcgYW55IG51bWJlciBvZiBhcmd1bWVudHMuXG4gICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIG1ldGhvZCB0byBpbnZva2VcbiAgICogQHBhcmFtIHtFSlNPTmFibGV9IFthcmcxLGFyZzIuLi5dIE9wdGlvbmFsIG1ldGhvZCBhcmd1bWVudHNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2FzeW5jQ2FsbGJhY2tdIE9wdGlvbmFsIGNhbGxiYWNrLCB3aGljaCBpcyBjYWxsZWQgYXN5bmNocm9ub3VzbHkgd2l0aCB0aGUgZXJyb3Igb3IgcmVzdWx0IGFmdGVyIHRoZSBtZXRob2QgaXMgY29tcGxldGUuIElmIG5vdCBwcm92aWRlZCwgdGhlIG1ldGhvZCBydW5zIHN5bmNocm9ub3VzbHkgaWYgcG9zc2libGUgKHNlZSBiZWxvdykuXG4gICAqL1xuICBjYWxsKG5hbWUgLyogLi4gW2FyZ3VtZW50c10gLi4gY2FsbGJhY2sgKi8pIHtcbiAgICAvLyBpZiBpdCdzIGEgZnVuY3Rpb24sIHRoZSBsYXN0IGFyZ3VtZW50IGlzIHRoZSByZXN1bHQgY2FsbGJhY2ssXG4gICAgLy8gbm90IGEgcGFyYW1ldGVyIHRvIHRoZSByZW1vdGUgbWV0aG9kLlxuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGlmIChhcmdzLmxlbmd0aCAmJiB0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSAnZnVuY3Rpb24nKVxuICAgICAgdmFyIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICByZXR1cm4gdGhpcy5hcHBseShuYW1lLCBhcmdzLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogQG1lbWJlck9mIE1ldGVvclxuICAgKiBAaW1wb3J0RnJvbVBhY2thZ2UgbWV0ZW9yXG4gICAqIEBhbGlhcyBNZXRlb3IuYXBwbHlcbiAgICogQHN1bW1hcnkgSW52b2tlIGEgbWV0aG9kIHBhc3NpbmcgYW4gYXJyYXkgb2YgYXJndW1lbnRzLlxuICAgKiBAbG9jdXMgQW55d2hlcmVcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiBtZXRob2QgdG8gaW52b2tlXG4gICAqIEBwYXJhbSB7RUpTT05hYmxlW119IGFyZ3MgTWV0aG9kIGFyZ3VtZW50c1xuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy53YWl0IChDbGllbnQgb25seSkgSWYgdHJ1ZSwgZG9uJ3Qgc2VuZCB0aGlzIG1ldGhvZCB1bnRpbCBhbGwgcHJldmlvdXMgbWV0aG9kIGNhbGxzIGhhdmUgY29tcGxldGVkLCBhbmQgZG9uJ3Qgc2VuZCBhbnkgc3Vic2VxdWVudCBtZXRob2QgY2FsbHMgdW50aWwgdGhpcyBvbmUgaXMgY29tcGxldGVkLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLm9uUmVzdWx0UmVjZWl2ZWQgKENsaWVudCBvbmx5KSBUaGlzIGNhbGxiYWNrIGlzIGludm9rZWQgd2l0aCB0aGUgZXJyb3Igb3IgcmVzdWx0IG9mIHRoZSBtZXRob2QgKGp1c3QgbGlrZSBgYXN5bmNDYWxsYmFja2ApIGFzIHNvb24gYXMgdGhlIGVycm9yIG9yIHJlc3VsdCBpcyBhdmFpbGFibGUuIFRoZSBsb2NhbCBjYWNoZSBtYXkgbm90IHlldCByZWZsZWN0IHRoZSB3cml0ZXMgcGVyZm9ybWVkIGJ5IHRoZSBtZXRob2QuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5ub1JldHJ5IChDbGllbnQgb25seSkgaWYgdHJ1ZSwgZG9uJ3Qgc2VuZCB0aGlzIG1ldGhvZCBhZ2FpbiBvbiByZWxvYWQsIHNpbXBseSBjYWxsIHRoZSBjYWxsYmFjayBhbiBlcnJvciB3aXRoIHRoZSBlcnJvciBjb2RlICdpbnZvY2F0aW9uLWZhaWxlZCcuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy50aHJvd1N0dWJFeGNlcHRpb25zIChDbGllbnQgb25seSkgSWYgdHJ1ZSwgZXhjZXB0aW9ucyB0aHJvd24gYnkgbWV0aG9kIHN0dWJzIHdpbGwgYmUgdGhyb3duIGluc3RlYWQgb2YgbG9nZ2VkLCBhbmQgdGhlIG1ldGhvZCB3aWxsIG5vdCBiZSBpbnZva2VkIG9uIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5yZXR1cm5TdHViVmFsdWUgKENsaWVudCBvbmx5KSBJZiB0cnVlIHRoZW4gaW4gY2FzZXMgd2hlcmUgd2Ugd291bGQgaGF2ZSBvdGhlcndpc2UgZGlzY2FyZGVkIHRoZSBzdHViJ3MgcmV0dXJuIHZhbHVlIGFuZCByZXR1cm5lZCB1bmRlZmluZWQsIGluc3RlYWQgd2UgZ28gYWhlYWQgYW5kIHJldHVybiBpdC4gU3BlY2lmaWNhbGx5LCB0aGlzIGlzIGFueSB0aW1lIG90aGVyIHRoYW4gd2hlbiAoYSkgd2UgYXJlIGFscmVhZHkgaW5zaWRlIGEgc3R1YiBvciAoYikgd2UgYXJlIGluIE5vZGUgYW5kIG5vIGNhbGxiYWNrIHdhcyBwcm92aWRlZC4gQ3VycmVudGx5IHdlIHJlcXVpcmUgdGhpcyBmbGFnIHRvIGJlIGV4cGxpY2l0bHkgcGFzc2VkIHRvIHJlZHVjZSB0aGUgbGlrZWxpaG9vZCB0aGF0IHN0dWIgcmV0dXJuIHZhbHVlcyB3aWxsIGJlIGNvbmZ1c2VkIHdpdGggc2VydmVyIHJldHVybiB2YWx1ZXM7IHdlIG1heSBpbXByb3ZlIHRoaXMgaW4gZnV0dXJlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbYXN5bmNDYWxsYmFja10gT3B0aW9uYWwgY2FsbGJhY2s7IHNhbWUgc2VtYW50aWNzIGFzIGluIFtgTWV0ZW9yLmNhbGxgXSgjbWV0ZW9yX2NhbGwpLlxuICAgKi9cbiAgYXBwbHkobmFtZSwgYXJncywgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBXZSB3ZXJlIHBhc3NlZCAzIGFyZ3VtZW50cy4gVGhleSBtYXkgYmUgZWl0aGVyIChuYW1lLCBhcmdzLCBvcHRpb25zKVxuICAgIC8vIG9yIChuYW1lLCBhcmdzLCBjYWxsYmFjaylcbiAgICBpZiAoIWNhbGxiYWNrICYmIHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB9XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgLy8gWFhYIHdvdWxkIGl0IGJlIGJldHRlciBmb3JtIHRvIGRvIHRoZSBiaW5kaW5nIGluIHN0cmVhbS5vbixcbiAgICAgIC8vIG9yIGNhbGxlciwgaW5zdGVhZCBvZiBoZXJlP1xuICAgICAgLy8gWFhYIGltcHJvdmUgZXJyb3IgbWVzc2FnZSAoYW5kIGhvdyB3ZSByZXBvcnQgaXQpXG4gICAgICBjYWxsYmFjayA9IE1ldGVvci5iaW5kRW52aXJvbm1lbnQoXG4gICAgICAgIGNhbGxiYWNrLFxuICAgICAgICBcImRlbGl2ZXJpbmcgcmVzdWx0IG9mIGludm9raW5nICdcIiArIG5hbWUgKyBcIidcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBLZWVwIG91ciBhcmdzIHNhZmUgZnJvbSBtdXRhdGlvbiAoZWcgaWYgd2UgZG9uJ3Qgc2VuZCB0aGUgbWVzc2FnZSBmb3IgYVxuICAgIC8vIHdoaWxlIGJlY2F1c2Ugb2YgYSB3YWl0IG1ldGhvZCkuXG4gICAgYXJncyA9IEVKU09OLmNsb25lKGFyZ3MpO1xuXG4gICAgdmFyIGVuY2xvc2luZyA9IEREUC5fQ3VycmVudE1ldGhvZEludm9jYXRpb24uZ2V0KCk7XG4gICAgdmFyIGFscmVhZHlJblNpbXVsYXRpb24gPSBlbmNsb3NpbmcgJiYgZW5jbG9zaW5nLmlzU2ltdWxhdGlvbjtcblxuICAgIC8vIExhemlseSBnZW5lcmF0ZSBhIHJhbmRvbVNlZWQsIG9ubHkgaWYgaXQgaXMgcmVxdWVzdGVkIGJ5IHRoZSBzdHViLlxuICAgIC8vIFRoZSByYW5kb20gc3RyZWFtcyBvbmx5IGhhdmUgdXRpbGl0eSBpZiB0aGV5J3JlIHVzZWQgb24gYm90aCB0aGUgY2xpZW50XG4gICAgLy8gYW5kIHRoZSBzZXJ2ZXI7IGlmIHRoZSBjbGllbnQgZG9lc24ndCBnZW5lcmF0ZSBhbnkgJ3JhbmRvbScgdmFsdWVzXG4gICAgLy8gdGhlbiB3ZSBkb24ndCBleHBlY3QgdGhlIHNlcnZlciB0byBnZW5lcmF0ZSBhbnkgZWl0aGVyLlxuICAgIC8vIExlc3MgY29tbW9ubHksIHRoZSBzZXJ2ZXIgbWF5IHBlcmZvcm0gZGlmZmVyZW50IGFjdGlvbnMgZnJvbSB0aGUgY2xpZW50LFxuICAgIC8vIGFuZCBtYXkgaW4gZmFjdCBnZW5lcmF0ZSB2YWx1ZXMgd2hlcmUgdGhlIGNsaWVudCBkaWQgbm90LCBidXQgd2UgZG9uJ3RcbiAgICAvLyBoYXZlIGFueSBjbGllbnQtc2lkZSB2YWx1ZXMgdG8gbWF0Y2gsIHNvIGV2ZW4gaGVyZSB3ZSBtYXkgYXMgd2VsbCBqdXN0XG4gICAgLy8gdXNlIGEgcmFuZG9tIHNlZWQgb24gdGhlIHNlcnZlci4gIEluIHRoYXQgY2FzZSwgd2UgZG9uJ3QgcGFzcyB0aGVcbiAgICAvLyByYW5kb21TZWVkIHRvIHNhdmUgYmFuZHdpZHRoLCBhbmQgd2UgZG9uJ3QgZXZlbiBnZW5lcmF0ZSBpdCB0byBzYXZlIGFcbiAgICAvLyBiaXQgb2YgQ1BVIGFuZCB0byBhdm9pZCBjb25zdW1pbmcgZW50cm9weS5cbiAgICB2YXIgcmFuZG9tU2VlZCA9IG51bGw7XG4gICAgdmFyIHJhbmRvbVNlZWRHZW5lcmF0b3IgPSAoKSA9PiB7XG4gICAgICBpZiAocmFuZG9tU2VlZCA9PT0gbnVsbCkge1xuICAgICAgICByYW5kb21TZWVkID0gRERQQ29tbW9uLm1ha2VScGNTZWVkKGVuY2xvc2luZywgbmFtZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmFuZG9tU2VlZDtcbiAgICB9O1xuXG4gICAgLy8gUnVuIHRoZSBzdHViLCBpZiB3ZSBoYXZlIG9uZS4gVGhlIHN0dWIgaXMgc3VwcG9zZWQgdG8gbWFrZSBzb21lXG4gICAgLy8gdGVtcG9yYXJ5IHdyaXRlcyB0byB0aGUgZGF0YWJhc2UgdG8gZ2l2ZSB0aGUgdXNlciBhIHNtb290aCBleHBlcmllbmNlXG4gICAgLy8gdW50aWwgdGhlIGFjdHVhbCByZXN1bHQgb2YgZXhlY3V0aW5nIHRoZSBtZXRob2QgY29tZXMgYmFjayBmcm9tIHRoZVxuICAgIC8vIHNlcnZlciAod2hlcmV1cG9uIHRoZSB0ZW1wb3Jhcnkgd3JpdGVzIHRvIHRoZSBkYXRhYmFzZSB3aWxsIGJlIHJldmVyc2VkXG4gICAgLy8gZHVyaW5nIHRoZSBiZWdpblVwZGF0ZS9lbmRVcGRhdGUgcHJvY2Vzcy4pXG4gICAgLy9cbiAgICAvLyBOb3JtYWxseSwgd2UgaWdub3JlIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIHN0dWIgKGV2ZW4gaWYgaXQgaXMgYW5cbiAgICAvLyBleGNlcHRpb24pLCBpbiBmYXZvciBvZiB0aGUgcmVhbCByZXR1cm4gdmFsdWUgZnJvbSB0aGUgc2VydmVyLiBUaGVcbiAgICAvLyBleGNlcHRpb24gaXMgaWYgdGhlICpjYWxsZXIqIGlzIGEgc3R1Yi4gSW4gdGhhdCBjYXNlLCB3ZSdyZSBub3QgZ29pbmdcbiAgICAvLyB0byBkbyBhIFJQQywgc28gd2UgdXNlIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIHN0dWIgYXMgb3VyIHJldHVyblxuICAgIC8vIHZhbHVlLlxuXG4gICAgdmFyIHN0dWIgPSBzZWxmLl9tZXRob2RIYW5kbGVyc1tuYW1lXTtcbiAgICBpZiAoc3R1Yikge1xuICAgICAgdmFyIHNldFVzZXJJZCA9IHVzZXJJZCA9PiB7XG4gICAgICAgIHNlbGYuc2V0VXNlcklkKHVzZXJJZCk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgaW52b2NhdGlvbiA9IG5ldyBERFBDb21tb24uTWV0aG9kSW52b2NhdGlvbih7XG4gICAgICAgIGlzU2ltdWxhdGlvbjogdHJ1ZSxcbiAgICAgICAgdXNlcklkOiBzZWxmLnVzZXJJZCgpLFxuICAgICAgICBzZXRVc2VySWQ6IHNldFVzZXJJZCxcbiAgICAgICAgcmFuZG9tU2VlZCgpIHtcbiAgICAgICAgICByZXR1cm4gcmFuZG9tU2VlZEdlbmVyYXRvcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKCFhbHJlYWR5SW5TaW11bGF0aW9uKSBzZWxmLl9zYXZlT3JpZ2luYWxzKCk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCB1bmxpa2UgaW4gdGhlIGNvcnJlc3BvbmRpbmcgc2VydmVyIGNvZGUsIHdlIG5ldmVyIGF1ZGl0XG4gICAgICAgIC8vIHRoYXQgc3R1YnMgY2hlY2soKSB0aGVpciBhcmd1bWVudHMuXG4gICAgICAgIHZhciBzdHViUmV0dXJuVmFsdWUgPSBERFAuX0N1cnJlbnRNZXRob2RJbnZvY2F0aW9uLndpdGhWYWx1ZShcbiAgICAgICAgICBpbnZvY2F0aW9uLFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgICAgLy8gQmVjYXVzZSBzYXZlT3JpZ2luYWxzIGFuZCByZXRyaWV2ZU9yaWdpbmFscyBhcmVuJ3QgcmVlbnRyYW50LFxuICAgICAgICAgICAgICAvLyBkb24ndCBhbGxvdyBzdHVicyB0byB5aWVsZC5cbiAgICAgICAgICAgICAgcmV0dXJuIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyByZS1jbG9uZSwgc28gdGhhdCB0aGUgc3R1YiBjYW4ndCBhZmZlY3Qgb3VyIGNhbGxlcidzIHZhbHVlc1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHViLmFwcGx5KGludm9jYXRpb24sIEVKU09OLmNsb25lKGFyZ3MpKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gc3R1Yi5hcHBseShpbnZvY2F0aW9uLCBFSlNPTi5jbG9uZShhcmdzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB2YXIgZXhjZXB0aW9uID0gZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSdyZSBpbiBhIHNpbXVsYXRpb24sIHN0b3AgYW5kIHJldHVybiB0aGUgcmVzdWx0IHdlIGhhdmUsXG4gICAgLy8gcmF0aGVyIHRoYW4gZ29pbmcgb24gdG8gZG8gYW4gUlBDLiBJZiB0aGVyZSB3YXMgbm8gc3R1YixcbiAgICAvLyB3ZSdsbCBlbmQgdXAgcmV0dXJuaW5nIHVuZGVmaW5lZC5cbiAgICBpZiAoYWxyZWFkeUluU2ltdWxhdGlvbikge1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKGV4Y2VwdGlvbiwgc3R1YlJldHVyblZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIGlmIChleGNlcHRpb24pIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIHJldHVybiBzdHViUmV0dXJuVmFsdWU7XG4gICAgfVxuXG4gICAgLy8gV2Ugb25seSBjcmVhdGUgdGhlIG1ldGhvZElkIGhlcmUgYmVjYXVzZSB3ZSBkb24ndCBhY3R1YWxseSBuZWVkIG9uZSBpZlxuICAgIC8vIHdlJ3JlIGFscmVhZHkgaW4gYSBzaW11bGF0aW9uXG4gICAgY29uc3QgbWV0aG9kSWQgPSAnJyArIHNlbGYuX25leHRNZXRob2RJZCsrO1xuICAgIGlmIChzdHViKSB7XG4gICAgICBzZWxmLl9yZXRyaWV2ZUFuZFN0b3JlT3JpZ2luYWxzKG1ldGhvZElkKTtcbiAgICB9XG5cbiAgICAvLyBHZW5lcmF0ZSB0aGUgRERQIG1lc3NhZ2UgZm9yIHRoZSBtZXRob2QgY2FsbC4gTm90ZSB0aGF0IG9uIHRoZSBjbGllbnQsXG4gICAgLy8gaXQgaXMgaW1wb3J0YW50IHRoYXQgdGhlIHN0dWIgaGF2ZSBmaW5pc2hlZCBiZWZvcmUgd2Ugc2VuZCB0aGUgUlBDLCBzb1xuICAgIC8vIHRoYXQgd2Uga25vdyB3ZSBoYXZlIGEgY29tcGxldGUgbGlzdCBvZiB3aGljaCBsb2NhbCBkb2N1bWVudHMgdGhlIHN0dWJcbiAgICAvLyB3cm90ZS5cbiAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgIG1zZzogJ21ldGhvZCcsXG4gICAgICBtZXRob2Q6IG5hbWUsXG4gICAgICBwYXJhbXM6IGFyZ3MsXG4gICAgICBpZDogbWV0aG9kSWRcbiAgICB9O1xuXG4gICAgLy8gSWYgYW4gZXhjZXB0aW9uIG9jY3VycmVkIGluIGEgc3R1YiwgYW5kIHdlJ3JlIGlnbm9yaW5nIGl0XG4gICAgLy8gYmVjYXVzZSB3ZSdyZSBkb2luZyBhbiBSUEMgYW5kIHdhbnQgdG8gdXNlIHdoYXQgdGhlIHNlcnZlclxuICAgIC8vIHJldHVybnMgaW5zdGVhZCwgbG9nIGl0IHNvIHRoZSBkZXZlbG9wZXIga25vd3NcbiAgICAvLyAodW5sZXNzIHRoZXkgZXhwbGljaXRseSBhc2sgdG8gc2VlIHRoZSBlcnJvcikuXG4gICAgLy9cbiAgICAvLyBUZXN0cyBjYW4gc2V0IHRoZSAnX2V4cGVjdGVkQnlUZXN0JyBmbGFnIG9uIGFuIGV4Y2VwdGlvbiBzbyBpdCB3b24ndFxuICAgIC8vIGdvIHRvIGxvZy5cbiAgICBpZiAoZXhjZXB0aW9uKSB7XG4gICAgICBpZiAob3B0aW9ucy50aHJvd1N0dWJFeGNlcHRpb25zKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH0gZWxzZSBpZiAoIWV4Y2VwdGlvbi5fZXhwZWN0ZWRCeVRlc3QpIHtcbiAgICAgICAgTWV0ZW9yLl9kZWJ1ZyhcbiAgICAgICAgICBcIkV4Y2VwdGlvbiB3aGlsZSBzaW11bGF0aW5nIHRoZSBlZmZlY3Qgb2YgaW52b2tpbmcgJ1wiICsgbmFtZSArIFwiJ1wiLFxuICAgICAgICAgIGV4Y2VwdGlvbixcbiAgICAgICAgICBleGNlcHRpb24uc3RhY2tcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdCB0aGlzIHBvaW50IHdlJ3JlIGRlZmluaXRlbHkgZG9pbmcgYW4gUlBDLCBhbmQgd2UncmUgZ29pbmcgdG9cbiAgICAvLyByZXR1cm4gdGhlIHZhbHVlIG9mIHRoZSBSUEMgdG8gdGhlIGNhbGxlci5cblxuICAgIC8vIElmIHRoZSBjYWxsZXIgZGlkbid0IGdpdmUgYSBjYWxsYmFjaywgZGVjaWRlIHdoYXQgdG8gZG8uXG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAvLyBPbiB0aGUgY2xpZW50LCB3ZSBkb24ndCBoYXZlIGZpYmVycywgc28gd2UgY2FuJ3QgYmxvY2suIFRoZVxuICAgICAgICAvLyBvbmx5IHRoaW5nIHdlIGNhbiBkbyBpcyB0byByZXR1cm4gdW5kZWZpbmVkIGFuZCBkaXNjYXJkIHRoZVxuICAgICAgICAvLyByZXN1bHQgb2YgdGhlIFJQQy4gSWYgYW4gZXJyb3Igb2NjdXJyZWQgdGhlbiBwcmludCB0aGUgZXJyb3JcbiAgICAgICAgLy8gdG8gdGhlIGNvbnNvbGUuXG4gICAgICAgIGNhbGxiYWNrID0gZXJyID0+IHtcbiAgICAgICAgICBlcnIgJiZcbiAgICAgICAgICAgIE1ldGVvci5fZGVidWcoXG4gICAgICAgICAgICAgIFwiRXJyb3IgaW52b2tpbmcgTWV0aG9kICdcIiArIG5hbWUgKyBcIic6XCIsXG4gICAgICAgICAgICAgIGVycixcbiAgICAgICAgICAgICAgZXJyLnN0YWNrXG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT24gdGhlIHNlcnZlciwgbWFrZSB0aGUgZnVuY3Rpb24gc3luY2hyb25vdXMuIFRocm93IG9uXG4gICAgICAgIC8vIGVycm9ycywgcmV0dXJuIG9uIHN1Y2Nlc3MuXG4gICAgICAgIHZhciBmdXR1cmUgPSBuZXcgRnV0dXJlKCk7XG4gICAgICAgIGNhbGxiYWNrID0gZnV0dXJlLnJlc29sdmVyKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2VuZCB0aGUgcmFuZG9tU2VlZCBvbmx5IGlmIHdlIHVzZWQgaXRcbiAgICBpZiAocmFuZG9tU2VlZCAhPT0gbnVsbCkge1xuICAgICAgbWVzc2FnZS5yYW5kb21TZWVkID0gcmFuZG9tU2VlZDtcbiAgICB9XG5cbiAgICB2YXIgbWV0aG9kSW52b2tlciA9IG5ldyBNZXRob2RJbnZva2VyKHtcbiAgICAgIG1ldGhvZElkLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgY29ubmVjdGlvbjogc2VsZixcbiAgICAgIG9uUmVzdWx0UmVjZWl2ZWQ6IG9wdGlvbnMub25SZXN1bHRSZWNlaXZlZCxcbiAgICAgIHdhaXQ6ICEhb3B0aW9ucy53YWl0LFxuICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgIG5vUmV0cnk6ICEhb3B0aW9ucy5ub1JldHJ5XG4gICAgfSk7XG5cbiAgICBpZiAob3B0aW9ucy53YWl0KSB7XG4gICAgICAvLyBJdCdzIGEgd2FpdCBtZXRob2QhIFdhaXQgbWV0aG9kcyBnbyBpbiB0aGVpciBvd24gYmxvY2suXG4gICAgICBzZWxmLl9vdXRzdGFuZGluZ01ldGhvZEJsb2Nrcy5wdXNoKHtcbiAgICAgICAgd2FpdDogdHJ1ZSxcbiAgICAgICAgbWV0aG9kczogW21ldGhvZEludm9rZXJdXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm90IGEgd2FpdCBtZXRob2QuIFN0YXJ0IGEgbmV3IGJsb2NrIGlmIHRoZSBwcmV2aW91cyBibG9jayB3YXMgYSB3YWl0XG4gICAgICAvLyBibG9jaywgYW5kIGFkZCBpdCB0byB0aGUgbGFzdCBibG9jayBvZiBtZXRob2RzLlxuICAgICAgaWYgKGlzRW1wdHkoc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MpIHx8XG4gICAgICAgICAgbGFzdChzZWxmLl9vdXRzdGFuZGluZ01ldGhvZEJsb2Nrcykud2FpdCkge1xuICAgICAgICBzZWxmLl9vdXRzdGFuZGluZ01ldGhvZEJsb2Nrcy5wdXNoKHtcbiAgICAgICAgICB3YWl0OiBmYWxzZSxcbiAgICAgICAgICBtZXRob2RzOiBbXSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGxhc3Qoc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MpLm1ldGhvZHMucHVzaChtZXRob2RJbnZva2VyKTtcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBhZGRlZCBpdCB0byB0aGUgZmlyc3QgYmxvY2ssIHNlbmQgaXQgb3V0IG5vdy5cbiAgICBpZiAoc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MubGVuZ3RoID09PSAxKSBtZXRob2RJbnZva2VyLnNlbmRNZXNzYWdlKCk7XG5cbiAgICAvLyBJZiB3ZSdyZSB1c2luZyB0aGUgZGVmYXVsdCBjYWxsYmFjayBvbiB0aGUgc2VydmVyLFxuICAgIC8vIGJsb2NrIHdhaXRpbmcgZm9yIHRoZSByZXN1bHQuXG4gICAgaWYgKGZ1dHVyZSkge1xuICAgICAgcmV0dXJuIGZ1dHVyZS53YWl0KCk7XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25zLnJldHVyblN0dWJWYWx1ZSA/IHN0dWJSZXR1cm5WYWx1ZSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIEJlZm9yZSBjYWxsaW5nIGEgbWV0aG9kIHN0dWIsIHByZXBhcmUgYWxsIHN0b3JlcyB0byB0cmFjayBjaGFuZ2VzIGFuZCBhbGxvd1xuICAvLyBfcmV0cmlldmVBbmRTdG9yZU9yaWdpbmFscyB0byBnZXQgdGhlIG9yaWdpbmFsIHZlcnNpb25zIG9mIGNoYW5nZWRcbiAgLy8gZG9jdW1lbnRzLlxuICBfc2F2ZU9yaWdpbmFscygpIHtcbiAgICBpZiAoISB0aGlzLl93YWl0aW5nRm9yUXVpZXNjZW5jZSgpKSB7XG4gICAgICB0aGlzLl9mbHVzaEJ1ZmZlcmVkV3JpdGVzKCk7XG4gICAgfVxuXG4gICAga2V5cyh0aGlzLl9zdG9yZXMpLmZvckVhY2goc3RvcmVOYW1lID0+IHtcbiAgICAgIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdLnNhdmVPcmlnaW5hbHMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFJldHJpZXZlcyB0aGUgb3JpZ2luYWwgdmVyc2lvbnMgb2YgYWxsIGRvY3VtZW50cyBtb2RpZmllZCBieSB0aGUgc3R1YiBmb3JcbiAgLy8gbWV0aG9kICdtZXRob2RJZCcgZnJvbSBhbGwgc3RvcmVzIGFuZCBzYXZlcyB0aGVtIHRvIF9zZXJ2ZXJEb2N1bWVudHMgKGtleWVkXG4gIC8vIGJ5IGRvY3VtZW50KSBhbmQgX2RvY3VtZW50c1dyaXR0ZW5CeVN0dWIgKGtleWVkIGJ5IG1ldGhvZCBJRCkuXG4gIF9yZXRyaWV2ZUFuZFN0b3JlT3JpZ2luYWxzKG1ldGhvZElkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9kb2N1bWVudHNXcml0dGVuQnlTdHViW21ldGhvZElkXSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignRHVwbGljYXRlIG1ldGhvZElkIGluIF9yZXRyaWV2ZUFuZFN0b3JlT3JpZ2luYWxzJyk7XG5cbiAgICB2YXIgZG9jc1dyaXR0ZW4gPSBbXTtcblxuICAgIGtleXMoc2VsZi5fc3RvcmVzKS5mb3JFYWNoKGNvbGxlY3Rpb24gPT4ge1xuICAgICAgdmFyIG9yaWdpbmFscyA9IHNlbGYuX3N0b3Jlc1tjb2xsZWN0aW9uXS5yZXRyaWV2ZU9yaWdpbmFscygpO1xuICAgICAgLy8gbm90IGFsbCBzdG9yZXMgZGVmaW5lIHJldHJpZXZlT3JpZ2luYWxzXG4gICAgICBpZiAoISBvcmlnaW5hbHMpIHJldHVybjtcbiAgICAgIG9yaWdpbmFscy5mb3JFYWNoKChkb2MsIGlkKSA9PiB7XG4gICAgICAgIGRvY3NXcml0dGVuLnB1c2goeyBjb2xsZWN0aW9uLCBpZCB9KTtcbiAgICAgICAgaWYgKCEgaGFzT3duLmNhbGwoc2VsZi5fc2VydmVyRG9jdW1lbnRzLCBjb2xsZWN0aW9uKSkge1xuICAgICAgICAgIHNlbGYuX3NlcnZlckRvY3VtZW50c1tjb2xsZWN0aW9uXSA9IG5ldyBNb25nb0lETWFwKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNlcnZlckRvYyA9IHNlbGYuX3NlcnZlckRvY3VtZW50c1tjb2xsZWN0aW9uXS5zZXREZWZhdWx0KFxuICAgICAgICAgIGlkLFxuICAgICAgICAgIE9iamVjdC5jcmVhdGUobnVsbClcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHNlcnZlckRvYy53cml0dGVuQnlTdHVicykge1xuICAgICAgICAgIC8vIFdlJ3JlIG5vdCB0aGUgZmlyc3Qgc3R1YiB0byB3cml0ZSB0aGlzIGRvYy4gSnVzdCBhZGQgb3VyIG1ldGhvZCBJRFxuICAgICAgICAgIC8vIHRvIHRoZSByZWNvcmQuXG4gICAgICAgICAgc2VydmVyRG9jLndyaXR0ZW5CeVN0dWJzW21ldGhvZElkXSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRmlyc3Qgc3R1YiEgU2F2ZSB0aGUgb3JpZ2luYWwgdmFsdWUgYW5kIG91ciBtZXRob2QgSUQuXG4gICAgICAgICAgc2VydmVyRG9jLmRvY3VtZW50ID0gZG9jO1xuICAgICAgICAgIHNlcnZlckRvYy5mbHVzaENhbGxiYWNrcyA9IFtdO1xuICAgICAgICAgIHNlcnZlckRvYy53cml0dGVuQnlTdHVicyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgc2VydmVyRG9jLndyaXR0ZW5CeVN0dWJzW21ldGhvZElkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmICghIGlzRW1wdHkoZG9jc1dyaXR0ZW4pKSB7XG4gICAgICBzZWxmLl9kb2N1bWVudHNXcml0dGVuQnlTdHViW21ldGhvZElkXSA9IGRvY3NXcml0dGVuO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRoaXMgaXMgdmVyeSBtdWNoIGEgcHJpdmF0ZSBmdW5jdGlvbiB3ZSB1c2UgdG8gbWFrZSB0aGUgdGVzdHNcbiAgLy8gdGFrZSB1cCBmZXdlciBzZXJ2ZXIgcmVzb3VyY2VzIGFmdGVyIHRoZXkgY29tcGxldGUuXG4gIF91bnN1YnNjcmliZUFsbCgpIHtcbiAgICBrZXlzKHRoaXMuX3N1YnNjcmlwdGlvbnMpLmZvckVhY2goaWQgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gdGhpcy5fc3Vic2NyaXB0aW9uc1tpZF07XG4gICAgICAvLyBBdm9pZCBraWxsaW5nIHRoZSBhdXRvdXBkYXRlIHN1YnNjcmlwdGlvbiBzbyB0aGF0IGRldmVsb3BlcnNcbiAgICAgIC8vIHN0aWxsIGdldCBob3QgY29kZSBwdXNoZXMgd2hlbiB3cml0aW5nIHRlc3RzLlxuICAgICAgLy9cbiAgICAgIC8vIFhYWCBpdCdzIGEgaGFjayB0byBlbmNvZGUga25vd2xlZGdlIGFib3V0IGF1dG91cGRhdGUgaGVyZSxcbiAgICAgIC8vIGJ1dCBpdCBkb2Vzbid0IHNlZW0gd29ydGggaXQgeWV0IHRvIGhhdmUgYSBzcGVjaWFsIEFQSSBmb3JcbiAgICAgIC8vIHN1YnNjcmlwdGlvbnMgdG8gcHJlc2VydmUgYWZ0ZXIgdW5pdCB0ZXN0cy5cbiAgICAgIGlmIChzdWIubmFtZSAhPT0gJ21ldGVvcl9hdXRvdXBkYXRlX2NsaWVudFZlcnNpb25zJykge1xuICAgICAgICBzdWIuc3RvcCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gU2VuZHMgdGhlIEREUCBzdHJpbmdpZmljYXRpb24gb2YgdGhlIGdpdmVuIG1lc3NhZ2Ugb2JqZWN0XG4gIF9zZW5kKG9iaikge1xuICAgIHRoaXMuX3N0cmVhbS5zZW5kKEREUENvbW1vbi5zdHJpbmdpZnlERFAob2JqKSk7XG4gIH1cblxuICAvLyBXZSBkZXRlY3RlZCB2aWEgRERQLWxldmVsIGhlYXJ0YmVhdHMgdGhhdCB3ZSd2ZSBsb3N0IHRoZVxuICAvLyBjb25uZWN0aW9uLiAgVW5saWtlIGBkaXNjb25uZWN0YCBvciBgY2xvc2VgLCBhIGxvc3QgY29ubmVjdGlvblxuICAvLyB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgcmV0cmllZC5cbiAgX2xvc3RDb25uZWN0aW9uKGVycm9yKSB7XG4gICAgdGhpcy5fc3RyZWFtLl9sb3N0Q29ubmVjdGlvbihlcnJvcik7XG4gIH1cblxuICAvKipcbiAgICogQG1lbWJlck9mIE1ldGVvclxuICAgKiBAaW1wb3J0RnJvbVBhY2thZ2UgbWV0ZW9yXG4gICAqIEBhbGlhcyBNZXRlb3Iuc3RhdHVzXG4gICAqIEBzdW1tYXJ5IEdldCB0aGUgY3VycmVudCBjb25uZWN0aW9uIHN0YXR1cy4gQSByZWFjdGl2ZSBkYXRhIHNvdXJjZS5cbiAgICogQGxvY3VzIENsaWVudFxuICAgKi9cbiAgc3RhdHVzKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZWFtLnN0YXR1cyguLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBGb3JjZSBhbiBpbW1lZGlhdGUgcmVjb25uZWN0aW9uIGF0dGVtcHQgaWYgdGhlIGNsaWVudCBpcyBub3QgY29ubmVjdGVkIHRvIHRoZSBzZXJ2ZXIuXG5cbiAgVGhpcyBtZXRob2QgZG9lcyBub3RoaW5nIGlmIHRoZSBjbGllbnQgaXMgYWxyZWFkeSBjb25uZWN0ZWQuXG4gICAqIEBtZW1iZXJPZiBNZXRlb3JcbiAgICogQGltcG9ydEZyb21QYWNrYWdlIG1ldGVvclxuICAgKiBAYWxpYXMgTWV0ZW9yLnJlY29ubmVjdFxuICAgKiBAbG9jdXMgQ2xpZW50XG4gICAqL1xuICByZWNvbm5lY3QoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLl9zdHJlYW0ucmVjb25uZWN0KC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZW1iZXJPZiBNZXRlb3JcbiAgICogQGltcG9ydEZyb21QYWNrYWdlIG1ldGVvclxuICAgKiBAYWxpYXMgTWV0ZW9yLmRpc2Nvbm5lY3RcbiAgICogQHN1bW1hcnkgRGlzY29ubmVjdCB0aGUgY2xpZW50IGZyb20gdGhlIHNlcnZlci5cbiAgICogQGxvY3VzIENsaWVudFxuICAgKi9cbiAgZGlzY29ubmVjdCguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmVhbS5kaXNjb25uZWN0KC4uLmFyZ3MpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmVhbS5kaXNjb25uZWN0KHsgX3Blcm1hbmVudDogdHJ1ZSB9KTtcbiAgfVxuXG4gIC8vL1xuICAvLy8gUmVhY3RpdmUgdXNlciBzeXN0ZW1cbiAgLy8vXG4gIHVzZXJJZCgpIHtcbiAgICBpZiAodGhpcy5fdXNlcklkRGVwcykgdGhpcy5fdXNlcklkRGVwcy5kZXBlbmQoKTtcbiAgICByZXR1cm4gdGhpcy5fdXNlcklkO1xuICB9XG5cbiAgc2V0VXNlcklkKHVzZXJJZCkge1xuICAgIC8vIEF2b2lkIGludmFsaWRhdGluZyBkZXBlbmRlbnRzIGlmIHNldFVzZXJJZCBpcyBjYWxsZWQgd2l0aCBjdXJyZW50IHZhbHVlLlxuICAgIGlmICh0aGlzLl91c2VySWQgPT09IHVzZXJJZCkgcmV0dXJuO1xuICAgIHRoaXMuX3VzZXJJZCA9IHVzZXJJZDtcbiAgICBpZiAodGhpcy5fdXNlcklkRGVwcykgdGhpcy5fdXNlcklkRGVwcy5jaGFuZ2VkKCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRydWUgaWYgd2UgYXJlIGluIGEgc3RhdGUgYWZ0ZXIgcmVjb25uZWN0IG9mIHdhaXRpbmcgZm9yIHN1YnMgdG8gYmVcbiAgLy8gcmV2aXZlZCBvciBlYXJseSBtZXRob2RzIHRvIGZpbmlzaCB0aGVpciBkYXRhLCBvciB3ZSBhcmUgd2FpdGluZyBmb3IgYVxuICAvLyBcIndhaXRcIiBtZXRob2QgdG8gZmluaXNoLlxuICBfd2FpdGluZ0ZvclF1aWVzY2VuY2UoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICEgaXNFbXB0eSh0aGlzLl9zdWJzQmVpbmdSZXZpdmVkKSB8fFxuICAgICAgISBpc0VtcHR5KHRoaXMuX21ldGhvZHNCbG9ja2luZ1F1aWVzY2VuY2UpXG4gICAgKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdHJ1ZSBpZiBhbnkgbWV0aG9kIHdob3NlIG1lc3NhZ2UgaGFzIGJlZW4gc2VudCB0byB0aGUgc2VydmVyIGhhc1xuICAvLyBub3QgeWV0IGludm9rZWQgaXRzIHVzZXIgY2FsbGJhY2suXG4gIF9hbnlNZXRob2RzQXJlT3V0c3RhbmRpbmcoKSB7XG4gICAgY29uc3QgaW52b2tlcnMgPSB0aGlzLl9tZXRob2RJbnZva2VycztcbiAgICByZXR1cm4ga2V5cyhpbnZva2Vycykuc29tZShpZCA9PiB7XG4gICAgICByZXR1cm4gaW52b2tlcnNbaWRdLnNlbnRNZXNzYWdlO1xuICAgIH0pO1xuICB9XG5cbiAgX2xpdmVkYXRhX2Nvbm5lY3RlZChtc2cpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5fdmVyc2lvbiAhPT0gJ3ByZTEnICYmIHNlbGYuX2hlYXJ0YmVhdEludGVydmFsICE9PSAwKSB7XG4gICAgICBzZWxmLl9oZWFydGJlYXQgPSBuZXcgRERQQ29tbW9uLkhlYXJ0YmVhdCh7XG4gICAgICAgIGhlYXJ0YmVhdEludGVydmFsOiBzZWxmLl9oZWFydGJlYXRJbnRlcnZhbCxcbiAgICAgICAgaGVhcnRiZWF0VGltZW91dDogc2VsZi5faGVhcnRiZWF0VGltZW91dCxcbiAgICAgICAgb25UaW1lb3V0KCkge1xuICAgICAgICAgIHNlbGYuX2xvc3RDb25uZWN0aW9uKFxuICAgICAgICAgICAgbmV3IEREUC5Db25uZWN0aW9uRXJyb3IoJ0REUCBoZWFydGJlYXQgdGltZWQgb3V0JylcbiAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICBzZW5kUGluZygpIHtcbiAgICAgICAgICBzZWxmLl9zZW5kKHsgbXNnOiAncGluZycgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2VsZi5faGVhcnRiZWF0LnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyBpcyBhIHJlY29ubmVjdCwgd2UnbGwgaGF2ZSB0byByZXNldCBhbGwgc3RvcmVzLlxuICAgIGlmIChzZWxmLl9sYXN0U2Vzc2lvbklkKSBzZWxmLl9yZXNldFN0b3JlcyA9IHRydWU7XG5cbiAgICBpZiAodHlwZW9mIG1zZy5zZXNzaW9uID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIHJlY29ubmVjdGVkVG9QcmV2aW91c1Nlc3Npb24gPSBzZWxmLl9sYXN0U2Vzc2lvbklkID09PSBtc2cuc2Vzc2lvbjtcbiAgICAgIHNlbGYuX2xhc3RTZXNzaW9uSWQgPSBtc2cuc2Vzc2lvbjtcbiAgICB9XG5cbiAgICBpZiAocmVjb25uZWN0ZWRUb1ByZXZpb3VzU2Vzc2lvbikge1xuICAgICAgLy8gU3VjY2Vzc2Z1bCByZWNvbm5lY3Rpb24gLS0gcGljayB1cCB3aGVyZSB3ZSBsZWZ0IG9mZi4gIE5vdGUgdGhhdCByaWdodFxuICAgICAgLy8gbm93LCB0aGlzIG5ldmVyIGhhcHBlbnM6IHRoZSBzZXJ2ZXIgbmV2ZXIgY29ubmVjdHMgdXMgdG8gYSBwcmV2aW91c1xuICAgICAgLy8gc2Vzc2lvbiwgYmVjYXVzZSBERFAgZG9lc24ndCBwcm92aWRlIGVub3VnaCBkYXRhIGZvciB0aGUgc2VydmVyIHRvIGtub3dcbiAgICAgIC8vIHdoYXQgbWVzc2FnZXMgdGhlIGNsaWVudCBoYXMgcHJvY2Vzc2VkLiBXZSBuZWVkIHRvIGltcHJvdmUgRERQIHRvIG1ha2VcbiAgICAgIC8vIHRoaXMgcG9zc2libGUsIGF0IHdoaWNoIHBvaW50IHdlJ2xsIHByb2JhYmx5IG5lZWQgbW9yZSBjb2RlIGhlcmUuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gU2VydmVyIGRvZXNuJ3QgaGF2ZSBvdXIgZGF0YSBhbnkgbW9yZS4gUmUtc3luYyBhIG5ldyBzZXNzaW9uLlxuXG4gICAgLy8gRm9yZ2V0IGFib3V0IG1lc3NhZ2VzIHdlIHdlcmUgYnVmZmVyaW5nIGZvciB1bmtub3duIGNvbGxlY3Rpb25zLiBUaGV5J2xsXG4gICAgLy8gYmUgcmVzZW50IGlmIHN0aWxsIHJlbGV2YW50LlxuICAgIHNlbGYuX3VwZGF0ZXNGb3JVbmtub3duU3RvcmVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIGlmIChzZWxmLl9yZXNldFN0b3Jlcykge1xuICAgICAgLy8gRm9yZ2V0IGFib3V0IHRoZSBlZmZlY3RzIG9mIHN0dWJzLiBXZSdsbCBiZSByZXNldHRpbmcgYWxsIGNvbGxlY3Rpb25zXG4gICAgICAvLyBhbnl3YXkuXG4gICAgICBzZWxmLl9kb2N1bWVudHNXcml0dGVuQnlTdHViID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgIHNlbGYuX3NlcnZlckRvY3VtZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxuXG4gICAgLy8gQ2xlYXIgX2FmdGVyVXBkYXRlQ2FsbGJhY2tzLlxuICAgIHNlbGYuX2FmdGVyVXBkYXRlQ2FsbGJhY2tzID0gW107XG5cbiAgICAvLyBNYXJrIGFsbCBuYW1lZCBzdWJzY3JpcHRpb25zIHdoaWNoIGFyZSByZWFkeSAoaWUsIHdlIGFscmVhZHkgY2FsbGVkIHRoZVxuICAgIC8vIHJlYWR5IGNhbGxiYWNrKSBhcyBuZWVkaW5nIHRvIGJlIHJldml2ZWQuXG4gICAgLy8gWFhYIFdlIHNob3VsZCBhbHNvIGJsb2NrIHJlY29ubmVjdCBxdWllc2NlbmNlIHVudGlsIHVubmFtZWQgc3Vic2NyaXB0aW9uc1xuICAgIC8vICAgICAoZWcsIGF1dG9wdWJsaXNoKSBhcmUgZG9uZSByZS1wdWJsaXNoaW5nIHRvIGF2b2lkIGZsaWNrZXIhXG4gICAgc2VsZi5fc3Vic0JlaW5nUmV2aXZlZCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAga2V5cyhzZWxmLl9zdWJzY3JpcHRpb25zKS5mb3JFYWNoKGlkID0+IHtcbiAgICAgIGlmIChzZWxmLl9zdWJzY3JpcHRpb25zW2lkXS5yZWFkeSkge1xuICAgICAgICBzZWxmLl9zdWJzQmVpbmdSZXZpdmVkW2lkXSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBBcnJhbmdlIGZvciBcImhhbGYtZmluaXNoZWRcIiBtZXRob2RzIHRvIGhhdmUgdGhlaXIgY2FsbGJhY2tzIHJ1biwgYW5kXG4gICAgLy8gdHJhY2sgbWV0aG9kcyB0aGF0IHdlcmUgc2VudCBvbiB0aGlzIGNvbm5lY3Rpb24gc28gdGhhdCB3ZSBkb24ndFxuICAgIC8vIHF1aWVzY2UgdW50aWwgdGhleSBhcmUgYWxsIGRvbmUuXG4gICAgLy9cbiAgICAvLyBTdGFydCBieSBjbGVhcmluZyBfbWV0aG9kc0Jsb2NraW5nUXVpZXNjZW5jZTogbWV0aG9kcyBzZW50IGJlZm9yZVxuICAgIC8vIHJlY29ubmVjdCBkb24ndCBtYXR0ZXIsIGFuZCBhbnkgXCJ3YWl0XCIgbWV0aG9kcyBzZW50IG9uIHRoZSBuZXcgY29ubmVjdGlvblxuICAgIC8vIHRoYXQgd2UgZHJvcCBoZXJlIHdpbGwgYmUgcmVzdG9yZWQgYnkgdGhlIGxvb3AgYmVsb3cuXG4gICAgc2VsZi5fbWV0aG9kc0Jsb2NraW5nUXVpZXNjZW5jZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgaWYgKHNlbGYuX3Jlc2V0U3RvcmVzKSB7XG4gICAgICBjb25zdCBpbnZva2VycyA9IHNlbGYuX21ldGhvZEludm9rZXJzO1xuICAgICAga2V5cyhpbnZva2VycykuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgIGNvbnN0IGludm9rZXIgPSBpbnZva2Vyc1tpZF07XG4gICAgICAgIGlmIChpbnZva2VyLmdvdFJlc3VsdCgpKSB7XG4gICAgICAgICAgLy8gVGhpcyBtZXRob2QgYWxyZWFkeSBnb3QgaXRzIHJlc3VsdCwgYnV0IGl0IGRpZG4ndCBjYWxsIGl0cyBjYWxsYmFja1xuICAgICAgICAgIC8vIGJlY2F1c2UgaXRzIGRhdGEgZGlkbid0IGJlY29tZSB2aXNpYmxlLiBXZSBkaWQgbm90IHJlc2VuZCB0aGVcbiAgICAgICAgICAvLyBtZXRob2QgUlBDLiBXZSdsbCBjYWxsIGl0cyBjYWxsYmFjayB3aGVuIHdlIGdldCBhIGZ1bGwgcXVpZXNjZSxcbiAgICAgICAgICAvLyBzaW5jZSB0aGF0J3MgYXMgY2xvc2UgYXMgd2UnbGwgZ2V0IHRvIFwiZGF0YSBtdXN0IGJlIHZpc2libGVcIi5cbiAgICAgICAgICBzZWxmLl9hZnRlclVwZGF0ZUNhbGxiYWNrcy5wdXNoKFxuICAgICAgICAgICAgKC4uLmFyZ3MpID0+IGludm9rZXIuZGF0YVZpc2libGUoLi4uYXJncylcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGludm9rZXIuc2VudE1lc3NhZ2UpIHtcbiAgICAgICAgICAvLyBUaGlzIG1ldGhvZCBoYXMgYmVlbiBzZW50IG9uIHRoaXMgY29ubmVjdGlvbiAobWF5YmUgYXMgYSByZXNlbmRcbiAgICAgICAgICAvLyBmcm9tIHRoZSBsYXN0IGNvbm5lY3Rpb24sIG1heWJlIGZyb20gb25SZWNvbm5lY3QsIG1heWJlIGp1c3QgdmVyeVxuICAgICAgICAgIC8vIHF1aWNrbHkgYmVmb3JlIHByb2Nlc3NpbmcgdGhlIGNvbm5lY3RlZCBtZXNzYWdlKS5cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gZG8gYW55dGhpbmcgc3BlY2lhbCB0byBlbnN1cmUgaXRzIGNhbGxiYWNrcyBnZXRcbiAgICAgICAgICAvLyBjYWxsZWQsIGJ1dCB3ZSdsbCBjb3VudCBpdCBhcyBhIG1ldGhvZCB3aGljaCBpcyBwcmV2ZW50aW5nXG4gICAgICAgICAgLy8gcmVjb25uZWN0IHF1aWVzY2VuY2UuIChlZywgaXQgbWlnaHQgYmUgYSBsb2dpbiBtZXRob2QgdGhhdCB3YXMgcnVuXG4gICAgICAgICAgLy8gZnJvbSBvblJlY29ubmVjdCwgYW5kIHdlIGRvbid0IHdhbnQgdG8gc2VlIGZsaWNrZXIgYnkgc2VlaW5nIGFcbiAgICAgICAgICAvLyBsb2dnZWQtb3V0IHN0YXRlLilcbiAgICAgICAgICBzZWxmLl9tZXRob2RzQmxvY2tpbmdRdWllc2NlbmNlW2ludm9rZXIubWV0aG9kSWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VsZi5fbWVzc2FnZXNCdWZmZXJlZFVudGlsUXVpZXNjZW5jZSA9IFtdO1xuXG4gICAgLy8gSWYgd2UncmUgbm90IHdhaXRpbmcgb24gYW55IG1ldGhvZHMgb3Igc3Vicywgd2UgY2FuIHJlc2V0IHRoZSBzdG9yZXMgYW5kXG4gICAgLy8gY2FsbCB0aGUgY2FsbGJhY2tzIGltbWVkaWF0ZWx5LlxuICAgIGlmICghIHNlbGYuX3dhaXRpbmdGb3JRdWllc2NlbmNlKCkpIHtcbiAgICAgIGlmIChzZWxmLl9yZXNldFN0b3Jlcykge1xuICAgICAgICBrZXlzKHNlbGYuX3N0b3JlcykuZm9yRWFjaChzdG9yZU5hbWUgPT4ge1xuICAgICAgICAgIGNvbnN0IHMgPSBzZWxmLl9zdG9yZXNbc3RvcmVOYW1lXTtcbiAgICAgICAgICBzLmJlZ2luVXBkYXRlKDAsIHRydWUpO1xuICAgICAgICAgIHMuZW5kVXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzZWxmLl9yZXNldFN0b3JlcyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgc2VsZi5fcnVuQWZ0ZXJVcGRhdGVDYWxsYmFja3MoKTtcbiAgICB9XG4gIH1cblxuICBfcHJvY2Vzc09uZURhdGFNZXNzYWdlKG1zZywgdXBkYXRlcykge1xuICAgIGNvbnN0IG1lc3NhZ2VUeXBlID0gbXNnLm1zZztcblxuICAgIC8vIG1zZyBpcyBvbmUgb2YgWydhZGRlZCcsICdjaGFuZ2VkJywgJ3JlbW92ZWQnLCAncmVhZHknLCAndXBkYXRlZCddXG4gICAgaWYgKG1lc3NhZ2VUeXBlID09PSAnYWRkZWQnKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzX2FkZGVkKG1zZywgdXBkYXRlcyk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlVHlwZSA9PT0gJ2NoYW5nZWQnKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzX2NoYW5nZWQobXNnLCB1cGRhdGVzKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2VUeXBlID09PSAncmVtb3ZlZCcpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NfcmVtb3ZlZChtc2csIHVwZGF0ZXMpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZVR5cGUgPT09ICdyZWFkeScpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NfcmVhZHkobXNnLCB1cGRhdGVzKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2VUeXBlID09PSAndXBkYXRlZCcpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NfdXBkYXRlZChtc2csIHVwZGF0ZXMpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZVR5cGUgPT09ICdub3N1YicpIHtcbiAgICAgIC8vIGlnbm9yZSB0aGlzXG4gICAgfSBlbHNlIHtcbiAgICAgIE1ldGVvci5fZGVidWcoJ2Rpc2NhcmRpbmcgdW5rbm93biBsaXZlZGF0YSBkYXRhIG1lc3NhZ2UgdHlwZScsIG1zZyk7XG4gICAgfVxuICB9XG5cbiAgX2xpdmVkYXRhX2RhdGEobXNnKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuX3dhaXRpbmdGb3JRdWllc2NlbmNlKCkpIHtcbiAgICAgIHNlbGYuX21lc3NhZ2VzQnVmZmVyZWRVbnRpbFF1aWVzY2VuY2UucHVzaChtc2cpO1xuXG4gICAgICBpZiAobXNnLm1zZyA9PT0gJ25vc3ViJykge1xuICAgICAgICBkZWxldGUgc2VsZi5fc3Vic0JlaW5nUmV2aXZlZFttc2cuaWRdO1xuICAgICAgfVxuXG4gICAgICBpZiAobXNnLnN1YnMpIHtcbiAgICAgICAgbXNnLnN1YnMuZm9yRWFjaChzdWJJZCA9PiB7XG4gICAgICAgICAgZGVsZXRlIHNlbGYuX3N1YnNCZWluZ1Jldml2ZWRbc3ViSWRdO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1zZy5tZXRob2RzKSB7XG4gICAgICAgIG1zZy5tZXRob2RzLmZvckVhY2gobWV0aG9kSWQgPT4ge1xuICAgICAgICAgIGRlbGV0ZSBzZWxmLl9tZXRob2RzQmxvY2tpbmdRdWllc2NlbmNlW21ldGhvZElkXTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxmLl93YWl0aW5nRm9yUXVpZXNjZW5jZSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gTm8gbWV0aG9kcyBvciBzdWJzIGFyZSBibG9ja2luZyBxdWllc2NlbmNlIVxuICAgICAgLy8gV2UnbGwgbm93IHByb2Nlc3MgYW5kIGFsbCBvZiBvdXIgYnVmZmVyZWQgbWVzc2FnZXMsIHJlc2V0IGFsbCBzdG9yZXMsXG4gICAgICAvLyBhbmQgYXBwbHkgdGhlbSBhbGwgYXQgb25jZS5cblxuICAgICAgY29uc3QgYnVmZmVyZWRNZXNzYWdlcyA9IHNlbGYuX21lc3NhZ2VzQnVmZmVyZWRVbnRpbFF1aWVzY2VuY2U7XG4gICAgICBrZXlzKGJ1ZmZlcmVkTWVzc2FnZXMpLmZvckVhY2goaWQgPT4ge1xuICAgICAgICBzZWxmLl9wcm9jZXNzT25lRGF0YU1lc3NhZ2UoXG4gICAgICAgICAgYnVmZmVyZWRNZXNzYWdlc1tpZF0sXG4gICAgICAgICAgc2VsZi5fYnVmZmVyZWRXcml0ZXNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLl9tZXNzYWdlc0J1ZmZlcmVkVW50aWxRdWllc2NlbmNlID0gW107XG5cbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5fcHJvY2Vzc09uZURhdGFNZXNzYWdlKG1zZywgc2VsZi5fYnVmZmVyZWRXcml0ZXMpO1xuICAgIH1cblxuICAgIC8vIEltbWVkaWF0ZWx5IGZsdXNoIHdyaXRlcyB3aGVuOlxuICAgIC8vICAxLiBCdWZmZXJpbmcgaXMgZGlzYWJsZWQuIE9yO1xuICAgIC8vICAyLiBhbnkgbm9uLShhZGRlZC9jaGFuZ2VkL3JlbW92ZWQpIG1lc3NhZ2UgYXJyaXZlcy5cbiAgICB2YXIgc3RhbmRhcmRXcml0ZSA9XG4gICAgICBtc2cubXNnID09PSBcImFkZGVkXCIgfHxcbiAgICAgIG1zZy5tc2cgPT09IFwiY2hhbmdlZFwiIHx8XG4gICAgICBtc2cubXNnID09PSBcInJlbW92ZWRcIjtcblxuICAgIGlmIChzZWxmLl9idWZmZXJlZFdyaXRlc0ludGVydmFsID09PSAwIHx8ICEgc3RhbmRhcmRXcml0ZSkge1xuICAgICAgc2VsZi5fZmx1c2hCdWZmZXJlZFdyaXRlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChzZWxmLl9idWZmZXJlZFdyaXRlc0ZsdXNoQXQgPT09IG51bGwpIHtcbiAgICAgIHNlbGYuX2J1ZmZlcmVkV3JpdGVzRmx1c2hBdCA9XG4gICAgICAgIG5ldyBEYXRlKCkudmFsdWVPZigpICsgc2VsZi5fYnVmZmVyZWRXcml0ZXNNYXhBZ2U7XG4gICAgfSBlbHNlIGlmIChzZWxmLl9idWZmZXJlZFdyaXRlc0ZsdXNoQXQgPCBuZXcgRGF0ZSgpLnZhbHVlT2YoKSkge1xuICAgICAgc2VsZi5fZmx1c2hCdWZmZXJlZFdyaXRlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChzZWxmLl9idWZmZXJlZFdyaXRlc0ZsdXNoSGFuZGxlKSB7XG4gICAgICBjbGVhclRpbWVvdXQoc2VsZi5fYnVmZmVyZWRXcml0ZXNGbHVzaEhhbmRsZSk7XG4gICAgfVxuICAgIHNlbGYuX2J1ZmZlcmVkV3JpdGVzRmx1c2hIYW5kbGUgPSBzZXRUaW1lb3V0KFxuICAgICAgc2VsZi5fX2ZsdXNoQnVmZmVyZWRXcml0ZXMsXG4gICAgICBzZWxmLl9idWZmZXJlZFdyaXRlc0ludGVydmFsXG4gICAgKTtcbiAgfVxuXG4gIF9mbHVzaEJ1ZmZlcmVkV3JpdGVzKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fYnVmZmVyZWRXcml0ZXNGbHVzaEhhbmRsZSkge1xuICAgICAgY2xlYXJUaW1lb3V0KHNlbGYuX2J1ZmZlcmVkV3JpdGVzRmx1c2hIYW5kbGUpO1xuICAgICAgc2VsZi5fYnVmZmVyZWRXcml0ZXNGbHVzaEhhbmRsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgc2VsZi5fYnVmZmVyZWRXcml0ZXNGbHVzaEF0ID0gbnVsbDtcbiAgICAvLyBXZSBuZWVkIHRvIGNsZWFyIHRoZSBidWZmZXIgYmVmb3JlIHBhc3NpbmcgaXQgdG9cbiAgICAvLyAgcGVyZm9ybVdyaXRlcy4gQXMgdGhlcmUncyBubyBndWFyYW50ZWUgdGhhdCBpdFxuICAgIC8vICB3aWxsIGV4aXQgY2xlYW5seS5cbiAgICB2YXIgd3JpdGVzID0gc2VsZi5fYnVmZmVyZWRXcml0ZXM7XG4gICAgc2VsZi5fYnVmZmVyZWRXcml0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHNlbGYuX3BlcmZvcm1Xcml0ZXMod3JpdGVzKTtcbiAgfVxuXG4gIF9wZXJmb3JtV3JpdGVzKHVwZGF0ZXMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5fcmVzZXRTdG9yZXMgfHwgISBpc0VtcHR5KHVwZGF0ZXMpKSB7XG4gICAgICAvLyBCZWdpbiBhIHRyYW5zYWN0aW9uYWwgdXBkYXRlIG9mIGVhY2ggc3RvcmUuXG5cbiAgICAgIGtleXMoc2VsZi5fc3RvcmVzKS5mb3JFYWNoKHN0b3JlTmFtZSA9PiB7XG4gICAgICAgIHNlbGYuX3N0b3Jlc1tzdG9yZU5hbWVdLmJlZ2luVXBkYXRlKFxuICAgICAgICAgIGhhc093bi5jYWxsKHVwZGF0ZXMsIHN0b3JlTmFtZSlcbiAgICAgICAgICAgID8gdXBkYXRlc1tzdG9yZU5hbWVdLmxlbmd0aFxuICAgICAgICAgICAgOiAwLFxuICAgICAgICAgIHNlbGYuX3Jlc2V0U3RvcmVzXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgc2VsZi5fcmVzZXRTdG9yZXMgPSBmYWxzZTtcblxuICAgICAga2V5cyh1cGRhdGVzKS5mb3JFYWNoKHN0b3JlTmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZU1lc3NhZ2VzID0gdXBkYXRlc1tzdG9yZU5hbWVdO1xuICAgICAgICB2YXIgc3RvcmUgPSBzZWxmLl9zdG9yZXNbc3RvcmVOYW1lXTtcbiAgICAgICAgaWYgKHN0b3JlKSB7XG4gICAgICAgICAgdXBkYXRlTWVzc2FnZXMuZm9yRWFjaCh1cGRhdGVNZXNzYWdlID0+IHtcbiAgICAgICAgICAgIHN0b3JlLnVwZGF0ZSh1cGRhdGVNZXNzYWdlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBOb2JvZHkncyBsaXN0ZW5pbmcgZm9yIHRoaXMgZGF0YS4gUXVldWUgaXQgdXAgdW50aWxcbiAgICAgICAgICAvLyBzb21lb25lIHdhbnRzIGl0LlxuICAgICAgICAgIC8vIFhYWCBtZW1vcnkgdXNlIHdpbGwgZ3JvdyB3aXRob3V0IGJvdW5kIGlmIHlvdSBmb3JnZXQgdG9cbiAgICAgICAgICAvLyBjcmVhdGUgYSBjb2xsZWN0aW9uIG9yIGp1c3QgZG9uJ3QgY2FyZSBhYm91dCBpdC4uLiBnb2luZ1xuICAgICAgICAgIC8vIHRvIGhhdmUgdG8gZG8gc29tZXRoaW5nIGFib3V0IHRoYXQuXG4gICAgICAgICAgY29uc3QgdXBkYXRlcyA9IHNlbGYuX3VwZGF0ZXNGb3JVbmtub3duU3RvcmVzO1xuXG4gICAgICAgICAgaWYgKCEgaGFzT3duLmNhbGwodXBkYXRlcywgc3RvcmVOYW1lKSkge1xuICAgICAgICAgICAgdXBkYXRlc1tzdG9yZU5hbWVdID0gW107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdXBkYXRlc1tzdG9yZU5hbWVdLnB1c2goLi4udXBkYXRlTWVzc2FnZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gRW5kIHVwZGF0ZSB0cmFuc2FjdGlvbi5cbiAgICAgIGtleXMoc2VsZi5fc3RvcmVzKS5mb3JFYWNoKHN0b3JlTmFtZSA9PiB7XG4gICAgICAgIHNlbGYuX3N0b3Jlc1tzdG9yZU5hbWVdLmVuZFVwZGF0ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VsZi5fcnVuQWZ0ZXJVcGRhdGVDYWxsYmFja3MoKTtcbiAgfVxuXG4gIC8vIENhbGwgYW55IGNhbGxiYWNrcyBkZWZlcnJlZCB3aXRoIF9ydW5XaGVuQWxsU2VydmVyRG9jc0FyZUZsdXNoZWQgd2hvc2VcbiAgLy8gcmVsZXZhbnQgZG9jcyBoYXZlIGJlZW4gZmx1c2hlZCwgYXMgd2VsbCBhcyBkYXRhVmlzaWJsZSBjYWxsYmFja3MgYXRcbiAgLy8gcmVjb25uZWN0LXF1aWVzY2VuY2UgdGltZS5cbiAgX3J1bkFmdGVyVXBkYXRlQ2FsbGJhY2tzKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY2FsbGJhY2tzID0gc2VsZi5fYWZ0ZXJVcGRhdGVDYWxsYmFja3M7XG4gICAgc2VsZi5fYWZ0ZXJVcGRhdGVDYWxsYmFja3MgPSBbXTtcbiAgICBjYWxsYmFja3MuZm9yRWFjaChjID0+IHtcbiAgICAgIGMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9wdXNoVXBkYXRlKHVwZGF0ZXMsIGNvbGxlY3Rpb24sIG1zZykge1xuICAgIGlmICghIGhhc093bi5jYWxsKHVwZGF0ZXMsIGNvbGxlY3Rpb24pKSB7XG4gICAgICB1cGRhdGVzW2NvbGxlY3Rpb25dID0gW107XG4gICAgfVxuICAgIHVwZGF0ZXNbY29sbGVjdGlvbl0ucHVzaChtc2cpO1xuICB9XG5cbiAgX2dldFNlcnZlckRvYyhjb2xsZWN0aW9uLCBpZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoISBoYXNPd24uY2FsbChzZWxmLl9zZXJ2ZXJEb2N1bWVudHMsIGNvbGxlY3Rpb24pKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIHNlcnZlckRvY3NGb3JDb2xsZWN0aW9uID0gc2VsZi5fc2VydmVyRG9jdW1lbnRzW2NvbGxlY3Rpb25dO1xuICAgIHJldHVybiBzZXJ2ZXJEb2NzRm9yQ29sbGVjdGlvbi5nZXQoaWQpIHx8IG51bGw7XG4gIH1cblxuICBfcHJvY2Vzc19hZGRlZChtc2csIHVwZGF0ZXMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGlkID0gTW9uZ29JRC5pZFBhcnNlKG1zZy5pZCk7XG4gICAgdmFyIHNlcnZlckRvYyA9IHNlbGYuX2dldFNlcnZlckRvYyhtc2cuY29sbGVjdGlvbiwgaWQpO1xuICAgIGlmIChzZXJ2ZXJEb2MpIHtcbiAgICAgIC8vIFNvbWUgb3V0c3RhbmRpbmcgc3R1YiB3cm90ZSBoZXJlLlxuICAgICAgdmFyIGlzRXhpc3RpbmcgPSBzZXJ2ZXJEb2MuZG9jdW1lbnQgIT09IHVuZGVmaW5lZDtcblxuICAgICAgc2VydmVyRG9jLmRvY3VtZW50ID0gbXNnLmZpZWxkcyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgc2VydmVyRG9jLmRvY3VtZW50Ll9pZCA9IGlkO1xuXG4gICAgICBpZiAoc2VsZi5fcmVzZXRTdG9yZXMpIHtcbiAgICAgICAgLy8gRHVyaW5nIHJlY29ubmVjdCB0aGUgc2VydmVyIGlzIHNlbmRpbmcgYWRkcyBmb3IgZXhpc3RpbmcgaWRzLlxuICAgICAgICAvLyBBbHdheXMgcHVzaCBhbiB1cGRhdGUgc28gdGhhdCBkb2N1bWVudCBzdGF5cyBpbiB0aGUgc3RvcmUgYWZ0ZXJcbiAgICAgICAgLy8gcmVzZXQuIFVzZSBjdXJyZW50IHZlcnNpb24gb2YgdGhlIGRvY3VtZW50IGZvciB0aGlzIHVwZGF0ZSwgc29cbiAgICAgICAgLy8gdGhhdCBzdHViLXdyaXR0ZW4gdmFsdWVzIGFyZSBwcmVzZXJ2ZWQuXG4gICAgICAgIHZhciBjdXJyZW50RG9jID0gc2VsZi5fc3RvcmVzW21zZy5jb2xsZWN0aW9uXS5nZXREb2MobXNnLmlkKTtcbiAgICAgICAgaWYgKGN1cnJlbnREb2MgIT09IHVuZGVmaW5lZCkgbXNnLmZpZWxkcyA9IGN1cnJlbnREb2M7XG5cbiAgICAgICAgc2VsZi5fcHVzaFVwZGF0ZSh1cGRhdGVzLCBtc2cuY29sbGVjdGlvbiwgbXNnKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNFeGlzdGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlcnZlciBzZW50IGFkZCBmb3IgZXhpc3RpbmcgaWQ6ICcgKyBtc2cuaWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLl9wdXNoVXBkYXRlKHVwZGF0ZXMsIG1zZy5jb2xsZWN0aW9uLCBtc2cpO1xuICAgIH1cbiAgfVxuXG4gIF9wcm9jZXNzX2NoYW5nZWQobXNnLCB1cGRhdGVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBzZXJ2ZXJEb2MgPSBzZWxmLl9nZXRTZXJ2ZXJEb2MobXNnLmNvbGxlY3Rpb24sIE1vbmdvSUQuaWRQYXJzZShtc2cuaWQpKTtcbiAgICBpZiAoc2VydmVyRG9jKSB7XG4gICAgICBpZiAoc2VydmVyRG9jLmRvY3VtZW50ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU2VydmVyIHNlbnQgY2hhbmdlZCBmb3Igbm9uZXhpc3RpbmcgaWQ6ICcgKyBtc2cuaWQpO1xuICAgICAgRGlmZlNlcXVlbmNlLmFwcGx5Q2hhbmdlcyhzZXJ2ZXJEb2MuZG9jdW1lbnQsIG1zZy5maWVsZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLl9wdXNoVXBkYXRlKHVwZGF0ZXMsIG1zZy5jb2xsZWN0aW9uLCBtc2cpO1xuICAgIH1cbiAgfVxuXG4gIF9wcm9jZXNzX3JlbW92ZWQobXNnLCB1cGRhdGVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBzZXJ2ZXJEb2MgPSBzZWxmLl9nZXRTZXJ2ZXJEb2MobXNnLmNvbGxlY3Rpb24sIE1vbmdvSUQuaWRQYXJzZShtc2cuaWQpKTtcbiAgICBpZiAoc2VydmVyRG9jKSB7XG4gICAgICAvLyBTb21lIG91dHN0YW5kaW5nIHN0dWIgd3JvdGUgaGVyZS5cbiAgICAgIGlmIChzZXJ2ZXJEb2MuZG9jdW1lbnQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXJ2ZXIgc2VudCByZW1vdmVkIGZvciBub25leGlzdGluZyBpZDonICsgbXNnLmlkKTtcbiAgICAgIHNlcnZlckRvYy5kb2N1bWVudCA9IHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5fcHVzaFVwZGF0ZSh1cGRhdGVzLCBtc2cuY29sbGVjdGlvbiwge1xuICAgICAgICBtc2c6ICdyZW1vdmVkJyxcbiAgICAgICAgY29sbGVjdGlvbjogbXNnLmNvbGxlY3Rpb24sXG4gICAgICAgIGlkOiBtc2cuaWRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9wcm9jZXNzX3VwZGF0ZWQobXNnLCB1cGRhdGVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIFByb2Nlc3MgXCJtZXRob2QgZG9uZVwiIG1lc3NhZ2VzLlxuXG4gICAgbXNnLm1ldGhvZHMuZm9yRWFjaChtZXRob2RJZCA9PiB7XG4gICAgICBjb25zdCBkb2NzID0gc2VsZi5fZG9jdW1lbnRzV3JpdHRlbkJ5U3R1YlttZXRob2RJZF07XG4gICAgICBrZXlzKGRvY3MpLmZvckVhY2goaWQgPT4ge1xuICAgICAgICBjb25zdCB3cml0dGVuID0gZG9jc1tpZF07XG4gICAgICAgIGNvbnN0IHNlcnZlckRvYyA9IHNlbGYuX2dldFNlcnZlckRvYyh3cml0dGVuLmNvbGxlY3Rpb24sIHdyaXR0ZW4uaWQpO1xuICAgICAgICBpZiAoISBzZXJ2ZXJEb2MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xvc3Qgc2VydmVyRG9jIGZvciAnICsgSlNPTi5zdHJpbmdpZnkod3JpdHRlbikpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghIHNlcnZlckRvYy53cml0dGVuQnlTdHVic1ttZXRob2RJZF0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnRG9jICcgK1xuICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh3cml0dGVuKSArXG4gICAgICAgICAgICAgICcgbm90IHdyaXR0ZW4gYnkgIG1ldGhvZCAnICtcbiAgICAgICAgICAgICAgbWV0aG9kSWRcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBzZXJ2ZXJEb2Mud3JpdHRlbkJ5U3R1YnNbbWV0aG9kSWRdO1xuICAgICAgICBpZiAoaXNFbXB0eShzZXJ2ZXJEb2Mud3JpdHRlbkJ5U3R1YnMpKSB7XG4gICAgICAgICAgLy8gQWxsIG1ldGhvZHMgd2hvc2Ugc3R1YnMgd3JvdGUgdGhpcyBtZXRob2QgaGF2ZSBjb21wbGV0ZWQhIFdlIGNhblxuICAgICAgICAgIC8vIG5vdyBjb3B5IHRoZSBzYXZlZCBkb2N1bWVudCB0byB0aGUgZGF0YWJhc2UgKHJldmVydGluZyB0aGUgc3R1YidzXG4gICAgICAgICAgLy8gY2hhbmdlIGlmIHRoZSBzZXJ2ZXIgZGlkIG5vdCB3cml0ZSB0byB0aGlzIG9iamVjdCwgb3IgYXBwbHlpbmcgdGhlXG4gICAgICAgICAgLy8gc2VydmVyJ3Mgd3JpdGVzIGlmIGl0IGRpZCkuXG5cbiAgICAgICAgICAvLyBUaGlzIGlzIGEgZmFrZSBkZHAgJ3JlcGxhY2UnIG1lc3NhZ2UuICBJdCdzIGp1c3QgZm9yIHRhbGtpbmdcbiAgICAgICAgICAvLyBiZXR3ZWVuIGxpdmVkYXRhIGNvbm5lY3Rpb25zIGFuZCBtaW5pbW9uZ28uICAoV2UgaGF2ZSB0byBzdHJpbmdpZnlcbiAgICAgICAgICAvLyB0aGUgSUQgYmVjYXVzZSBpdCdzIHN1cHBvc2VkIHRvIGxvb2sgbGlrZSBhIHdpcmUgbWVzc2FnZS4pXG4gICAgICAgICAgc2VsZi5fcHVzaFVwZGF0ZSh1cGRhdGVzLCB3cml0dGVuLmNvbGxlY3Rpb24sIHtcbiAgICAgICAgICAgIG1zZzogJ3JlcGxhY2UnLFxuICAgICAgICAgICAgaWQ6IE1vbmdvSUQuaWRTdHJpbmdpZnkod3JpdHRlbi5pZCksXG4gICAgICAgICAgICByZXBsYWNlOiBzZXJ2ZXJEb2MuZG9jdW1lbnRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyBDYWxsIGFsbCBmbHVzaCBjYWxsYmFja3MuXG5cbiAgICAgICAgICBzZXJ2ZXJEb2MuZmx1c2hDYWxsYmFja3MuZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgIGMoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIERlbGV0ZSB0aGlzIGNvbXBsZXRlZCBzZXJ2ZXJEb2N1bWVudC4gRG9uJ3QgYm90aGVyIHRvIEdDIGVtcHR5XG4gICAgICAgICAgLy8gSWRNYXBzIGluc2lkZSBzZWxmLl9zZXJ2ZXJEb2N1bWVudHMsIHNpbmNlIHRoZXJlIHByb2JhYmx5IGFyZW4ndFxuICAgICAgICAgIC8vIG1hbnkgY29sbGVjdGlvbnMgYW5kIHRoZXknbGwgYmUgd3JpdHRlbiByZXBlYXRlZGx5LlxuICAgICAgICAgIHNlbGYuX3NlcnZlckRvY3VtZW50c1t3cml0dGVuLmNvbGxlY3Rpb25dLnJlbW92ZSh3cml0dGVuLmlkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkZWxldGUgc2VsZi5fZG9jdW1lbnRzV3JpdHRlbkJ5U3R1YlttZXRob2RJZF07XG5cbiAgICAgIC8vIFdlIHdhbnQgdG8gY2FsbCB0aGUgZGF0YS13cml0dGVuIGNhbGxiYWNrLCBidXQgd2UgY2FuJ3QgZG8gc28gdW50aWwgYWxsXG4gICAgICAvLyBjdXJyZW50bHkgYnVmZmVyZWQgbWVzc2FnZXMgYXJlIGZsdXNoZWQuXG4gICAgICBjb25zdCBjYWxsYmFja0ludm9rZXIgPSBzZWxmLl9tZXRob2RJbnZva2Vyc1ttZXRob2RJZF07XG4gICAgICBpZiAoISBjYWxsYmFja0ludm9rZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBjYWxsYmFjayBpbnZva2VyIGZvciBtZXRob2QgJyArIG1ldGhvZElkKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5fcnVuV2hlbkFsbFNlcnZlckRvY3NBcmVGbHVzaGVkKFxuICAgICAgICAoLi4uYXJncykgPT4gY2FsbGJhY2tJbnZva2VyLmRhdGFWaXNpYmxlKC4uLmFyZ3MpXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgX3Byb2Nlc3NfcmVhZHkobXNnLCB1cGRhdGVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIFByb2Nlc3MgXCJzdWIgcmVhZHlcIiBtZXNzYWdlcy4gXCJzdWIgcmVhZHlcIiBtZXNzYWdlcyBkb24ndCB0YWtlIGVmZmVjdFxuICAgIC8vIHVudGlsIGFsbCBjdXJyZW50IHNlcnZlciBkb2N1bWVudHMgaGF2ZSBiZWVuIGZsdXNoZWQgdG8gdGhlIGxvY2FsXG4gICAgLy8gZGF0YWJhc2UuIFdlIGNhbiB1c2UgYSB3cml0ZSBmZW5jZSB0byBpbXBsZW1lbnQgdGhpcy5cblxuICAgIG1zZy5zdWJzLmZvckVhY2goc3ViSWQgPT4ge1xuICAgICAgc2VsZi5fcnVuV2hlbkFsbFNlcnZlckRvY3NBcmVGbHVzaGVkKCgpID0+IHtcbiAgICAgICAgdmFyIHN1YlJlY29yZCA9IHNlbGYuX3N1YnNjcmlwdGlvbnNbc3ViSWRdO1xuICAgICAgICAvLyBEaWQgd2UgYWxyZWFkeSB1bnN1YnNjcmliZT9cbiAgICAgICAgaWYgKCFzdWJSZWNvcmQpIHJldHVybjtcbiAgICAgICAgLy8gRGlkIHdlIGFscmVhZHkgcmVjZWl2ZSBhIHJlYWR5IG1lc3NhZ2U/IChPb3BzISlcbiAgICAgICAgaWYgKHN1YlJlY29yZC5yZWFkeSkgcmV0dXJuO1xuICAgICAgICBzdWJSZWNvcmQucmVhZHkgPSB0cnVlO1xuICAgICAgICBzdWJSZWNvcmQucmVhZHlDYWxsYmFjayAmJiBzdWJSZWNvcmQucmVhZHlDYWxsYmFjaygpO1xuICAgICAgICBzdWJSZWNvcmQucmVhZHlEZXBzLmNoYW5nZWQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRW5zdXJlcyB0aGF0IFwiZlwiIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGFsbCBkb2N1bWVudHMgY3VycmVudGx5IGluXG4gIC8vIF9zZXJ2ZXJEb2N1bWVudHMgaGF2ZSBiZWVuIHdyaXR0ZW4gdG8gdGhlIGxvY2FsIGNhY2hlLiBmIHdpbGwgbm90IGJlIGNhbGxlZFxuICAvLyBpZiB0aGUgY29ubmVjdGlvbiBpcyBsb3N0IGJlZm9yZSB0aGVuIVxuICBfcnVuV2hlbkFsbFNlcnZlckRvY3NBcmVGbHVzaGVkKGYpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJ1bkZBZnRlclVwZGF0ZXMgPSAoKSA9PiB7XG4gICAgICBzZWxmLl9hZnRlclVwZGF0ZUNhbGxiYWNrcy5wdXNoKGYpO1xuICAgIH07XG4gICAgdmFyIHVuZmx1c2hlZFNlcnZlckRvY0NvdW50ID0gMDtcbiAgICB2YXIgb25TZXJ2ZXJEb2NGbHVzaCA9ICgpID0+IHtcbiAgICAgIC0tdW5mbHVzaGVkU2VydmVyRG9jQ291bnQ7XG4gICAgICBpZiAodW5mbHVzaGVkU2VydmVyRG9jQ291bnQgPT09IDApIHtcbiAgICAgICAgLy8gVGhpcyB3YXMgdGhlIGxhc3QgZG9jIHRvIGZsdXNoISBBcnJhbmdlIHRvIHJ1biBmIGFmdGVyIHRoZSB1cGRhdGVzXG4gICAgICAgIC8vIGhhdmUgYmVlbiBhcHBsaWVkLlxuICAgICAgICBydW5GQWZ0ZXJVcGRhdGVzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGtleXMoc2VsZi5fc2VydmVyRG9jdW1lbnRzKS5mb3JFYWNoKGNvbGxlY3Rpb24gPT4ge1xuICAgICAgc2VsZi5fc2VydmVyRG9jdW1lbnRzW2NvbGxlY3Rpb25dLmZvckVhY2goc2VydmVyRG9jID0+IHtcbiAgICAgICAgY29uc3Qgd3JpdHRlbkJ5U3R1YkZvckFNZXRob2RXaXRoU2VudE1lc3NhZ2UgPVxuICAgICAgICAgIGtleXMoc2VydmVyRG9jLndyaXR0ZW5CeVN0dWJzKS5zb21lKG1ldGhvZElkID0+IHtcbiAgICAgICAgICAgIHZhciBpbnZva2VyID0gc2VsZi5fbWV0aG9kSW52b2tlcnNbbWV0aG9kSWRdO1xuICAgICAgICAgICAgcmV0dXJuIGludm9rZXIgJiYgaW52b2tlci5zZW50TWVzc2FnZTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAod3JpdHRlbkJ5U3R1YkZvckFNZXRob2RXaXRoU2VudE1lc3NhZ2UpIHtcbiAgICAgICAgICArK3VuZmx1c2hlZFNlcnZlckRvY0NvdW50O1xuICAgICAgICAgIHNlcnZlckRvYy5mbHVzaENhbGxiYWNrcy5wdXNoKG9uU2VydmVyRG9jRmx1c2gpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAodW5mbHVzaGVkU2VydmVyRG9jQ291bnQgPT09IDApIHtcbiAgICAgIC8vIFRoZXJlIGFyZW4ndCBhbnkgYnVmZmVyZWQgZG9jcyAtLS0gd2UgY2FuIGNhbGwgZiBhcyBzb29uIGFzIHRoZSBjdXJyZW50XG4gICAgICAvLyByb3VuZCBvZiB1cGRhdGVzIGlzIGFwcGxpZWQhXG4gICAgICBydW5GQWZ0ZXJVcGRhdGVzKCk7XG4gICAgfVxuICB9XG5cbiAgX2xpdmVkYXRhX25vc3ViKG1zZykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIEZpcnN0IHBhc3MgaXQgdGhyb3VnaCBfbGl2ZWRhdGFfZGF0YSwgd2hpY2ggb25seSB1c2VzIGl0IHRvIGhlbHAgZ2V0XG4gICAgLy8gdG93YXJkcyBxdWllc2NlbmNlLlxuICAgIHNlbGYuX2xpdmVkYXRhX2RhdGEobXNnKTtcblxuICAgIC8vIERvIHRoZSByZXN0IG9mIG91ciBwcm9jZXNzaW5nIGltbWVkaWF0ZWx5LCB3aXRoIG5vXG4gICAgLy8gYnVmZmVyaW5nLXVudGlsLXF1aWVzY2VuY2UuXG5cbiAgICAvLyB3ZSB3ZXJlbid0IHN1YmJlZCBhbnl3YXksIG9yIHdlIGluaXRpYXRlZCB0aGUgdW5zdWIuXG4gICAgaWYgKCEgaGFzT3duLmNhbGwoc2VsZi5fc3Vic2NyaXB0aW9ucywgbXNnLmlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFhYWCBDT01QQVQgV0lUSCAxLjAuMy4xICNlcnJvckNhbGxiYWNrXG4gICAgdmFyIGVycm9yQ2FsbGJhY2sgPSBzZWxmLl9zdWJzY3JpcHRpb25zW21zZy5pZF0uZXJyb3JDYWxsYmFjaztcbiAgICB2YXIgc3RvcENhbGxiYWNrID0gc2VsZi5fc3Vic2NyaXB0aW9uc1ttc2cuaWRdLnN0b3BDYWxsYmFjaztcblxuICAgIHNlbGYuX3N1YnNjcmlwdGlvbnNbbXNnLmlkXS5yZW1vdmUoKTtcblxuICAgIHZhciBtZXRlb3JFcnJvckZyb21Nc2cgPSBtc2dBcmcgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgbXNnQXJnICYmXG4gICAgICAgIG1zZ0FyZy5lcnJvciAmJlxuICAgICAgICBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgIG1zZ0FyZy5lcnJvci5lcnJvcixcbiAgICAgICAgICBtc2dBcmcuZXJyb3IucmVhc29uLFxuICAgICAgICAgIG1zZ0FyZy5lcnJvci5kZXRhaWxzXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfTtcblxuICAgIC8vIFhYWCBDT01QQVQgV0lUSCAxLjAuMy4xICNlcnJvckNhbGxiYWNrXG4gICAgaWYgKGVycm9yQ2FsbGJhY2sgJiYgbXNnLmVycm9yKSB7XG4gICAgICBlcnJvckNhbGxiYWNrKG1ldGVvckVycm9yRnJvbU1zZyhtc2cpKTtcbiAgICB9XG5cbiAgICBpZiAoc3RvcENhbGxiYWNrKSB7XG4gICAgICBzdG9wQ2FsbGJhY2sobWV0ZW9yRXJyb3JGcm9tTXNnKG1zZykpO1xuICAgIH1cbiAgfVxuXG4gIF9saXZlZGF0YV9yZXN1bHQobXNnKSB7XG4gICAgLy8gaWQsIHJlc3VsdCBvciBlcnJvci4gZXJyb3IgaGFzIGVycm9yIChjb2RlKSwgcmVhc29uLCBkZXRhaWxzXG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBMZXRzIG1ha2Ugc3VyZSB0aGVyZSBhcmUgbm8gYnVmZmVyZWQgd3JpdGVzIGJlZm9yZSByZXR1cm5pbmcgcmVzdWx0LlxuICAgIGlmICghIGlzRW1wdHkoc2VsZi5fYnVmZmVyZWRXcml0ZXMpKSB7XG4gICAgICBzZWxmLl9mbHVzaEJ1ZmZlcmVkV3JpdGVzKCk7XG4gICAgfVxuXG4gICAgLy8gZmluZCB0aGUgb3V0c3RhbmRpbmcgcmVxdWVzdFxuICAgIC8vIHNob3VsZCBiZSBPKDEpIGluIG5lYXJseSBhbGwgcmVhbGlzdGljIHVzZSBjYXNlc1xuICAgIGlmIChpc0VtcHR5KHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzKSkge1xuICAgICAgTWV0ZW9yLl9kZWJ1ZygnUmVjZWl2ZWQgbWV0aG9kIHJlc3VsdCBidXQgbm8gbWV0aG9kcyBvdXRzdGFuZGluZycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgY3VycmVudE1ldGhvZEJsb2NrID0gc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3NbMF0ubWV0aG9kcztcbiAgICB2YXIgbTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRNZXRob2RCbG9jay5sZW5ndGg7IGkrKykge1xuICAgICAgbSA9IGN1cnJlbnRNZXRob2RCbG9ja1tpXTtcbiAgICAgIGlmIChtLm1ldGhvZElkID09PSBtc2cuaWQpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICghbSkge1xuICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkNhbid0IG1hdGNoIG1ldGhvZCByZXNwb25zZSB0byBvcmlnaW5hbCBtZXRob2QgY2FsbFwiLCBtc2cpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBmcm9tIGN1cnJlbnQgbWV0aG9kIGJsb2NrLiBUaGlzIG1heSBsZWF2ZSB0aGUgYmxvY2sgZW1wdHksIGJ1dCB3ZVxuICAgIC8vIGRvbid0IG1vdmUgb24gdG8gdGhlIG5leHQgYmxvY2sgdW50aWwgdGhlIGNhbGxiYWNrIGhhcyBiZWVuIGRlbGl2ZXJlZCwgaW5cbiAgICAvLyBfb3V0c3RhbmRpbmdNZXRob2RGaW5pc2hlZC5cbiAgICBjdXJyZW50TWV0aG9kQmxvY2suc3BsaWNlKGksIDEpO1xuXG4gICAgaWYgKGhhc093bi5jYWxsKG1zZywgJ2Vycm9yJykpIHtcbiAgICAgIG0ucmVjZWl2ZVJlc3VsdChcbiAgICAgICAgbmV3IE1ldGVvci5FcnJvcihtc2cuZXJyb3IuZXJyb3IsIG1zZy5lcnJvci5yZWFzb24sIG1zZy5lcnJvci5kZXRhaWxzKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbXNnLnJlc3VsdCBtYXkgYmUgdW5kZWZpbmVkIGlmIHRoZSBtZXRob2QgZGlkbid0IHJldHVybiBhXG4gICAgICAvLyB2YWx1ZVxuICAgICAgbS5yZWNlaXZlUmVzdWx0KHVuZGVmaW5lZCwgbXNnLnJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGVkIGJ5IE1ldGhvZEludm9rZXIgYWZ0ZXIgYSBtZXRob2QncyBjYWxsYmFjayBpcyBpbnZva2VkLiAgSWYgdGhpcyB3YXNcbiAgLy8gdGhlIGxhc3Qgb3V0c3RhbmRpbmcgbWV0aG9kIGluIHRoZSBjdXJyZW50IGJsb2NrLCBydW5zIHRoZSBuZXh0IGJsb2NrLiBJZlxuICAvLyB0aGVyZSBhcmUgbm8gbW9yZSBtZXRob2RzLCBjb25zaWRlciBhY2NlcHRpbmcgYSBob3QgY29kZSBwdXNoLlxuICBfb3V0c3RhbmRpbmdNZXRob2RGaW5pc2hlZCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX2FueU1ldGhvZHNBcmVPdXRzdGFuZGluZygpKSByZXR1cm47XG5cbiAgICAvLyBObyBtZXRob2RzIGFyZSBvdXRzdGFuZGluZy4gVGhpcyBzaG91bGQgbWVhbiB0aGF0IHRoZSBmaXJzdCBibG9jayBvZlxuICAgIC8vIG1ldGhvZHMgaXMgZW1wdHkuIChPciBpdCBtaWdodCBub3QgZXhpc3QsIGlmIHRoaXMgd2FzIGEgbWV0aG9kIHRoYXRcbiAgICAvLyBoYWxmLWZpbmlzaGVkIGJlZm9yZSBkaXNjb25uZWN0L3JlY29ubmVjdC4pXG4gICAgaWYgKCEgaXNFbXB0eShzZWxmLl9vdXRzdGFuZGluZ01ldGhvZEJsb2NrcykpIHtcbiAgICAgIHZhciBmaXJzdEJsb2NrID0gc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3Muc2hpZnQoKTtcbiAgICAgIGlmICghIGlzRW1wdHkoZmlyc3RCbG9jay5tZXRob2RzKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdObyBtZXRob2RzIG91dHN0YW5kaW5nIGJ1dCBub25lbXB0eSBibG9jazogJyArXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShmaXJzdEJsb2NrKVxuICAgICAgICApO1xuXG4gICAgICAvLyBTZW5kIHRoZSBvdXRzdGFuZGluZyBtZXRob2RzIG5vdyBpbiB0aGUgZmlyc3QgYmxvY2suXG4gICAgICBpZiAoISBpc0VtcHR5KHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzKSlcbiAgICAgICAgc2VsZi5fc2VuZE91dHN0YW5kaW5nTWV0aG9kcygpO1xuICAgIH1cblxuICAgIC8vIE1heWJlIGFjY2VwdCBhIGhvdCBjb2RlIHB1c2guXG4gICAgc2VsZi5fbWF5YmVNaWdyYXRlKCk7XG4gIH1cblxuICAvLyBTZW5kcyBtZXNzYWdlcyBmb3IgYWxsIHRoZSBtZXRob2RzIGluIHRoZSBmaXJzdCBibG9jayBpblxuICAvLyBfb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MuXG4gIF9zZW5kT3V0c3RhbmRpbmdNZXRob2RzKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmIChpc0VtcHR5KHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzWzBdLm1ldGhvZHMuZm9yRWFjaChtID0+IHtcbiAgICAgIG0uc2VuZE1lc3NhZ2UoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9saXZlZGF0YV9lcnJvcihtc2cpIHtcbiAgICBNZXRlb3IuX2RlYnVnKCdSZWNlaXZlZCBlcnJvciBmcm9tIHNlcnZlcjogJywgbXNnLnJlYXNvbik7XG4gICAgaWYgKG1zZy5vZmZlbmRpbmdNZXNzYWdlKSBNZXRlb3IuX2RlYnVnKCdGb3I6ICcsIG1zZy5vZmZlbmRpbmdNZXNzYWdlKTtcbiAgfVxuXG4gIF9jYWxsT25SZWNvbm5lY3RBbmRTZW5kQXBwcm9wcmlhdGVPdXRzdGFuZGluZ01ldGhvZHMoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBvbGRPdXRzdGFuZGluZ01ldGhvZEJsb2NrcyA9IHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzO1xuICAgIHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzID0gW107XG5cbiAgICBzZWxmLm9uUmVjb25uZWN0ICYmIHNlbGYub25SZWNvbm5lY3QoKTtcbiAgICBERFAuX3JlY29ubmVjdEhvb2suZWFjaChjYWxsYmFjayA9PiB7XG4gICAgICBjYWxsYmFjayhzZWxmKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgaWYgKGlzRW1wdHkob2xkT3V0c3RhbmRpbmdNZXRob2RCbG9ja3MpKSByZXR1cm47XG5cbiAgICAvLyBXZSBoYXZlIGF0IGxlYXN0IG9uZSBibG9jayB3b3J0aCBvZiBvbGQgb3V0c3RhbmRpbmcgbWV0aG9kcyB0byB0cnlcbiAgICAvLyBhZ2Fpbi4gRmlyc3Q6IGRpZCBvblJlY29ubmVjdCBhY3R1YWxseSBzZW5kIGFueXRoaW5nPyBJZiBub3QsIHdlIGp1c3RcbiAgICAvLyByZXN0b3JlIGFsbCBvdXRzdGFuZGluZyBtZXRob2RzIGFuZCBydW4gdGhlIGZpcnN0IGJsb2NrLlxuICAgIGlmIChpc0VtcHR5KHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzKSkge1xuICAgICAgc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MgPSBvbGRPdXRzdGFuZGluZ01ldGhvZEJsb2NrcztcbiAgICAgIHNlbGYuX3NlbmRPdXRzdGFuZGluZ01ldGhvZHMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBPSywgdGhlcmUgYXJlIGJsb2NrcyBvbiBib3RoIHNpZGVzLiBTcGVjaWFsIGNhc2U6IG1lcmdlIHRoZSBsYXN0IGJsb2NrIG9mXG4gICAgLy8gdGhlIHJlY29ubmVjdCBtZXRob2RzIHdpdGggdGhlIGZpcnN0IGJsb2NrIG9mIHRoZSBvcmlnaW5hbCBtZXRob2RzLCBpZlxuICAgIC8vIG5laXRoZXIgb2YgdGhlbSBhcmUgXCJ3YWl0XCIgYmxvY2tzLlxuICAgIGlmICghIGxhc3Qoc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MpLndhaXQgJiZcbiAgICAgICAgISBvbGRPdXRzdGFuZGluZ01ldGhvZEJsb2Nrc1swXS53YWl0KSB7XG4gICAgICBvbGRPdXRzdGFuZGluZ01ldGhvZEJsb2Nrc1swXS5tZXRob2RzLmZvckVhY2gobSA9PiB7XG4gICAgICAgIGxhc3Qoc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MpLm1ldGhvZHMucHVzaChtKTtcblxuICAgICAgICAvLyBJZiB0aGlzIFwibGFzdCBibG9ja1wiIGlzIGFsc28gdGhlIGZpcnN0IGJsb2NrLCBzZW5kIHRoZSBtZXNzYWdlLlxuICAgICAgICBpZiAoc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgbS5zZW5kTWVzc2FnZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb2xkT3V0c3RhbmRpbmdNZXRob2RCbG9ja3Muc2hpZnQoKTtcbiAgICB9XG5cbiAgICAvLyBOb3cgYWRkIHRoZSByZXN0IG9mIHRoZSBvcmlnaW5hbCBibG9ja3Mgb24uXG4gICAgb2xkT3V0c3RhbmRpbmdNZXRob2RCbG9ja3MuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICBzZWxmLl9vdXRzdGFuZGluZ01ldGhvZEJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFdlIGNhbiBhY2NlcHQgYSBob3QgY29kZSBwdXNoIGlmIHRoZXJlIGFyZSBubyBtZXRob2RzIGluIGZsaWdodC5cbiAgX3JlYWR5VG9NaWdyYXRlKCkge1xuICAgIHJldHVybiBpc0VtcHR5KHRoaXMuX21ldGhvZEludm9rZXJzKTtcbiAgfVxuXG4gIC8vIElmIHdlIHdlcmUgYmxvY2tpbmcgYSBtaWdyYXRpb24sIHNlZSBpZiBpdCdzIG5vdyBwb3NzaWJsZSB0byBjb250aW51ZS5cbiAgLy8gQ2FsbCB3aGVuZXZlciB0aGUgc2V0IG9mIG91dHN0YW5kaW5nL2Jsb2NrZWQgbWV0aG9kcyBzaHJpbmtzLlxuICBfbWF5YmVNaWdyYXRlKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fcmV0cnlNaWdyYXRlICYmIHNlbGYuX3JlYWR5VG9NaWdyYXRlKCkpIHtcbiAgICAgIHNlbGYuX3JldHJ5TWlncmF0ZSgpO1xuICAgICAgc2VsZi5fcmV0cnlNaWdyYXRlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBvbk1lc3NhZ2UocmF3X21zZykge1xuICAgIHRyeSB7XG4gICAgICB2YXIgbXNnID0gRERQQ29tbW9uLnBhcnNlRERQKHJhd19tc2cpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIE1ldGVvci5fZGVidWcoJ0V4Y2VwdGlvbiB3aGlsZSBwYXJzaW5nIEREUCcsIGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEFueSBtZXNzYWdlIGNvdW50cyBhcyByZWNlaXZpbmcgYSBwb25nLCBhcyBpdCBkZW1vbnN0cmF0ZXMgdGhhdFxuICAgIC8vIHRoZSBzZXJ2ZXIgaXMgc3RpbGwgYWxpdmUuXG4gICAgaWYgKHRoaXMuX2hlYXJ0YmVhdCkge1xuICAgICAgdGhpcy5faGVhcnRiZWF0Lm1lc3NhZ2VSZWNlaXZlZCgpO1xuICAgIH1cblxuICAgIGlmIChtc2cgPT09IG51bGwgfHwgIW1zZy5tc2cpIHtcbiAgICAgIC8vIFhYWCBDT01QQVQgV0lUSCAwLjYuNi4gaWdub3JlIHRoZSBvbGQgd2VsY29tZSBtZXNzYWdlIGZvciBiYWNrXG4gICAgICAvLyBjb21wYXQuICBSZW1vdmUgdGhpcyAnaWYnIG9uY2UgdGhlIHNlcnZlciBzdG9wcyBzZW5kaW5nIHdlbGNvbWVcbiAgICAgIC8vIG1lc3NhZ2VzIChzdHJlYW1fc2VydmVyLmpzKS5cbiAgICAgIGlmICghKG1zZyAmJiBtc2cuc2VydmVyX2lkKSlcbiAgICAgICAgTWV0ZW9yLl9kZWJ1ZygnZGlzY2FyZGluZyBpbnZhbGlkIGxpdmVkYXRhIG1lc3NhZ2UnLCBtc2cpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChtc2cubXNnID09PSAnY29ubmVjdGVkJykge1xuICAgICAgdGhpcy5fdmVyc2lvbiA9IHRoaXMuX3ZlcnNpb25TdWdnZXN0aW9uO1xuICAgICAgdGhpcy5fbGl2ZWRhdGFfY29ubmVjdGVkKG1zZyk7XG4gICAgICB0aGlzLm9wdGlvbnMub25Db25uZWN0ZWQoKTtcbiAgICB9IGVsc2UgaWYgKG1zZy5tc2cgPT09ICdmYWlsZWQnKSB7XG4gICAgICBpZiAodGhpcy5fc3VwcG9ydGVkRERQVmVyc2lvbnMuaW5kZXhPZihtc2cudmVyc2lvbikgPj0gMCkge1xuICAgICAgICB0aGlzLl92ZXJzaW9uU3VnZ2VzdGlvbiA9IG1zZy52ZXJzaW9uO1xuICAgICAgICB0aGlzLl9zdHJlYW0ucmVjb25uZWN0KHsgX2ZvcmNlOiB0cnVlIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRlc2NyaXB0aW9uID1cbiAgICAgICAgICAnRERQIHZlcnNpb24gbmVnb3RpYXRpb24gZmFpbGVkOyBzZXJ2ZXIgcmVxdWVzdGVkIHZlcnNpb24gJyArXG4gICAgICAgICAgbXNnLnZlcnNpb247XG4gICAgICAgIHRoaXMuX3N0cmVhbS5kaXNjb25uZWN0KHsgX3Blcm1hbmVudDogdHJ1ZSwgX2Vycm9yOiBkZXNjcmlwdGlvbiB9KTtcbiAgICAgICAgdGhpcy5vcHRpb25zLm9uRERQVmVyc2lvbk5lZ290aWF0aW9uRmFpbHVyZShkZXNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtc2cubXNnID09PSAncGluZycgJiYgdGhpcy5vcHRpb25zLnJlc3BvbmRUb1BpbmdzKSB7XG4gICAgICB0aGlzLl9zZW5kKHsgbXNnOiAncG9uZycsIGlkOiBtc2cuaWQgfSk7XG4gICAgfSBlbHNlIGlmIChtc2cubXNnID09PSAncG9uZycpIHtcbiAgICAgIC8vIG5vb3AsIGFzIHdlIGFzc3VtZSBldmVyeXRoaW5nJ3MgYSBwb25nXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIFsnYWRkZWQnLCAnY2hhbmdlZCcsICdyZW1vdmVkJywgJ3JlYWR5JywgJ3VwZGF0ZWQnXS5pbmNsdWRlcyhtc2cubXNnKVxuICAgICkge1xuICAgICAgdGhpcy5fbGl2ZWRhdGFfZGF0YShtc2cpO1xuICAgIH0gZWxzZSBpZiAobXNnLm1zZyA9PT0gJ25vc3ViJykge1xuICAgICAgdGhpcy5fbGl2ZWRhdGFfbm9zdWIobXNnKTtcbiAgICB9IGVsc2UgaWYgKG1zZy5tc2cgPT09ICdyZXN1bHQnKSB7XG4gICAgICB0aGlzLl9saXZlZGF0YV9yZXN1bHQobXNnKTtcbiAgICB9IGVsc2UgaWYgKG1zZy5tc2cgPT09ICdlcnJvcicpIHtcbiAgICAgIHRoaXMuX2xpdmVkYXRhX2Vycm9yKG1zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE1ldGVvci5fZGVidWcoJ2Rpc2NhcmRpbmcgdW5rbm93biBsaXZlZGF0YSBtZXNzYWdlIHR5cGUnLCBtc2cpO1xuICAgIH1cbiAgfVxuXG4gIG9uUmVzZXQoKSB7XG4gICAgLy8gU2VuZCBhIGNvbm5lY3QgbWVzc2FnZSBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzdHJlYW0uXG4gICAgLy8gTk9URTogcmVzZXQgaXMgY2FsbGVkIGV2ZW4gb24gdGhlIGZpcnN0IGNvbm5lY3Rpb24sIHNvIHRoaXMgaXNcbiAgICAvLyB0aGUgb25seSBwbGFjZSB3ZSBzZW5kIHRoaXMgbWVzc2FnZS5cbiAgICB2YXIgbXNnID0geyBtc2c6ICdjb25uZWN0JyB9O1xuICAgIGlmICh0aGlzLl9sYXN0U2Vzc2lvbklkKSBtc2cuc2Vzc2lvbiA9IHRoaXMuX2xhc3RTZXNzaW9uSWQ7XG4gICAgbXNnLnZlcnNpb24gPSB0aGlzLl92ZXJzaW9uU3VnZ2VzdGlvbiB8fCB0aGlzLl9zdXBwb3J0ZWRERFBWZXJzaW9uc1swXTtcbiAgICB0aGlzLl92ZXJzaW9uU3VnZ2VzdGlvbiA9IG1zZy52ZXJzaW9uO1xuICAgIG1zZy5zdXBwb3J0ID0gdGhpcy5fc3VwcG9ydGVkRERQVmVyc2lvbnM7XG4gICAgdGhpcy5fc2VuZChtc2cpO1xuXG4gICAgLy8gTWFyayBub24tcmV0cnkgY2FsbHMgYXMgZmFpbGVkLiBUaGlzIGhhcyB0byBiZSBkb25lIGVhcmx5IGFzIGdldHRpbmcgdGhlc2UgbWV0aG9kcyBvdXQgb2YgdGhlXG4gICAgLy8gY3VycmVudCBibG9jayBpcyBwcmV0dHkgaW1wb3J0YW50IHRvIG1ha2luZyBzdXJlIHRoYXQgcXVpZXNjZW5jZSBpcyBwcm9wZXJseSBjYWxjdWxhdGVkLCBhc1xuICAgIC8vIHdlbGwgYXMgcG9zc2libHkgbW92aW5nIG9uIHRvIGFub3RoZXIgdXNlZnVsIGJsb2NrLlxuXG4gICAgLy8gT25seSBib3RoZXIgdGVzdGluZyBpZiB0aGVyZSBpcyBhbiBvdXRzdGFuZGluZ01ldGhvZEJsb2NrICh0aGVyZSBtaWdodCBub3QgYmUsIGVzcGVjaWFsbHkgaWZcbiAgICAvLyB3ZSBhcmUgY29ubmVjdGluZyBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gICAgaWYgKHRoaXMuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIGFuIG91dHN0YW5kaW5nIG1ldGhvZCBibG9jaywgd2Ugb25seSBjYXJlIGFib3V0IHRoZSBmaXJzdCBvbmUgYXMgdGhhdCBpcyB0aGVcbiAgICAgIC8vIG9uZSB0aGF0IGNvdWxkIGhhdmUgYWxyZWFkeSBzZW50IG1lc3NhZ2VzIHdpdGggbm8gcmVzcG9uc2UsIHRoYXQgYXJlIG5vdCBhbGxvd2VkIHRvIHJldHJ5LlxuICAgICAgY29uc3QgY3VycmVudE1ldGhvZEJsb2NrID0gdGhpcy5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3NbMF0ubWV0aG9kcztcbiAgICAgIHRoaXMuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzWzBdLm1ldGhvZHMgPSBjdXJyZW50TWV0aG9kQmxvY2suZmlsdGVyKFxuICAgICAgICBtZXRob2RJbnZva2VyID0+IHtcbiAgICAgICAgICAvLyBNZXRob2RzIHdpdGggJ25vUmV0cnknIG9wdGlvbiBzZXQgYXJlIG5vdCBhbGxvd2VkIHRvIHJlLXNlbmQgYWZ0ZXJcbiAgICAgICAgICAvLyByZWNvdmVyaW5nIGRyb3BwZWQgY29ubmVjdGlvbi5cbiAgICAgICAgICBpZiAobWV0aG9kSW52b2tlci5zZW50TWVzc2FnZSAmJiBtZXRob2RJbnZva2VyLm5vUmV0cnkpIHtcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBtZXRob2QgaXMgdG9sZCB0aGF0IGl0IGZhaWxlZC5cbiAgICAgICAgICAgIG1ldGhvZEludm9rZXIucmVjZWl2ZVJlc3VsdChcbiAgICAgICAgICAgICAgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAnaW52b2NhdGlvbi1mYWlsZWQnLFxuICAgICAgICAgICAgICAgICdNZXRob2QgaW52b2NhdGlvbiBtaWdodCBoYXZlIGZhaWxlZCBkdWUgdG8gZHJvcHBlZCBjb25uZWN0aW9uLiAnICtcbiAgICAgICAgICAgICAgICAgICdGYWlsaW5nIGJlY2F1c2UgYG5vUmV0cnlgIG9wdGlvbiB3YXMgcGFzc2VkIHRvIE1ldGVvci5hcHBseS4nXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gT25seSBrZWVwIGEgbWV0aG9kIGlmIGl0IHdhc24ndCBzZW50IG9yIGl0J3MgYWxsb3dlZCB0byByZXRyeS5cbiAgICAgICAgICAvLyBUaGlzIG1heSBsZWF2ZSB0aGUgYmxvY2sgZW1wdHksIGJ1dCB3ZSBkb24ndCBtb3ZlIG9uIHRvIHRoZSBuZXh0XG4gICAgICAgICAgLy8gYmxvY2sgdW50aWwgdGhlIGNhbGxiYWNrIGhhcyBiZWVuIGRlbGl2ZXJlZCwgaW4gX291dHN0YW5kaW5nTWV0aG9kRmluaXNoZWQuXG4gICAgICAgICAgcmV0dXJuICEobWV0aG9kSW52b2tlci5zZW50TWVzc2FnZSAmJiBtZXRob2RJbnZva2VyLm5vUmV0cnkpO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIE5vdywgdG8gbWluaW1pemUgc2V0dXAgbGF0ZW5jeSwgZ28gYWhlYWQgYW5kIGJsYXN0IG91dCBhbGwgb2ZcbiAgICAvLyBvdXIgcGVuZGluZyBtZXRob2RzIGFuZHMgc3Vic2NyaXB0aW9ucyBiZWZvcmUgd2UndmUgZXZlbiB0YWtlblxuICAgIC8vIHRoZSBuZWNlc3NhcnkgUlRUIHRvIGtub3cgaWYgd2Ugc3VjY2Vzc2Z1bGx5IHJlY29ubmVjdGVkLiAoMSlcbiAgICAvLyBUaGV5J3JlIHN1cHBvc2VkIHRvIGJlIGlkZW1wb3RlbnQsIGFuZCB3aGVyZSB0aGV5IGFyZSBub3QsXG4gICAgLy8gdGhleSBjYW4gYmxvY2sgcmV0cnkgaW4gYXBwbHk7ICgyKSBldmVuIGlmIHdlIGRpZCByZWNvbm5lY3QsXG4gICAgLy8gd2UncmUgbm90IHN1cmUgd2hhdCBtZXNzYWdlcyBtaWdodCBoYXZlIGdvdHRlbiBsb3N0XG4gICAgLy8gKGluIGVpdGhlciBkaXJlY3Rpb24pIHNpbmNlIHdlIHdlcmUgZGlzY29ubmVjdGVkIChUQ1AgYmVpbmdcbiAgICAvLyBzbG9wcHkgYWJvdXQgdGhhdC4pXG5cbiAgICAvLyBJZiB0aGUgY3VycmVudCBibG9jayBvZiBtZXRob2RzIGFsbCBnb3QgdGhlaXIgcmVzdWx0cyAoYnV0IGRpZG4ndCBhbGwgZ2V0XG4gICAgLy8gdGhlaXIgZGF0YSB2aXNpYmxlKSwgZGlzY2FyZCB0aGUgZW1wdHkgYmxvY2sgbm93LlxuICAgIGlmIChcbiAgICAgIHRoaXMuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzLmxlbmd0aCA+IDAgJiZcbiAgICAgIHRoaXMuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzWzBdLm1ldGhvZHMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICB0aGlzLl9vdXRzdGFuZGluZ01ldGhvZEJsb2Nrcy5zaGlmdCgpO1xuICAgIH1cblxuICAgIC8vIE1hcmsgYWxsIG1lc3NhZ2VzIGFzIHVuc2VudCwgdGhleSBoYXZlIG5vdCB5ZXQgYmVlbiBzZW50IG9uIHRoaXNcbiAgICAvLyBjb25uZWN0aW9uLlxuICAgIGtleXModGhpcy5fbWV0aG9kSW52b2tlcnMpLmZvckVhY2goaWQgPT4ge1xuICAgICAgdGhpcy5fbWV0aG9kSW52b2tlcnNbaWRdLnNlbnRNZXNzYWdlID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBJZiBhbiBgb25SZWNvbm5lY3RgIGhhbmRsZXIgaXMgc2V0LCBjYWxsIGl0IGZpcnN0LiBHbyB0aHJvdWdoXG4gICAgLy8gc29tZSBob29wcyB0byBlbnN1cmUgdGhhdCBtZXRob2RzIHRoYXQgYXJlIGNhbGxlZCBmcm9tIHdpdGhpblxuICAgIC8vIGBvblJlY29ubmVjdGAgZ2V0IGV4ZWN1dGVkIF9iZWZvcmVfIG9uZXMgdGhhdCB3ZXJlIG9yaWdpbmFsbHlcbiAgICAvLyBvdXRzdGFuZGluZyAoc2luY2UgYG9uUmVjb25uZWN0YCBpcyB1c2VkIHRvIHJlLWVzdGFibGlzaCBhdXRoXG4gICAgLy8gY2VydGlmaWNhdGVzKVxuICAgIHRoaXMuX2NhbGxPblJlY29ubmVjdEFuZFNlbmRBcHByb3ByaWF0ZU91dHN0YW5kaW5nTWV0aG9kcygpO1xuXG4gICAgLy8gYWRkIG5ldyBzdWJzY3JpcHRpb25zIGF0IHRoZSBlbmQuIHRoaXMgd2F5IHRoZXkgdGFrZSBlZmZlY3QgYWZ0ZXJcbiAgICAvLyB0aGUgaGFuZGxlcnMgYW5kIHdlIGRvbid0IHNlZSBmbGlja2VyLlxuICAgIGtleXModGhpcy5fc3Vic2NyaXB0aW9ucykuZm9yRWFjaChpZCA9PiB7XG4gICAgICBjb25zdCBzdWIgPSB0aGlzLl9zdWJzY3JpcHRpb25zW2lkXTtcbiAgICAgIHRoaXMuX3NlbmQoe1xuICAgICAgICBtc2c6ICdzdWInLFxuICAgICAgICBpZDogaWQsXG4gICAgICAgIG5hbWU6IHN1Yi5uYW1lLFxuICAgICAgICBwYXJhbXM6IHN1Yi5wYXJhbXNcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBERFBDb21tb24gfSBmcm9tICdtZXRlb3IvZGRwLWNvbW1vbic7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IGtleXMgfSBmcm9tIFwibWV0ZW9yL2RkcC1jb21tb24vdXRpbHMuanNcIjtcblxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJy4vbGl2ZWRhdGFfY29ubmVjdGlvbi5qcyc7XG5cbi8vIFRoaXMgYXJyYXkgYWxsb3dzIHRoZSBgX2FsbFN1YnNjcmlwdGlvbnNSZWFkeWAgbWV0aG9kIGJlbG93LCB3aGljaFxuLy8gaXMgdXNlZCBieSB0aGUgYHNwaWRlcmFibGVgIHBhY2thZ2UsIHRvIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBhbGxcbi8vIGRhdGEgaXMgcmVhZHkuXG5jb25zdCBhbGxDb25uZWN0aW9ucyA9IFtdO1xuXG4vKipcbiAqIEBuYW1lc3BhY2UgRERQXG4gKiBAc3VtbWFyeSBOYW1lc3BhY2UgZm9yIEREUC1yZWxhdGVkIG1ldGhvZHMvY2xhc3Nlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IEREUCA9IHt9O1xuXG4vLyBUaGlzIGlzIHByaXZhdGUgYnV0IGl0J3MgdXNlZCBpbiBhIGZldyBwbGFjZXMuIGFjY291bnRzLWJhc2UgdXNlc1xuLy8gaXQgdG8gZ2V0IHRoZSBjdXJyZW50IHVzZXIuIE1ldGVvci5zZXRUaW1lb3V0IGFuZCBmcmllbmRzIGNsZWFyXG4vLyBpdC4gV2UgY2FuIHByb2JhYmx5IGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGZhY3RvciB0aGlzLlxuRERQLl9DdXJyZW50TWV0aG9kSW52b2NhdGlvbiA9IG5ldyBNZXRlb3IuRW52aXJvbm1lbnRWYXJpYWJsZSgpO1xuRERQLl9DdXJyZW50UHVibGljYXRpb25JbnZvY2F0aW9uID0gbmV3IE1ldGVvci5FbnZpcm9ubWVudFZhcmlhYmxlKCk7XG5cbi8vIFhYWDogS2VlcCBERFAuX0N1cnJlbnRJbnZvY2F0aW9uIGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eS5cbkREUC5fQ3VycmVudEludm9jYXRpb24gPSBERFAuX0N1cnJlbnRNZXRob2RJbnZvY2F0aW9uO1xuXG4vLyBUaGlzIGlzIHBhc3NlZCBpbnRvIGEgd2VpcmQgYG1ha2VFcnJvclR5cGVgIGZ1bmN0aW9uIHRoYXQgZXhwZWN0cyBpdHMgdGhpbmdcbi8vIHRvIGJlIGEgY29uc3RydWN0b3JcbmZ1bmN0aW9uIGNvbm5lY3Rpb25FcnJvckNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuRERQLkNvbm5lY3Rpb25FcnJvciA9IE1ldGVvci5tYWtlRXJyb3JUeXBlKFxuICAnRERQLkNvbm5lY3Rpb25FcnJvcicsXG4gIGNvbm5lY3Rpb25FcnJvckNvbnN0cnVjdG9yXG4pO1xuXG5ERFAuRm9yY2VkUmVjb25uZWN0RXJyb3IgPSBNZXRlb3IubWFrZUVycm9yVHlwZShcbiAgJ0REUC5Gb3JjZWRSZWNvbm5lY3RFcnJvcicsXG4gICgpID0+IHt9XG4pO1xuXG4vLyBSZXR1cm5zIHRoZSBuYW1lZCBzZXF1ZW5jZSBvZiBwc2V1ZG8tcmFuZG9tIHZhbHVlcy5cbi8vIFRoZSBzY29wZSB3aWxsIGJlIEREUC5fQ3VycmVudE1ldGhvZEludm9jYXRpb24uZ2V0KCksIHNvIHRoZSBzdHJlYW0gd2lsbCBwcm9kdWNlXG4vLyBjb25zaXN0ZW50IHZhbHVlcyBmb3IgbWV0aG9kIGNhbGxzIG9uIHRoZSBjbGllbnQgYW5kIHNlcnZlci5cbkREUC5yYW5kb21TdHJlYW0gPSBuYW1lID0+IHtcbiAgdmFyIHNjb3BlID0gRERQLl9DdXJyZW50TWV0aG9kSW52b2NhdGlvbi5nZXQoKTtcbiAgcmV0dXJuIEREUENvbW1vbi5SYW5kb21TdHJlYW0uZ2V0KHNjb3BlLCBuYW1lKTtcbn07XG5cbi8vIEBwYXJhbSB1cmwge1N0cmluZ30gVVJMIHRvIE1ldGVvciBhcHAsXG4vLyAgICAgZS5nLjpcbi8vICAgICBcInN1YmRvbWFpbi5tZXRlb3IuY29tXCIsXG4vLyAgICAgXCJodHRwOi8vc3ViZG9tYWluLm1ldGVvci5jb21cIixcbi8vICAgICBcIi9cIixcbi8vICAgICBcImRkcCtzb2NranM6Ly9kZHAtLSoqKiotZm9vLm1ldGVvci5jb20vc29ja2pzXCJcblxuLyoqXG4gKiBAc3VtbWFyeSBDb25uZWN0IHRvIHRoZSBzZXJ2ZXIgb2YgYSBkaWZmZXJlbnQgTWV0ZW9yIGFwcGxpY2F0aW9uIHRvIHN1YnNjcmliZSB0byBpdHMgZG9jdW1lbnQgc2V0cyBhbmQgaW52b2tlIGl0cyByZW1vdGUgbWV0aG9kcy5cbiAqIEBsb2N1cyBBbnl3aGVyZVxuICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIG9mIGFub3RoZXIgTWV0ZW9yIGFwcGxpY2F0aW9uLlxuICovXG5ERFAuY29ubmVjdCA9ICh1cmwsIG9wdGlvbnMpID0+IHtcbiAgdmFyIHJldCA9IG5ldyBDb25uZWN0aW9uKHVybCwgb3B0aW9ucyk7XG4gIGFsbENvbm5lY3Rpb25zLnB1c2gocmV0KTsgLy8gaGFjay4gc2VlIGJlbG93LlxuICByZXR1cm4gcmV0O1xufTtcblxuRERQLl9yZWNvbm5lY3RIb29rID0gbmV3IEhvb2soeyBiaW5kRW52aXJvbm1lbnQ6IGZhbHNlIH0pO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFJlZ2lzdGVyIGEgZnVuY3Rpb24gdG8gY2FsbCBhcyB0aGUgZmlyc3Qgc3RlcCBvZlxuICogcmVjb25uZWN0aW5nLiBUaGlzIGZ1bmN0aW9uIGNhbiBjYWxsIG1ldGhvZHMgd2hpY2ggd2lsbCBiZSBleGVjdXRlZCBiZWZvcmVcbiAqIGFueSBvdGhlciBvdXRzdGFuZGluZyBtZXRob2RzLiBGb3IgZXhhbXBsZSwgdGhpcyBjYW4gYmUgdXNlZCB0byByZS1lc3RhYmxpc2hcbiAqIHRoZSBhcHByb3ByaWF0ZSBhdXRoZW50aWNhdGlvbiBjb250ZXh0IG9uIHRoZSBjb25uZWN0aW9uLlxuICogQGxvY3VzIEFueXdoZXJlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdG8gY2FsbC4gSXQgd2lsbCBiZSBjYWxsZWQgd2l0aCBhXG4gKiBzaW5nbGUgYXJndW1lbnQsIHRoZSBbY29ubmVjdGlvbiBvYmplY3RdKCNkZHBfY29ubmVjdCkgdGhhdCBpcyByZWNvbm5lY3RpbmcuXG4gKi9cbkREUC5vblJlY29ubmVjdCA9IGNhbGxiYWNrID0+IHtcbiAgcmV0dXJuIEREUC5fcmVjb25uZWN0SG9vay5yZWdpc3RlcihjYWxsYmFjayk7XG59O1xuXG4vLyBIYWNrIGZvciBgc3BpZGVyYWJsZWAgcGFja2FnZTogYSB3YXkgdG8gc2VlIGlmIHRoZSBwYWdlIGlzIGRvbmVcbi8vIGxvYWRpbmcgYWxsIHRoZSBkYXRhIGl0IG5lZWRzLlxuLy9cbkREUC5fYWxsU3Vic2NyaXB0aW9uc1JlYWR5ID0gKCkgPT4ge1xuICByZXR1cm4gYWxsQ29ubmVjdGlvbnMuZXZlcnkoY29ubiA9PiB7XG4gICAgcmV0dXJuIGtleXMoY29ubi5fc3Vic2NyaXB0aW9ucykuZXZlcnkoaWQgPT4ge1xuICAgICAgcmV0dXJuIGNvbm4uX3N1YnNjcmlwdGlvbnNbaWRdLnJlYWR5O1xuICAgIH0pO1xuICB9KTtcbn07XG4iXX0=
