<!-- components/AppBar.vue -->
<template>
  <nav class="navbar navbar-light px-3" style="background-color: orangered">
    <a class="navbar-brand d-flex align-items-center" href="/">
      <!-- Image to the left of the text -->
      <img src="@/assets/logo.jpg" alt="Hacker News Logo" class="navbar-logo me-2" />
      <span>Hacker News</span>
    </a>
    <form class="form-inline" @submit.prevent="onSearch">
      <div class="input-group">
        <input
          v-model="localSearchQuery"
          class="form-control"
          type="search"
          placeholder="Search stories by title, url or author"
          aria-label="Search"
        />
        <div class="input-group-append">
          <button class="btn btn-success mx-2" type="submit">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </form>
  </nav>
</template>

<script>
export default {
  props: {
    searchQuery: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localSearchQuery: this.searchQuery, // local data to manage v-model
    };
  },
  watch: {
    // Keep localSearchQuery in sync with searchQuery when it changes in the parent
    searchQuery(newQuery) {
      this.localSearchQuery = newQuery;
    },
    // Watch localSearchQuery and emit update when it changes
    localSearchQuery() {
      this.$emit("update:searchQuery", this.localSearchQuery);
    },
  },
  methods: {
    onSearch() {
      this.$emit("search", this.localSearchQuery);
    },
  },
};
</script>

<style scoped>
/* Add any specific styles for AppBar here */
.navbar-logo {
  width: 30px; /* Adjust logo size */
  height: auto;
}
</style>
