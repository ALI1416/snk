<script setup>
import {onMounted, ref} from 'vue'
import {snk} from '@ali1416/snk'

const userName = ref('ali1416')
const type = ref()
const year = ref()
const tip = ref()
const svg = ref()

async function generate() {
  let userNameValue = userName.value
  let typeValue = typeof type.value !== 'number' ? undefined : type.value
  let yearValue = typeof year.value !== 'number' ? undefined : year.value
  try {
    svg.value = await snk(userNameValue, typeValue, yearValue)
  } catch (e) {
    console.error(e)
    tip.value += '<br>' + e
  }
}

onMounted(() => {
  generate()
})
</script>

<template>
  <label for="userName">用户名：</label><input type="text" id="userName" v-model="userName"><br>
  <label for="type">主题模式：</label><input type="number" min="0" max="2" id="type" v-model="type"><br>
  <label for="year">年：</label><input type="number" id="year" v-model="year"><br>
  <button @click="generate">生成动画</button>
  <p v-html="tip"></p>
  <hr>
  <div v-html="svg"></div>
</template>
