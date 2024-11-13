<template>
  <nav>
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 0 }">
        <button class="page-link rounded-0" @click="$emit('change-page', currentPage - 1)">
          &lt;&lt; Previous
        </button>
      </li>
      <li class="page-item" :class="{ disabled: !hasMore }">
        <button class="page-link rounded-0" @click="$emit('change-page', currentPage + 1)">
          Next &gt;&gt;
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    hasMore: {
      type: Boolean,
      required: true,
    },
  },
};
</script>