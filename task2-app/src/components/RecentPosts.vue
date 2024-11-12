<!-- components/RecentPosts.vue -->
<template>
  <div class="container my-3 border-0">
    <h3>Most recent</h3>
    <ul class="list-group mb-4 border-0">
      <li
        v-for="(post, index) in posts"
        :key="post.objectID"
        class="list-group list-group-flush bg-light border-top px-3 py-1"
      >
        <div>
          <!-- Post enumeration with progressive numbering -->
          <div class="d-flex align-items-center">
            <span class="me-2">{{ index + 1 + currentPage * hitsPerPage }}.</span>
            <div
              @click="toggleComments(post.objectID)"
              class="font-weight-bold cursor-pointer post-title"
            >
              {{ post.title }}
            </div>
          </div>

          <!-- Author with Bootstrap user icon and total comment count -->
          <p class="mb-1" style="font-size: 14px; color: #595858;">
            <i>
              <i class="bi bi-person-fill"></i> {{ post.author }} &nbsp;
              <i class="bi bi-chat-fill"></i> {{ post.commentCount }}
            </i>
          </p>
        </div>

        <!-- Expandable comments section -->
        <div v-if="expandedPostId === post.objectID" class="mt-3">
          <div v-if="post.comments && post.comments.length > 0">
            <p>Comments</p>
            <ul class="list-group">
              <!-- Display only the loaded comments, with lazy loading for more comments -->
              <li
                v-for="comment in post.comments.slice(0, post.loadedComments)"
                :key="comment.id"
                class="list-group-item px-1 py-0 border-0 rounded-0 bg-light border-top"
              >
                <p>
                  <i><i class="bi bi-person-fill"></i> {{ comment.author }}:</i><br />
                  {{ comment.text }}
                </p>
                <!-- Recursively render replies with left margin -->
                <div v-if="comment.children && comment.children.length > 0" class="ms-3">
                  <ul class="list-group">
                    <li
                      v-for="reply in comment.children"
                      :key="reply.id"
                      class="list-group-item px-1 py-0 border-0 rounded-0 bg-light border-top"
                    >
                      <p>
                        <i><i class="bi bi-person-fill"></i> {{ reply.author }}:</i><br />
                        {{ reply.text }}
                      </p>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            <!-- 'Load more' link to fetch more comments -->
            <div v-if="post.loadedComments < post.comments.length" @click="loadMoreComments(post)">
              <a href="#" @click.prevent class="text-primary">More</a>
            </div>
          </div>
          <div v-else>
            <p>No comments available for this post.</p>
          </div>
        </div>
      </li>
    </ul>

    <!-- Pagination buttons -->
    <nav>
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 0 }">
          <button class="page-link rounded-0" @click="changePage(currentPage - 1)">&lt;&lt; Previous</button>
        </li>
        <li class="page-item" :class="{ disabled: !hasMore }">
          <button class="page-link rounded-0" @click="changePage(currentPage + 1)">Next &gt;&gt;</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from "axios";

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
      expandedPostId: null, // To track which post is expanded
    };
  },
  watch: {
    searchQuery: {
      handler() {
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

        // Count total comments for each post and add a default for loadedComments
        await Promise.all(
          this.posts.map(async (post) => {
            const details = await axios.get(
              `https://hn.algolia.com/api/v1/items/${post.objectID}`
            );
            post.commentCount = this.countTotalComments(details.data.children);
            post.comments = this.extractComments(details.data.children);
            post.loadedComments = 3; // Show only 3 comments initially
          })
        );

        this.hasMore = response.data.hits.length > 0;
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
    countTotalComments(children) {
      let count = 0;
      children.forEach((child) => {
        if (child.type === "comment") {
          count++;
          if (child.children && child.children.length > 0) {
            count += this.countTotalComments(child.children);
          }
        }
      });
      return count;
    },
    async toggleComments(postId) {
      // If the post is already expanded, collapse it
      if (this.expandedPostId === postId) {
        this.expandedPostId = null;
      } else {
        this.expandedPostId = postId;
      }
    },
    extractComments(children) {
      const comments = [];
      children.forEach((child) => {
        if (child.type === "comment") {
          const comment = {
            id: child.id,
            author: child.author,
            text: child.text,
            children: child.children ? this.extractComments(child.children) : [],
          };
          comments.push(comment);
        }
      });
      return comments;
    },
    loadMoreComments(post) {
      post.loadedComments += 3;
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

<style>
.post-title {
  cursor: pointer;
  font-weight: bold;
}
</style>
