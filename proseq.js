ProteinSequence = function(canvas_id, seq, sst, acc) {
  // TODO: Check arguments are same length
  // TODO: Private methods are actually publicly visible.
  // TODO: All methods are recreated per instance. Is this a problem?
  // TODO: Fit to canvas width.
  // TODO: Resize canvas when browser resized.
  // TODO: Pass settings in constructor

  // Constants
  const MAX_RES_PER_ROW = 60;
  const SEQ_LAYER_OFFSET_X = 20;
  const SST_MARGIN_T = 20;
  const FONT_FAMILY = "Monospace";
  const FONT_SIZE = 16;
  const ROW_HEIGHT = 60;
  const ROW_MARGIN_T = 0;
  const ROWS = Math.ceil(seq.length / MAX_RES_PER_ROW);

  // Attributes
  this.seq = seq;
  this.sst = sst;
  this.acc = acc;
  this.acc_min = Math.min.apply(Math, acc);
  this.acc_max = Math.max.apply(Math, acc);
  this.colors = tinycolor("#DD8CFF").monochromatic(10);

  this.stage = new Kinetic.Stage({
    container: canvas_id,
    width: 900,
    height: ROWS * ROW_HEIGHT + 25
  });
  this.v_header_layer = new Kinetic.Layer();
  this.seq_layer = new Kinetic.Layer();

  // Private methods
  this.draw_residue = function(res_num, x, y) {
    var r = seq.charAt(res_num);
    var normalised_acc = (
        (this.acc[res_num] - this.acc_min)/(this.acc_max - this.acc_min) * 90
    );
    var color_pos = Math.floor(normalised_acc / 10);
    var res_text = new Kinetic.Text({
      x: x,
      y: y,
      text: r,
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMILY,
      fill: this.colors[color_pos].toHexString()
    });

    var res_text_w = res_text.getTextWidth();
    var res_text_h = res_text.getTextHeight();

    this.register_tooltip(
        res_text,
        x + (res_text_w / 2),
        y + res_text_h,
        this.acc[res_num]);
    this.seq_layer.add(res_text);

    return res_text_w;
  }

  this.draw_tooltip = function(x, y, message) {
    // The stage is a little higher than it needs to be so that the tooltip on
    // the last row is visible. Ideally we should change the direction of the
    // tooltip.
    tooltip = new Kinetic.Label({
      x: x,
      y: y,
      opacity: 0.75
    });
    tooltip_tag = new Kinetic.Tag({
      fill: 'gray',
      pointerDirection: 'up',
      pointerWidth: 10,
      pointerHeight: 10,
      lineJoin: 'round',
      shadowColor: 'black',
      shadowBlur: 3,
      shadowOffset: {x:2, y:2},
      shadowOpacity: 0.5
    });
    tooltip_text = new Kinetic.Text({
      text: message,
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE,
      padding: 5,
      fill: 'white'
    });
    tooltip.add(tooltip_tag);
    tooltip.add(tooltip_text);

    this.seq_layer.add(tooltip);
    this.seq_layer.draw();

    return tooltip;
  }

  this.register_tooltip = function(src, x, y, message) {
    var proseq = this;
    var tooltip;
    src.on('mouseenter', function() {
      tooltip = proseq.draw_tooltip(x, y, message);
    });

    src.on('mouseleave', function() {
      tooltip.destroy();
      proseq.seq_layer.draw();
    });
  }

  this.draw_helix = function(x, y, w, h) {
    var rect = new Kinetic.Rect({
      x: x, y: y, width: w, height: h, fill: 'blue'
    });
    this.register_tooltip(rect, x + (w / 2), y + h, "Alpha Helix");
    this.seq_layer.add(rect);
  }

  this.draw_strand = function(x, y, w, h) {
    var rect = new Kinetic.Rect({
      x: x, y: y, width: w, height: h, fill: 'red'
    });
    this.register_tooltip(rect, x + (w / 2), y + h, "Beta Strand");
    this.seq_layer.add(rect);
  }

  this.draw_turn = function(x, y, w, h) {
    var rect = new Kinetic.Rect({
      x: x, y: y, width: w, height: h, fill: 'green'
    });
    this.register_tooltip(rect, x + (w / 2), y + h, "Turn");
    this.seq_layer.add(rect);
  }

  this.draw_loop = function(x, y, w, h) {
    var rect = new Kinetic.Rect({
      x: x, y: y, width: w, height: h, fill: 'black'
    });
    this.register_tooltip(rect, x + (w / 2), y + h, "Loop");
    this.seq_layer.add(rect);
  }

  this.draw_pi_helix = function(x, y, w, h) {
    var rect = new Kinetic.Rect({
      x: x, y: y, width: w, height: h, fill: 'purple'
    });
    this.register_tooltip(rect, x + (w / 2), y + h, "Pi Helix");
    this.seq_layer.add(rect);
  }

  this.draw_310helix = function(x, y, w, h) {
    var rect = new Kinetic.Rect({
      x: x, y: y, width: w, height: h, fill: 'yellow'
    });
    this.register_tooltip(rect, x + (w / 2), y + h, "310 Helix");
    this.seq_layer.add(rect);
  }

  this.draw = function() {
    var rows = Math.ceil(seq.length / MAX_RES_PER_ROW);
    var v_header_width = 0;
    for (var i = 0; i < rows; i++) {
      var x = 0;
      var y = (i * ROW_HEIGHT) + ROW_MARGIN_T;

      // Draw the residue number heading
      var res_num_txt = new Kinetic.Text({
        x: x,
        y: y,
        text: i * MAX_RES_PER_ROW + 1,
        fontSize: FONT_SIZE,
        fontFamily: FONT_FAMILY,
        fill: 'gray'
      });
      this.v_header_layer.add(res_num_txt);
      var res_num_txt_w = res_num_txt.getWidth();
      v_header_width = (
          res_num_txt_w > v_header_width ? res_num_txt_w : v_header_width);

      // Calculate the number of residues for the current row. The default is
      // to draw 60, but the last row often has less.
      if (i == rows - 1) {
        num_res_in_row = seq.length - (i * MAX_RES_PER_ROW);
      } else {
        num_res_in_row = MAX_RES_PER_ROW;
      }

      // Iterate over the residues in the current row. For each residue, draw
      // it with the appropriate accessibility colour, and draw the secondary
      // structure representation.
      var start_res = i * MAX_RES_PER_ROW;
      for (var j = start_res; j < (start_res + num_res_in_row); j++)
      {
        // Residue including accessibility
        var res_text_width = this.draw_residue(j, x, y);

        // Secondary structure
        switch (sst[j]) {
        case 'H': this.draw_helix(x, y + SST_MARGIN_T, res_text_width, 20);
                  break;
        case 'S': this.draw_strand(x, y + SST_MARGIN_T, res_text_width, 20);
                  break;
        case 'T': this.draw_turn(x, y + SST_MARGIN_T, res_text_width, 20);
                  break;
        case ' ': this.draw_loop(x, y + SST_MARGIN_T, res_text_width, 20);
                  break;
        case 'G': this.draw_pi_helix(x, y + SST_MARGIN_T, res_text_width, 20);
                  break;
        case '3': this.draw_310helix(x, y + SST_MARGIN_T, res_text_width, 20);
                  break;
        default:
          console.error("Unexpected secondary structure type: " + sst[j]);
        }

        x = x + res_text_width;
      }
    }

    // Getting the width of the vertical header here returns 0, so I assume it
    // doesn't sum the width of its children. Instead, set the width and use it
    // to reposition the sequence layer.
    this.v_header_layer.width(v_header_width);
    var v_header_width = this.v_header_layer.getWidth();
    this.seq_layer.x(v_header_width + SEQ_LAYER_OFFSET_X);

    this.stage.add(this.v_header_layer);
    this.stage.add(this.seq_layer);
  }

  // Public methods
  this.update = function() {
    this.draw();
  }

};
