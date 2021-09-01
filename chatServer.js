const socketIO = require('socket.io');
let userList= []
module.exports = function (server) {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    let curUser = ''
    // 登录
    socket.on('login', (name) => {
      /**
       * 判断用户名不是搜有人，和用户名是否已经存在啦
       * 如果用户名为true 将其返回一个true
       */
      if (name == '所有人' || userList.filter(ele => ele.name == name).length > 0) {
        socket.emit('login', false);
      } else {
        curUser = name;
        userList.push({
          name,
          socket,
        });
        socket.emit('login', true);
        socket.broadcast.emit('userin', name);
      }
    })
    /**
     * 获取所有在线用户
     */
    socket.on('users', () => {
      const list = userList.map((ele) => ele.name);
      socket.emit('users',list);
    });
    socket.on('msg', ({msg, to}) => {
      if(to == null) {
        // 发送给所有人
        socket.broadcast.emit('newmsg',{
          form: curUser,
          msg,
          to,
        })
      }else {
        // 发送给某个人
        const receiveUser = userList.filter(ele => ele.name == to);
        if(receiveUser.length < 1) return;
        receiveUser[0].socket.emit('newmsg', {
          form: curUser,
          msg,
          to,
        });
      }
    })
    /**
     * 用户退出登录
     */
    socket.on('disconnect', res => {
      userList = userList.filter(ele => ele.name != curUser)
      socket.broadcast.emit('userout', curUser)

    });
  });
};
