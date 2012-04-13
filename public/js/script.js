(function() {
  var amp, code, dom, node, t, valide;

  amp = 1;

  t = 1;

  dom = {
    txt_char: $('#text'),
    txt_frec: $('#frec'),
    txt_amp: $('#amp'),
    txt_code: $('#code'),
    cb_codes: $('#combo'),
    box_debg: $('.debug'),
    ico_load: $('.load'),
    inputs: $('	input'),
    graph: $('#graph'),
    graph_line_code: $('#graph_line_code'),
    numbers: $('.number')
  };

  valide = {
    bin: function(event) {
      if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39) || event.keyCode === 110) {
        return true;
      } else if ((event.keyCode < 48 || event.keyCode > 49) && (event.keyCode < 96 || event.keyCode > 105)) {
        return event.preventDefault();
      }
    }
  };

  node = {
    init: function() {
      var _this = this;
      dom.numbers.on('keydown', function(event) {
        return valide.bin(event);
      });
      dom.txt_char.on('keyup', function() {
        return _this._change();
      });
      dom.txt_frec.on('keyup change click', function() {
        return _this._change();
      });
      dom.txt_amp.on('keyup change click', function() {
        return _this._change();
      });
      dom.cb_codes.on('change', function() {
        return _this._change();
      });
      dom.txt_code.text(dom.cb_codes.val());
      dom.inputs.prop('disabled', false);
      dom.ico_load.remove();
      return $('header, div, footer').removeClass('hide');
    },
    _change: function() {
      var char, i, new_char, _ref;
      amp = parseInt(dom.txt_amp.val()) || 1;
      t = 1 / parseInt(dom.txt_frec.val()) || 1;
      char = dom.txt_char.val();
      dom.txt_code.text(dom.cb_codes.val());
      new_char = [];
      for (i = 0, _ref = char.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        new_char.push(parseInt(char[i]));
      }
      if (new_char.length > 0) {
        this._plot(new_char);
        switch (dom.cb_codes.val()) {
          case "adi":
            return this._plot_code_line(code.adi(new_char));
          case "ami":
            return this._plot_code_line(code.ami(new_char));
          case "cmi":
            return this._plot_code_line(code.cmi(new_char));
          case "manchester":
            return this._plot_code_line(code.manchester(new_char));
          case "b8zs":
            return this._plot_code_line(code.b8zs(new_char));
          case "hdb3":
            return this._plot_code_line(code.hdb3(new_char));
        }
      }
    },
    _plot: function(val) {
      var k, options, p, points, x, _ref, _ref2, _ref3;
      options = {
        series: {
          lines: {
            show: true
          },
          points: {
            show: true
          }
        }
      };
      console.log(amp);
      points = [];
      k = 0;
      for (x = 0, _ref = val.length - 1; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
        for (p = k, _ref2 = k + t, _ref3 = t / 50; k <= _ref2 ? p <= _ref2 : p >= _ref2; p += _ref3) {
          points.push([p, val[x] * amp]);
        }
        k += t;
      }
      return $.plot(dom.graph, [points]);
    },
    _plot_code_line: function(val) {
      var k, p, points, x, _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
      console.log(amp);
      points = [];
      k = 0;
      if (dom.cb_codes.val() === "cmi" || dom.cb_codes.val() === "manchester") {
        for (x = 0, _ref = val.length - 1; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
          for (p = k, _ref2 = k + t / 2, _ref3 = t / 100; k <= _ref2 ? p <= _ref2 : p >= _ref2; p += _ref3) {
            points.push([p, val[x] * amp]);
          }
          k += t / 2;
          points.push([k, val[x] * amp]);
        }
      } else {
        for (x = 0, _ref4 = val.length - 1; 0 <= _ref4 ? x <= _ref4 : x >= _ref4; 0 <= _ref4 ? x++ : x--) {
          for (p = k, _ref5 = k + t, _ref6 = t / 50; k <= _ref5 ? p <= _ref5 : p >= _ref5; p += _ref6) {
            points.push([p, val[x] * amp]);
          }
          k += t;
        }
      }
      return $.plot(dom.graph_line_code, [points], {
        grid: {
          clickable: true
        }
      });
    }
  };

  code = {
    adi: function(char) {
      var adi, i, _ref, _ref2;
      adi = [];
      for (i = 0, _ref = char.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        adi.push(char[i]);
      }
      for (i = 1, _ref2 = adi.length - 1; i <= _ref2; i += 2) {
        adi[i] = adi[i] === 1 ? 0 : 1;
      }
      return adi;
    },
    ami: function(char) {
      var adi, flag, i, _ref, _ref2;
      adi = [];
      flag = false;
      for (i = 0, _ref = char.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        adi.push(char[i]);
      }
      for (i = 1, _ref2 = adi.length - 1; 1 <= _ref2 ? i <= _ref2 : i >= _ref2; 1 <= _ref2 ? i++ : i--) {
        if (adi[i] !== 0) {
          if (flag) {
            adi[i] = 1;
            flag = false;
          } else {
            adi[i] = -1;
            flag = true;
          }
        }
      }
      return adi;
    },
    cmi: function(char) {
      var adi, flag, i, _ref;
      adi = [];
      flag = true;
      for (i = 0, _ref = char.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        if (char[i] === 0) {
          adi.push(0);
          adi.push(1);
        } else {
          if (flag) {
            adi.push(1);
            adi.push(1);
            flag = false;
          } else {
            adi.push(0);
            adi.push(0);
            flag = true;
          }
        }
      }
      return adi;
    },
    manchester: function(char) {
      var adi, i, _ref;
      adi = [];
      for (i = 0, _ref = char.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        if (char[i] === 0) {
          adi.push(1);
          adi.push(-1);
        } else {
          adi.push(-1);
          adi.push(1);
        }
      }
      return adi;
    },
    b8zs: function(char) {
      var ami, i, _ref;
      ami = this.ami(char);
      for (i = 0, _ref = ami.length - 9; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        if (ami[i] === 0 && ami[i + 1] === 0 && ami[i + 2] === 0 && ami[i + 3] === 0 && ami[i + 4] === 0 && ami[i + 5] === 0 && ami[i + 6] === 0 && ami[i + 7] === 0) {
          try {
            if (ami[i - 1] === 1 || ami[i - 1] === 1) {
              ami[i + 3] = 1;
              ami[i + 4] = -1;
              ami[i + 6] = -1;
              ami[i + 7] = 1;
              i += 7;
            } else if (ami[i - 1] === -1) {
              ami[i + 3] = -1;
              ami[i + 4] = 1;
              ami[i + 6] = 1;
              ami[i + 7] = -1;
              i += 7;
            }
          } catch (error) {

          }
        }
      }
      return ami;
    },
    hdb3: function(char) {
      var ami, i, _ref;
      ami = this.ami(char);
      for (i = 0, _ref = ami.length - 4; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        if (ami[i] === 0 && ami[i + 1] === 0 && ami[i + 2] === 0 && ami[i + 3] === 0) {
          try {
            if (ami[i - 1] === 1 || ami[i - 1] === 1) {
              ami[i] = -1;
              ami[i + 1] = 0;
              ami[i + 2] = 0;
              ami[i + 3] = -1;
              i += 3;
            } else if (ami[i - 1] === -1) {
              ami[i] = 1;
              ami[i + 1] = 0;
              ami[i + 2] = 0;
              ami[i + 3] = 1;
              i += 3;
            }
          } catch (error) {

          }
        }
      }
      return ami;
    }
  };

  $(function() {
    return node.init();
  });

}).call(this);
