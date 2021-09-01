const page = (function () {
  const users = $('.users');
  const chatList = $('.chat-list');
  /**
   * 页面切换
   */
  function switchPage() {
    $('.login').hide();
    $('.chat').show();
  }
  /**
   * 添加用户
   * @param {*} name
   */
  function addUser(name) {
    $('<li>').attr('user', name).text(name).appendTo(users);
    totalPeo(1);
    addLog(`<span class="user">${name}</span> 进入聊天室`);
    chatList.scrollTop(chatList.prop('scrollHeight'), 0);
  }
  /**
   * 用户进入聊天室的信息提醒
   */
  function addLog(log) {
    $('<li>').addClass('log').html(log).appendTo(chatList);
  }
  /**
   * 上线人数
   * @param {*} num
   */
  function totalPeo(num) {
    const number = +$('.user-list .title span').text();
    $('.user-list .title span').text(number + num);
  }
  /**显示用户发送消息内容 */
  function addMsg(from, msg, to) {
    $('<li>')
      .html(
        `<span class="user">${from}</span>
        <span class="gray">对</span>
        <span class="user">${to ? to : '所有人'}</span>
        <span class="gray">说：</span>
        <span>${msg}</span>`
      )
      .appendTo(chatList);
    // 这句代码不理解
    chatList.scrollTop(chatList.prop('scrollHeight'), 0);
  }
  /**
   * 删除用户
   */
  function removeUser(name) {
    const li = users.find(`li[user="${name}"]`);
    if (!li) return;
    li.remove();
    totalPeo(-1);
    addLog(`<span class="user">${name}</span> 退出了聊天室`);
  }
  /**
   * 清空输入框
   */
  function clearInput() {
    $('.sendmsg input').text('');
  }
  /**
   * 初始化聊天室
   */
  function initChatRoom() {
    users.html(`<li class="all">所有人</li>`);
    $('.user-list .title span').text(0);
    chatList.html(`<li class="log">欢迎来到聊天室</li>`);
  }
  /**
   * 信息接收者
   * @returns 
   */
  function getTargetUser() {
    const user = $('.sendmsg .user').text();
    return user === '所有人' ? null : user;
  }
  /**
   * 切换信息接收者
   */
  users.click((e) => {
    console.log(e.target.tagName);
    if (e.target.tagName == 'LI') {
      $('.sendmsg .user').text($(e.target).text().trim());
    }
  });

  return {
    // 用户昵称
    me: null,
    sendText: null,
    switchPage,
    addUser,
    addMsg,
    totalPeo,
    clearInput,
    removeUser,
    initChatRoom,
    getTargetUser,
    // 需要websocekt使用的方法
    onLogin: null,
    onSendMsg: null,
  };
})();

(function () {
  /**
   * 输入昵称
   */
  $('.login .form input').keydown((e) => {
    if (e.key === 'Enter') {
      page.me = $(e.target).val();
      page.onLogin && page.onLogin(page.me);
    }
  });
  $('.sendmsg input').keydown((e) => {
    if (e.key === 'Enter') {
      page.onSendMsg && page.onSendMsg(page.me, $(e.target).val(), page.getTargetUser());
      page.clearInput();
    }
  });
})();
