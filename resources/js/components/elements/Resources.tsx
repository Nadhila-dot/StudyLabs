import { ExternalLink, Search } from "lucide-react"
import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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

interface ResourcesListProps {
  resources?: Resource[]  // Now accepts a simple array
}

const ITEMS_PER_PAGE = 6

const ResourcesList: React.FC<ResourcesListProps> = ({ resources = [] }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  
  if (!resources || resources.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No resources available</p>
      </div>
    )
  }
  
  // Filter resources based on search query
  const filteredResources = searchQuery.trim() === "" 
    ? resources
    : resources.filter(resource => 
        resource.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE)
  
  // Get current page of resources
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedResources = filteredResources.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when search changes
  }
  
  // Handle page navigation
  const handlePageChange = (page: number, e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentPage(page)
  }
  
  // Handle previous/next navigation
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }
  
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }
  
  // Determine which page links to show (with ellipsis for many pages)
  const getPageLinks = () => {
    const pageItems = []
    
    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageItems.push(i)
      }
    } else {
      // Always show first page
      pageItems.push(1)
      
      // Show ellipsis or nearby pages
      if (currentPage > 3) {
        pageItems.push('ellipsis1')
      }
      
      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = startPage; i <= endPage; i++) {
        pageItems.push(i)
      }
      
      // Show ellipsis before last page if needed
      if (currentPage < totalPages - 2) {
        pageItems.push('ellipsis2')
      }
      
      // Always show last page
      if (totalPages > 1) {
        pageItems.push(totalPages)
      }
    }
    
    return pageItems
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
            {paginatedResources.map((resource) => (
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
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={handlePrevious}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {getPageLinks().map((page, i) => (
                  page === 'ellipsis1' || page === 'ellipsis2' ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink 
                        href="#"
                        onClick={(e) => handlePageChange(page as number, e)}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={handleNext}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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