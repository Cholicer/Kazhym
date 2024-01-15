<script setup>
import { useDataStore } from "~~/stores/use-Data";

definePageMeta({
	layout: "entry",
});
const router = useRouter();
const dataStore = useDataStore();

const emailValid = computed(() => {
	const select = inputs.value.filter(item => item.label == "Пошта");
	return /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/.test(select[0].value);
});

const passwordValid = computed(() => {
	const password = inputs.value.filter(item => item.label == "Құпиясөз")[0]
		.value;
	if (password.length < 8) {
		return "Құпиясөз кем дегенде 8 символдан болуы керек";
	}
	if (!password.match(/[A-Z]/)) {
		return "Құпиясөз кем дегенде 1 үлкен әріпті қамтуы қажет";
	}
	if (!password.match(/[a-z]/)) {
		return "Құпиясөз кем дегенде 1 кішкентай әріпті қамтуы қажет";
	}
	if (!password.match(/[0-9]/)) {
		return "Құпиясөз кем дегенде 1 цифрді қамтуы қажет";
	}
	if (!password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
		return "Құпиясөз кем дегенде 1 арнайы символды қамтуы қажет";
	}
	return true;
});

const typeHandler = () => {
	const password = inputs.value.filter(item => item.label == "Құпиясөз")[0];
	password.type = password.type == "password" ? "text" : "password";
	password.icon =
		password.icon == "visibility" ? "visibility_off" : "visibility";
};

const inputs = ref([
	{
		label: "Пошта",
		type: "email",
		value: "",
		icon: "email",
		handle: emailValid,
	},
	{
		label: "Құпиясөз",
		type: "password",
		value: "",
		handler: typeHandler,
		icon: "visibility",
		handle: passwordValid,
	},
]);

const loginHandler = async () => {
	const { $toast } = useNuxtApp();
	const email = inputs.value.filter(item => item.label == "Пошта")[0].value;
	const password = inputs.value.filter(item => item.label == "Құпиясөз")[0]
		.value;
	const credentials = await loginUser(email, password);
	if (credentials) {
		const resultTasks = await queryByCollection("tasks");
		resultTasks.map(item => {
			dataStore.addTask(item);
		});

		const resultUsers = await queryByCollection("users");
		resultUsers.map(item => {
			dataStore.setUser(item);
		});
		router.push({ path: "/" });
		dataStore.setNotifications(
			$toast().success("Жүйеге қосылдыңыз", {
				icon: "😎👌",
				background: "#22559c",
				barBackground: "#7CB9E8",
			})
		);
	} else {
		dataStore.setNotifications(
			$toast().error("Пошта немесе құпиясөз қате терілді", {
				icon: "😭😭😭",
				duration: 4000,
				position: "top-left",
			})
		);
	}
};
</script>

<template>
	<div
		class="w-full lg:w-2/5 h-3/4 lg:ml-10 p-5 flex flex-col justify-center items-center"
	>
		<div class="w-[70%] mb-5">
			<p class="text-gray-400 text-sm">ТЕГІН БАСТАУ</p>
			<h1 class="text-2xl lg:text-4xl mb-3 mt-3 text-white">
				Қош
				<span class="text-2xl lg:text-4xl text-[#2772db]">Келдіңіз</span> .
			</h1>
			<span class="text-xs lg:text-md mt-5 text-gray-400"
				>Сізде әлі аккаунт жоқ па?
				<NuxtLink to="/register">
					<span
						class="text-md cursor-pointer text-[#2772db] underline decoration-dotted"
						>Тіркелу</span
					>
				</NuxtLink>
			</span>
		</div>
		<div class="w-[70%]">
			<div
				v-for="input in inputs"
				:key="input.label"
				class="w-full mt-5 flex justify-center items-center border border-[#2772db] text-white outline-none text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 px-2 py-1"
				:class="{ 'border-green-800': input.handle === true }"
			>
				<SharedInput
					v-model:value="input.value"
					:label="input.label"
					:type="input.type"
				>
				</SharedInput>
				<SharedIcon
					:icon="input.icon"
					:handler="typeHandler"
					color="text-gray-400"
					size="text-2xl"
				>
				</SharedIcon>
			</div>
		</div>
		<div class="w-[70%] mt-10 flex justify-center items-center rounded-xl">
			<SharedButton
				text="Кіру"
				class="w-full px-3 py-3 bg-[#22559c] rounded-xl text-white"
				:class="
					emailValid && passwordValid === true
						? 'bg-green-800 cursor-pointer'
						: 'bg-[#22559c] cursor-not-allowed'
				"
				:disabled="emailValid && passwordValid === true ? false : true"
				:handler="loginHandler"
			></SharedButton>
		</div>
	</div>
</template>

<style scoped></style>
