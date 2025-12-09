<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from "@nuxt/ui";
import type { Course, CourseWithAvatar } from "~/types/course";
import { useClipboard } from '@vueuse/core'

const searchQuery = ref('')
const { courses, pending, error, refetch } = useAllCourses()
const UAvatar = resolveComponent('UAvatar')
const toast = useToast()
const { copy } = useClipboard()


const tableData = computed<CourseWithAvatar[]>(() => {
  const list = courses.value?.data ?? [];
  return list.map((course) => ({
    ...course,
    avatar: {
      src: course.image_url || "",
      alt: `${course.title} avatar`,
    },
  }));
});

const filteredItems = computed<CourseWithAvatar[]>(() => {
  if (!tableData.value.length) return [];

  if (!searchQuery.value) return tableData.value;

  const query = searchQuery.value.toLowerCase();

  return tableData.value.filter(
    (course) =>
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
  );
});

const columns: TableColumn<CourseWithAvatar>[] = [
  {
    accessorKey: "course_id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) =>
      h("div", { class: "flex items-center gap-3" }, [
        h(UAvatar as any, {
          ...row.original.avatar, // now typed as an object
          size: "lg",
        }),
        h("div", undefined, [
          h("p", { class: "font-medium text-highlighted" }, row.original.title),
        ]),
      ]),
  },
  {
    accessorKey: "language",
    header: "Lang",
  },
  {
    accessorKey: "order",
    header: "Order",
  },
  {
    id: 'action'
  }
];

function getDropdownActions(course: Course): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Copy user Id',
        icon: 'i-lucide-copy',
        onSelect: () => {
          copy(course.course_id.toString())

          toast.add({
            title: 'User ID copied to clipboard!',
            color: 'success',
            icon: 'i-lucide-circle-check'
          })
        }
      }
    ],
    [
      {
        label: 'Edit',
        icon: 'i-lucide-edit',
        onSelect: () => {
          navigateTo(`/courses/${course.course_id}/edit`);
        }
      },
      {
        label: 'View',
        icon: 'i-lets-icons-view',
        onSelect: ()=>{
          navigateTo(`/courses/${course.course_id}`);
        }
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error'
      }
    ]
  ]
};
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">All Courses</h2>

      <UButton color="primary" @click="() => refetch()" :loading="pending">
        Refresh
      </UButton>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex justify-center py-10">
      <UProgress :value="50" />
    </div>

    <!-- Error -->
    <div v-if="error" class="text-red-500 bg-red-100 p-4 rounded-md">
      {{ error }}
    </div>

    <!-- Courses Grid -->
    <div v-if="courses?.data" class="space-y-4">
      <input type="text" v-model="searchQuery" placeholder="Search items..." class="border p-2 rounded w-full" />

      <UTable :data="filteredItems" :columns="columns" :loading="pending" sticky>
        <template #action-cell="{ row }">
          <UDropdownMenu :items="getDropdownActions(row.original)">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" aria-label="Actions" />
          </UDropdownMenu>
        </template>
      </UTable>
    </div>

    <p v-if="courses?.data?.length === 0" class="text-center text-gray-500">
      No courses available.
    </p>
  </div>
</template>
