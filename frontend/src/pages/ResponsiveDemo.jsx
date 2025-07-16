import React from "react";
import {
  ResponsiveGrid,
  ResponsiveStack,
  ResponsiveContainer,
  ResponsiveText,
} from "../components/ui/ResponsiveGrid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Input, Select, Textarea } from "../components/ui/Form";
import {
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  TableCellsIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

const ResponsiveDemo = () => {
  return (
    <ResponsiveContainer size="default" className="py-8">
      <div className="space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="text-center">
          <ResponsiveText
            as="h1"
            size="3xl"
            weight="bold"
            className="text-gray-900"
          >
            Responsive Design Demo
          </ResponsiveText>
          <ResponsiveText size="lg" className="mt-4 text-gray-600">
            CleanMatch frontend is fully responsive across all devices
          </ResponsiveText>
        </div>

        {/* Device Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Device Compatibility</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap="6">
              <div className="text-center">
                <DevicePhoneMobileIcon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Mobile First</h3>
                <p className="text-sm text-gray-600">
                  Optimized for phones and small screens
                </p>
              </div>
              <div className="text-center">
                <TableCellsIcon className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Tablet Ready</h3>
                <p className="text-sm text-gray-600">
                  Perfect layout for tablets
                </p>
              </div>
              <div className="text-center">
                <ComputerDesktopIcon className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Desktop</h3>
                <p className="text-sm text-gray-600">
                  Full-featured desktop experience
                </p>
              </div>
              <div className="text-center">
                <Squares2X2Icon className="h-12 w-12 mx-auto text-orange-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">All Sizes</h3>
                <p className="text-sm text-gray-600">
                  Adapts to any screen size
                </p>
              </div>
            </ResponsiveGrid>
          </CardContent>
        </Card>

        {/* Grid Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Grids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* 1 column mobile, 2 tablet, 3 desktop */}
              <div>
                <h4 className="font-semibold mb-4">1 → 2 → 3 Column Layout</h4>
                <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }}>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div
                      key={num}
                      className="bg-blue-100 p-4 rounded-lg text-center"
                    >
                      <ResponsiveText weight="semibold">
                        Item {num}
                      </ResponsiveText>
                    </div>
                  ))}
                </ResponsiveGrid>
              </div>

              {/* 1 column mobile, 4 desktop */}
              <div>
                <h4 className="font-semibold mb-4">1 → 4 Column Layout</h4>
                <ResponsiveGrid cols={{ sm: 1, lg: 4 }}>
                  {[1, 2, 3, 4].map((num) => (
                    <div
                      key={num}
                      className="bg-green-100 p-4 rounded-lg text-center"
                    >
                      <ResponsiveText weight="semibold">
                        Service {num}
                      </ResponsiveText>
                    </div>
                  ))}
                </ResponsiveGrid>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stack Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Stacks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Vertical to horizontal stack */}
              <div>
                <h4 className="font-semibold mb-4">
                  Vertical → Horizontal Stack
                </h4>
                <ResponsiveStack
                  direction="responsive"
                  spacing="4"
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="bg-purple-100 p-4 rounded flex-1">
                    <ResponsiveText weight="semibold">
                      Content Area
                    </ResponsiveText>
                    <ResponsiveText size="sm" className="mt-2">
                      Main content goes here
                    </ResponsiveText>
                  </div>
                  <div className="bg-orange-100 p-4 rounded w-full sm:w-64">
                    <ResponsiveText weight="semibold">Sidebar</ResponsiveText>
                    <ResponsiveText size="sm" className="mt-2">
                      Secondary content
                    </ResponsiveText>
                  </div>
                </ResponsiveStack>
              </div>

              {/* Button group */}
              <div>
                <h4 className="font-semibold mb-4">Button Groups</h4>
                <ResponsiveStack direction="responsive" spacing="3">
                  <Button className="w-full sm:w-auto">Primary Action</Button>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Secondary
                  </Button>
                  <Button variant="ghost" className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </ResponsiveStack>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4 sm:space-y-6">
              {/* Single column fields */}
              <ResponsiveStack direction="vertical" spacing="4">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  className="text-sm sm:text-base"
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  className="text-sm sm:text-base"
                />
              </ResponsiveStack>

              {/* Two column layout on larger screens */}
              <ResponsiveStack direction="responsive" spacing="4">
                <Input
                  label="Phone Number"
                  placeholder="(555) 123-4567"
                  className="text-sm sm:text-base"
                />
                <Select label="Service Type">
                  <option value="">Select a service</option>
                  <option value="house">House Cleaning</option>
                  <option value="office">Office Cleaning</option>
                  <option value="deep">Deep Cleaning</option>
                </Select>
              </ResponsiveStack>

              <Textarea
                label="Special Instructions"
                placeholder="Any special cleaning requirements..."
                rows={4}
                className="text-sm sm:text-base"
              />

              <ResponsiveStack direction="responsive" spacing="3" justify="end">
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button className="w-full sm:w-auto">Submit Request</Button>
              </ResponsiveStack>
            </form>
          </CardContent>
        </Card>

        {/* Typography Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Typography</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <ResponsiveText as="h1" size="3xl" weight="bold">
                Main Heading (Responsive)
              </ResponsiveText>
              <ResponsiveText as="h2" size="2xl" weight="semibold">
                Section Heading
              </ResponsiveText>
              <ResponsiveText as="h3" size="xl" weight="medium">
                Subsection Heading
              </ResponsiveText>
              <ResponsiveText size="base">
                This is body text that scales appropriately across different
                screen sizes. It ensures readability on all devices while
                maintaining good typography hierarchy.
              </ResponsiveText>
              <ResponsiveText size="sm" className="text-gray-600">
                Small text for captions and secondary information.
              </ResponsiveText>
            </div>
          </CardContent>
        </Card>

        {/* Breakpoint Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Tailwind CSS Breakpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Breakpoint</th>
                    <th className="text-left py-2 px-4">Min Width</th>
                    <th className="text-left py-2 px-4">Device Type</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono">sm</td>
                    <td className="py-2 px-4">640px</td>
                    <td className="py-2 px-4">Large phones, small tablets</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono">md</td>
                    <td className="py-2 px-4">768px</td>
                    <td className="py-2 px-4">Tablets</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono">lg</td>
                    <td className="py-2 px-4">1024px</td>
                    <td className="py-2 px-4">Small laptops</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono">xl</td>
                    <td className="py-2 px-4">1280px</td>
                    <td className="py-2 px-4">Large laptops, desktops</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-mono">2xl</td>
                    <td className="py-2 px-4">1536px</td>
                    <td className="py-2 px-4">Large desktops</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Features Implemented */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Features Implemented</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveGrid cols={{ sm: 1, md: 2 }} gap="6">
              <div>
                <h4 className="font-semibold text-lg mb-3">
                  Layout & Structure
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>✅ Mobile-first responsive design</li>
                  <li>✅ Flexible grid systems</li>
                  <li>✅ Adaptive navigation</li>
                  <li>✅ Touch-friendly interface</li>
                  <li>✅ Responsive containers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3">Components & UI</h4>
                <ul className="space-y-2 text-sm">
                  <li>✅ Responsive typography</li>
                  <li>✅ Adaptive form elements</li>
                  <li>✅ Flexible card layouts</li>
                  <li>✅ Responsive buttons</li>
                  <li>✅ Mobile-optimized toasts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3">User Experience</h4>
                <ul className="space-y-2 text-sm">
                  <li>✅ Touch target optimization</li>
                  <li>✅ Readable text sizes</li>
                  <li>✅ Optimal spacing</li>
                  <li>✅ Consistent interactions</li>
                  <li>✅ Accessibility support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3">Performance</h4>
                <ul className="space-y-2 text-sm">
                  <li>✅ CSS-only responsiveness</li>
                  <li>✅ No JavaScript media queries</li>
                  <li>✅ Efficient CSS classes</li>
                  <li>✅ Optimized image loading</li>
                  <li>✅ Fast rendering</li>
                </ul>
              </div>
            </ResponsiveGrid>
          </CardContent>
        </Card>
      </div>
    </ResponsiveContainer>
  );
};

export default ResponsiveDemo;
