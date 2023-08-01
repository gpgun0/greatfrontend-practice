const obj = {
  test: () => {
    console.log(this);
  },
  test2: function () {
    console.log(this);
  },
};

obj.test();
obj.test2();

// logs
// {}
// { test: [Function: test], test2: [Function: test2] }
