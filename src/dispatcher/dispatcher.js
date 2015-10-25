"use strict";

import { Dispatcher }                 from "flux";

import dispatcherCallback             from "src/dispatcher/dispatcherCallback";


const dispatcher = new Dispatcher();
dispatcher.register(dispatcherCallback);

export default dispatcher;
