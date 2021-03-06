'use strict';

const skygear = require('skygear');
const skygearCloud = require('skygear/cloud');

const { getContainer,
  createUser } = require('./util');

const adminId = '7fa953c3-20eb-4144-9d85-e029cd8c75a6'; // Hard-coded an admin user ID


/* Ping device -> send an event to the ping channel  */
function pingDevices() {
  console.log('ping devices');
  var container = getContainer(adminId);
  container.pubsub.connect();
  container.pubsub.publish('ping', {msg: 'from scheduled system'});
}

/* Auto ping every 30 sec */
skygearCloud.every('*/30 * * * * *', function () {
  console.log('in scheduled ping cronjob');
  pingDevices();
});

/* Manually ping through endpoint /ping-devices */
skygearCloud.handler('/ping-devices', function (req) {
  console.log('Will ping devices');
  pingDevices();
  return 'Ping';
});

/* After Save trigger when the Report record is saved */
skygearCloud.afterSave('Report', function afterSaveReport(record, orig) {
    console.log('afterSave Report');

    var container = getContainer(adminId);
    container.pubsub.connect();
    container.pubsub.publish('report-saved', record);
});
