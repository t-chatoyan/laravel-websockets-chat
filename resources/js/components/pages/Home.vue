<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" href="#">Larave Chat</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <span class="text-white" v-if="user">{{user.first_name + ' ' + user.last_name}}</span>
            <a @click.prevent="signOut" class="nav-link" href="#">Sign Out</a>
          </li>
        </ul>
  
      </div>
    </nav>
    <div class="row h-100 justify-content-center mt-4">
      <div class="col-4 messages-content">
        <div v-if="user && messages">
          <div class="chat-messages-list" v-chat-scroll>
            <div :class="message.sender_id === user.id ? 'messages-content-item-right ml-auto':'messages-content-item-left'" v-for="message in messages">
              <p>{{message.sender.first_name + ' ' + message.sender.last_name}}</p>
              <p>{{message.message}}</p>
              <span class="text-muted">{{message.created_at | moment("from", "now")}}</span>
            </div>
          </div>
          <form @submit.prevent="sendMessage">
            <div class="form-group">
              <textarea @input="typing()" v-model="formData.message" class="form-control" placeholder="Message ..." id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>
            <div>
              <button class="btn btn-success">send</button>
            </div>
          </form>
          <div>
              <p class="m-0" v-for="typingUser in typingUsers">{{typingUser.first_name}} typing ...</p>
          </div>
        </div>
      </div>
      <div class="col-4">
       <div class="users-list p-3">
         <p class="text-center">Online Users</p>
         <ul class="list-group">
           <li @click.prevent="getMessages(user)" class="list-group-item cursor-pointer" v-for="user in onlineUsers">
             <p class="m-0">
               {{user.first_name + '  ' + user.last_name}}
             </p>
           </li>
         </ul>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {http} from "../../api";

  export default {
    data () {
      return {
        formData: {},
        user: null,
        onlineUsers: [],
        typingUsers: [],
        messages: [],
      }
    },
    created() {
      http.get('me').then(res => {
        this.user = res.data;
      })
    },
    mounted() {
      this.getMessages();
      this.listenForChat();
    },
    methods: {
      getMessages() {
        http.get('get-messages').then(res => {
          this.messages = res.data.data
        })
      },
      typing() {
        setTimeout( () => {
          Echo.join('chat')
            .whisper('typing', {
              id: this.user.id,
              first_name: this.user.first_name,
            });
        }, 300)
      
      },
      listenForChat() {
        let timer;

        window.Echo.join('chat')
          .here((users) => {
            this.onlineUsers = users.filter(item => {
              return item.id !== this.user.id
            })
          })
          .joining((user) => {
            this.onlineUsers.push(user)
          })
          .leaving((user) => {
            this.onlineUsers = this.onlineUsers.filter(item => {
              return item.id !== user.id
            })
          }).listenForWhisper("typing", (event) => {
              if (!this.typingUsers.find(item => item.id === event.id)) {
                this.typingUsers.push(event)
              }
              clearTimeout(timer);
              timer = setTimeout(() => {
                this.typingUsers = this.typingUsers.filter(item => item.id !== event.id)
              }, 800);
          })
          .listen('ChatMessage', (event) => {
            this.messages.push(event.chat)
          });
      },
      sendMessage() {
        if (this.formData.message !== '') {
          http.post('send-message', this.formData).then(res => {
            this.formData.message = ''
          })
        }
     
      },
      signOut () {
        http.get('logout', this.formData).then(res => {
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
          this.$router.push('/login')
        })
      }
    }
  }
</script>
<style>
  .chat-messages-list {
    padding: 16px 20px;
    height: 450px;
    overflow: hidden auto;
  }
  .users-list {
    padding: 16px 20px;
    height: 450px;
    overflow: hidden auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.2);
  }
  .messages-content {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    width: 100%;
    
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.2);
    padding: 15px
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .messages-content-item-right {
    width: 60%;
    min-height: 80px;
    margin-bottom: 24px;
    background: #3FB1BB;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.24);
    border-radius: 16px;
    padding: 16px 21px;
    border-bottom-right-radius: 0;
  }
  .messages-content-item-left {
    width: 60%;
    min-height: 80px;
    margin-bottom: 24px;
    background: #FFFFFF;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.24);
    border-radius: 16px;
    padding: 16px 21px;
    border-bottom-left-radius: 0;
  }
</style>
