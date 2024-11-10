<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-light px-3" style="background-color: orangered">
      <a class="navbar-brand" href="/">Hacker News</a>
      <form class="form-inline" @submit.prevent="onSearch">
        <div class="input-group">
          <input
            v-model="searchQuery"
            class="form-control"
            type="search"
            placeholder="Search stories by title, url or author"
            aria-label="Search"
          />
          <div class="input-group-append">
            <button class="btn bg-white mx-2" type="submit">Search</button>
          </div>
        </div>
      </form>
    </nav>

    <div class="container">
      <RecentPosts :searchQuery="searchQuery" />
    </div>
  </div>
</template>

<script>
import "@/styles.css";
import RecentPosts from "./components/RecentPosts.vue";

export default {
  components: {
    RecentPosts,
  },
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    onSearch() {
      // Triggers the search when the form is submitted
    },
  },
};
</script>