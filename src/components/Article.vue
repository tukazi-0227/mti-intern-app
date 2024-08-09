<template>
  <li class="column">
    <div class="ui card fluid">
      <div class="content">
        <span class="ui right floated meta">{{ formatDate(article.timestamp) }}</span>
        <h3 class="header">
          {{ article.title }}
        </h3>
        <div>
          <span class="ui small green label">{{ article.category }}</span>
          <span class="ui small green label">{{ article.symptoms }}</span>
        </div>
        <span class="meta">{{ article.userId }}</span>
        <!-- テキストの一部表示 -->
        <p v-if="article.text?.length > 50 && !article.showFullText">
          {{ article.text.slice(0, 50) }}...
          <a href="#" @click.prevent="article.showFullText = true">続きを読む</a>
        </p>
        <!-- 全文表示 -->
        <p v-else style="white-space:pre-wrap;">
          {{ article.text }}
          <a href="#" v-if="article.text.length > 50" @click.prevent="article.showFullText = false">閉じる</a>
        </p>
        
          <a v-if="article.url" :href="article.url" target="_blank">商品はこちら</a>

        <div v-if="writerMode" >
          <div>
            <i class="heart icon"></i> {{ article.like }}
          </div>
          <button class="ui red right floated icon button" @click="onDeleteEvent">
            <i class="trash alternate outline icon"></i> 記事を削除する
          </button>
        </div>
        
        <button v-else class="ui right floated icon button" @click="onLikeEvent" :disabled="isLoading">
          <i class="heart icon"></i> {{ article.like }}
        </button>
      
      </div>
    </div>
  </li>
</template>


<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from "@/assets/config.js";

export default {
  name: 'Article',
  
  props: {
    id: {
      type: Number,
      required: true
    },
    article: {
      required: true
    },
    writerMode: {
      type: Boolean,
      required: false
    }

  },
  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      isLiked: false,
      isLoading: false,
    };
  },
  methods: {
    // Vue.jsで使う関数はここで記述する
    formatDate (timestamp) {
      const date = new Date(timestamp);
      const date_minutes = String(date.getMinutes()).length == 1 ? `0${date.getMinutes()}` : date.getMinutes()
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date_minutes}`
    },
    
    async onLikeEvent() {
      if (this.isLiked){
        this.article.like--;
      } else {
        this.article.like++;
      };
      
      try {
        this.isLoading = true;
        const res = await fetch(baseUrl + "/article", {
          method: "PUT",
          body: JSON.stringify(this.article)
        });
  
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};
  
        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage =
            jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }
        
        this.isLiked = !this.isLiked;
      } catch(e) {
        alert(`通信に失敗しました - ${e.message}`)
      } finally {
        this.isLoading = false;
      }
    },
    
    async onDeleteEvent() {
      try {
        const res = await fetch(baseUrl + `/article?userId=${this.article.userId}&timestamp=${this.article.timestamp}`, {
          method: "DELETE",
          headers: { Authorization: "mtiToken" }
        });
        
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};
  
        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage =
            jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }
        alert('記事を削除しました')
        this.$router.push({name: 'WriterHome'})
        
      } catch(e) {
        alert(`通信に失敗しました - ${e.message}`)
      }
    },
  },    
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
