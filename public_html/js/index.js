/* Init Skygear */ 
skygear.config({
  'endPoint': 'https://iotsample.skygeario.com/',
  'apiKey': 'fe8bc005f8cb4f8b92b187dee6e96f6f',
}).then(() => {
  console.log('skygear container is now ready for making API calls.');

  setupDeviceUser();

}, (error) => {
  console.error(error);
});

// We are going to make sure the web panel has a current user,
// if not, we will sign up one anonymously
function setupDeviceUser () {
  if (skygear.currentUser) {
    $('.currentUserId').text(skygear.currentUser.id);
    subscribeAllHandlers();
  } else {
    skygear.signupAnonymously().then((user) => {
      console.log(user); // user object with undefined email and username
      $('.currentUserId').text(skygear.currentUser.id);
      subscribeAllHandlers();
    }, (error) => {
      console.error(error);
    });
  }
}

/** Pubsub **/
// Subscribe to ping events
function subscribePing() {
  skygear.on('ping', (data) => {
    console.log(data);
    replyToPing();
  });
}

// Subscribe to reply events
function subscribeReply() {
    // whenever a device replies
  skygear.on('reply', (data) => {
    console.log('A device replied!');

    $("#p2").hide(); // hide the progress bar when there is ping reply data
    statusTable.updateRecord(data)
  });
}

// We also subscribe to Report saved event
function subscribeReportSaved() {
  skygear.on('report-saved', (data) => {
    console.log(data);
    var reportId = data._id;
    var content = data.content;
    var message =  ''+ content + ' (' + reportId + ')';
    showReportToast(message);
  });
}

// A wrapper for all subscriptions
function subscribeAllHandlers() {
  subscribePing();
  subscribeReply();
  subscribeReportSaved();
}

// We can initiate a ping from the web pannel
function pingDevices() {
  skygear.pubsub.publish('ping',{msg:"from web pannel"});
}

// The web pannel will reply to the ping also
function replyToPing() {
  skygear.pubsub.publish('reply',{
    device: skygear.currentUser.id,
    platform: 'web pannel',
    lastReply: Date()
  });
}

/* UI */
// The status table view controller
var statusTable = null;
var statusTableEl = $('.status-table');
var statusRecordTemplate = '<tr class="status-record-row"> \
        <td class="mdl-data-table__cell--non-numeric device"></td> \
        <td class="platform"></td> \
        <td class="report-time"></td> \
        </tr>';

function StatusTable (el) {
  this.el = el;
  this.updateRecord = function(replyObject) {
    console.log(replyObject);
    var id = replyObject.device;
    var viewArray = findRecordView(id);
    var view = null;
    if(viewArray.length == 0) {
       view = createRecordView(id);
       el.append(view);
    } else {
      view = viewArray[0];
    }

    $(view).find('.platform').text(replyObject.platform);
    $(view).find('.report-time').text(replyObject.lastReply);

  }

  var findRecordView = function(deviceId) {
    var view = el.find('.status-record-row[data-deviceID="'+deviceId+'"]');
    return view;
  }

  var createRecordView = function(deviceId) {
    var view = $(statusRecordTemplate);
    var deviceView = view.find('.device');
    view.attr('data-deviceId', deviceId);
    deviceView.text(deviceId);
    return view;
  }

}

function showReportToast(message) {
  var snackbarContainer = document.querySelector('#demo-toast-example');
  var showToastButton = document.querySelector('#demo-show-toast');
  snackbarContainer.MaterialSnackbar.showSnackbar({message: message});
}


// Ready function when the app is loaded
$().ready(function(){
  statusTable = new StatusTable(statusTableEl);
})

// Button events
$('.ping-button').on('click',function(e){
  pingDevices();
})