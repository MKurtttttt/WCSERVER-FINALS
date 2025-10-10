<template>
  <section class="media-grid">
    <div class="media-card" v-for="item in sampleMedia" :key="item.id">
      <img :src="item.image" :alt="item.title" class="media-img" />
      <h3>{{ item.title }}</h3>
      <p>{{ item.author }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MediaGrid',
  data() {
    return {
      sampleMedia: [
        { id: 1, title: 'Spider-Man', author: 'Stan Lee', image: 'https://via.placeholder.com/150' },
        { id: 2, title: 'Naruto', author: 'Masashi Kishimoto', image: 'https://via.placeholder.com/150' },
        { id: 3, title: 'One Piece', author: 'Eiichiro Oda', image: 'https://via.placeholder.com/150' }
      ]
    };
  }
};
</script>
