/**
 * Created by Nick on 14-5-13.
 */
(function ($) {
  var msgs = {
    'email': '请输入合法的Email地址',
    'url': '请输入合法的URL地址',
    'required': '该项目为必填项目',
    'parameter': '输入的格式不符合要求',
    'maxlength': '不能输入超过{0}个字符',
    'minlength': '请输入至少{0}个字符',
    'rangelength': '输入字符长度应介于{0}和{1}之间',
    'max': '请输入小于{0}的值',
    'min': '请输入大于{0}的值',
    'range': '输入值应介于{0}和{1}之间',
    'equal': '两次输入不一致'
  };
  var reg = {
    'email': /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    'url': /^((https|http|ftp|rtsp|mms):\/\/)?[a-z0-9A-Z]{3}\.[a-z0-9A-Z][a-z0-9A-Z]{0,61}?[a-z0-9A-Z]\.com|net|cn|cc (:s[0-9]{1-4})?\/$/
  };
  /**
   * 表单验证，回调函数中返回false即可阻止默认提交事件
   * @param opts
   * @param success
   */
  $.fn.validate = function (opts, success) {
    var defOpts = {
      'inputError': 'input-error',
      'msgError': 'msg-error'
    };
    if (typeof opts == 'function') {
      success = opts;
      opts = {};
    }
    success = success || function () {
      alert('校验成功，但是未设置校验成功回调函数');
      return false;
    };
    opts = $.extend(defOpts, opts);

    var form = this[0].tagName.toLowerCase() == 'form' ? this : $(this.find('form')[0]);
    if (form.length == 0) return;
    var eles = form.find('[validated]');
    //添加各类事件
    eles.on('change, blur', function () {
      verify(this);
    });
    form.on('submit', function (e) {
      for (var i = 0; i < eles.length; i++) {
        var ele = eles[i];
        if (!verify(ele)) {
          ele.focus();
          return false;
        }
      }
      return success(e);
    });
    //针对equalTo情况特殊处理，需要相互映射
    $.each(eles.filter('[equal]'), function (index, item) {
      item = $(item);
      $(item.attr('equal')).attr('equal', '#' + item.attr('id')).data('re', true);
    });
    var verify = function (item) {
      item = $(item);
      if (item.css('display') == 'none') return;
      var isvalid = true;
      var rkey;
      var rcd;
      var value = item.val();
      var conditions = {
        'email': item.attr('type') == 'email',
        'url': item.attr('type') == 'url',
        'number': item.attr('type') == 'number',
        'required': item.attr('required') ? true : false,
        'parameter': item.attr('parameter'),
        'maxlength': item.attr('maxlength'),
        'minlength': item.attr('minlength'),
        'rangelength': item.attr('rangelength'),
        'max': item.attr('max'),
        'min': item.attr('min'),
        'range': item.attr('range'),
        'equal': item.attr('equal')
      };
      for (var key in conditions) {
        var cd = conditions[key];
        if (isvalid && (cd != undefined && cd != null && cd)) {
          rkey = key;
          rcd = cd;
          switch (key) {
            case 'required' :
            {
              if ($.trim(value).length < 1) isvalid = false;
              break;
            }
            case 'email' :
            {
              if (value.length > 0 && !reg[key].test(value)) isvalid = false;
              break;
            }
            case 'url' :
            {
              if (value.length > 0 && !reg[key].test(value)) isvalid = false;
              break;
            }
            case 'number':
            {
              if (value.length > 0 && isNaN(value)) isvalid = false;
              break;
            }
            case 'parameter' :
            {
              if (value.length > 0 && !new RegExp(cd).test(value)) isvalid = false;
              break;
            }
            case 'maxlength':
            {
              if (value.length > 0 && value.length > cd) isvalid = false;
              break;
            }
            case 'minlength':
            {
              if (value.length < cd) isvalid = false;
              break;
            }
            case 'rangelength':
            {
              var rl = $.parseJSON(cd);
              if (value.length > 0 && (value.length < Math.min.apply(null, rl) || value.length > Math.max.apply(null, rl))) isvalid = false;
              break;
            }
            case 'max':
            {
              if (value.length > 0 && (isNaN(value) || value > cd)) isvalid = false;
              break;
            }
            case 'min':
            {
              if (value.length > 0 && (isNaN(value) || value < cd)) isvalid = false;
              break;
            }
            case 'range':
            {
              var rg = $.parseJSON(cd);
              if (value.length > 0 && (isNaN(value) || value < Math.min.apply(null, rg) || value > Math.max.apply(null, rg))) isvalid = false;
              break;
            }
            case 'equal':
            {
              if (value != $(cd).val()) isvalid = false;
            }
          }
        }
      }
      if (isvalid) {
        hideError(item, rkey);
      } else {
        if (rkey == 'equal' && !item.data('re')) {
          hideError(item);
        }
        showError(item, rkey, rcd);
      }
      return isvalid;
    };

    var hideError = function (item, key) {
      if (key && key == 'equal' && !item.data('re')) {
        $(item.attr('equal')).removeClass(opts.inputError).next('div.' + opts.msgError).remove();
      }
      item.removeClass(opts.inputError).next('div.' + opts.msgError).remove();
    };
    var showError = function (item, key, condition) {
      var msg = msgs[key];
      condition = condition.toString().replace(/[\[\]]/g, '').split(',');
      for (var i = 0; i < condition.length; i++) {
        msg = msg.replace(new RegExp("\\{" + i + "\\}", "g"), condition[i]);
      }
      if (key == 'equal' && !item.data('re')) {
        item = $(item.attr('equal'));
      }
      msg = item.attr('msg') || msg;
      item.addClass(opts.inputError);
      item.next('div.' + opts.msgError).remove();
      item.after(['<div class=', opts.msgError, '>', msg, '</div>'].join(''));
    }
  };
})(jQuery);