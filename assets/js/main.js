
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
          $('.ball, .ball2').fadeOut('fast', function () { this.remove(); });
          setTimeout(function () { $pb.parent().slideUp('fast'); }, 1);
        }
      }
    };

    $doc.mousemove(listener);
  }

  var $secret = $('.secret').add('.secret_paper');
  var $address = $('.address').add('.address_paper');
  var $publicKey = $('.publicKey');
  var $privateKey = $('.privateKey');
  var $after = $('.after');
  var $before = $('.before');

  var $qr_address = $('.qr_address');
  var $qr_secret = $('.qr_secret');
  var $qr_address_paper = $('.qr_address_paper');
  var $qr_secret_paper = $('.qr_secret_paper');

  var secret, lw;

  var build = function () {
    lw = LiskWallet(secret);

    $address.text(lw.address);
    $publicKey.text(lw.publicKey);
    $privateKey.text(lw.privateKey);

    $qr_address.qrcode({ render: 'image', size: 300, text: lw.address });
    $qr_secret.qrcode({ render: 'image', size: 300, text: lw.secret });

    $qr_address_paper.qrcode({ render: 'image', size: 160, text: lw.address });
    $qr_secret_paper.qrcode({ render: 'image', size: 180, text: lw.secret });

    $after.fadeIn('fast');
    $before.slideUp('fast');

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

  var setSecret = function (data) {
    secret = data;
    $secret.text(secret);
  };

  $('.print button').click(function () {
    window.print();
  });

  $('.btns .btn').click(function () {
    var $this = $(this).attr('disabled', 1);
    $this.parents('.row').slideUp('fast');

    if ($this.hasClass('btn_random')) {
      $('.init').fadeIn('fast');

      balls(
        60 + parseInt(Math.random() * 60),
        function () {
          setSecret(LiskWallet.generateMnemonic());
        },
        build
      );
    }
    else if ($this.hasClass('btn_my')) {
      var $my = $('.my').fadeIn('fast');
      var $form = $my.find('.form-group');
      var $btn = $my.find('button');
      var $input = $my.find('input');

      var error = function (err) {
        $btn.attr('disabled', err);

        if (err) {
          $form.removeClass('has-success').addClass('has-error');
        }
        else {
          $form.removeClass('has-error').addClass('has-success');
        }
      };

      $input.focus().keyup(function (e) {
        if (LiskWallet.validateMnemonic($(this).val())) {
          error(false);

          if (e.keyCode === 13)
            $btn.click();
        }
        else {
          error(true);
        }
      });

      $btn.click(function () {
        $btn.attr('disabled', 1);
        $my.slideUp('fast');
        setSecret($input.val());
        build();
      });
    }
  });

})(jQuery)
