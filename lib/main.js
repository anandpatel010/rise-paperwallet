'use strict';

var main = function main() {
  var $btns_row = $('.btns');
  var $btns = $btns_row.find('.btn');

  var $restart_row = $('.restart');
  var $restart = $restart_row.find('.btn');

  var $enter_row = $('.enter');
  var $enter_text = $enter_row.find('input');
  var $enter_btn = $enter_row.find('.btn');

  var $after = $('.after');

  var start = function start(random) {
    $btns_row.show();
    $restart_row.hide();
    $enter_row.hide();
    $restart.removeAttr('disabled');
    $btns.removeAttr('disabled');
    $after.hide();

    var passphrase = void 0;

    var build = function build() {
      var lw = LiskWallet(passphrase);

      $('.passphrase').text(lw.passphrase);
      $('.address').text(lw.address);
      $('.publicKey').text(lw.publicKey);
      $('.privateKey').text(lw.privateKey);

      $('.qr_address').empty().qrcode({ render: 'image', size: 350, text: lw.address });
      $('.qr_passphrase').empty().qrcode({ render: 'image', size: 350, text: lw.passphrase });

      $('.qr_address_paper').empty().qrcode({ render: 'image', size: 160, text: lw.address });
      $('.qr_passphrase_paper').empty().qrcode({ render: 'image', size: 160, text: lw.passphrase });

      $after.show();
    };

    $btns.unbind('click').click(function () {
      var $this = $(this).attr('disabled', 1);

      $btns_row.hide();

      if ($(this).hasClass('btn_random')) {
        balls(75 + parseInt(Math.random() * 25), function () {
          passphrase = LiskWallet.generateMnemonic();
        }, function () {
          $restart_row.show();
          build();
        });
      } else {
        (function () {
          $restart_row.show();
          $enter_btn.attr('disabled', 1);
          $enter_row.show();

          var $form = $enter_row.parent().removeClass('has-success has-error');

          var fix = function fix(v) {
            return v.replace(/ +/g, ' ').trim().toLowerCase();
          };

          var error = function error(err) {
            $enter_btn.attr('disabled', err);

            if (err) {
              $form.removeClass('has-success').addClass('has-error');
            } else {
              $form.removeClass('has-error').addClass('has-success');
            }
          };

          $enter_text.val('').focus().unbind('keyup').keyup(function (e) {
            var value = fix($enter_text.val());

            if (LiskWallet.validateMnemonic(value) && value.split(' ').length === 12) {
              error(false);

              if (e.keyCode === 13) $enter_btn.click();
            } else {
              error(true);
            }
          });

          $enter_btn.unbind('click').click(function () {
            passphrase = fix($enter_text.val());
            $(this).attr('disabled', 1);
            $enter_row.hide();
            build();
          });
        })();
      }
    });
  };

  start();

  $restart.click(function () {
    $restart.attr('disabled', 1);
    start();
  });

  $('.hash').click(function () {
    var range = void 0,
        selection = void 0;

    if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(this);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(this);
      range.select();
    }
  });

  $('.btn-print').click(function () {
    window.print();
  });
};

jQuery(main);

function balls(total, it, cb) {
  var $doc = $(document);
  var $body = $('body');
  var $pb = $('.progress-bar').css('width', 0);
  var $ct = $('.bar').show();

  var px = 0;
  var count = 0;

  var listener = function listener(ev) {
    px++;

    if (px > 5) {
      px = 0;

      count++;
      $pb.css('width', count / total * 100 + '%');

      $('<div />').css('top', ev.clientY).css('left', ev.clientX).addClass('ball').appendTo($body).clone().removeClass('ball').addClass('ball2').appendTo($body);

      it();

      if (count >= total) {
        cb();
        $doc.unbind('mousemove', listener);
        $('.ball, .ball2').fadeOut('fast', function () {
          this.remove();
        });
        setTimeout(function () {
          $ct.slideUp('fast');
        }, 1);
      }
    }
  };

  $doc.mousemove(listener);
}