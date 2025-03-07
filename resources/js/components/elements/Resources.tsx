import { ExternalLink, Search } from "lucide-react"
import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"

export interface Resource {
  id: number
  name: string
  preview_url: string
  subject?: string
  term?: string
  category: string
}

interface PaginatedResources {
  current_page: number
  data: Resource[]
  last_page: number
  per_page: number
  total: number
  links?: any[]
}

interface ResourcesListProps {
  resources?: PaginatedResources
}

const ResourcesList: React.FC<ResourcesListProps> = ({ resources }) => {
  const [searchQuery, setSearchQuery] = useState("")
  
  if (!resources || !resources.data || resources.data.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No resources available</p>
      </div>
    )
  }
  
  // Filter resources based on search query
  const filteredResources = searchQuery.trim() === "" 
    ? resources.data
    : resources.data.filter(resource => 
        resource.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search resources..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      {filteredResources.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-muted-foreground">No resources found matching "{searchQuery}"</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="border rounded shadow p-4">
                <h3 className="text-lg font-bold">{resource.name}</h3>
                <iframe
                  src={resource.preview_url || "/placeholder.svg"}
                  title={resource.name}
                  className="w-full h-40"
                />
                <p className="text-sm">Category: {resource.category}</p>
                {resource.subject && <p className="text-sm">Subject: {resource.subject}</p>}
                {resource.term && <p className="text-sm">Term: {resource.term}</p>}
                <a
                  href={resource.preview_url}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Open Resource <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
          
          {resources.last_page > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href={resources.prev_page_url || '#'}
                    className={!resources.prev_page_url ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({length: resources.last_page}, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      href={`${resources.path}?page=${page}`}
                      isActive={page === resources.current_page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href={resources.next_page_url || '#'}
                    className={!resources.next_page_url ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}

export default ResourcesList