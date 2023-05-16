<script setup lang="ts">
import { API } from 'aws-amplify';
import { createTodo as createTodoMutation } from '../graphql/mutations';
import { listTodos } from '../graphql/queries';
import { onCreateTodo } from '../graphql/subscriptions';

import { ref, type Ref, onMounted } from 'vue';

const name = ref('');
const description = ref('');
const todos: Ref<any[]> = ref([]);

onMounted(async () => {
  await getTodos();
  subscribe();
})

async function createTodo() {
    if (!name || !description) return;
    const todo = { name, description };
    todos.value = [...todos.value, todo];
    await API.graphql({
      query: createTodoMutation,
      variables: { input: todo }
    });
    name.value = '';
    description.value = '';
}

async function getTodos() {
  const todos_from_api: any = await API.graphql({
    query: listTodos
  });
  todos.value = todos_from_api.data.listTodos.items;
}

async function subscribe() {
  let apiResponse: any = await API.graphql({ query: onCreateTodo })
  apiResponse.subscribe({
    next: (eventData: any) => {
      let todo = eventData.value.data.onCreateTodo;
      if (todos.value.some((item) => item.name === todo.name)) return; // remove duplications
      todos.value = [...todos.value, todo];
    }
  });
}
</script>

<template>
  <main>
    <h1>Todo App</h1>
    <input type="text" v-model="name" placeholder="Todo name" />
    <input type="text" v-model="description" placeholder="Todo description" />
    <button v-on:click="createTodo">Create Todo</button>
    <div v-for="item in todos" :key="item.id">
      <h3>{{ item.name }}</h3>
      <p>{{ item.description }}</p>
    </div>
  </main>
</template>
