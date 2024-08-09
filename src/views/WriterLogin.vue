<template>
  <div>
    <div class="ui secondary pointing green inverted massive menu">
      <div class="left menu">
        <div class="item">MediQal now</div>
      </div>
      <div class="right menu">
        <a @click="to_home" class="item">記事一覧へ戻る</a>
      </div>
    </div>
    <div class="ui container center aligned">
      <p >企業の方は以下からログインしてください</p>
    </div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <form class="ui large form" @submit.prevent="submit">
          
          <div class="field">
            <div  class="ui left icon input">
              <i class="user icon"></i>
              <input v-model="userdata.userId" type="text" placeholder="会社名" />
            </div>
          </div>
          
          <div class="field">
            <div  class="ui left icon input">
              <i class="lock icon"></i>
              <input v-model="userdata.password" :type="toggleInputType" placeholder="パスワード" />
            </div>
          </div>
          
          <div class="field" v-if="!isLogin">
            <div  class="ui left icon input">
              <i class="lock icon"></i>
              <input v-model="secondary_password" :type="toggleInputType" placeholder="パスワード(再入力)" />
            </div>
          </div>
          
          <button class="ui huge green fluid button" type="submit" :disabled="disableButton">
            {{submitText}}
          </button>
        </form>
      </div>
      <button @click="toggle_mode()" class="ui huge gray fluid button">
        {{toggleText}}
      </button>
  
    </div>
    
    <Loader />
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from '@/assets/config.js'
import Loader from '@/components/Loader.vue'

export default {
  name: 'WriterLogin',

  components: {
    // 読み込んだコンポーネント名をここに記述する
    Loader
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      userdata: {
        userId: null,
        password: null
      },
      secondary_password: null,
      isLogin: true,
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    submitText() {
      return this.isLogin ? 'ログイン' : '新規登録'
    },
    toggleText() {
      return this.isLogin ? '新規登録' : 'ログイン'
    },
    toggleInputType() {
      return this.isLogin ? "password": "text"
    },
    disableButton() {
      return this.isLogin ? 
        !Boolean(this.userdata.userId && this.userdata.password) : 
        !Boolean(this.userdata.userId && this.userdata.password && this.userdata.password == this.secondary_password);
    }
  },
  
  methods: {
    // Vue.jsで使う関数はここで記述する
    toggle_mode() {
      this.isLogin = !this.isLogin;
    },
    to_home () {
      this.$router.push({name: 'Home'})
    },
    async submit() {
      if(this.isLogin) {
        const requestBody = {
          userId: this.userdata.userId,
          password: this.userdata.password,
        }
        
        try {
          const response = await fetch(`${baseUrl}/user/login`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
          })
          
          const text = await response.text();
          const jsonData = text ? JSON.parse(text) : {};

          if(!response.ok) {
            throw new Error(jsonData.message ?? 'エラーメッセージなし')
          } else {
            window.localStorage.setItem('token', jsonData.token);
            window.localStorage.setItem('userId', this.userdata.userId)
            this.$router.push({name: 'WriterHome'})
          }
          
        } catch(e) {
          console.error(e);
          alert(`エラーが発生しました。\n${e.message}`);
        }

        
      } else {
        const header = {
          Authorization: "mtiToken"
        };
        
        const requestBody = {
          userId: this.userdata.userId,
          password: this.userdata.password,
        }
        
        try {
          const response = await fetch(`${baseUrl}/user/signup`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            header
          })
          
          const text = await response.text();
          const jsonData = text ? JSON.parse(text) : {};

          if(!response.ok) {
            throw new Error(jsonData.message ?? 'エラーメッセージなし')
          } else {
            window.localStorage.setItem('token', jsonData.token);
            window.localStorage.setItem('userId', this.userdata.userId)
            this.$router.push({name: 'WriterHome'})
          }
          
        } catch(e) {
          console.error(e);
          alert(`エラーが発生しました。\n${e.message}`);
        }
      }
    }
  },
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
