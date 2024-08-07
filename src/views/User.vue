<template>
  <Menu />
  <div>
    <div class="ui main container">
      <div class="ui segment">
        <form class="ui form">
          <div class="field">
            <label for="nickname">ユーザ名</label>
            <input v-model="nickname" type="text" name="nickname" placeholder="Nickname" />
          </div>
          
          <div class="field">
            <label>年齢</label>
            <div class="inline fields">
              <div class="field">
                <input v-model.number="start" type="text" name="agestart">
                <label for="agestart">歳から</label>
              </div>
              <div class="field">
                <input v-model.number="end" type="text" name="ageend">
                <label for="ageend">歳まで</label>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div class="ui three column grid">
        <template v-for="(user, index) in filteredUsers" :key="index">
          <li class="column">
            <div class="ui card fluid">
              <div class="class content">
                <h2 class="header">
                  {{user.nickname}}
                  <span class="ui green label">
                    {{user.age}}
                  </span>
                </h2>
                <span class="meta">
                  {{user.userId}}
                </span>
              </div>
            </div>
          </li>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from "@/assets/config";
import Menu from "@/components/Menu.vue";

export default {
  name: 'User',

  components: {
    // 読み込んだコンポーネント名をここに記述する
    Menu
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      users: [],
      nickname: "",
      start: 0,
      end: 100,
    };
  },
  
  created: async function() {
    if(!window.localStorage.getItem('token')){
      this.$router.push({ name: 'Login' })
    }
    
    try {
      const header = {
        Authorization: "mtiToken"
      };
    
      const response = await fetch(`${baseUrl}/users`, {
        method: 'GET',
        header
      });
      
       const text = await response.text();
      const jsonData = text ? JSON.parse(text) : {};
      console.log(jsonData);
      
      if(!response.ok) {
        throw new Error(jsonData.message ?? 'エラーメッセージなし')
      }
      
      this.users = jsonData.users ?? [];
    
    } catch(e) {
      console.error(e);
      alert(`エラーが発生しました。\n${e.message}`);
    }
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する

    filteredUsers: function () {
      let result = this.users;
      if (this.nickname) {
        result = result.filter(user => user.nickname === this.nickname);
      }
      if (this.start) {
        result = result.filter(user => user.age >= this.start);
      }
      if (this.end) {
        result = result.filter(user => user.age <= this.end);
      }
      return result;
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
  },
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
