<template>
  <Menu />
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <!-- 投稿ボックス -->
      <div class="ui segment">
        <form class="ui form" @submit.prevent="postArticle">
          <input v-model="post.like" name="article-like" type="hidden">
          <div class="field">
            <label for="field">タイトル</label>
            <input v-model="post.title" name="article-title" type="text" placeholder="タイトル">
            <p v-if="isInValidTitle" class="custom-error">タイトルは25文字以内で入力してください。</p>
          </div>
          <div class="field">
            <textarea
              v-model="post.text"
              name="article-content"
              placeholder="あなたの投稿を発信しましょう！"
            />
          </div>

          <div class="field">
            <label for="category">症状</label>
            <select v-model = "post.symptoms">
              <option disabled value="">症状をえらんでください</option>
              <option v-for="option in options" :key="option.value" :value="option.value" >
                {{ option.text }}
              </option>
            </select>  
          </div>
          
          <div class="field">
            <label for="field">分野</label>
            <select v-model = "post.category">
              <option disabled value="">分野をえらんでください</option>
              <option v-for="option in fieldOptions" :key="option.value" :value="option.value" >
                {{ option.text }}
              </option>
            </select>  
          </div>
          
          <div class="field">
            <label for="field">商品URLなど</label>
            <input v-model="post.url" name="article-url" type="text" placeholder="URL">
          </div>
          
          <div class="right-align">
            <button
              class="ui teal button"
              v-bind:disabled="isPostButtonDisabled"
              type="submit"
            >
              投稿
            </button>
          </div>
        </form>
      </div>
      
      <div class="ui segment">
      <!--投稿一覧-->
        <div style="display: flex; margin-bottom: 20px;">
            <div style="">
              <h3>あなたの投稿</h3>
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
            <Article :id="index" :article="item" :writerMode="true" />
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
import Menu from '@/components/Menu.vue'
import Article from '@/components/Article.vue'

const headers = {'Authorization' : 'mtiToken'};


export default {
  name: 'WriterHome',

  components: {
   // 読み込んだコンポーネント名をここに記述する
   Menu,
   Article
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      post: {
        title: null,
        text: null,
        category: null,
        symptoms: null,
        url: null,
        like: "0",
      },
      filter: {
        symptoms: '',
        category: '',
        search: '',
      },
      search: {
        userId: null,
        category: null,
        symptoms: null,
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
      iam: null,
    };
  },
  computed: {
  
    isPostButtonDisabled () {
      return !Boolean(this.post.title || this.post.text || this.post.category || this.post.symptoms)
    },
    
    filteredArticles() {
      let result = this.articles.filter((article) => {
        return article.userId === this.iam;
      });
      
      if (this.filter.search === '新しい順') {
        result.sort((a, b) => b.timestamp - a.timestamp);
      } else if (this.filter.search === '古い順') {
        result.sort((a, b) => a.timestamp - b.timestamp);
      } else if (this.filter.search === '人気順') {
        result.sort((a, b) => b.like - a.like);
      }
      
      return result;
    },
    
    isInValidTitle() {
      return this.post.title && this.post.title.length > 25;
    }
  },

  created: async function() {
    if(!window.localStorage.getItem('token')){
      this.$router.push({ name: 'Home' })
    } else {
      this.iam = window.localStorage.getItem('userId');
    }
    
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
      
    } catch (e) {
      console.error(e);
      alert(`記事一覧取得時にエラーが発生しました: ${e}`);
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    // isMyArticle(id) {}, // 自分の記事かどうかを判定する
    // [!]いらないかも async getArticles() {}, // 記事一覧を取得する
    // async postArticle() {}, // 記事を作成する
    
    
    async postArticle() {
      if (this.isCallingApi) {
        return;
      }
      this.isCallingApi = true;

      const reqBody = {
        userId: this.iam,
        title: this.post.title,
        text: this.post.text,
        like: this.post.like,
        url: this.post.url,
        category: this.selected,
        symptoms: this.selectedField
      };
      try {
        /* global fetch */
        const res = await fetch(baseUrl + "/article", {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers,
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage =
            jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }

        this.articles.unshift({ ...reqBody, timestamp: Date.now() });
        this.successMsg = "記事が投稿されました！";
        this.post.text = "";
        this.post.category = "";
      } catch (e) {
        console.error(e);
        this.errorMsg = e;
      } finally {
        this.isCallingApi = false;
      }
    },


    async getSearchedArticles() {
      `${postBaseUrl}/team2-article-get?userId=${this.search.userId}${this.search.category ? `&category=${this.search.category}` : ''}${this.search.start ? `&start=${this.search.start}` : ''}${this.search.end ? `&end=${this.search.end}` : ''}`
    }, // 記事を検索する
    // async deleteArticle(article) {}, // 記事を削除する
    // convertToLocaleString(timestamp) {} // timestampをLocaleDateStringに変換する
  },
}
</script>

<style scoped>
  .custom-error{
    color:red;
  }
</style>
