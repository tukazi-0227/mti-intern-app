<template>
  <div class="ui secondary pointing teal inverted massive menu">
    <div class="left menu">
      <img class="ui image" style="margin-left: 20px; width: 50px;" src="@/assets/logo.svg" alt="app logo" />
      <h2 class="ui header item">MediQal now</h2>
    </div>
    <div class="right menu middle">
      <button class="ui standard inverted button" style="margin: 10px 20px;" @click="to_company">
        <i class="building icon"></i>
        企業の方はこちら
      </button>
    </div>
  </div>
  <div>
    <div class="ui main container">
      
      <div class="ui segment">
        <form class="ui form">
          <h3 class="header">タグで検索</h3>
          <div class="field">
            <label for="category">症状</label>
            <select v-model = "filter.symptoms">
              <option disable value="">症状を選んでください</option>
              <option v-for="option in options" :key="option.value" :value="option.value" >
                {{ option.text }}
              </option>
            </select>  
          </div>
          <div class="field">
            <label for="field">分野</label>
            <select v-model = "filter.category">
              <option disable value="">分野をえらんでください</option>
              <option v-for="option in fieldOptions" :key="option.value" :value="option.value" >
                {{ option.text }}
              </option>
            </select> 
          </div>
        </form>
      </div>
      <div class="ui segment">
      <!--投稿一覧-->
        <div style="display: flex; margin-bottom: 20px;">
          <div style="">
            <h3>投稿一覧</h3>
          </div>
          <div style="margin-left: auto">
            <form class="ui right aligned form">
              <div class="ui mini input">
                  <select v-model="filter.search">
                    <option disable value="">並び替え</option>
                    <option v-for="option in searchOptions" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
              </div>
            </form>
          </div>
        </div>
      
        <ul class="ui one column grid">
          <template v-for="(item, index) in filteredArticles" :key="index">
            <Article :id="index" :article="item" />
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
import { baseUrl } from '@/assets/config.js';
import Article from '@/components/Article.vue';

// const headers = {'Authorization' : 'mtiToken'};


export default {
  name: 'Home',

  components: {
    Article
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      filter: {
        symptoms: '',
        category: '',
        search: '',
      },
      articles: [],
      options: [
        { value: '熱', text: '熱' },
        { value: 'のど', text: 'のど' },
        { value: 'はな', text: 'はな' },
        { value: 'せき', text: 'せき' },
        { value: 'たん', text: 'たん' },
        { value: '頭痛', text: '頭痛' },
        { value: '腹痛', text: '腹痛' },
        { value: '倦怠感', text: '倦怠感' },
        { value: '寒気', text: '寒気' },
        { value: '風邪全般', text: '風邪全般' }
      ],
      fieldOptions: [
        { value: '食事', text: '食事' },
        { value: '睡眠', text: '睡眠' },
        { value: '即効性', text: '即効性' },
        { value: '予防', text: '予防' }
      ],
      searchOptions: [
        { value: '新しい順', text: '新しい順' },
        { value: '古い順', text: '古い順' },
        { value: '人気順', text: '人気順' },
      ],
    };
  },
  
  computed: {
    disableSearch() {
      return !Boolean(this.filter.category || this.filter.symptoms)
    },
    
    filteredArticles() {
      let result = this.articles;
      
      if (this.filter.category != "") {
        result = result.filter(article => article.category == this.filter.category);
      }
      if (this.filter.symptoms != "") {
        result = result.filter(article => article.symptoms == this.filter.symptoms);
      }
      
      
      if (this.filter.search === '新しい順') {
        this.articles.sort((a, b) => b.timestamp - a.timestamp);
      } else if (this.filter.search === '古い順') {
        this.articles.sort((a, b) => a.timestamp - b.timestamp);
      } else if (this.filter.search === '人気順') {
        this.articles.sort((a, b) => b.like - a.like);
      }
    
      return result;
    }
  },

  created: async function() {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    // apiからarticleを取得する
    try {
      const res = await fetch(baseUrl + "/articles", {
        method: "GET"
      });

      const text = await res.text();
      const jsonData = text ? JSON.parse(text) : {};

      // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
      if (!res.ok) {
        const errorMessage =
          jsonData.message ?? "エラーメッセージがありません";
        throw new Error(errorMessage);
      }
      

      // [!] 記事がなかった場合undefinedとなり、記事追加時のunshiftでエラーとなるため、空のarrayを代入
      this.articles = jsonData.users.map(article => ({
        ...article,
        like: parseInt(article.like)
      }));
      
      // 並び替えオプションに応じたソートを実施
    } catch (e) {
      console.error(e);
      alert(`記事一覧取得時にエラーが発生しました: ${e}`);
    }
  },

  methods: {
    to_company () {
      this.$router.push({name: 'WriterLogin'})
    },
  },
}
</script>

<style scoped>
</style>
