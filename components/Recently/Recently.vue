<script setup>
import { useDataStore } from "../../stores/use-Data";

const dataStore = useDataStore();

onMounted(async () => {
	const recentlyData = await queryByCollection("activity");
	recentlyData.map(item => {
		dataStore.setActivity(item);
		dataStore.activity.sort((a, b) => b.date - a.date);
	});
});

const starus = ["Қалғаны", "Берілді", "Процесте", "Орындалды"];
</script>

<template>
	<div
		class="scroll-bar w-64 h-[90%] bg-[#212121] rounded-xl hidden lg:flex flex-col items-center py-3 overflow-y-auto"
	>
		<h1 class="text-xl mb-5 text-white font-bold">Соңғы Әрекеттер</h1>
		<div
			v-for="data in dataStore.activity"
			class="w-[90%] my-1 flex items-start justify-center px-2"
		>
			<div class="relative">
				<SharedAvatar size="h-10 w-10" :pic="data.image" />
				<span class="border absolute h-14 left-[18px] bg-gray-500"></span>
			</div>
			<div class="w-[80%] ml-2">
				<p class="text-sm text-white">
					<span class="font-bold text-md">
						{{ data.name }}
					</span>
					&nbsp;
					<span class="text-indigo-500">
						{{ data.title }}
					</span>
					тапсырмасын
					<span
						:class="{
							'text-[#f06868]': data.statu === starus[0],
							'text-[#f8da5b]': data.statu === starus[1],
							'text-[#7dd87d]': data.statu === starus[2],
							'text-[#5293ee]': data.statu === starus[3],
						}"
					>
						{{ data.statu }}
					</span>
					ауыстырды
				</p>
			</div>
		</div>
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

.scroll-bar::-webkit-scrollbar {
	width: 6px;
}

.scroll-bar::-webkit-scrollbar-track {
	box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.scroll-bar::-webkit-scrollbar-thumb {
	background-color: #393e46;
	outline: 1px solid #121212;
	border-radius: 20px;
}
</style>
