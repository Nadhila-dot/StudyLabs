import { LucideLink2, ChevronLeft, ChevronRight } from "lucide-react"
import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export interface Resource {
  id: number
  name: string
  preview_url: string
  subject?: string
  term?: string
  category: string
}

interface PaginatedResources {
  data: Resource[]
  current_page: number
  last_page: number
  // Add other pagination fields if needed
}

interface ResourcesListProps {
  resources?: PaginatedResources
  onPageChange?: (page: number) => void
}

const ResourcesList: React.FC<ResourcesListProps> = ({ resources, onPageChange }) => {
  if (!resources || !resources.data) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No resources available</p>
      </div>
    )
  }

  const { current_page, last_page } = resources;
  
  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          href="#" 
          onClick={(e) => handlePageClick(e, 1)} 
          isActive={current_page === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // If there are many pages, show ellipsis after first page
    if (current_page > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) {
      if (i === 1 || i === last_page) continue; // Skip first and last as they're always shown
      
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            href="#" 
            onClick={(e) => handlePageClick(e, i)} 
            isActive={current_page === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // If there are many pages, show ellipsis before last page
    if (current_page < last_page - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if it's not the first page
    if (last_page > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            href="#" 
            onClick={(e) => handlePageClick(e, last_page)} 
            isActive={current_page === last_page}
          >
            {last_page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const handlePageClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: number
  ) => {
    e.preventDefault();
    if (onPageChange && page !== current_page) {
      onPageChange(page);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.data.map((resource) => (
          <div key={resource.id} className="border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold mb-2">{resource.name}</h3>
            <div className="relative aspect-video mb-3 bg-muted rounded overflow-hidden">
              <iframe
                src={resource.preview_url || "/placeholder.svg"}
                title={resource.name}
                className="w-full h-full absolute inset-0"
                loading="lazy"
              />
            </div>
            <div className="space-y-1 mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Category:</span> {resource.category}
              </p>
              {resource.subject && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Subject:</span> {resource.subject}
                </p>
              )}
              {resource.term && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Term:</span> {resource.term}
                </p>
              )}
            </div>
            <a
              href={resource.preview_url}
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Open Resource <LucideLink2 className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
      
      {/* Shadcn Pagination */}
      {last_page > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => handlePageClick(e, Math.max(1, current_page - 1))}
                aria-disabled={current_page === 1}
                className={current_page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => handlePageClick(e, Math.min(last_page, current_page + 1))}
                aria-disabled={current_page === last_page}
                className={current_page === last_page ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default ResourcesList