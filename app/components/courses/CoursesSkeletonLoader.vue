<template>
  <div class="space-y-6">
    <!-- Page Header Skeleton -->
    <div class="flex items-center justify-between">
      <div class="space-y-2">
        <USkeleton
          class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-8 w-48" />
        <USkeleton
          class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-4 w-64" />
      </div>

      <USkeleton
        class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-10 w-24 rounded-md" />
    </div>

    <!-- Card Skeleton -->
    <div class="border rounded-lg p-4 space-y-6">
      <!-- Card Header Skeleton -->
      <div class="flex items-center justify-between gap-4">
        <USkeleton
          class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-10 w-48 rounded-md" />
        <USkeleton
          class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-6 w-32" />
        <USkeleton
          class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-10 w-60 rounded-md" />
      </div>

      <!-- Table Skeleton -->
      <div class="space-y-4">
        <!-- Table Header -->
        <div class="grid grid-cols-5 gap-4">
          <USkeleton
            class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-4 w-full" />
          <USkeleton
            class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-4 w-full" />
          <USkeleton
            class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-4 w-full" />
          <USkeleton
            class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-4 w-full" />
          <USkeleton
            class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-4 w-full" />
        </div>

        <!-- Table Rows -->
        <div v-for="i in 6" :key="i" class="grid grid-cols-5 gap-4 items-center">
          <USkeleton
            class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-4 w-full" />

          <!-- Avatar + Title -->
          <div class="flex items-center gap-3">
            <USkeleton
              class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-10 w-10 rounded-full" />
            <USkeleton
              class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-4 w-32" />
          </div>

          <USkeleton
            class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-4 w-20" />
          <USkeleton
            class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-4 w-16" />
          <USkeleton
            class="bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite] h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  </div>
</template>
