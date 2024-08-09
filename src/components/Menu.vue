<template>
  <div class="ui secondary pointing teal inverted massive menu">
    <div class="left menu">
      <!--<img class="ui image" style="margin-left: 20px; width: 50px;" src="logo.svg" alt="app logo" />-->
      <h2 class="ui header item">MediQal now</h2>
    </div>
    <router-link active-class="active" class="item" to="/writer-profile">プロフィール</router-link>
    <router-link active-class="active" class="item" to="/writer-home">投稿</router-link>
    <router-link active-class="active" class="item" to="/writer-view">閲覧</router-link>
    <div class="right menu middle">
      <button class="ui standard inverted button" style="margin: 10px 20px;" @click="logout">
        <i class="sign-out icon"></i>
        ログアウト
      </button>
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';

export default {
  name: 'Menu',

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
    };
  },
  methods: {
    // Vue.jsで使う関数はここで記述する
    logout() {
      window.localStorage.clear();
      this.$router.push({ name: "Home" });
    },
  },    
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
