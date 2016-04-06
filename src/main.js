
let main = () => {
  let $btns_row = $('.btns')
  let $btns = $btns_row.find('.btn')

  let $restart_row = $('.restart')
  let $restart = $restart_row.find('.btn')

  let $enter_row = $('.enter')
  let $enter_text = $enter_row.find('input')
  let $enter_btn = $enter_row.find('.btn')

  let $after = $('.after')

  let start = (random) => {
    $btns_row.show()
    $restart_row.hide()
    $enter_row.hide()
    $restart.removeAttr('disabled')
    $btns.removeAttr('disabled')
    $after.hide()

    let passphrase

    let build = () => {
      let lw = LiskWallet(passphrase)

      $('.passphrase').text(lw.passphrase)
      $('.address').text(lw.address)
      $('.publicKey').text(lw.publicKey)
      $('.privateKey').text(lw.privateKey)

      $('.qr_address').empty().qrcode({ render: 'image', size: 350, text: lw.address })
      $('.qr_passphrase').empty().qrcode({ render: 'image', size: 350, text: lw.passphrase })

      $('.qr_address_paper').empty().qrcode({ render: 'image', size: 160, text: lw.address })
      $('.qr_passphrase_paper').empty().qrcode({ render: 'image', size: 160, text: lw.passphrase })

      $after.show()
    }

    $btns.unbind('click').click(function () {
      let $this = $(this).attr('disabled', 1)

      $btns_row.hide()

      if ($(this).hasClass('btn_random')) {
        balls(
          75 + parseInt(Math.random() * 25),
          function () {
            passphrase = LiskWallet.generateMnemonic()
          },
          () => {
            $restart_row.show()
            build()
          }
        )
      } else {
        $restart_row.show()
        $enter_btn.attr('disabled', 1)
        $enter_row.show()

        let $form = $enter_row.parent().removeClass('has-success has-error')

        let fix = v => v.replace(/ +/g, ' ').trim().toLowerCase()

        let error = function (err) {
          $enter_btn.attr('disabled', err)

          if (err) {
            $form.removeClass('has-success').addClass('has-error')
          }
          else {
            $form.removeClass('has-error').addClass('has-success')
          }
        }

        $enter_text.val('').focus().unbind('keyup').keyup(function (e) {
          let value = fix($enter_text.val())

          if (LiskWallet.validateMnemonic(value) && value.split(' ').length === 12) {
            error(false)

            if (e.keyCode === 13)
              $enter_btn.click()
          }
          else {
            error(true)
          }
        })

        $enter_btn.unbind('click').click(function () {
          passphrase = fix($enter_text.val())
          $(this).attr('disabled', 1)
          $enter_row.hide()
          build()
        })
      }
    })
  }

  start()

  $restart.click(() => {
    $restart.attr('disabled', 1)
    start()
  })

  $('.hash').click(function () {
    let range, selection

    if (window.getSelection) {
       selection = window.getSelection()
       range = document.createRange()
       range.selectNodeContents(this)
       selection.removeAllRanges()
       selection.addRange(range)
    }
    else if (document.body.createTextRange) {
       range = document.body.createTextRange()
       range.moveToElementText(this)
       range.select()
    }
  })

  $('.btn-print').click(() => {
    window.print()
  })
}

jQuery(main)

function balls (total, it, cb) {
  let $doc = $(document)
  let $body = $('body')
  let $pb = $('.progress-bar').css('width', 0)
  let $ct = $('.bar').show()

  let px = 0
  let count = 0

  let listener = function (ev) {
    px++

    if (px > 5) {
      px = 0

      count++
      $pb.css('width', (count / total * 100) + '%')

      $('<div />')
        .css('top', ev.clientY)
        .css('left', ev.clientX)
        .addClass('ball')
        .appendTo($body)
        .clone()
        .removeClass('ball')
        .addClass('ball2')
        .appendTo($body)

      it()

      if (count >= total) {
        cb()
        $doc.unbind('mousemove', listener)
        $('.ball, .ball2').fadeOut('fast', function () { this.remove() })
        setTimeout(function () { $ct.slideUp('fast') }, 1)
      }
    }
  }

  $doc.mousemove(listener)
}
