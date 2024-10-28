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
    href: "/educator-three-dashboard",
    description: "Overview of key metrics and student performance.",
    icon: <AiOutlineUsergroupAdd />,
  },
  {
    title: "Manage Modules 📚",
    href: "/educator-three-dashboard/modules",
    description: "Access and manage educational modules and content.",
    icon: <AiOutlineUsergroupAdd />,
  },
  {
    title: "Manage Questions ❓",
    href: "/educator-three-dashboard/questions",
    description: "Create and edit questions for assessments.",
    icon: <AiOutlineUsergroupAdd />,
  },
  {
    title: "Manage Voice Exercises🎤",
    href: "/educator-three-dashboard/voice",
    description: "Manage voice exercises for students.",
    icon: <AiOutlineUsergroupAdd />,
  },
  {
    title: "Manage Comprehension Test 🧠",
    href: "/educator-three-dashboard/comprehension",
    description: "Educator tests to evaluate student comprehension.",
    icon: <AiOutlineUsergroupAdd />,
  },
  {
    title: "Quiz History 📝",
    href: "/educator-three-dashboard/history-quiz",
    description: "View the history of student performance in quizzes.",
    icon: <AiOutlineUsergroupAdd />,
  },
  {
    title: "Voice Exercises History ",
    href: "/educator-three-dashboard/history-voice",
    description: "View the history of student performance in voice exercises.",
    icon: <AiOutlineUsergroupAdd />,
  },
  {
    title: "Comprehension Test History ",
    href: "/educator-three-dashboard/history-comprehensionTest",
    description:
      "View the history of student performance in comprehension test.",
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
        <NavigationMenuItem className="pl-2">
          <Link href="" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
            ></NavigationMenuLink>
          </Link>
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
