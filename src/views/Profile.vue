<template>
  <Menu />
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <form class="ui large form" @submit.prevent="submit">
          
          <div class="field">
            <div  class="ui left icon input">
              <i class="user icon"></i>
              <input v-model="userdata.userId" type="text" placeholder="ID" required disabled />
            </div>
          </div>
          
          <div class="field">
            <div  class="ui left icon input">
              <i class="lock icon"></i>
              <input v-model="userdata.password" type="password" placeholder="password" />
            </div>
          </div>
          
          <div class="field">
            <div  class="ui left icon input">
              <i class="tag icon"></i>
              <input v-model="userdata.nickname" type="text" placeholder="NichName" />
            </div>
          </div>
          
          <div class="field">
            <div  class="ui left icon input">
              <i class="calendar icon"></i>
              <input v-model.number="userdata.age" type="text" placeholder="Age" />
            </div>
          </div>
          
          <button class="ui huge green fluid button" type="submit" :disabled="disabledButton">
            更新
          </button>
        </form>
      </div>
      <button @click="deleteUser" class="ui huge gray fluid button" type="submit" >
        退会
      </button>
  
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from '@/assets/config.js'
import Menu from '@/components/Menu.vue'

export default {
  name: 'Profile',

  components: {
    // 読み込んだコンポーネント名をここに記述する
    Menu
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      userdata: {
        userId: window.localStorage.getItem('userId'),
        password: null,
        nickname: null,
        age: null
      },
    }
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    disabledButton () {
      return !Boolean(this.userdata.password && this.userdata.nickname && this.userdata.age)
    }
  },
  
  created: async function() {
    if(!window.localStorage.getItem('token')){
      this.$router.push({ name: 'Login' })
    }
    
    const header = {
      Authorization: "mtiToken"
    };
    
    try {
      const response = await fetch(`${baseUrl}/user?userId=${this.userdata.userId}`, {
        method: 'GET',
        header
      })
      
      const text = await response.text();
      const jsonData = text ? JSON.parse(text) : {};
      console.log(jsonData);
      
      if(!response.ok) {
        throw new Error(jsonData.message ?? 'エラーメッセージなし')
      }
      
      this.userdata.nickname = jsonData.nickname;
      this.userdata.age = jsonData.age;
      
    } catch(e) {
      console.error(e);
      alert(`エラーが発生しました。\n${e.message}`);
    }
  },
  
  methods: {
    // Vue.jsで使う関数はここで記述する
    async submit() {
      const header = {
        Authorization: "mtiToken"
      };
      
      const requestBody = this.userdata;
      
      try {
        const response = await fetch(`${baseUrl}/user`, {
          method: 'PUT',
          body: JSON.stringify(requestBody),
          header
        })
        
        const text = await response.text();
        const jsonData = text ? JSON.parse(text) : {};
        console.log(jsonData);
        
        if(!response.ok) {
          throw new Error(jsonData.message ?? 'エラーメッセージなし')
        } else {
          alert('プロフィールの更新に成功しました！');
        }
        
      } catch(e) {
        console.error(e);
        alert(`エラーが発生しました。\n${e.message}`);
      }
    },
    
    async deleteUser() {

      const header = {
        Authorization: "mtiToken"
      };
      
      try {
        const response = await fetch(`${baseUrl}/user?userId=${this.userdata.userId}`, {
          method: 'DELETE',
          header
        })
        
        const text = await response.text();
        const jsonData = text ? JSON.parse(text) : {};
        console.log(jsonData);
        
        if(!response.ok) {
          throw new Error(jsonData.message ?? 'エラーメッセージなし')
        } else {
          this.$router.push({ name: 'Login' });
        }
        
      } catch(e) {
        console.error(e);
        alert(`エラーが発生しました。\n${e.message}`);
      }
    }
  },
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
