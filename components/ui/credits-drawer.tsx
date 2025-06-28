"use client"

import * as React from "react"

import { Button } from "@/components/ui/Button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { AvatarCircles } from "@/components/magicui/avatar-circles"

export function CreditsDrawer({ children }: { children: React.ReactNode }) {
  // GitHub profile avatar URLs
  const avatars = [
    
    {
      imageUrl: "https://avatars.githubusercontent.com/u/120254467", 
      profileUrl: "https://github.com/kartheesan05"
    },

    {
      imageUrl: "https://avatars.githubusercontent.com/u/73416366",
      profileUrl: "https://github.com/Karthikxp"
    }
    
    
  ];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="bg-black border-gray-800">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerDescription className="text-center text-gray-300">Designed and Developed by</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold tracking-tighter text-white">
                  Karthik And Kartheesan
                </div>
                
                {/* GitHub Profile Avatar Circles */}
                <div className="flex justify-center mt-4">
                  <AvatarCircles numPeople={0} avatarUrls={avatars} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </DrawerContent>
    </Drawer>
  )
} 