/*
 * @Author: your name
 * @Date: 2021-01-19 16:39:55
 * @LastEditTime: 2021-01-25 11:13:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mu\src\mu_mobile\index.js
 */

import './assets/css/index.scss';

// 弹窗
class Popup {
    constructor(options) {
        this.muid = Math.random().toString().slice(-6)
        this.animateTime = 300 + 100
        this.originHTML = $(options.originDOM).html()
        this.options = options
        this.options.overlay = this.options.overlay ? true : this.options.overlay == false ? false : true //默认开启遮罩
        this.options.forbidScroll = this.options.forbidScroll ? this.options.forbidScroll : this.options.forbidScroll == false ? false : true
        console.log(options);
        this.beforeCreate()
    }
    assembleHTML() {
        let HTML = ''
        switch (this.options.direction) {
            default:
                HTML = `<div class="mu-con ${this.options.customClass?this.options.customClass:''}" data-muid="${this.muid}">
        ${this.options.overlay?'<div class="mu--overlay"></div>':''}
        <div class="mu-popup mu-popup--${this.options.direction} mu-animate--popup-${this.options.direction}-a ${this.options.round?'mu-popup-round':''}">
        ${this.options.nav?`<mu-nav>${this.options.nav.close?`<i class="mu-iconfont icon-searchclose ${this.options.nav.close}" data-ops="close"></i>`:''}
        ${this.options.nav.title?`<div class="mu-popup--title">${this.options.nav.title}</div>`:''}</mu-nav>`:''}
        ${this.originHTML}
        </div>
    </div>`
                // break

        }
        return HTML

    }

    // 生命周期
    beforeCreate() {
        console.log('beforeCreate:' + this.muid);

        this.created()
    }
    created() {
        let _this = this
        console.log('created');
        $('body').append(this.assembleHTML())
        // 当动画完全加载完成才绑定点击事件，防止乱点
        setTimeout(() => {
            // click 背影
            $(`[data-muid="${this.muid}"]`).on('click', '.mu--overlay', () => {
                _this.close()
            })
            $(`[data-muid="${this.muid}"]`).on('click', '[data-ops]', function () {
                let $this = $(this)

                switch ($this.data('ops')) {
                    // close 点击了Xicon，关闭弹窗
                    case 'close':
                        _this.close()
                        break
                }
            })
            // // 禁止窗口滚动
            if (this.options.forbidScroll) {
                $('body').css('overflow', 'hidden')
            }
        }, this.animateTime);
    }
    beforeDestroy() {
        // 处理关闭动画
        let handleDOM = $(`[data-muid="${this.muid}"]`).find('.mu-popup')
        handleDOM.removeClass(`mu-animate--popup-${this.options.direction}-a`).addClass(`mu-animate--popup-${this.options.direction}-b`)
        setTimeout(() => {
            handleDOM.removeClass(`mu-animate--popup-${this.options.direction}-b`).parent().remove()
            // 恢复窗口滚动
            if (this.options.forbidScroll) {
                $('body').css('overflow', '')
            }
            this.destroyed()
        }, this.animateTime);

    }
    destroyed() {
        // 处理关闭之后的回调
        console.log('destroyed');

    }
    // 生命周期 end

    // close方便外部调用
    close() {
        this.beforeDestroy()
    }
}

// 带icon、文字提示
class Toast {
    constructor(options) {
        this.shutDown = false //本次对象关闭状态（只能执行一次关闭流程）
        this.muid = Math.random().toString().slice(-6)
        this.$mu = null //带有muid的DOM
        this.animateTime = 300 + 100 //动画时长，跟css配合
        this.content = null //文字span DOM(方便直接修改文字)

        this.options = options
        this.options.duration = this.options.duration ? this.options.duration : this.options.duration == 0 ? 0 : 2000 //Toast持续存在时间
        this.options.forbidClick = this.options.forbidClick ? true : this.options.forbidClick == false ? false : true //默认不可点击overlay关闭Toast

        this.beforeCreate()
        console.log(options);

    }
    assembleHTML() {
        let icon = null
        if (this.options.icon) {
            switch (this.options.icon) {
                case 'success':
                    icon = 'icon-dagou'
                    break
                case 'fail':
                    icon = 'icon-gantanhao'
                    break
                case 'loading':
                    icon = 'icon-dengdai'
                    break
            }
        }
        let HTML = `<div class="mu-con ${this.options.customClass?this.options.customClass:''}" data-muid="${this.muid}">
    <div class="mu--overlay ${this.options.overlay?'overlay-nth3':'overlay-nth2'}"></div>
    <div class="mu-toast${icon?'':' mu-toast--text'}">
        ${icon?`<i class="mu-iconfont ${icon}"></i>`:''}
        <span>${this.options.content}</span>
    </div>
</div>`

        return HTML

    }

