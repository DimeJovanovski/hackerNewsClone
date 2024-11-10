<template>
  <div class="container my-3">
    <h2>Hot</h2>
    <ul class="list-group mb-4">
      <li v-for="post in posts" :key="post.objectID" class="list-group-item">
        <a :href="post.url" target="_blank" class="font-weight-bold">{{ post.title }}</a>
        <p class="mb-1">by {{ post.author }}</p>
      </li>
    </ul>

    <!-- Pagination buttons -->
    <nav>
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 0 }">
          <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
        </li>
        <li class="page-item" :class="{ disabled: !hasMore }">
          <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    searchQuery: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      posts: [],
      currentPage: 0,
      hitsPerPage: 10,
      hasMore: true,
    };
  },
  watch: {
    searchQuery: {
      handler() {
        // Reset to the first page when search query changes
        this.currentPage = 0;
        this.fetchPosts();
      },
      immediate: true,
    },
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get(
          `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(this.searchQuery)}&tags=story&page=${this.currentPage}&hitsPerPage=${this.hitsPerPage}`
        );
        this.posts = response.data.hits;
        this.hasMore = response.data.hits.length > 0;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    changePage(page) {
      if (page >= 0 && (page < this.currentPage || this.hasMore)) {
        this.currentPage = page;
        this.fetchPosts();
      }
    },
  },
  created() {
    this.fetchPosts();
  },
};
</script>