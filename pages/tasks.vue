<script setup>
import { useDataStore } from "../stores/use-Data";

definePageMeta({
	layout: "content",
	middleware: ["auth"],
});

const dataStore = useDataStore();
const firebaseUser = useFirebaseUser();
const userID = firebaseUser.value?.uid;

onMounted(async () => {
	dataStore.setUserToData(userID);
});

const status = ["Қалғаны", "Берілді", "Процесте", "Орындалды"];
</script>
<template>
	<div
		class="w-full h-full grid grid-cols-1 md:grid-cols-2 md:min-h-full xl:flex justify-center items-center text-white"
	>
		<div
			v-for="statu in status"
			class="w-full scroll-bar overflow-y-auto px-5 h-full flex flex-col items-center"
			@drop="dataStore.DropData($event, statu, userID)"
			@dragenter.prevent
			@dragover.prevent
		>
			<div
				class="bg-[#212121] rounded-xl w-full sm:w-1/2 md:w-[80%] xl:w-full 2xl:w-[85%] py-3 mb-3 flex justify-center items-center"
			>
				<h1
					class="text-xl font-bold"
					:class="{
						'text-[#f06868]': statu === status[0],
						'text-[#f8da5b]': statu === status[1],
						'text-[#7dd87d]': statu === status[2],
						'text-[#5293ee]': statu === status[3],
					}"
				>
					{{ statu }}
				</h1>
			</div>
			<div
				class="w-full sm:w-1/2 md:w-[80%] xl:w-full 2xl:w-[85%] flex flex-col items-center"
			>
				<TaskItem
					v-for="data in dataStore.getData(statu, userID)"
					:key="data.id"
					:item="data"
					:statu="statu"
				/>
			</div>
		</div>
		<TaskDetails v-if="dataStore.isModalActive"></TaskDetails>
	</div>
</template>

<style scoped>
.Todo {
	color: #f06868;
}

.Inprogress {
	color: #f8da5b;
}

.Done {
	color: #7dd87d;
}

.Backlog {
	color: #5293ee;
}
</style>
