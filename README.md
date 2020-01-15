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
2. 数据库名字叫做 recreation/娱乐,端口 3006. ok
3. 喜欢的歌曲列表. ok
4. 喜欢的电影列表. 无法处理.需要电影的schema定义好才行
5. 我关注了谁,获取关注人列表.  ok
6. 密码要加密处理. ok
7. 更新用户资料 ok
8. 更新用户头像 ok
9. 查看我所上传过的歌曲列表,带分页的 ok
10. 收藏(喜欢)歌曲 ok
11. 对一个用户进行关注操作. ok
12. 谁关注了我,获取我的粉丝列表. ok

## 歌曲模块

1. 设计music的schema ok
2. 上传歌曲需要token校验,然后关联users表. ok

## 文件模块

1. 上传歌曲并返回url ok

## 电影模块

## 广场模块
>这个需求我要好好思索一下.  

每当有个人上传个歌曲资源,或是电影资源时,都要有动态的展示,存放到一个集合里面.

每当我想获取我的发布动态的时候,就在广场集合里面去拿对应的id即可,这里如果是在用户下面存广场id就不合适了,因为前面已经有上传过的歌曲列表了,所以这里是要在广场集合里面有一个userID,需要查看的时候匹配userID,而且获取动态的时候也需要头像行吗,是一定要管理用户表的.

有点赞和踩的功能,本身放一个数字或是数组即可,但是有个问题.就是如何不让一个用户重复的去赞和踩呢?所以我认为正确的思路是,单独设立一个字段action,0未操作1赞2踩.假如赞是一个数组,里面装了全部点赞的人的id,后台去判断,如果你的id包含在了这个数组里面,你就要把action更新为1.

需要注意的是,踩和赞是有互斥关系的,假如你点了赞,就发送action:1给后端,后端拿到就把id存到赞的数组里,而且要看踩的数组里面有没有,有的话要删除一下.
如果你点击了已经点赞的小手,那么就是取消赞的操作,发送action:0,后端检查赞踩数组并清空..

这样,当你前端拿到array的时候,就通过action的状态,去渲染小手的状态.(是赞亮还是踩亮).

除了赞和踩,还有一个比较麻烦的需求是评论.广场的这个动态的下可以进行并排的一级评论,也可以对一级评论进行二级评论,然后2级评论可以相互评论.  
2级的相互评论中要有标识,就是**张三回复李四**这种字样. 这就要求1级评论和2级评论的字段的稍稍有点不同,除了userId外,还要有一个toUserId.

最后,每个1级评论和2级评论都要有点赞和踩的功能.
 



1. 
