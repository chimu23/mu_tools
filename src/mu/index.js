
require('./mu.scss');

// 即时消息封装
function assembleMessage(options, OBJ) {
  let HTML_wrap = ''
  let HTML_item = ''
  let existIndex = 0
  let objID = Math.random().toString().slice(-6);

  HTML_wrap = `
  <div class="mu-popup mu-msg ${options.place?options.place:'top'}" data-muid="${OBJ.muid}"></div>`

  if (!$('.mu-popup.mu-msg').length) {
    //  页面上还存在消息，直接插入新消息到消息盒
    $('body').append(HTML_wrap)

  }
  existIndex = $('.mu-popup.mu-msg').find('.mu-content').length

  HTML_item = `
  <div class="mu-animate">
  <div class="mu-content ${options.type||'message'} animate" data-muid="${objID}" style="top:${existIndex*60}px">
    <i class="mu-icon ${options.type||'message'}"></i>
    <span class="mu-msg">${options.content}</span>
    ${options.closeAble?'<i class="mu-icon close"></i>':''}
  </div></div>`

  $('body').find('.mu-popup.mu-msg').append(HTML_item)

  if (options.disappear) {
    // 默认消失
    setTimeout(() => {
      $(`.mu-content[data-muid=${objID}]`).length && closeHandler($(`.mu-content[data-muid=${objID}]`))
    }, options.time);
  }
  // click关闭按钮
  $(`.mu-content[data-muid=${objID}]`).find('.mu-icon.close').on('click', function () {
    closeHandler($(this).parent('.mu-content'))
  })

  function closeHandler(obj) {

    $(obj).css({
      'top': '-80px',
      'opacity': '0'
    })

    setTimeout(() => {
      $(obj).parent().remove()
      $('.mu-popup.mu-msg').find('.mu-animate').each(function (index, item) {
        $(item).find('.mu-content').css('top', index * 60 + 'px')
      })
    }, 200);

    OBJ.finalStatus()
  }
  // 计算每个信息的所在高度
  // function calculateTop() {
    // existTop = Math.ceil($('.mu-popup.msg').find('.mu-content').last().outerHeight()) + Math.ceil($('.mu-popup.msg').find('.mu-content').last().position().top) - 10
  // }
}
// 自定义弹窗封装
function assembleCustom(options, OBJ) {
  let HTML_wrap = ''
  HTML_wrap = `
  <div class="mu-popup mu-custom" data-muid="${OBJ.muid}" tabindex="0">
${options.cover ? '<div class="mu-BGCover"></div>' : ''}
<div class="mu-center-wrap" style="top:${options.top ? options.top : '50%'};left:${
  options.left ? options.left : '50%'
  };">
<i class="mu-icon close"></i>
<div class="mu-content">

</div>
</div>
</div>`;
  $(options.targetDOM).append(HTML_wrap)

  $(`.mu-popup.mu-custom .mu-content`).append(
    $(options.originDOM).clone().css('display', 'block')
  );
  if (options.noScroll) {
    $('body').css('overflow', 'hidden');
    OBJ.self_finalEven = function () {
      $('body').css('overflow', '');
    };
  }
  options.keyClose && handleKeyColose(OBJ.muid)
  $(`.mu-popup.mu-custom[data-muid=${OBJ.muid}]`).on('click', '.mu-icon.close', function () {

    $(this).parents('.mu-popup.mu-custom').remove()
    OBJ.close()
  })
}

// 确认弹窗封装
function assembleConfirm(options, OBJ) {
  let HTML = ''
  HTML = `<div class="mu-popup mu-confirm" data-muid="${OBJ.muid}" tabindex="0">
  ${options.cover?'<div class="mu-BGCover"></div>':''}
  <div class="mu-center-wrap">
   <div class="mu-content">
      <i class="mu-icon close"></i>
      <div class="mu-title">
          提示
      </div>
      <div class="mu-content-wrap">
          <i class="mu-icon shock"></i>
          <span class="mu-msg">
              ${options.content}
          </span>
      </div>
      <div class="handle-btns">
          <button class="mu-button mu-button-default" data-op="0">取消</button>
          <button class="mu-button mu-button-primary" data-op="1">确认</button>
      </div>
   </div>
  </div>
</div>`
  $('body').append(HTML)
  options.keyClose && handleKeyColose(OBJ.muid)

  $(`.mu-popup.mu-confirm[data-muid=${OBJ.muid}]`).on('click', '.handle-btns button', async function () {
    {
      let op = $(this).data('op')
      if (op) {
        await options.confirm()
        $(this).parents('.mu-popup.mu-confirm').fadeOut()

      } else {
        options.cancel && options.cancel()

      }
      handleClose($(this).parents('.mu-popup.mu-confirm'), OBJ)

    }
  })
  $(`.mu-popup.mu-confirm[data-muid=${OBJ.muid}]`).on('click', '.mu-icon.close', function () {
    handleClose($(this).parents('.mu-popup.mu-confirm'), OBJ)

  })

  function handleClose(DOM) {
    $(DOM).fadeOut()
    setTimeout(() => {
      OBJ.close()
    }, 500);
  }
}

