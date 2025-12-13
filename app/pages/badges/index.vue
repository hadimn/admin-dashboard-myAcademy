<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from "@nuxt/ui";
import { useClipboard } from '@vueuse/core'
import type { badge, BadgeWithAvatar } from "~/types/badge";

const searchQuery = ref('')
const { badges, pending, error, refetch } = useShowBadges()
const UAvatar = resolveComponent('UAvatar')
const toast = useToast()
const { copy } = useClipboard()


const tableData = computed<BadgeWithAvatar[]>(() => {
  const list = badges.value?.data ?? [];
  return list.map((badge) => ({
    ...badge,
    avatar: {
      src: badge.icon || "",
      alt: `${badge.name} avatar`,
    },
  }));
});

const filteredItems = computed<BadgeWithAvatar[]>(() => {
  if (!tableData.value.length) {
    return []
  };

  if (!searchQuery.value) return tableData.value;

  const query = searchQuery.value.toLowerCase();

  return tableData.value.filter(
    (badge) =>
      badge.name.toLowerCase().includes(query) ||
      badge.badge_id.toString().toLowerCase().includes(query) ||
      badge.description.toLowerCase().includes(query) ||
      badge.type.toLowerCase().includes(query) ||
      badge.points.toString().toLowerCase().includes(query)
  );
});


const columns: TableColumn<BadgeWithAvatar>[] = [
  {
    accessorKey: "badge_id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const badge = row.original;
      const icon = badge.icon || "";

      return h("div", { class: "flex items-center gap-3" }, [
        // Check if it's an emoji
        h(UAvatar as any, {
          src: icon,
          alt: `${badge.name} avatar`,
          size: "lg",
        }),
        h("div", undefined, [
          h("p", { class: "font-medium text-highlighted" }, badge.name),
        ]),
      ]);
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
  {
    accessorKey: "criteria",
    header: "Criteria",
    cell: ({ row }) => {
      const criteria = row.original.criteria;

      return h('div', {
        class: "font-mono text-sm bg-gray-50 p-2 rounded",
      },
        typeof criteria === 'string' ? criteria : JSON.stringify(criteria, null, 2)
      );
    }
  },
  {
    id: 'action',
    header: 'Actions',
  }
];

function getDropdownActions(badge: badge): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Copy badge Id',
        icon: 'i-lucide-copy',
        onSelect: () => {
          copy(badge.badge_id.toString())

          toast.add({
            title: 'badge ID copied to clipboard!',
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
          navigateTo(`/badges/${badge.badge_id}/edit`);
        }
      },
      {
        label: 'View',
        icon: 'i-lets-icons-view',
        onSelect: () => {
          navigateTo(`/badges/${badge.badge_id}`);
        }
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: async () => {
          console.log('this badge has been deleted')
          const response = await useBadgesDelete(String(badge.badge_id));
          toast.add({
            title: `${response.message}`,
            description: `course: "${response.data.name}" has been deleted successfuly!`,
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
        <h1 class="text-3xl font-bold text-gray-900">Badges</h1>
        <p class="mt-2 text-gray-600">Manage and organize your Badges</p>
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
          <UButton icon="i-gridicons-create" color="primary" to="/badges/create" :loading="pending">
            Create New Badge
          </UButton>
          <h3 class="text-lg font-semibold text-gray-900">All Badges</h3>

          <UInput v-model="searchQuery" placeholder="Search badges..." icon="i-heroicons-magnifying-glass" />
        </div>
      </template>

      <!-- Error -->
      <div v-if="error" class="text-red-500 bg-red-100 p-4 rounded-md">
        {{ error.cause }}
      </div>

      <!-- Table -->
      <UTable v-if="badges?.data" :data="filteredItems" :columns="columns" :loading="pending">
        <template #action-cell="{ row }">
          <UDropdownMenu :items="getDropdownActions(row.original)">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" aria-label="Actions" />
          </UDropdownMenu>
        </template>
      </UTable>

      <!-- Empty State -->
      <div v-if="badges?.data?.length === 0" class="py-10 text-center text-gray-500">
        No badges available.
      </div>
    </UCard>
  </div>
</template>
