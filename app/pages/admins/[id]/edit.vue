<!-- app/pages/admins/[id]/edit.vue -->
<script setup lang="ts">


definePageMeta({
  title: "Edit admin",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Get admin ID from route
const adminId = computed(() => route.params.id as string);

// Initialize CRUD composable
const crud = useCrud<Admins>(adminsResource);

// Fetch user data on mount
onMounted(async () => {
  await crud.fetchItem(adminId.value);
});

// Handle form submission
const handleSubmit = async (data: Partial<Admins>) => {
  try {
    await crud.updateItem(adminId.value, data);

    toast.add({
      title: "Success",
      description: "admin updated successfully",
      class: "text-green-600",
    });

    // Redirect to admin detail page
    router.push(`/admins/${adminId.value}`);
  } catch (err: any) {
    let errorMessage = "An unknown error occurred.";

    // 1. Check if the error object has an 'errors' property
    //    and that it is an object (like { fieldName: ['error1', 'error2'] })
    if (err.errors && typeof err.errors === "object") {
      // 2. Extract all error message arrays into a single, flat array
      const allErrors = Object.values(err.errors).flat();

      // 3. Join the errors using a newline character (\n) as the separator
      if (allErrors.length > 0) {
        errorMessage = allErrors.join("\n");
      } else if (err.message) {
        // Fallback to the main error message if 'errors' is empty
        errorMessage = err.message;
      }
    } else if (err.message) {
      // Fallback to the main error message if 'errors' doesn't exist
      errorMessage = err.message;
    }

    toast.add({
      title: "Error",
      // Pass the concatenated string to the description
      description: errorMessage,
      color: "error", // Use a standard color name like 'danger' or 'red' if supported
      // class: 'text-red-600' // 'class' is often used for styling the toast container, not the text itself. Use 'color' prop if available.
    });

    console.error("Failed to update admin:", err);
  }
};

// Handle cancel
const handleCancel = () => {
  router.push(`/admins/${adminId.value}`);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Edit admin
        <div
          v-if="crud.item.value"
          class="mt-1 text-lg font-medium text-gray-500 dark:text-gray-400"
        >
          {{ crud.item.value.name }}
        </div>
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Update admin information
      </p>
    </div>

    <!-- Form -->
    <CrudsCrudForm
      :data-loading="crud.loading.value"
      :config="adminsResource"
      :initial-data="crud.item.value || undefined"
      :loading="crud.loading.value"
      :error="crud.error.value"
      mode="edit"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
