ProteinSequence = function (canvas_id, seq, sst, acc) {
  // TODO: Check arguments are same length

  var canvas = document.getElementById(canvas_id);
  var context = canvas.getContext('2d');

  context.font = '14pt Monospace';

  var acc_min = Math.min.apply(Math, acc);
  var acc_max = Math.max.apply(Math, acc);

  var colors = tinycolor("#DD8CFF").monochromatic(10);

  var rows = Math.ceil(seq.length / 60);

  for (var i = 0; i < rows; i++) {
    var x = 0;
    var y = (i * 60) + 20;

    // Residue number
    context.fillStyle = 'gray';
    context.fillText(i * 60 + 1, x, y);
    context.fillStyle = 'black';

    for (var j = i * 60; j < i * 60 + 60; j++)
    {
      // Sequence incl. accessibility colour
      var r = seq.charAt(j);
      var metrics = context.measureText(r);
      var width = metrics.width;
      var normalized_acc = ((acc[j] - acc_min)/(acc_max - acc_min) * 90);
      var color_pos = Math.floor(normalized_acc / 10);
      context.fillStyle = colors[color_pos].toHexString();
      context.fillText(r, x + 60, y);
      context.fillStyle = 'black';

      // Secondary structure
      var sst_type = sst[j];
      if (sst_type == 'H') {
        context.beginPath();
        context.rect(x + 60, y + 5, width, 20);
        context.fillStyle = 'blue';
        context.fill();
        context.fillStyle = 'black';
      } else if (sst_type == 'S') {
        context.beginPath();
        context.rect(x + 60, y + 10.0, width, 10);
        context.fillStyle = 'red';
        context.fill();
        context.fillStyle = 'black';
      } else if (sst_type == 'T') {
        context.beginPath();
        context.rect(x + 60, y + 12.5, width, 5);
        context.fillStyle = 'black';
        context.fill();
        context.fillStyle = 'black';
      }

      x = x + width;
    }
  }
};
