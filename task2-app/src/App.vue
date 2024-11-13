<template>
  <div id="app">
    <AppBar v-model:searchQuery="searchQuery" @search="onSearch" />
    <div class="container">
      <RecentPosts :searchQuery="searchQuery" />
    </div>
  </div>
</template>

<script>
  import "@/styles.css";
  import AppBar from "./components/AppBar.vue";
  import RecentPosts from "./components/RecentPosts.vue";

  export default {
    components: {
      AppBar,
      RecentPosts,
    },
    data() {
      return {
        searchQuery: "",
      };
    },
    methods: {
      onSearch(query) {
        this.searchQuery = query;
      },
    },
  };
</script>
