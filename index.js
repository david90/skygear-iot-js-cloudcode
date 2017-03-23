'use strict';

const skygear = require('skygear');
const skygearCloud = require('skygear/cloud');

const { getContainer,
  createUser } = require('./util');


function pingDevices() {
  console.log('ping devices');
  // load all registered devices

  // ping them
  skygear.pubsub.publish('ping', {msg: 'nothing'});

}

/* Auto ping every 1 minute */
skygearCloud.every('0 * * * * *', function () {
  console.log('in scheduled ping cronjob');
  pingDevices();
});

/* Manually ping through endpoint /ping-devices */
skygearCloud.handler('/ping-devices', function (req) {
  console.log('Will ping devices');
  pingDevices();
  return 'Ping';
});
