/**
 * HashMap
 * 实现了put、get、remove、containsKey、containsValue方法
 * Created by Nick on 14-5-15.
 */
(function (window) {
  var Entry = function (key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  };
  /**
   * HashMap 对象
   * @param length
   * @constructor
   */
  var HashMap = function (length) {
    this.size = 0;
    this.length = (length && !isNaN(length)) ? parseInt(length) : 256;
    this.loadFactor = 0.75;
    this.table = new Array(this.length);
  };
  /**
   * HashMap原型方法
   * @type {{constructor: HashMap, _hash: _hash, _indexFor: _indexFor, _refresh: _refresh, put: put, get: get, remove: remove, containsKey: containsKey, containsValue: containsValue}}
   */
  HashMap.prototype = {
    constructor: HashMap,
    /**
     * 获取hash值
     * @param str
     * @returns {number}
     * @private
     */
    _hash: function (str) {
      str = str + "";
      var h = 0, off = 0;
      var len = str.length;
      for (var i = 0; i < len; i++) {
        h = 31 * h + str.charCodeAt(off++);
        if (h > 0x7fffffff || h < 0x80000000) {
          h = h & 0xffffffff;
        }
      }
      return h;
    },
    /**
     * 获取对应桶的坐标
     * @param key
     * @returns {number}
     * @private
     */
    _indexFor: function (key) {
      return this._hash(key) & (this.length - 1);
    },
    /**
     * size超出loadFactor * length值后进行自动增加
     * @private
     */
    _refresh: function () {
      this.size = 0;
      var tmpTable = [];
      var pos;
      for (pos = 0; pos < this.length; pos++) {
        this.table[pos] && tmpTable.push(this.table[pos]);
      }
      this.length = this.length * 2;
      this.table = new Array(length);
      for (pos = 0, length = tmpTable.length; pos < length; pos++) {
        var entry = tmpTable[pos];
        this.put(entry.key, entry.value);
      }
    },
    /**
     * 判断给定的对象是否为null或undefined
     * @param obj
     * @returns {boolean}
     * @private
     */
    _isBlank: function (obj) {
      return obj == null || obj == undefined;
    },
    /**
     * 向HashMap中增加一个值
     * @param key
     * @param value
     * @returns {HashMap}
     */
    put: function (key, value) {
      if (this._isBlank(key) || this._isBlank(value)) return this;
      var entry = new Entry(key, value);
      var index = this._indexFor(key);
      //如果该位置没有值，则将值放到此位置
      var tmp = this.table[index];
      if (!tmp) {
        this.table[index] = entry;
        this.size++;
      } else {
        //该位置有值
        //判断该值的key与当前key是否相等，相等则替换值
        if (tmp.key === key) {
          tmp.value = value;
        } else {
          //不相等（散列冲突），访问链表看是否有相等，有则替换值，没有则追加到链表末尾
          var found = false;
          while (tmp.next) {
            tmp = tmp.next;
            if (tmp.key === key) {
              found = true;
              tmp.value = value;
            }
          }
          if (!found) {
            tmp.next = entry;
            entry.prev = tmp;
            this.size++;
          }
        }
      }
      if (this.size > this.length * this.loadFactor) this._refresh();
      return this;
    },
    /**
     * 获取HashMap中指定Key的值
     * @param key
     * @returns {*}
     */
    get: function (key) {
      if (this._isBlank(key)) return null;
      var index = this._indexFor(key);
      var tmp = this.table[index];
      if (tmp) {
        if (!tmp.next && tmp.key === key) {
          return tmp.value;
        } else {
          while (tmp.next) {
            tmp = tmp.next;
            if (tmp.key === key) {
              return tmp.value;
            }
          }
        }
      }
      return null;
    },
    /**
     * 删除Map中指定的值
     * @param key
     * @returns {*}
     */
    remove: function (key) {
      if (this._isBlank(key)) return null;
      var index = this._indexFor(key);
      var tmp = this.table[index];
      if (tmp) {
        if (tmp.key === key) {
          this.table[index] = tmp.next;
          this.size--;
          return tmp;
        } else {
          var prev;
          while (tmp.next) {
            prev = tmp;
            tmp = prev.next;
            if (tmp.key === key) {
              prev.next = tmp.next;
              this.size--;
              return tmp;
            }
          }
        }
      }
    },
    /**
     * Map中是否包含有key
     * @param key
     * @returns {boolean}
     */
    containsKey: function (key) {
      if (this._isBlank(key)) return false;
      var index = this._indexFor(key);
      var tmp = this.table[index];
      if (tmp) {
        if (tmp.key === key) {
          return true;
        }
        while (tmp.next) {
          tmp = tmp.next;
          if (tmp.key === key) {
            return true;
          }
        }
      }
      return false;
    },
    /**
     * Map中是否包含有给定的值
     * @param value
     * @returns {boolean}
     */
    containsValue: function (value) {
      if (this._isBlank(value)) return false;
      for (var pos = 0; pos < this.length; pos++) {
        var tmp = this.table[pos];
        if (tmp) {
          if (tmp.value === value) {
            return true;
          }
          while (tmp.next) {
            tmp = tmp.next;
            if (tmp.value === value) {
              return true;
            }
          }
        }
      }
      return false;
    }
  };
  window.HashMap = HashMap;
})(window);