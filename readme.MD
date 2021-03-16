@mu 全局变量

## {}表示对象

## []表示参数可选

## function 表示回调函数

## OBJ.close(),关闭当前对象生成的弹窗

## new mu.Dialog({}) {} 接收参数 beforeEven、afterOpenEven、closeEven

# 即时消息弹窗 case 0

```
  demo.msg({
        content: '这是消息呢这是消息呢',
        [type]:'message |success |warning |error'
        [closeAble]: false,        默认不显示关闭按钮
        [time]: 2000,              消失时间
        [disappear]: true,         默认2秒消失
        [place]: 'top |center'     弹窗位置
    })
```

# 确认消息弹窗 case 1

```
    demo.confirm({
        content: '这是消息呢这是消息呢这是消息呢这是消息呢这是消息呢这是消息呢这是消息呢',
        [cover]: true,              遮罩
        [keyClose]:false,           默认不允许Esc进行关闭
        [cancel]: function () {     取消事件
            console.log('取消了');
        },
        confirm: function () {      确认事件
            return new Promise((resolve, rej) => {
                setTimeout(() => {
                    console.log('消息已确认');
                    resolve()
                }, 3000);
            })
        }
    })
```

# 自定义弹窗 case 2

```
<div id="demo" style="display: none;">
    <div class="main-box">
        123 123 123 123 123 123 123 123 123
    </div>
</div>
```

```
demo.open({
    originDOM:'#demo',       原始对象
    [targetDOM]:'#target',   默认目标对象为body
    [noScroll]:false,        默认body不允许滚动
    [cover]:true,            默认带有阴影
    [keyClose]:false,        默认不允许ESC关闭
    [left]:'50%',
    [top]:'50%',
})

```

# 自动寻址小提示弹窗 case 3

let demo = new mu.Dialog()
demo.tip({options})
options:{
demo:'.demo', //需要出现在哪个 DOM 的旁边('可不用 ID')
content:'Message'
}

```
    demo.addressing({
        originDOM: '#box',  原DOM,需要设置position为absolute
        targetDOM: '.me',   目标DOM
        [offsetLeft]: 10,   默认为0,左距离偏移量,只接受数值,最终单位为px
        [offsetTop]: 100    默认为0,上距离偏移量,只接受数值,最终单位为px
    })
```

# loading 遮罩 case 4

```
    demo.loading({
        [type]:2,                 loading弹窗类型，默认为2
        [targetDOM]: '#target',   在目标位置添加遮罩,默认为body
        [allowScroll]: true,      默认允许body滚动
        [content]:'内容'          text文本内容
    })

    setTimeout(() => {
        demo.close()
    }, 1000);
```
