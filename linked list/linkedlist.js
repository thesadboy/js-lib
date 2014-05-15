/**
 * Created by Nick on 14-5-15.
 */
(function (window) {
  /**
   * 链表节点对象
   * @param data
   * @constructor
   */
  var Node = function (data) {
    this.data = data;
    this.next = null;
  };
  /**
   * 链表对象
   * @constructor
   */
  var LinkedList = function () {
    this.size = 0;
    this.head = null;
  };

  /**
   * 链表原型方法
   * @type {{_testIndex: _testIndex, insert: insert, insertBefore: insertBefore, insertAfter: insertAfter, replace: replace, remove: remove, get: get, swap: swap, getIterator: getIterator, all: all}}
   */
  LinkedList.prototype = {
    constructor: LinkedList,
    /**
     * 查询index是否越界
     * @param index
     * @private
     */
    _testIndex: function (index) {
      if (isNaN(index)) {
        throw  Error('Index must be a Integer');
      }
      if (index > this.size - 1 || index < 0) {
        throw Error('List Index Out Of Bounds');
      }
    },
    /**
     * 向链表末尾插入数据
     * @param data
     * @returns {LinkedList}
     */
    insert: function (data) {
      this.size++;
      var node = new Node(data);
      if (this.head == null) {
        this.head = node;
      } else {
        var tmp = this.head;
        while (tmp.next != null) {
          tmp = tmp.next;
        }
        tmp.next = node;
      }
      return this;
    },
    /**
     * 在某个位置前插入一个数据
     * @param index
     * @param data
     * @returns {LinkedList}
     */
    insertBefore: function (index, data) {
      this._testIndex(index);
      this.size++;
      var node = new Node(data);
      var pos = 0;
      var prev = this.head;
      var current;
      while (pos < index - 1) {
        prev = prev.next;
        pos++;
      }
      current = prev.next;
      if (index == 0) {
        this.head = node;
        current = prev;
      } else {
        prev.next = node;
      }
      node.next = current;
      return this;
    },
    /**
     * 在某个位置后插入一个数据
     * @param index
     * @param data
     * @returns {LinkedList}
     */
    insertAfter: function (index, data) {
      this._testIndex(index);
      this.size++;
      var node = new Node(data);
      var pos = 0;
      var current = this.head;
      var next;
      while (pos < index) {
        current = current.next;
        pos++;
      }
      next = current.next;
      current.next = node;
      node.next = next;
      return this;
    },
    /**
     * 将某个位置的数据替换掉
     * @param index
     * @param data
     * @returns {LinkedList}
     */
    replace: function (index, data) {
      this._testIndex(index);
      var node = new Node(data);
      var pos = 0;
      var prev = this.head;
      var current;
      var next;
      while (pos < index - 1) {
        prev = prev.next;
        pos++;
      }
      current = prev.next;
      next = current.next;
      if (index == 0) {
        this.head = node;
        next = current;
      } else {
        prev.next = node;
      }
      node.next = next;
      return this;
    },
    /**
     * 将某个位置的数据删除
     * @param index
     * @returns {LinkedList}
     */
    remove: function (index) {
      this._testIndex(index);
      this.size--;
      if (index == 0) {
        this.head = this.head.next;
      } else {
        var pos = 0;
        var prev = this.head;
        var current;
        var next;
        while (pos < index - 1) {
          prev = prev.next;
          pos++;
        }
        current = prev.next;
        next = current.next;
        prev.next = next;
      }
      return this;
    },
    /**
     * 获取某个位置的数据
     * @param index
     * @returns {*}
     */
    get: function (index) {
      this._testIndex(index);
      var pos = 0;
      var current = this.head;
      while (pos < index) {
        current = current.next;
        pos++;
      }
      return current.data;
    },
    /**
     * 将某两个位置的数据交换
     * @param indexA
     * @param indexB
     * @returns {LinkedList}
     */
    swap: function (indexA, indexB) {
      if (indexA == indexB) return this;
      this._testIndex(indexA);
      this._testIndex(indexB);
      if (indexA > indexB) {
        var tmp = indexA;
        indexA = indexB;
        indexB = tmp;
      }
      var posA = 0;
      var posB = 0;
      var prevA = this.head;
      var prevB = this.head;
      var currentA;
      var currentB;
      var nextA;
      var nextB;
      while (posA < indexA - 1) {
        prevA = prevA.next;
        posA++;
      }
      currentA = prevA.next;
      nextA = currentA.next;
      while (posB < indexB - 1) {
        prevB = prevB.next;
        posB++;
      }
      currentB = prevB.next;
      nextB = currentB.next;
      if (indexA == 0) {
        nextA = currentA;
        currentA = prevA;
        this.head = currentB;
      } else {
        currentB = prevB.next;
        nextB = currentB.next;
        prevA.next = currentB;
      }
      currentB.next = nextA;
      prevB.next = currentA;
      currentA.next = nextB;
      return this;
    },
    /**
     * 获取迭代器对象
     * @returns {{hasNext: hasNext, next: next}}
     */
    getIterator: function () {
      var that = this;
      var tmp;
      var next;
      return {
        hasNext: function () {
          return (tmp || that.head).next != null;
        },
        next: function () {
          if (!tmp) {
            next = that.head;
          } else {
            next = tmp.next;
          }
          tmp = next;
          return next.data;
        }
      };
    },
    /**
     * 获取链表中的所有数据
     * @returns {{}}
     */
    all: function () {
      var result = {};
      var iterator = this.getIterator();
      var pos = 0;
      while (iterator.hasNext()) {
        result[pos] = iterator.next();
        pos++;
      }
      return result;
    }
  };
  window.LinkedList = LinkedList;
})(window);