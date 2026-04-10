<template>
  <div class="project-form-container">
    <div class="main-form">
      <h1>Create your project now!</h1>

      <p>Project name</p>
      <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="My project" v-model="projectName">
        <label>My project</label>
      </div>

      <p>Insert video source</p>
      <div class="dropzone" @dragover.prevent @drop.prevent="handleDrop" @click="$refs.videoDropInput.click()">
        <input type="file" ref="videoDropInput" accept="video/*" style="display: none" @change="handleFileInput" />
        <p v-if="!videoFile">Drop your video source here or <span class="browse-link">browse</span></p>
        <p v-else>Selected file: {{ videoFile.name }}</p>
      </div>

      <p>Source language SRT</p>
      <div class="dropzone srt-dropzone" :class="{ 'has-file': srtSourceFile }"
        @dragover.prevent @drop.prevent="handleSrtDrop($event, 'source')" @click="$refs.srtSourceInput.click()">
        <input type="file" ref="srtSourceInput" accept=".srt" style="display: none" @change="handleSrtInput($event, 'source')" />
        <span class="srt-icon">📄</span>
        <p v-if="!srtSourceFile">Drop source <strong>.srt</strong> file here or <span class="browse-link">browse</span></p>
        <p v-else>✓ {{ srtSourceFile.name }}</p>
      </div>

      <p>Target language SRT</p>
      <div class="dropzone srt-dropzone" :class="{ 'has-file': srtTargetFile }"
        @dragover.prevent @drop.prevent="handleSrtDrop($event, 'target')" @click="$refs.srtTargetInput.click()">
        <input type="file" ref="srtTargetInput" accept=".srt" style="display: none" @change="handleSrtInput($event, 'target')" />
        <span class="srt-icon">📄</span>
        <p v-if="!srtTargetFile">Drop target <strong>.srt</strong> file here or <span class="browse-link">browse</span></p>
        <p v-else>✓ {{ srtTargetFile.name }}</p>
      </div>

      <button class="btn btn-lg btn-light fw-bold" @click="handleCreate">Create</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const projectName = ref('')
const videoFile = ref(null)
const srtSourceFile = ref(null)
const srtTargetFile = ref(null)

function handleDrop(event) {
  const file = event.dataTransfer.files[0]
  if (file?.type.startsWith('video/')) videoFile.value = file
  else alert('Please drop a valid video file.')
}

function handleFileInput(event) {
  const file = event.target.files[0]
  if (file) videoFile.value = file
}

function handleSrtDrop(event, type) {
  const file = event.dataTransfer.files[0]
  if (file?.name.endsWith('.srt')) {
    if (type === 'source') srtSourceFile.value = file
    else srtTargetFile.value = file
  } else {
    alert('Please drop a valid .srt file.')
  }
}

function handleSrtInput(event, type) {
  const file = event.target.files[0]
  if (file) {
    if (type === 'source') srtSourceFile.value = file
    else srtTargetFile.value = file
  }
}

function parseSrt(srtText) {
  return srtText.trim().split(/\r?\n\r?\n/).map(block => {
    const lines = block.split(/\r?\n/)
    if (lines.length >= 3) {
      return { timestamp: lines[1], testo: lines.slice(2).join('\n') }
    }
    return null
  }).filter(Boolean)
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = () => reject(new Error('File read error'))
    reader.readAsText(file)
  })
}

async function handleCreate() {
  if (!projectName.value.trim()) return alert('Enter a project name.')
  if (!videoFile.value) return alert('Please upload a video file.')
  if (!srtSourceFile.value && !srtTargetFile.value) return alert('Upload at least one SRT file.')

  let subtitles = []
  let tranSubtitles = []

  if (srtSourceFile.value) {
    const text = await readFileAsText(srtSourceFile.value)
    subtitles = parseSrt(text)
  }

  if (srtTargetFile.value) {
    const text = await readFileAsText(srtTargetFile.value)
    tranSubtitles = parseSrt(text)
  }


  localStorage.setItem('projectName', projectName.value)
  localStorage.setItem('subtitles', JSON.stringify(subtitles))
  localStorage.setItem('tranSubtitles', JSON.stringify(tranSubtitles))

  router.push({
    name: 'video-player',
    state: {
      videoFile: videoFile.value,
      projectName: projectName.value,
      subtitles: subtitles,
      tranSubtitles: tranSubtitles
    }
  })
}
</script>

<style scoped>
/* invariato rispetto all'originale */
p {
  text-align: left;
  color: #e0e0e0;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.btn {
  background-color: #4a90e2;
  border-color: #4a90e2;
  width: 100%;
  color: white;
}
.btn:hover {
  background-color: #357abd;
  border-color: #357abd;
}
h1 {
  color: #ffffff;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}
.main-form {
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}
.dropzone {
  border: 2px dashed #4a90e2;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #b0b0b0;
  background-color: #333333;
  cursor: pointer;
  transition: all 0.2s;
}
.dropzone:hover {
  border-color: #357abd;
  background-color: #3a3a3a;
}
.srt-dropzone {
  padding: 1.2rem 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.srt-dropzone.has-file {
  border-color: #4caf50;
  background-color: #1e3a1e;
  color: #81c784;
}
.srt-dropzone p {
  margin: 0;
  color: inherit;
}
.srt-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
}
</style>