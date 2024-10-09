import FarmerStats from "@/components/farmer/FarmerStats";
import SupplyRegistrationForm from "@/components/farmer/SupplyRegistrationForm";
import SupplyTracker from "@/components/farmer/SupplyTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Leaf, Truck } from "lucide-react";

export default async function FarmerDashboard() {

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <div className="container mx-auto p-6">
                <h1 className="text-4xl font-bold mb-6 text-green-800 dark:text-green-100">Farmer Dashboard</h1>
                <Tabs defaultValue="register" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 bg-green-200 dark:bg-green-700">
                        <TabsTrigger value="register" className="flex items-center space-x-2">
                            <Leaf className="w-5 h-5" />
                            <span>Register Supply</span>
                        </TabsTrigger>
                        <TabsTrigger value="track" className="flex items-center space-x-2">
                            <Truck className="w-5 h-5" />
                            <span>Track Supply</span>
                        </TabsTrigger>
                        {/* <TabsTrigger value="stats" className="flex items-center space-x-2">
                            <BarChart3 className="w-5 h-5" />
                            <span>Farm Stats</span>
                        </TabsTrigger> */}
                    </TabsList>
                    <TabsContent value="register">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Register New Supply</h2>
                            <SupplyRegistrationForm />
                        </div>
                    </TabsContent>
                    <TabsContent value="track">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Track Supply</h2>
                            <SupplyTracker />
                        </div>
                    </TabsContent>
                    <TabsContent value="stats">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Farm Statistics</h2>
                            <FarmerStats />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}