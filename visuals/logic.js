/*Downloaded from https://www.codeseek.co/fenwick/xmb-ripoff-ozmpqb */
var ICON_SIZE = 100;
var PADDING = 10;

//todo: pull model from XHR or some

var model = {
  cursor: {
    x: 0,
    y: 0
  },
  columns: {
    "settings": {
      index: 0,
      title: "settings",
      selectedIndex: 0,
      active: false,
      icon: "settings_applications",
      items: [{ title: "info", subtitle: "subtitle", active: false, icon: "info" }, { title: "grade", subtitle: "subtitle", active: false, icon: "grade" }, { title: "toll", subtitle: "subtitle", active: false, icon: "toll" }, { title: "info", subtitle: "subtitle", active: false, icon: "info" }, { title: "grade", subtitle: "subtitle", active: false, icon: "grade" }, { title: "toll", subtitle: "subtitle", active: false, icon: "toll" }]
    },
    "explore": {
      index: 1,
      title: "karaoke",
      selectedIndex: 1,
      active: false,
      icon: "face",
      items: [{ title: "face", subtitle: "subtitle", active: false, icon: "face" }, { title: "favorite", subtitle: "subtitle", active: false, icon: "favorite" }]
    },
    "play_arrow": {
      index: 2,
      title: " Play",
      selectedIndex: 1,
      active: false,
      icon: "play_arrow",
      items: [{ title: "edit", subtitle: "subtitle", active: false, icon: "edit" }, { title: "gesture", subtitle: "subtitle", active: false, icon: "gesture" }]
    },
    "settings2": {
      index: 3,
      title: "visuals",
      selectedIndex: 0,
      active: false,
      icon: "analytics",
      items: [{ title: "info", subtitle: "subtitle", active: false, icon: "info" }, { title: "grade", subtitle: "subtitle", active: false, icon: "grade" }, { title: "toll", subtitle: "subtitle", active: false, icon: "toll" }]
    },
    "settings4": {
      index: 4,
      title: "add music",
      selectedIndex: 0,
      active: false,
      icon: "add_circle",
      items: [{ title: "info", subtitle: "subtitle", active: false, icon: "info" }, { title: "grade", subtitle: "subtitle", active: false, icon: "grade" }, { title: "toll", subtitle: "subtitle", active: false, icon: "toll" }]
    }
  }

  //add zero position to each column and item
};_.each(model.columns, function (c) {
  c.position = { x: 0, y: 0 };
  _.each(c.items, function (i) {
    i.position = {
      x: 0,
      y: 0
    };
  });
});

var xmbVue = new Vue({
  el: "#xmb",
  data: model,
  methods: {
    handleKey: function handleKey(dir, val) {
      this.cursor[dir] += val;
      var nCols = this.nColumns;

      // wrap x
      this.cursor.x = this.cursor.x % nCols;
      if (this.cursor.x < 0) {
        this.cursor.x = this.cursor.x + nCols;
      }

      //wrap y
      var nRows = this.nRows;
      this.cursor.y = this.cursor.y % nRows;
      if (this.cursor.y < 0) {
        this.cursor.y = this.cursor.y + nRows;
      }

      this.highlightCell(this.cursor.x, this.cursor.y);
    },
    highlightCell: function highlightCell(column, row) {

      console.log(column, row);
      //update position of elements as well
      var xAccum = (-column - 1) * (ICON_SIZE + PADDING);
      if (column == 0) {
        xAccum += ICON_SIZE + PADDING;
      }
      var yAccum;

      _.each(this.columns, function (col, colKey) {
        col.active = false;
        yAccum = -(ICON_SIZE + PADDING) * (row + 1);

        col.position.x = xAccum;
        xAccum += ICON_SIZE + PADDING;
        if (column === col.index || column === col.index + 1) {
          xAccum += ICON_SIZE / 2;
        }

        _.each(col.items, function (item, rowN) {
          if (rowN == row && col.index == column) {
            item.active = true;
            col.active = true;
          } else {
            item.active = false;
          }

          if (rowN == row) {
            yAccum += ICON_SIZE + PADDING;
          }
          yAccum += ICON_SIZE + PADDING;
          item.position.y = yAccum;
        });
      });
      this.cursor.y = row;
      this.cursor.x = column;
    }
  },
  watch: {
    cursor: function cursor(e) {
      console.log('cursor mutated', e);
    }
  },
  computed: {
    nColumns: function nColumns() {
      return Object.keys(this.columns).length;
    },
    nRows: function nRows() {
      //get the row at the current index
      var row = this.columnsArray[this.cursor.x];
      if (!row) {
        console.log('invalid row index: ', this.cursor.x);
        return 0;
      }
      return row.items.length; //todo: number of columns in this row
    },
    columnsArray: function columnsArray() {
      var _this = this;

      //get columns in an array
      var arr = [];
      Object.keys(this.columns).forEach(function (key) {
        arr.push(_this.columns[key]);
      });
      return _.sortBy(arr, 'index');
    }
  },
  created: function created() {
    _.each(this.columns, function (column) {
      _.each(column.items, function (item) {
        item.active = false;
      });
    });
    this.highlightCell(this.cursor.x, this.cursor.y);
  }
});

// handle movement based on keys
$('body').on('keyup', function (e) {
  if (e.key == "ArrowUp") {
    xmbVue.handleKey('y', -1);
  } else if (e.key == "ArrowDown") {
    xmbVue.handleKey('y', 1);
  } else if (e.key == "ArrowLeft") {
    xmbVue.handleKey('x', -1);
  } else if (e.key == "ArrowRight") {
    xmbVue.handleKey('x', 1);
  }
});

$('body').on("mousewheel", _.throttle(scrollHandler, 10));

function scrollHandler(e) {
  console.log(e);
  if (e.deltaX) {
    xmbVue.handleKey('x', Math.sign(e.deltaX));
  }
  if (e.deltaY) {
    xmbVue.handleKey('y', Math.sign(e.deltaY));
  }
}
