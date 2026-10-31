import BorrowTable from "@/components/borrow/BorrowTable";

export default function MyBorrowsPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#183f32]">My Borrows</h1>

          <p className="mt-2 text-gray-600">
            Manage your borrowed books and return them on time.
          </p>
        </div>

        <BorrowTable />
      </div>
    </main>
  );
}
