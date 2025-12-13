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
  if (!tableData.value.length) {
    return []
  };

  if (!searchQuery.value) return tableData.value;

  const query = searchQuery.value.toLowerCase();

  return tableData.value.filter(
    (course) =>
      course.title.toLowerCase().includes(query) ||
      course.course_id.toString().toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.language.toLowerCase().includes(query)
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
    id: 'action',
    header: 'Actions',
  }
];

function getDropdownActions(course: Course): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Copy course Id',
        icon: 'i-lucide-copy',
        onSelect: () => {
          copy(course.course_id.toString())

          toast.add({
            title: 'Course ID copied to clipboard!',
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
        onSelect: () => {
          navigateTo(`/courses/${course.course_id}`);
        }
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: async () => {
          const response = await useCoursesDelete(String(course.course_id));
          toast.add({
            title: `${response.message}`,
            description: `course: "${response.data.title}" has been deleted successfuly!`,
            class:"font-bold",
          });
          refetch();
        }
      }
    ]
  ]
};

onMounted(async () => {
  await refetch();
})
</script>

<template>
  <div>
    <!-- Loading Skeleton -->
    <CoursesSkeletonLoader v-if="pending" />
    <!-- Page Header -->
    <div v-if="!pending" class="mb-2 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Courses</h1>
        <p class="mt-2 text-gray-600">Manage and organize your courses</p>
      </div>

      <UButton color="primary" @click="() => refetch()" :loading="pending">
        Refresh
      </UButton>
    </div>

    <!-- Card Container -->
    <UCard v-if="!pending">
      <!-- Card Header -->
      <template #header>
        <div class="flex items-center justify-between">
          <UButton icon="i-gridicons-create" color="primary" to="/courses/create" :loading="pending">
            Create New Course
          </UButton>
          <h3 class="text-lg font-semibold text-gray-900">All Courses</h3>

          <UInput v-model="searchQuery" placeholder="Search courses..." icon="i-heroicons-magnifying-glass" />
        </div>
      </template>

      <!-- Error -->
      <div v-if="error" class="text-red-500 bg-red-100 p-4 rounded-md">
        {{ error.cause }}
      </div>

      <!-- Table -->
      <UTable v-if="courses?.data" :data="filteredItems" :columns="columns" :loading="pending">
        <template #action-cell="{ row }">
          <UDropdownMenu :items="getDropdownActions(row.original)">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" aria-label="Actions" />
          </UDropdownMenu>
        </template>
      </UTable>

      <!-- Empty State -->
      <div v-if="courses?.data?.length === 0" class="py-10 text-center text-gray-500">
        No courses available.
      </div>
    </UCard>
  </div>
</template>
