
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
  var $after = $('.after');
  var $before = $('.before');

  var $qr_address = $('.qr_address');
  var $qr_secret = $('.qr_secret');
  var $qr_address_paper = $('.qr_address_paper div');
  var $qr_secret_paper = $('.qr_secret_paper div');

  var secret, lw;

  var build = function () {
    lw = LiskWallet(secret);

    $address.text(lw.address);
    $publicKey.text(lw.publicKey);
    $privateKey.text(lw.privateKey);

    $qr_address.qrcode({ width: 300, height: 300, text: lw.address });
    $qr_secret.qrcode({ width: 300, height: 300, text: lw.secret });

    $qr_address_paper.qrcode({ width: 150, height: 150, text: lw.address });
    $qr_secret_paper.qrcode({ width: 150, height: 150, text: lw.secret });

    $after.fadeIn();
    $before.slideUp();

    $('.page-header small').addClass('pulsate');

    $('.ms').click(function () {
      var range, selection;

      if (window.getSelection) {
         selection = window.getSelection();
         range = document.createRange();
         range.selectNodeContents(this);
         selection.removeAllRanges();
         selection.addRange(range);
      }
      else if (document.body.createTextRange) {
         range = document.body.createTextRange();
         range.moveToElementText(this);
         range.select();
      }
    });
  }

  balls(
    80 + parseInt(Math.random() * 80),
    function () {
      secret = LiskWallet.generateMnemonic();
      $secret.text(secret);
    },
    build
  );

})(jQuery)
