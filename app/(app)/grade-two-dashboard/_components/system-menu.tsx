"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components: {
  title: string;
  href: string;
  description: string;
  icon: JSX.Element;
}[] = [
  {
    title: "Dashboard 📊",
    href: "/grade-two-dashboard",
    description: "It shows you an overview of your performance and your tasks.",
    icon: <AiOutlineUsergroupAdd />,
  },
  {
    title: "History of Quiz 📊",
    href: "/grade-two-dashboard/history-quiz",
    description:
      "Look back at all the quizzes you've taken and how well you did!",
    icon: <AiOutlineUsergroupAdd />,
  },
  {
    title: "History of Voice Exercises 📊",
    href: "/grade-two-dashboard/history-voice",
    description:
      "Check out all the fun voice activities you’ve done and what you learned!",
    icon: <AiOutlineUsergroupAdd />,
  },
  {
    title: "History of Comprehension Test 📊",
    href: "/grade-two-dashboard/history-comprehension",
    description:
      "Review your comprehension tests to see how well you understand what you read.",
    icon: <AiOutlineUsergroupAdd />,
  },
];
export function SystemMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>System Menu</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
