
(function ($) {
  function balls (total, it, cb) {
    var $doc = $(document);
    var $body = $('body');
    var $pb = $('.progress-bar');

    var px = 0;
    var count = 0;

    var listener = function (ev) {
      px++;

      if (px > 5) {
        px = 0;

        count++;
        $pb.css('width', (count / total * 100) + '%');

        $('<div />')
          .css('top', ev.clientY)
          .css('left', ev.clientX)
          .addClass('ball')
          .appendTo($body)
          .clone()
          .removeClass('ball')
          .addClass('ball2')
          .appendTo($body)
        ;

        it();

        if (count >= total) {
          cb();
          $doc.unbind('mousemove', listener);
          $('.ball, .ball2').fadeOut(function () { this.remove(); });
          setTimeout(function () { $pb.parent().slideUp(); }, 1);
        }
      }
    };

    $doc.mousemove(listener);
  }

  var $secret = $('.secret');
  var $hash = $('.hash');
  var $address = $('.address');
  var $publicKey = $('.publicKey');
  var $privateKey = $('.privateKey');
  var $qr_address = $('.qr_address');
  var $qr_secret = $('.qr_secret');
  var $after = $('.after');

  var secret, lw;

  var build = function () {
    lw = LiskWallet(secret);

    $hash.text(lw.hash);
    $address.text(lw.address);
    $publicKey.text(lw.publicKey);
    $privateKey.text(lw.privateKey);

    $qr_address.qrcode({ width: 400, height: 400, text: lw.address });
    $qr_secret.qrcode({ width: 400, height: 400, text: lw.secret });

    $after.fadeIn('slow');
  }

  balls(
    120,
    function () {
      secret = LiskWallet.generateMnemonic();
      $secret.text(secret);
    },
    build
  );

})(jQuery)
