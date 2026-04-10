<script setup>
import Form from '../components/Form.vue';
</script>

<template>
  <div class="sensei-dashboard">
    <header class="top-bar">
      <div class="logo">
        <img src="/FBK_colour_transp.png" alt="FBK Logo" class="logo_photo">
        Sensei
      </div>
    </header>

    <div class="main-layout">
      <main class="content">
        <Form/>
      </main>
    </div>
  </div>
</template>

<style scoped>
.sensei-dashboard {
  background-color: #0f1117;
  color: #e2e8f0;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 36px;
  background: #0a0c12;
  border-bottom: 1px solid #1e2330;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #fff;
  display: flex;
  align-items: center;
}

.logo_photo {
  height: 40px;
  width: 40px;
  margin-right: 12px;
}

.main-layout {
  display: flex;
  min-height: calc(100vh - 54px);
}

.content {
  flex-grow: 1;
  padding: 36px 48px;
  overflow-y: auto;
}
</style>