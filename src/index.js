
let main = () => {
  let $btns_row = $('.btns').show()
  let $btns = $btns_row.find('.btn')
  let $enter_row = $('.enter')
  let $enter_text = $enter_row.find('input')
  let $enter_btn = $enter_row.find('.btn')
  let $after = $('.after')

  let start = function () {
    $enter_row.hide()
    $after.hide()

    let passphrase

    let build = () => {
      let lw = LiskWallet(passphrase)

      $('.passphrase').text(lw.passphrase)
      $('.address').text(lw.address)
      $('.publicKey').text(lw.publicKey)
      $('.privateKey').text(lw.privateKey)
      $('.passphraseHash').text(lw.hash)

      $('.qr_address').empty().qrcode({ render: 'image', size: 350, text: lw.address })
      $('.qr_passphrase').empty().qrcode({ render: 'image', size: 350, text: lw.passphrase })

      $('.qr_address_paper').empty().qrcode({ render: 'image', size: 150, text: lw.address })
      $('.qr_passphrase_paper').empty().qrcode({ render: 'image', size: 150, text: lw.passphrase })

      $after.show()
    }

    if ($(this).hasClass('btn_random')) {
      $btns_row.hide()

      balls(
        window.location.protocol === 'file:' ? 15 : 75 + parseInt(Math.random() * 25),
        function () {
          passphrase = LiskWallet.generateMnemonic()
        },
        () => {
          $btns_row.show()
          build()
        }
      )
    } else {
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

        if (value.split(' ').length !== 12 || !LiskWallet.validateMnemonic(value)) {
          error(true)
        }
        else {
          error(false)

          if (e.keyCode === 13)
            $enter_btn.click()
        }
      })

      $enter_btn.unbind('click').click(function () {
        passphrase = fix($enter_text.val())
        $(this).attr('disabled', 1)
        $enter_row.hide()
        build()
      })
    }
  }

  $btns.click(start)

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

  // $('.papers').find('.btn').click(function () {
  //   let $this = $(this)
  //
  //   $this.parent().find('.btn').removeClass('active')
  //   $this.addClass('active')
  // })
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

    if (px > 10) {
      px = 0

      count++
      $pb.css('width', (count / total * 100) + '%')

      $('<div />')
        .css('top', ev.clientY)
        .css('left', ev.clientX)
        .addClass('ball2')
        .appendTo($body)
        // .clone()
        // .removeClass('ball')
        // .addClass('ball2')
        // .appendTo($body)

      it()

      if (count >= total) {
        cb()
        $doc.unbind('mousemove', listener)
        $('.ball, .ball2').hide().remove()
        $ct.hide()
      }
    }
  }

  $doc.mousemove(listener)
}
