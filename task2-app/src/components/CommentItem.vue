<template>
  <li class="list-group-item px-1 py-0 border-0 rounded-0 bg-light border-top" :style="{ marginLeft: `${depth * 20}px` }">
    <p><i class="bi bi-person-fill"></i> {{ comment.author }}:<br> {{ comment.text }}</p>
    <!-- Render replies (if any) -->
    <ul v-if="comment.children && comment.children.length > 0" class="list-group ms-3">
      <CommentItem 
        v-for="reply in comment.children" 
        :key="reply.id" 
        :comment="reply" 
        :depth="depth + 1" 
      />
    </ul>
  </li>
</template>
  
<script>
  export default {
    name: "CommentItem",
    props: {
      comment: {
        type: Object,
        required: true,
      },
      depth: {
        type: Number,
        default: 0,
      },
    },
  };
</script>
  