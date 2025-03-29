import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClientDetail() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Client Details</h1>
        <p className="text-muted-foreground">
          Individual client information and records
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Name:</span>
                    <span>John Smith</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Type:</span>
                    <span>Individual</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Status:</span>
                    <span>Active</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span>john@example.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="border-b pb-2">
                    <p className="font-medium">Individual Therapy</p>
                    <p className="text-sm text-muted-foreground">May 15, 2024 - 2:00 PM</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">Assessment Review</p>
                    <p className="text-sm text-muted-foreground">May 22, 2024 - 3:30 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Balance:</span>
                    <span>$240.00</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Last Payment:</span>
                    <span>$120.00 (Apr 28, 2024)</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span>Credit Card</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Session history will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Billing information will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Clinical notes will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 