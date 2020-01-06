## 前世今生

以前写过一个听歌搜索用的[node项目](https://github.com/dogdogbrother/senlin-music-node),但是有一些地方写的有瑕疵,例如我不知道mongoose的ref引入,上传文件设计的不合理等等...

然后功能上也少了一些,例如我想加上视频上传和播放的功能,广场的功能,收藏点赞关注私聊等交友的功能...这些功能很难在老项目中去扩展了(因为写的烂).

## 能做什么(TUDO)?

1. 注册登录,有个人资料内容.
2. 长传歌曲和视频,生成链接地址.并记录上传者等周边信息.
3. 获取歌曲和视频资源,同时也支持搜索网易云音乐的资源和信息.
4. 有广场功能,就是上传歌曲啊,发布心情啊等等都可以有分页记录.
5. 对用户可以关注,实现关注-粉丝需求.
6. 对广场内容实现点赞举报评论功能.
7. 相应的资源被评论或是点赞时,websocket会推送信息给前端.
8. 相应资源被举报时,管理员接到推送信息,能进行删除处理,相应的会把动态个人信息记录等数据全部删除.

## 用户模块

1. 先把 _v 隐藏掉,再加上时间戳.  ok
2. 数据库名字叫做 recreation 娱乐,端口 3006. ok
3. 喜欢的歌曲. 无法处理.需要歌曲的schema定义好才行
4. 喜欢的电影. 无法处理.需要电影的schema定义好才行
5. 我关注了谁.  OK
6. 密码要加密处理.