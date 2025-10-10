<template>
  <section class="filter-section">
    <input type="text" placeholder="Search media..." class="search-input" />
    <div class="filters">
      <button class="filter-btn">All</button>
      <button class="filter-btn">Comics</button>
      <button class="filter-btn">Novels</button>
      <button class="filter-btn">Movies</button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FilterSection'
};
</script>
