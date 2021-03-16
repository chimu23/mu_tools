<!--
 * @Author: your name
 * @Date: 2021-01-21 15:42:55
 * @LastEditTime: 2021-01-25 11:07:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mu\src\mu_mobile\README.md
-->
生命周期支持before、after、close
# Toast

```
    let mypopup = new mu.Toast({
        [icon]: 'success',                  success|fail|loading    不传则只显示文字
        [customClass]: 'myclass',           自定义class
        [forbidClick]:true,                 禁止点击遮罩关闭Toast,默认为true
        [overlay]:true,                     是否开启遮罩（增加nth3类名，降低阴影透明度）
        [duration]:2000                     持续展示时间，默认为2s,为0时不会自动关闭
        content: '加载中...',               传入文字
        before() {
            console.log('这是before');
        },
        after() {
            console.log('这是after');
            let i = 1
            setTimeout(() => {
                // mypopup.close()
                $(mypopup.content).text('123')  返回content对象，支持直接修改文字
            }, 3000);
        },
        close() {
            console.log('这是close');
        }
    })
```

# Popup

```

    let mypopup = new mu.Popup({
        direction: 'bottom',                  bottom|left|right 弹窗出现位置
        originDOM: '#abc',                    copyHTML 推荐id，复制的是Div内的，不包含本Div
        [round]: true,                        展示圆角,默认没有
        [forbidScroll]:true,                  禁止窗口滚动,默认禁止
        [customClass]: 'myclass',             自定义类名
        [overlay]:true,                       遮罩，默认显示
        [nav]: {                              开启导航
            close: 'right',                   显示关闭图标
            title: '这是正常的标题'            弹窗标题
        }
    })
```

# LazyImages

```
        <div class="img-wrap" style="margin: 6rem;">                               图片必须设置宽高或者被有宽高的容器包裹
            <img data-lazy="http://192.168.1.110:8080/public/aaa.jpg" alt="">      margin兼容性较好，padding会导致实际显示区域
        </div>                                                                     比图片本身大(img宽高100%，放在容器内则不受
                                                                                   padding和margin影响)
  new mu.LazyImages([{
        [targetDOM] :'body',        //需要处理哪个范围内的图片           默认body
        [iconSize]:'4rem'           //加载icon的大小 支持px，rem等等     默认2.5rem
    }])
```

# Notify

```

     let a = new mu.Notify({
        content: '这是通知',                         提示信息
        [duration]: 0,                               存在时间，默认2s,0则不消失
        [icon]: 'success',                           success|primary|danger|warning 默认primary，不传则不显示
        [color]: 'red',                              字体颜色，权重比type高
        [background]: '#333333',                     背景颜色，权重比type高
        [type]: 'success',                           success|primary|danger|warning 默认primary
    })
    setTimeout(() => {
        a.content.text('123')                        文字DOM，可修改文字
    }, 1000);
```

# actionSheet

```
    let d = new mu.actionSheet({
        [customClass]: 'myclass',                                  自定义class
        [forbidScroll]: true,                                      禁止页面滚动，默认禁止
        [overlay]: true,                                           添加页面遮罩，默认添加
        [title]: '标题文字',                                       传入actionsheet标题,不传则不显示
        [description]: '辅助标题',                                 传入actionsheet辅助说明，需保证title存在值，该项才显示
        [round]: true,                                             开启圆弧，默认开启
        actions: [                                                 每一项的名字 可选参数为 [color,disable,subname]
            { name: '选项一', color: '#ee0a24' },
            { name: '选项二', disabled: true },
            { name: '选项三-3', subname: '描述信息' },
        ],
        actionsFun(){                                              菜单对应的函数事件，内部返回了actionIndex,据此做不同点击处理
            console.log(d.actionIndex);
            if(d.actionIndex == 0){
                console.log('选项一');
            }else if(d.actionIndex == 1){
                console.log('选项二');
            }
        },
    })
```