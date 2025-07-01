namespace Project {
  interface Item {
    id: string;
    title: string;
    userId: bigint;
    createdAt: string;
    deletedAt: string | null;
  }
}
