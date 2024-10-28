import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons"

export const labels = [
  {
    value: "bug",
    label: "",
  },
  {
    value: "feature",
    label: "",
  },
  {
    value: "documentation",
    label: "",
  },
]

export const statuses = [
  {
    value: "true",
    label: "Active",
  },
  {
    value: "false",
    label: "In-active",
  },
]

export const classification = [
  {
    value: "backlog",
    label: "",
    icon: CheckCircledIcon,
  },
  {
    value: "todo",
    label: "",
    icon: CheckCircledIcon,
  },
  {
    value: "in progress",
    label: "",
    icon: CheckCircledIcon,
  },
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
]