    // 生命周期
    beforeCreate() {
        this.options.before && this.options.before()
        this.created()
    }
    created() {
        let _this = this
        $('body').append(this.assembleHTML())
        this.$mu = $(`[data-muid="${this.muid}"]`)
        this.content = $('.mu-toast').find('span')
        this.options.after && this.options.after()
        if (this.options.duration) {
            setTimeout(() => {
                _this.close()
            }, this.options.duration);
        }
        if (!this.options.forbidClick) {
            // 允许点击overlay关闭弹窗
            $(`[data-muid="${this.muid}"]`).on('click', '.mu--overlay', () => {
                _this.close()
            })
        }
    }
    beforeDestroy() {
        // 处理关闭动画

        this.$mu.addClass('mu-animate-disappear')

        setTimeout(() => {
            this.$mu.remove()
        }, this.animateTime);

        this.destroyed()

    }
    destroyed() {
        // 处理关闭之后的回调
        console.log('destroyed');
        this.options.close && this.options.close()

    }
    // 生命周期 end

    // close方便外部调用
    close() {
        if (this.shutDown) return
        this.shutDown = true
        this.beforeDestroy()
    }
}

// mu-imagelazy 图片懒加载
class LazyImages {
    constructor(options = {}) {
        this.animateTime = 300 + 300 //动画时长，跟css配合(作用在消失然后显示图片的间隔上)
        this.options = options
        this.options.DOM = this.options.DOM ? this.options.DOM : 'body' //懒加载图片默认填充位置
        this.options.iconSize = this.options.iconSize ? this.options.iconSize : '2.5rem' //加载icon的大小
        this.beforeCreate()
        console.log(options);

    }
    lazyImages() {
        let _this = this
        $(_this.options.DOM).find('img[data-lazy]').each(function (index, elem) {
            let lazySrc = $(elem).data('lazy')
            let img = new Image()
            img.src = lazySrc
            let HTML = `<div class="mu-lazyimages mu-lazyimages--active" data-lazyindex="${index}" style="position:absolute;width: ${$(elem).width()}px; height: ${$(elem).height()}px; top: ${$(elem).offset().top}px; left: ${$(elem).offset().left}px;display: flex;justify-content: center;align-items: center;"><div class="mu-lazyimages--skeleton"></div>
    <i class="mu-iconfont icon-img" style="font-size:${_this.options.iconSize}"></i>
</div>`
            $(_this.options.DOM).append(HTML)
            img.onload = function () {
                $(elem).attr('src', lazySrc)
                _this.close($(`[data-lazyindex="${index}"]`))
            }
            img.onerror = function () {
                $(`[data-lazyindex="${index}"]`).removeClass('mu-lazyimages--active').find('.mu-iconfont').removeClass('icon-img').addClass('icon-break')
            }
        })
    }

    // 生命周期
    beforeCreate() {
        this.options.before && this.options.before()
        this.created()
    }
    created() {
        $('body').append(this.lazyImages())
    }
    beforeDestroy($this) {
        // 处理关闭动画
        $this.addClass('mu-animate-disappear')

        setTimeout(() => {
            $this.remove()
        }, this.animateTime);

        this.destroyed()
    }
    destroyed() {
        // 处理关闭之后的回调
        console.log('destroyed');
        this.options.close && this.options.close()
    }
    // 生命周期 end

    // close方便外部调用
    close($this) {
        this.beforeDestroy($this)
    }
}

// 顶部信息提示
class Notify {
    constructor(options = {}) {
        this.shutDown = false //本次对象关闭状态（只能执行一次关闭流程）
        this.muid = Math.random().toString().slice(-6)
        this.$mu = null //带有muid的DOM
        this.animateTime = 300 + 100 //动画时长，跟css配合
        this.content = null //文字span DOM(方便直接修改文字)

        this.options = options
        this.options.duration = this.options.duration ? this.options.duration : this.options.duration == 0 ? 0 : 2000 //Toast持续存在时间
        this.options.icon = this.options.icon ? this.options.icon : false //传则显示icon
        this.options.color = this.options.color ? this.options.color : '' //字体颜色
        this.options.background = this.options.background ? this.options.background : '' //背景颜色
        this.options.type = this.options.type ? this.options.type : 'primary' //默认tye（状态）

        this.beforeCreate()
        console.log(options);

    }
    assembleHTML() {
        let icon = null
        if (this.options.icon) {
            switch (this.options.icon) {
                case 'success':
                    icon = 'icon-dagou'
                    break
                case 'fail':
                    icon = 'icon-gantanhao'
                    break
                case 'loading':
                    icon = 'icon-dengdai'
                    break
            }
        }
        let HTML = `<div class="mu-notify mu-notify--success bg-color--${this.options.type} ${this.options.customClass?this.options.customClass:''}" style="${this.options.color?`color:${this.options.color};`:''} ${this.options.background?`background-color:${this.options.background};`:''}" data-muid="${this.muid}">
${this.options.icon?`<i class="mu-iconfont ${icon}"></i>`:''}
<span>通知通知通知通知通知</span>
</div>
`
        return HTML

    }

