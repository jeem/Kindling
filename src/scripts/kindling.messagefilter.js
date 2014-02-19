kindling.module(function () {
  'use strict';

  var $lastTimestampMessage = null;

  function isLeaveMessage($message) {
    return $message.hasClass('leave_message') || $message.hasClass('kick_message');
  }

  function isEnterMessage($message) {
    return $message.hasClass('enter_message');
  }

  function isTimestampMessage($message) {
    return $message.hasClass('timestamp_message');
  }

  function isNoise($message) {
    var noisy = ["New Relic alert", "Supplier M"];
    for (var n = 0; n < noisy.length; n++ ) {
      if ($message.text().indexOf(noisy[n]) != -1)
        return true;
    }
    return false;
  }

  function showMessage($message) {
    if ($message) {
      $message.removeClass('hidden_message');
    }
  }

  function hideMessage($message) {
    if ($message) {
      $message.addClass('hidden_message');
    }
  }

  function shouldHideThisMessage($message, options) {
    return (isNoise($message)) ||
           (options.leaveRoom === 'false' && isLeaveMessage($message)) ||
           (options.enterRoom === 'false' && isEnterMessage($message)) ||
           (options.timeStamps === 'false' && isTimestampMessage($message));
  }

  function filterMessage(e, options, username, message) {
    var $message = $(message);

    if (options.playMessageSounds === 'false') {
      $message.find('[data-sound]').removeAttr('data-sound');
    }

    if ($message.hasClass("message")) {
      var hideCurrentMessage = shouldHideThisMessage($message, options);

      if (isTimestampMessage($message)) {
        hideMessage($lastTimestampMessage);
        $lastTimestampMessage = $message;
      } else if(!hideCurrentMessage) {
        $lastTimestampMessage = null;
      }

      if (hideCurrentMessage) {
        hideMessage($message);
      } else {
        showMessage($message);
      }
    }
  }

  function filterMessages(e, options) {
    if (options) {
      $('#chat-wrapper .message').each(function(index, message) {
        filterMessage(e, options, null, message);
      });

      hideMessage($lastTimestampMessage);
      kindling.scrollToBottom();
    }
  }

  return {
    init: function () {
      $.subscribe('optionsChanged', filterMessages);
      $.subscribe('newMessage', filterMessage);
    }
  };
}());
