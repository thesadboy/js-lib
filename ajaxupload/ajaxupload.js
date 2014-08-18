/**
 * Created by Nick on 14-7-26.
 */
(function (window, $) {
  window.AjaxUpload = function (options) {
    var $default = {
      id: '',
      url: '',
      params: {},
      timeout: null,
      success: null,
      time: 60000
    };
    var frame, form;
    var file = $('#' + options.id);
    var parent = file.parent();
    var timestamp;
    options = $.extend({}, $default, options);
    if (options.url.indexOf('?') > -1) {
      options.url += '&callback=AjaxUploadCallBack';
    } else {
      options.url += '?callback=AjaxUploadCallBack';
    }
    if (!file.data('ajax-file-upload')) {
      timestamp = new Date().getTime();
      file.data('ajax-file-upload', timestamp);
      frame = $('<iframe style="width: 0; height: 0; border: 0; display: none;"></iframe>').attr('id', 'frame-' + timestamp).attr('name', timestamp);
      form = $('<form method="post" enctype="multipart/form-data"></form>').attr('id', 'form-' + timestamp).attr('target', timestamp).attr('action', options.url);
      $(document.body).append(frame);
      $(document.body).append(form);
    } else {
      timestamp = file.data('ajax-file-upload');
      form = $('#form-' + timestamp);
    }
    if (!file.val()) {
      return;
    }
    /**
     * 将file域还原
     */
    var reset = function () {
      file.attr('value', '');
      form.get(0).reset();
      parent.append(file);
    };
    form.empty().append(file);
    for (var key in options.params) {
      form.append('<input type="hidden" name="' + key + '" value="' + options.params[key] + '">');
    }

    window.AjaxUploadCallBack = AjaxUploadCallBack = function (data) {
      options.success && options.success(data);
      reset();
    };
    setTimeout(function () {
      if (frame.get(0).contentWindow.document.body.childNodes.length < 1 && frame.get(0).contentWindow.document.head.childNodes.length < 1) {
        frame.attr('src', '');
        options.timeout && options.timeout();
        reset();
      }
    }, options.time);
    form.get(0).submit();
  };
})(window, jQuery);