import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@shadcn/components/ui/input-group"

export function Search() {
  return (
    <InputGroup className="sm:w-3/4 bg-background max-w-[500px]">
      <InputGroupInput placeholder="Search your songs..."  className="text-neon "/>
      <InputGroupAddon>
        <SearchIcon className="text-(--ps-neon-10)" />
      </InputGroupAddon>
    </InputGroup>
  )
}