// loading遮罩
function assembleLoadingCover(options, OBJ) {
  let HTML = ''
 
  switch (options.type) {
    case 1:
      HTML = `<div class="mu-popup mu-loading-cover mu-loading-type-1" data-muid="${OBJ.muid}">
      <div class="mu-loading"></div>
      ${options.content?'<div class="mu-loading-text">'+options.content+'</div>':''}
    </div>`
      break
    case 2:
      HTML = `<div class="mu-popup mu-loading-cover mu-loading-type-2" data-muid="${OBJ.muid}">
      <div class="mu-loading2">
      <div class="mu--loading-ul">
      <div class="mu--loaidng-li"></div>
      <div class="mu--loaidng-li"></div>
      <div class="mu--loaidng-li"></div>
      <div class="mu--loaidng-li"></div>
      <div class="mu--loaidng-li"></div>
  </div>
  </div>
      ${options.content?'<div class="mu-loading-text">'+options.content+'</div>':''}
    </div>`
      break
  }
  if (!options.allowScroll) {
    $('body').css('overflow', 'hidden');
    OBJ.self_finalEven = function () {
      $('body').css('overflow', '');
    };
  }
  $(options.targetDOM).append(HTML)
}

// 寻址弹窗
function assembleAddressing(options, OBJ) {
  let targetTop =
    $(options.targetDOM).offset().top -
    $(options.targetDOM).outerHeight() - 2;
  let targetLeft = $(options.targetDOM).offset().left;
  // console.log(targetTop);
  // console.log(targetLeft);
  $(options.originDOM).css({
    top: targetTop + options.offsetTop,
    left: targetLeft + options.offsetLeft
  })
}

// 监听ESC关闭 给弹窗DOM挂载esc事件
function handleKeyColose(muid) {
  $(`.mu-popup[data-muid=${muid}]`).on('keydown', (event) => {
    if (event.keyCode == 27) {
      $(`.mu-popup[data-muid=${muid}]`).find('.mu-icon.close').trigger('click')
    }
  });
}

class Dialog {
  constructor(options) {
    // this.msgTime = 2000; //即时消息弹窗显示时间
    this.sustainTime_msg = 3000 //即时消息弹窗显示时间
    this.muid = null; //本次弹窗对象
    this.options = options || {}; //接收配置参数，closeEven、afterOpenEven
    this.self_finalEven = null; //自身最后需要完成的事件
    this.init();
  }

  /**
   * @method 初始化函数,生成弹窗对象随机数，连接唯一窗口
   */
  init() {
    this.BeginStatus()
    this.muid = Math.random().toString().slice(-6);
  }

  /**
   * @description 消息弹窗open 0
   */
  msg(options) {
    this.open({
      type: 0,
      originContent: {
        disappear: true,
        time: this.sustainTime_msg,
        ...options
      },
    });
    return this.muid
  }

  /**
   * @description 确认弹窗open 1
   */
  confirm(options) {
    this.open({
      type: 1,
      originContent: {
        cover: true,
        ...options
      }
    });
    return this.muid
  }

  /**
   * @description 寻址弹窗type 3
   * @param {Object} options
   */
  addressing(options) {
    this.open({
      type: 3,
      originContent: {
        offsetLeft: 0,
        offsetTop: 0,
        ...options
      }
    })
    return this.muid
  }

  /**
   * @description loading遮罩 open 4
   */
  loading(options) {
    this.open({
      type: 4,
      originContent: {
        allowScroll: true,
        targetDOM: 'body',
        type: 2,
        ...options
      }
    });
    return this
  }


  open(options) {
    let {
      type = 2
    } = {
      ...options
    };


    switch (type) {

      case 0:
        assembleMessage(options.originContent, this)
        break;

      case 1:
        assembleConfirm(options.originContent, this)
        break;

      case 2:
        assembleCustom({
          cover: true,
          noScroll: true,
          keyClose: false,
          targetDOM: 'body',
          ...options
        }, this)
        break;

      case 3:
        assembleAddressing({
          ...options.originContent
        }, this)
        break;

      case 4:
        assembleLoadingCover(options.originContent, this)
        break;
    }

    this.options.afterOpenEven && this.options.afterOpenEven();
  }

  close(muid = this.muid) {
    $(`[data-muid=${muid}]`).remove()
    this.self_finalEven && this.self_finalEven()
    this.finalStatus()
  }

  BeginStatus(callback = this.options.beforeEven) {
    callback && callback()

  }
  MiddleStatus(callback = this.options.afterOpenEven) {
    callback && callback()

  }
  finalStatus(callback = this.options.closeEven) {
    callback && callback()
  }
}

export default {
  Dialog,
};