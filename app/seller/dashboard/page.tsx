import { SellerStats } from "@/components/SellerStats"

export default function SellerDashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Seller Dashboard</h1>
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Property Statistics</h2>
        <SellerStats />
      </div>
      {/* Add more dashboard content here */}
    </div>
  )
} 