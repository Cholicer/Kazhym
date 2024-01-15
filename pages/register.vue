<script setup>
import { useDataStore } from "../stores/use-Data";

const dataStore = useDataStore();
const router = useRouter();

definePageMeta({
	layout: "entry",
});
const firebaseUser = useFirebaseUser();

const nameValid = computed(() => {
	const select = inputs.value.filter(item => item.label == "Есіміңіз");
	return select[0].value.length > 2;
});

const surnameValid = computed(() => {
	const select = inputs.value.filter(item => item.label == "Тегіңіз");
	return select[0].value.length > 2;
});

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
	return Boolean(true);
});

const typeHandler = () => {
	const password = inputs.value.filter(item => item.label == "Құпиясөз")[0];
	password.type = password.type == "password" ? "text" : "password";
	password.icon =
		password.icon == "visibility" ? "visibility_off" : "visibility";
};

const formValid = computed(() => {
	return (
		nameValid.value &&
		surnameValid.value &&
		emailValid.value &&
		passwordValid.value == true
	);
});

const inputs = ref([
	{
		label: "Есіміңіз",
		type: "text",
		value: "",
		icon: "person",
		handle: nameValid,
	},
	{
		label: "Тегіңіз",
		type: "text",
		value: "",
		icon: "person",
		handle: surnameValid,
	},
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

const registerHandler = async () => {
	const { $toast } = useNuxtApp();
	const email = inputs.value.filter(item => item.label == "Пошта")[0].value;
	const password = inputs.value.filter(item => item.label == "Құпиясөз")[0]
		.value;
	await createUser(email, password);
	await add("users", {
		name: inputs.value.filter(item => item.label == "Есіміңіз")[0].value,
		surname: inputs.value.filter(item => item.label == "Тегіңіз")[0].value,
		userID: firebaseUser.value.uid,
		image: "https://i.pravatar.cc/300",
	});
	dataStore.setNotifications($toast().success("Жіүйеге сәтті тіркелдіңіз"));
	router.push({ path: "/login" });
};
</script>

<template>
	<div
		class="w-full h-screen lg:w-2/5 lg:h-3/4 lg:ml-10 p-5 flex flex-col justify-center items-center"
	>
		<div class="w-[70%] mb-5">
			<p class="text-gray-400 text-sm">ТЕГІН БАСТАУ</p>
			<h1 class="text-xl lg:text-3xl mb-3 mt-3 text-white">
				Жаңа аккаунт
				<span class="text-xl lg:text-3xl font-bold text-[#2772db]"
					>құру</span
				>
				.
			</h1>
			<span class="text-sm mt-5 text-gray-400"
				>Жүйеге тіркелгенсіз бе?
				<NuxtLink to="/login">
					<span class="text-[#2772db] underline decoration-dotted"
						>Кіру</span
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
			<span
				v-if="passwordValid !== true"
				class="text-red-800 md:px-2 mt-1 text-xs"
				>{{ passwordValid }}</span
			>
		</div>
		<div class="w-[70%] mt-10 flex justify-center items-center">
			<SharedButton
				text="Жүйеге тіркеу"
				class="w-full md:w-1/2 lg:w-full px-3 py-3 text-white rounded-xl"
				:class="{
					'bg-green-800 cursor-pointer hover:bg-green-700': formValid,
					'cursor-not-allowed bg-[#22559c]': !formValid,
				}"
				:disabled="!formValid"
				:handler="registerHandler"
			></SharedButton>
		</div>
	</div>
</template>

<style scoped></style>
