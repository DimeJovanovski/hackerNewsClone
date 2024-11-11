<!-- components/RecentPosts.vue -->
<template>
  <div class="container my-3">
    <h2>Hot</h2>
    <ul class="list-group mb-4">
      <li v-for="post in posts" :key="post.objectID" class="list-group-item">
        <div>
          <div @click="toggleComments(post.objectID)" class="font-weight-bold cursor-pointer">
            {{ post.title }}
          </div>
          <p class="mb-1">by {{ post.author }}</p>
        </div>

        <!-- Expandable comments section -->
        <div v-if="expandedPostId === post.objectID" class="mt-3">
          <div v-if="post.comments && post.comments.length > 0">
            <h5>Comments</h5>
            <ul class="list-group">
              <li v-for="comment in post.comments" :key="comment.id" class="list-group-item">
                <p><strong>{{ comment.author }}:</strong> {{ comment.text }}</p>
                <!-- Recursively render replies -->
                <div v-if="comment.children && comment.children.length > 0">
                  <ul class="list-group ml-3">
                    <li v-for="reply in comment.children" :key="reply.id" class="list-group-item">
                      <p><strong>{{ reply.author }}:</strong> {{ reply.text }}</p>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
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
      expandedPostId: null,  // To track which post is expanded
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
        this.hasMore = response.data.hits.length > 0;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    async toggleComments(postId) {
      // If the post is already expanded, collapse it
      if (this.expandedPostId === postId) {
        this.expandedPostId = null;
      } else {
        // Fetch the comments when the post is clicked
        this.expandedPostId = postId;

        // Find the post from the posts array
        const post = this.posts.find((post) => post.objectID === postId);

        if (!post.comments) {
          try {
            // Fetch post details, including comments
            const response = await axios.get(`https://hn.algolia.com/api/v1/items/${postId}`);
            // Here we assume that the children array represents comments, recursively included
            post.comments = this.extractComments(response.data.children);
          } catch (error) {
            console.error('Error fetching comments:', error);
          }
        }
      }
    },

    // Recursively extract comments and replies
    extractComments(children) {
      const comments = [];
      children.forEach(child => {
        if (child.type === 'comment') {
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
