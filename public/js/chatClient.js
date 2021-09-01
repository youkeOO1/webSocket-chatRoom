
const socket = io.connect();
/**
 * 页面触发登录
 * @param {*} name 
 */
page.onLogin = function (name) {
  socket.emit('login', name);
};
/**
 * 页面触发发送信息
 * @param {*} from 
 * @param {*} msg 
 * @param {*} to 
 */
page.onSendMsg = function (from, msg, to) {
  socket.emit('msg', {
    msg,
    to
  })
  page.addMsg(from, msg, to);
  page.clearInput();
}


/**
 * 用户登录
 */
socket.on('login', (result) => {
  if(result) {
    page.switchPage();
    socket.emit('users', '')
  }else {
    alert('用户名不可用')
  }
});
/**
 * 新登录的用户
 */
socket.on('userin', (res) => {
  page.addUser(res)
});
/**
 * 获取用户列表
 */
socket.on('users', res => {
  page.initChatRoom();
  res.forEach(e => {
    page.addUser(e)
  });
  /**
   * 发送给所用人的信息
   */
  socket.on('newmsg', ({form, msg, to}) => {
    page.addMsg(form, msg, to);
  });
  /**
   * 用户退出
   */
  socket.on('userout', res => {
    console.log(res, 'out')
    page.removeUser(res)
  });
});