    // 生命周期
    beforeCreate() {
        this.options.before && this.options.before()
        this.created()
    }
    created() {
        let _this = this
        $('body').append(this.assembleHTML())
        this.$mu = $(`[data-muid="${this.muid}"]`)
        console.log(this.$mu.find('span'));
        this.content = this.$mu.find('span')
        this.options.after && this.options.after()
        if (this.options.duration) {
            setTimeout(() => {
                _this.close()
            }, this.options.duration);
        }

    }
    beforeDestroy() {
        // 处理关闭动画

        this.$mu.addClass('mu-animate-disappear')

        setTimeout(() => {
            this.$mu.remove()
        }, this.animateTime);

        this.destroyed()

    }
    destroyed() {
        // 处理关闭之后的回调
        console.log('destroyed');
        this.options.close && this.options.close()

    }
    // 生命周期 end

    // close方便外部调用
    close() {
        if (this.shutDown) return
        this.shutDown = true
        this.beforeDestroy()
    }
}

// 菜单弹窗
class actionSheet {
    constructor(options) {
        this.muid = Math.random().toString().slice(-6)
        this.$mu = null
        this.animateTime = 300 + 100
        this.actionIndex = 0
        this.options = options
        this.options.overlay = this.options.overlay ? true : this.options.overlay == false ? false : true //默认开启遮罩
        this.options.forbidScroll = this.options.forbidScroll ? this.options.forbidScroll : this.options.forbidScroll == false ? false : true //默认禁止页面滚动
        this.options.round = this.options.round ? true : this.options.round == false ? false : true //默认开启圆弧
        console.log(options);
        this.beforeCreate()
    }
    assembleHTML() {

        let ulHTML = `<ul>`
        this.options.actions.forEach((elem, index) => {
            console.log(elem);
            ulHTML += `   <li ${elem.disabled?`class="actionsheet--disable"`:''} ${elem.color?`style="color:${elem.color};"`:''} data-ops="actionsheet-li" data-actionsheet="${index}">
                <span>${elem.name}</span>
                ${elem.subname?`<span class="mu-actionsheet--li-desc">${elem.subname}</span>`:''}
            </li>`
            if (index == this.options.actions.length - 1) {
                ulHTML += '</ul>'
            }
        });
        let HTML = ''
        switch (this.options.direction) {
            default:
                HTML = `<div class="mu-con ${this.options.customClass?this.options.customClass:''}" data-muid="${this.muid}">
    ${this.options.overlay?'<div class="mu--overlay"></div>':''}
    <div class="mu-actionsheet mu-animate--popup-bottom-a${this.options.round?' mu-actionsheet--round':''}">
    ${this.options.title?`<div class="mu-actionsheet--hd">
    <p>${this.options.title}</p>
    ${this.options.description?`<p>${this.options.description}</p>`:''}
</div>`:''}
${ulHTML}
        <div class="mu-actionsheet-ft" data-ops="close">
            取消
        </div>
    </div>
</div>`
                // break

        }
        return HTML

    }

    // 生命周期
    beforeCreate() {
        console.log('beforeCreate:' + this.muid);

        this.created()
    }
    created() {
        let _this = this
        console.log('created');
        $('body').append(this.assembleHTML())
        // 当动画完全加载完成才绑定点击事件，防止乱点
        setTimeout(() => {
            _this.$mu = $(`[data-muid = "${_this.muid}"]`)
            // click 背影
            _this.$mu.on('click', '.mu--overlay', () => {
                _this.close()
            })
            _this.$mu.on('click', '[data-ops]', function () {
                let $this = $(this)

                switch ($this.data('ops')) {
                    // actionsheet-li   ui的菜单每项
                    // close 点击了取消，关闭弹窗
                    case 'close':
                        _this.close()
                        break
                    case 'actionsheet-li':
                        _this.actionIndex = Number($(this).data('actionsheet'))
                        _this.options.actionsFun && _this.options.actionsFun()
                        break
                }
            })
            // // 禁止窗口滚动
            if (this.options.forbidScroll) {
                $('body').css('overflow', 'hidden')
            }
        }, this.animateTime);
    }
    beforeDestroy() {
        // 处理关闭动画
        this.$mu.find('.mu-actionsheet').removeClass(`mu-animate--popup-bottom-a`).addClass(`mu-animate--popup-bottom-b`)
          
        setTimeout(() => {
            this.$mu.remove()
            // 恢复窗口滚动
            if (this.options.forbidScroll) {
                $('body').css('overflow', '')
            }
            this.destroyed()
        }, this.animateTime);

    }
    destroyed() {
        // 处理关闭之后的回调
        console.log('destroyed');

    }
    // 生命周期 end

    // close方便外部调用
    close() {
        this.beforeDestroy()
    }
}
















// class Message {
//     constructor(a) {
//         console.log(a);
//     }
//     k(params) {
//         console.log(params);
//     }
// }

export default {
    Popup,
    Toast,
    LazyImages,
    Notify,
    actionSheet
    // Message
}