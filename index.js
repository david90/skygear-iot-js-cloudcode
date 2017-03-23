'use strict';

const skygear = require('skygear');
const skygearCloud = require('skygear/cloud');

const { getContainer,
  createUser } = require('./util');


function pingDevices() {
  console.log('ping devices');
  // load all registered devices

  // ping them

}

/* Auto ping every 1 minute */
skygearCloud.every('0 * * * * *', function () {
  console.log('in headsup schedule cronjob');
  pingDevices();
});

/* Manually ping through endpoint /ping-devices */
skygearCloud.handler('/ping-devices', function (req) {
  console.log('Will ping devices');
  pingDevices();
  return 'Ping';
});
