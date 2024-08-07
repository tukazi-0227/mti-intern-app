<template>
  <Menu />
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <!--投稿フォーム-->
        <form class="ui form" @submit.prevent="getSearchedArticles">
          <div class="field">
            <div  class="ui left icon input">
              <textarea type="input" placeholder="あなたの投稿を発信しましょう！"></textarea>
            </div>
          </div>
          <div class="inline field">
            <label for="article-category">カテゴリー</label>
            <input
              v-model="post.category"
              type="text"
              id="article-category"
              name="article-category"
            />
          </div>
        </form>

        <button class="ui green fluid button" type="submit">
          投稿
        </button>

      </div>
      
      
      <div class="ui segment">
        <form class="ui form" @submit.prevent="getSearchedArticles()">
          <div class="field">
            <label for="userId">ユーザID</label>
            <input v-model="search.userId" type="text" name="userId" placeholder="ユーザID" />
          </div>
          
          <div class="field">
            <label for="category">カテゴリー名</label>
            <input v-model="search.category" type="text" name="category" placeholder="カテゴリー名" />
          </div>
          
          <div class="field">
            <label>投稿日時</label>
            <div class="inline fields">
              <div class="field">
                <input v-model.number="search.start" type="date" name="poststart">
                <label for="poststart">から</label>
              </div>
              <div class="field">
                <input v-model.number="search.end" type="date" name="postend">
                <label for="postend">まで</label>
              </div>
            </div>
          </div>
          
          <button class="ui huge green fluid button" type="submit" :disabled="disableSearch">
            検索
          </button>
        </form>
      </div>
      
      <h4>投稿一覧</h4>
      <div class="ui segment">
      <!--投稿一覧-->
      <ul class="ui one column grid">
        <template v-for="(item, index) in articles" :key="index">
          <li class="column">
            <div class="ui card fluid">
              <div class="content">
                <h2 class="header">
                  {{ item.text }}
                  <span class="ui green label">{{ item.category }}</span>
                </h2>
                <span class="meta">{{ item.userId }} </span>
              </div>
            </div>
          </li>
        </template>
      </ul>
      </div>
      
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcと同じ意味です
// import something from '@/components/something.vue';
import { postBaseUrl } from '@/assets/config.js';
import Menu from '@/components/Menu.vue'

// const headers = {'Authorization' : 'mtiToken'};


export default {
  name: 'Home',

  components: {
   // 読み込んだコンポーネント名をここに記述する
   Menu
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      post: {
        text: null,
        category: null,
      },
      search: {
        userId: null,
        category: null,
        start: null,
        end: null,
      },
      articles: [],
      iam: null,
    };
  },
  computed: {
    disableSearch() {
      return !Boolean(this.search.userId) 
    },
    filteredArticles() {
      // カテゴリフィルタと検索クエリに基づいて記事をフィルタリングする
      return this.articles.filter((article) => {
        const matchesCategory = this.categoryFilter
          ? article.category === this.categoryFilter
          : true;
        const matchesSearchQuery = this.searchQuery
          ? article.text.includes(this.searchQuery)
          : true;
        return matchesCategory && matchesSearchQuery;
      });
    },
  },

  created: async function() {
    if(!window.localStorage.getItem('token')){
      this.$router.push({ name: 'Login' })
    } else {
      this.iam = window.localStorage.getItem('userId');
    }
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    // apiからarticleを取得する
    try {
      const header = {
        Authorization: "mtiToken"
      };
    
      const response = await fetch(`${postBaseUrl}/team2-article-get`, {
        method: 'GET',
        header
      });
      
      const text = await response.text();
      const jsonData = text ? JSON.parse(text) : {};
      console.log(jsonData);
      
      this.articles = jsonData.articles ?? [];
    } catch(e) {
      console.error(e);
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    // isMyArticle(id) {}, // 自分の記事かどうかを判定する
    // [!]いらないかも async getArticles() {}, // 記事一覧を取得する
    // async postArticle() {}, // 記事を作成する
    
    async getSearchedArticles() {
      `${postBaseUrl}/team2-article-get?userId=${this.search.userId}${this.search.category ? `&category=${this.search.category}` : ''}${this.search.start ? `&start=${this.search.start}` : ''}${this.search.end ? `&end=${this.search.end}` : ''}`
    }, // 記事を検索する
    // async deleteArticle(article) {}, // 記事を削除する
    // convertToLocaleString(timestamp) {} // timestampをLocaleDateStringに変換する
  }
}
</script>

<style scoped>
</style>
