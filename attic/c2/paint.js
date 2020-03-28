(function(module) {
  var title = '';
  var painter, name, rna;
  var scheduled = false;
  var progress = false;
  var canvas = false;
  var ctx = false;
  var resCfg = 896;
  var resCnv = false;
  var Canvas = require('canvas');

  // var registry = require('./registry');
  var registry = require('./genjs');
  var new_picture = registry.new_picture;
  var compute_pixel = registry.compute_pixel;

  var d, i, j;

  function stop_paint() {
    // TODO: Verify support for delete handler syntax, and pay
    //       pending transfer if it happened to get through.
    if (painter) { 
      process.nextTick(painter);
    }

    progress.text = "(stopped)";
    scheduled = false; // $("input#stop").hide();
    rna = false;
  }

  function begin_paint() {
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0,0,resCnv,resCnv);
    stop_paint(ctx,resCnv);
    scheduled = true;
    progress = "(preview)";
    d = 32; j = 0;
    painter = process.nextTick(paint_preview);
  }

  function paint_preview() {
    for (var k = 0; d * k < resCnv; k++) {
      var x = 2.0 * d * (k + 0.5) / resCnv - 1.0;
      var y = 2.0 * d * (j + 0.5) / resCnv - 1.0;
      var c = compute_pixel(rna,x,y);
      ctx.fillStyle = c;
      ctx.fillRect(d*k,d*j,d,d);
    }
    j = j + 1;
    if (d*j >= resCnv) {
      j = 0;
      if (d <= 8) {
        i = 0;
        painter = process.nextTick(paint);
        return;
      }
      else { d = d/2; }
    }
    painter = process.nextTick(paintPreview);
  }

  function paint() {
    progress = Math.floor(100*j/resCnv) + "%";
    for (var k = 0; k < 32; k++) {
      var x = 2.0 * (i + 0.5) / resCnv - 1.0;
      var y = 2.0 * (j + 0.5) / resCnv - 1.0;
      var c = compute_pixel(rna,x,y);
      ctx.fillStyle = c;
      ctx.fillRect(i,j,1,1);
      i = i + 1;
      if (i >= resCnv) {
        i = 0;
        j = j + 1;
        break;
      }
    }
    if (j >= resCnv) {
      progress = ''
      scheduled = false;
      saveable = true;
      console.log("Ready to save!");
    }
    else { painter = process.nextTick(paint); }
  }

  // Ensure name stores a relative file path.  If not is set, derive from title.
  // If that still doesn't work, then throw.
  function assertName() {
    if (name === '') {
      name = title;
      name = name.replace(/^\s*|\s*$/g,'');
    }
    if (name === '') {
      alert('Picture name must not be empty.');
    }
  }

  function save() {
    if (! saveable) { throw new Error("Not in a saveable state!"); }
    assertName();
  }

  function paintForTitle(newTitle) {
    title = newTitle;
    saveable = false;

    if (!ctx) {
      cnv = new Canvas(resCfg, resCfg);
      // if ($.browser.msie) { cnv = G_vmlCanvasManager.initElement(cnv); }
      ctx = cnv.getContext("2d");
      resCnv = resCfg;
    }

    rna = false;
    caption = name;
    painter = process.nextTick(begin_paint);
  }

  function submit() {
    var name = $("input#submit_name").val();
    name = name.replace(/^\s*|\s*$/g,'');
    if (name == '') {
      alert('Picture name must not be empty.');
      return false;
    }
    else {
      return true;
    }
  }

  var scheduled = false;

  function call_stop() {
    if (scheduled === false) {
      throw new Error("Cannot stop somthing that isn't scheduled!");
    }

    stop_paint();
    return false;
  }

  module.exports = { beginPainting: paintForTitle };
}(module));
