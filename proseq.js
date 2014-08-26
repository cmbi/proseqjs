ProteinSequence = function(canvas_id, seq, sst, acc) {
  // TODO: Check arguments are same length
  // TODO: Draw legend
  // TODO: Private methods are actually publicly visible.
  // TODO: All methods are recreated per instance. Is this a problem?
  // TODO: Fit to canvas width.
  // TODO: Resize canvas when browser resized.
  // TODO: Pass settings in constructor

  // Attributes
  this.seq = seq;
  this.sst = sst;
  this.acc = acc;
  this.canvas = document.getElementById(canvas_id);
  this.context = this.canvas.getContext('2d');
  this.acc_min = Math.min.apply(Math, acc);
  this.acc_max = Math.max.apply(Math, acc);
  this.colors = tinycolor("#DD8CFF").monochromatic(10);

  // Constants
  const MAX_RES_PER_ROW = 60;
  const SEQ_MARGIN_L = 20;
  const SST_MARGIN_T = 5;
  const CHAR_W = this.context.measureText('A').width;
  const RES_HEAD_WIDTH = seq.length.toString().length * CHAR_W;
  const ROW_HEIGHT = 60;
  const ROW_MARGIN_T = 20;
  const ROWS = Math.ceil(seq.length / MAX_RES_PER_ROW);

  // Resize the canvas now before drawing. Resizing the canvas causing the
  // content to be cleared.
  this.canvas.height = (ROWS * ROW_HEIGHT);

  // Initialise context. This must be done after setting the canvas size
  // because it interferes with scaling.
  this.context.font = '14pt Monospace';

  // Private methods
  this.draw_residue = function(res_num, x, y) {
    var r = seq.charAt(res_num);
    var metrics = this.context.measureText(r);
    // TODO: Why 90 and not 100?
    var normalised_acc = (
        (this.acc[res_num] - this.acc_min)/(this.acc_max - this.acc_min) * 90
    );
    var color_pos = Math.floor(normalised_acc / 10);

    this.context.fillStyle = this.colors[color_pos].toHexString();
    this.context.fillText(r, x, y);
    this.context.fillStyle = 'black';

    return metrics.width;
  }

  this.draw_helix = function(x, y, w, h) {
    this.context.beginPath();
    this.context.fillStyle = 'blue';
    this.context.rect(x, y, w, h);
    this.context.fill();
    this.context.closePath();
  }

  this.draw_strand = function(x, y, w, h) {
    this.context.beginPath();
    this.context.fillStyle = 'red';
    this.context.rect(x, y, w, h);
    this.context.fill();
    this.context.closePath();
  }

  this.draw_turn = function(x, y, w, h) {
    this.context.beginPath();
    this.context.fillStyle = 'green';
    this.context.rect(x, y, w, h);
    this.context.fill();
    this.context.closePath();
  }

  this.draw_loop = function(x, y, w, h) {
    this.context.beginPath();
    this.context.fillStyle = 'black';
    this.context.rect(x, y, w, h);
    this.context.fill();
    this.context.closePath();
  }

  this.draw_3helix = function(x, y, w, h) {
    this.context.beginPath();
    this.context.fillStyle = 'purple';
    this.context.rect(x, y, w, h);
    this.context.fill();
    this.context.closePath();
  }

  this.draw_310helix = function(x, y, w, h) {
    this.context.beginPath();
    this.context.fillStyle = 'yellow';
    this.context.rect(x, y, w, h);
    this.context.fill();
    this.context.closePath();
  }

  this.draw = function() {
    var rows = Math.ceil(seq.length / MAX_RES_PER_ROW);

    for (var i = 0; i < rows; i++) {
      var x = 0;
      var y = (i * ROW_HEIGHT) + ROW_MARGIN_T;

      // Draw the residue number heading
      this.context.fillStyle = 'gray';
      this.context.fillText(i * MAX_RES_PER_ROW + 1, x, y);
      this.context.fillStyle = 'black';

      // Calculate the number of residues for the current row. The default is to
      // draw 60, but the last row often has less.
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
        var res_text_width = this.draw_residue(
            j, x + RES_HEAD_WIDTH + SEQ_MARGIN_L, y);

        // Secondary structure
        switch (sst[j]) {
        case 'H': this.draw_helix(
                      x + RES_HEAD_WIDTH + SEQ_MARGIN_L,
                      y + SST_MARGIN_T, res_text_width, 20); break;
        case 'S': this.draw_strand(
                      x + RES_HEAD_WIDTH + SEQ_MARGIN_L,
                      y + SST_MARGIN_T, res_text_width, 20); break;
        case 'T': this.draw_turn(
                      x + RES_HEAD_WIDTH + SEQ_MARGIN_L,
                      y + SST_MARGIN_T, res_text_width, 20); break;
        case ' ': this.draw_loop(
                      x + RES_HEAD_WIDTH + SEQ_MARGIN_L,
                      y + SST_MARGIN_T, res_text_width, 20); break;
        case 'G': this.draw_3helix(
                      x + RES_HEAD_WIDTH + SEQ_MARGIN_L,
                      y + SST_MARGIN_T, res_text_width, 20); break;
        case '3': this.draw_310helix(
                      x + RES_HEAD_WIDTH + SEQ_MARGIN_L,
                      y + SST_MARGIN_T, res_text_width, 20); break;
        default:
          console.error("Unexpected secondary structure type: " + sst[j]);
        }

        this.context.fillStyle = 'black';
        x = x + res_text_width;
      }
    }
  }

  // Public methods
  this.update = function() {
    this.draw();
  }

};
